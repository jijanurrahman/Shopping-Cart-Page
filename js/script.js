// script.js - Main application logic and initialization

class ShoppingApp {
    constructor() {
        this.productManager = null;
        this.cart = null;
        this.ui = null;
        
        this.initialize();
    }

    // Initialize the application
    initialize() {
        try {
            // Initialize managers
            this.productManager = new ProductManager();
            this.cart = new ShoppingCart();
            
            // Load cart from storage if available
            this.cart.loadFromStorage();
            
            // Initialize UI
            this.ui = new UIManager(this.cart, this.productManager);
            this.ui.initialize();
            
            // Set up auto-save for cart
            this.cart.addListener(() => {
                this.cart.saveToStorage();
            });
            
            // Set up error handling
            this.setupErrorHandling();
            
            console.log('Shopping App initialized successfully');
        } catch (error) {
            console.error('Error initializing shopping app:', error);
            this.handleInitializationError(error);
        }
    }

    // Add item to cart
    addToCart(productId, quantity = 1) {
        try {
            const product = this.productManager.getProductById(productId);
            
            if (!product) {
                this.ui.showToast('Product not found', 'error');
                return false;
            }

            const success = this.cart.addItem(product, quantity);
            
            if (success) {
                this.ui.showToast(`${product.name} added to cart!`, 'success');
                return true;
            } else {
                this.ui.showToast('Failed to add item to cart', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.ui.showToast('An error occurred while adding to cart', 'error');
            return false;
        }
    }

    // Remove item from cart
    removeFromCart(productId) {
        try {
            const item = this.cart.getItem(productId);
            
            if (!item) {
                this.ui.showToast('Item not found in cart', 'warning');
                return false;
            }

            const productName = item.product.name;
            const success = this.cart.removeItem(productId);
            
            if (success) {
                this.ui.showToast(`${productName} removed from cart`, 'success');
                return true;
            } else {
                this.ui.showToast('Failed to remove item from cart', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            this.ui.showToast('An error occurred while removing from cart', 'error');
            return false;
        }
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        try {
            // Validate quantity
            if (newQuantity < 0) {
                this.ui.showToast('Quantity cannot be negative', 'warning');
                return false;
            }

            if (!Number.isInteger(newQuantity)) {
                this.ui.showToast('Quantity must be a whole number', 'warning');
                return false;
            }

            if (newQuantity > 99) {
                this.ui.showToast('Maximum quantity is 99', 'warning');
                return false;
            }

            const item = this.cart.getItem(productId);
            
            if (!item) {
                this.ui.showToast('Item not found in cart', 'warning');
                return false;
            }

            const success = this.cart.updateQuantity(productId, newQuantity);
            
            if (success) {
                if (newQuantity === 0) {
                    this.ui.showToast(`${item.product.name} removed from cart`, 'success');
                } else {
                    this.ui.showToast('Quantity updated', 'success');
                }
                return true;
            } else {
                this.ui.showToast('Failed to update quantity', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            this.ui.showToast('An error occurred while updating quantity', 'error');
            return false;
        }
    }

    // Apply promo code
    applyPromoCode(code) {
        try {
            const result = this.cart.applyPromoCode(code);
            
            if (result.success) {
                this.ui.showToast(result.message, 'success');
                return true;
            } else {
                this.ui.showToast(result.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('Error applying promo code:', error);
            this.ui.showToast('An error occurred while applying promo code', 'error');
            return false;
        }
    }

    // Remove promo code
    removePromoCode() {
        try {
            const result = this.cart.removePromoCode();
            
            if (result.success) {
                this.ui.showToast(result.message, 'success');
                return true;
            } else {
                this.ui.showToast(result.message, 'warning');
                return false;
            }
        } catch (error) {
            console.error('Error removing promo code:', error);
            this.ui.showToast('An error occurred while removing promo code', 'error');
            return false;
        }
    }

    // Get cart summary
    getCartSummary() {
        try {
            return this.cart.getCartSummary();
        } catch (error) {
            console.error('Error getting cart summary:', error);
            return {
                items: [],
                totalItems: 0,
                totalPrice: 0,
                formattedTotal: '$0.00',
                isEmpty: true
            };
        }
    }

    // Search products
    searchProducts(query) {
        try {
            const results = this.productManager.searchProducts(query);
            this.ui.renderSearchResults(results);
            return results;
        } catch (error) {
            console.error('Error searching products:', error);
            this.ui.showToast('Error searching products', 'error');
            return [];
        }
    }

    // Filter products by price
    filterByPrice(minPrice, maxPrice) {
        try {
            const results = this.productManager.filterByPriceRange(minPrice, maxPrice);
            this.ui.renderFilteredResults(results);
            return results;
        } catch (error) {
            console.error('Error filtering products:', error);
            this.ui.showToast('Error filtering products', 'error');
            return [];
        }
    }

    // Sort products
    sortProducts(sortBy, order) {
        try {
            const results = this.productManager.sortProducts(sortBy, order);
            this.ui.renderSortedResults(results);
            return results;
        } catch (error) {
            console.error('Error sorting products:', error);
            this.ui.showToast('Error sorting products', 'error');
            return [];
        }
    }

    // Validate cart for checkout
    validateCheckout() {
        try {
            const validation = this.cart.validateCart();
            
            if (!validation.isValid) {
                validation.errors.forEach(error => {
                    this.ui.showToast(error, 'error');
                });
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error validating checkout:', error);
            this.ui.showToast('Error validating cart', 'error');
            return false;
        }
    }

    // Process checkout
    processCheckout() {
        try {
            if (!this.validateCheckout()) {
                return false;
            }

            // In a real application, this would send data to a server
            const orderData = {
                items: this.cart.getItems(),
                total: this.cart.getTotalPrice(),
                timestamp: new Date().toISOString(),
                orderId: this.generateOrderId()
            };

            console.log('Processing order:', orderData);
            
            // Simulate successful processing
            return true;
        } catch (error) {
            console.error('Error processing checkout:', error);
            this.ui.showToast('Error processing checkout', 'error');
            return false;
        }
    }

    // Generate order ID
    generateOrderId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORDER-${timestamp}-${random}`;
    }

    // Clear cart data
    clearCartData() {
        try {
            this.cart.clearCart();
            this.cart.clearStorage();
            this.ui.showToast('Cart cleared successfully', 'success');
            return true;
        } catch (error) {
            console.error('Error clearing cart data:', error);
            this.ui.showToast('Error clearing cart', 'error');
            return false;
        }
    }

    // Get application statistics
    getStats() {
        try {
            const cartStats = this.cart.getStatistics();
            const productStats = {
                totalProducts: this.productManager.getAllProducts().length
            };

            return {
                cart: cartStats,
                products: productStats,
                appVersion: '1.0.0',
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting statistics:', error);
            return null;
        }
    }

    // Setup global error handling
    setupErrorHandling() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.ui.showToast('An unexpected error occurred', 'error');
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.ui.showToast('An unexpected error occurred', 'error');
        });
    }

    // Handle initialization errors
    handleInitializationError(error) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'fixed inset-0 flex items-center justify-center bg-red-100 z-50';
        errorMessage.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                <i class="fas fa-exclamation-triangle text-red-600 text-4xl mb-4"></i>
                <h2 class="text-xl font-bold text-gray-800 mb-2">Application Error</h2>
                <p class="text-gray-600 mb-4">
                    Failed to initialize the shopping cart application.
                    Please refresh the page to try again.
                </p>
                <button onclick="location.reload()" 
                        class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Refresh Page
                </button>
            </div>
        `;
        
        document.body.appendChild(errorMessage);
    }

    // Cleanup resources
    destroy() {
        try {
            // Save cart before destroying
            this.cart.saveToStorage();
            
            // Clear references
            this.productManager = null;
            this.cart = null;
            this.ui = null;
            
            console.log('Shopping App destroyed successfully');
        } catch (error) {
            console.error('Error destroying shopping app:', error);
        }
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Create global app instance
        window.app = new ShoppingApp();
        
        // Make app methods globally accessible for HTML onclick handlers
        window.addToCart = (productId, quantity) => window.app.addToCart(productId, quantity);
        window.removeFromCart = (productId) => window.app.removeFromCart(productId);
        window.updateQuantity = (productId, quantity) => window.app.updateQuantity(productId, quantity);
        window.applyPromoCode = (code) => window.app.applyPromoCode(code);
        window.removePromoCode = () => window.app.removePromoCode();
        
        console.log('Shopping Cart Application loaded successfully');
    } catch (error) {
        console.error('Failed to initialize shopping cart application:', error);
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.app && window.app.cart) {
        window.app.cart.saveToStorage();
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShoppingApp;
}