// cart.js - Shopping cart management and operations

class ShoppingCart {
    constructor() {
        this.items = [];
        this.listeners = [];
        this.promoCodeManager = new PromoCodeManager();
        
        // Set up promo code listener
        this.promoCodeManager.addListener(() => {
            this.notifyListeners();
        });
    }

    // Add event listener for cart changes
    addListener(callback) {
        this.listeners.push(callback);
    }

    // Notify all listeners of cart changes
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.items);
            } catch (error) {
                console.error('Error in cart listener:', error);
            }
        });
    }

    // Add item to cart
    addItem(product, quantity = 1) {
        try {
            // Validate inputs
            if (!product || !product.id) {
                throw new Error('Invalid product data');
            }

            if (quantity <= 0) {
                throw new Error('Quantity must be greater than 0');
            }

            if (!Number.isInteger(quantity)) {
                throw new Error('Quantity must be a whole number');
            }

            // Check if item already exists in cart
            const existingItemIndex = this.items.findIndex(item => item.product.id === product.id);

            if (existingItemIndex >= 0) {
                // Update quantity of existing item
                this.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item to cart
                this.items.push({
                    product: { ...product }, // Create a copy to avoid reference issues
                    quantity: quantity,
                    addedAt: new Date()
                });
            }

            this.notifyListeners();
            return true;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            return false;
        }
    }

    // Remove item from cart completely
    removeItem(productId) {
        try {
            if (!productId) {
                throw new Error('Product ID is required');
            }

            const initialLength = this.items.length;
            this.items = this.items.filter(item => item.product.id !== productId);

            if (this.items.length === initialLength) {
                console.warn('Item not found in cart:', productId);
                return false;
            }

            this.notifyListeners();
            return true;
        } catch (error) {
            console.error('Error removing item from cart:', error);
            return false;
        }
    }

    // Update quantity of specific item
    updateQuantity(productId, newQuantity) {
        try {
            if (!productId) {
                throw new Error('Product ID is required');
            }

            if (newQuantity < 0) {
                throw new Error('Quantity cannot be negative');
            }

            if (!Number.isInteger(newQuantity)) {
                throw new Error('Quantity must be a whole number');
            }

            const itemIndex = this.items.findIndex(item => item.product.id === productId);

            if (itemIndex === -1) {
                console.warn('Item not found in cart:', productId);
                return false;
            }

            if (newQuantity === 0) {
                // Remove item if quantity is 0
                return this.removeItem(productId);
            } else {
                // Update quantity
                this.items[itemIndex].quantity = newQuantity;
                this.notifyListeners();
                return true;
            }
        } catch (error) {
            console.error('Error updating item quantity:', error);
            return false;
        }
    }

    // Clear entire cart
    clearCart() {
        try {
            this.items = [];
            this.promoCodeManager.clear();
            this.notifyListeners();
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return false;
        }
    }

    // Get all cart items
    getItems() {
        return [...this.items]; // Return a copy to prevent external modification
    }

    // Get cart item by product ID
    getItem(productId) {
        return this.items.find(item => item.product.id === productId);
    }

    // Get total number of items in cart
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Calculate subtotal (before discount)
    getSubtotal() {
        return this.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    // Calculate total price (with discount applied)
    getTotalPrice() {
        const subtotal = this.getSubtotal();
        const totals = this.promoCodeManager.calculateTotals(subtotal);
        return totals.finalTotal;
    }

    // Get detailed pricing information
    getPricingDetails() {
        const subtotal = this.getSubtotal();
        return this.promoCodeManager.calculateTotals(subtotal);
    }

    // Get formatted total price
    getFormattedTotal() {
        const total = this.getTotalPrice();
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(total);
        } catch (error) {
            console.error('Error formatting total:', error);
            return `$${total.toFixed(2)}`;
        }
    }

    // Check if cart is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Apply promo code
    applyPromoCode(code) {
        const subtotal = this.getSubtotal();
        return this.promoCodeManager.applyPromoCode(code, subtotal);
    }

    // Remove promo code
    removePromoCode() {
        return this.promoCodeManager.removePromoCode();
    }

    // Get applied promo code
    getAppliedPromo() {
        return this.promoCodeManager.getAppliedPromo();
    }

    // Check if promo code is applied
    hasAppliedPromo() {
        return this.promoCodeManager.hasAppliedPromo();
    }

    // Get cart summary for checkout
    getCartSummary() {
        const pricingDetails = this.getPricingDetails();
        return {
            items: this.getItems(),
            totalItems: this.getTotalItems(),
            subtotal: pricingDetails.subtotal,
            discountAmount: pricingDetails.discountAmount,
            discountPercent: pricingDetails.discountPercent,
            totalPrice: pricingDetails.finalTotal,
            formattedTotal: this.getFormattedTotal(),
            isEmpty: this.isEmpty(),
            hasDiscount: pricingDetails.hasDiscount,
            appliedPromo: this.getAppliedPromo()
        };
    }

    // Validate cart before checkout
    validateCart() {
        const errors = [];

        if (this.isEmpty()) {
            errors.push('Cart is empty');
        }

        // Check for invalid quantities
        this.items.forEach(item => {
            if (item.quantity <= 0) {
                errors.push(`Invalid quantity for ${item.product.name}`);
            }
            if (!Number.isInteger(item.quantity)) {
                errors.push(`Quantity must be a whole number for ${item.product.name}`);
            }
        });

        // Check for invalid prices
        this.items.forEach(item => {
            if (!item.product.price || item.product.price <= 0) {
                errors.push(`Invalid price for ${item.product.name}`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Save cart to localStorage (for persistence)
    saveToStorage() {
        try {
            const cartData = {
                items: this.items,
                savedAt: new Date().toISOString()
            };
            localStorage.setItem('shoppingCart', JSON.stringify(cartData));
            this.promoCodeManager.saveToStorage();
            return true;
        } catch (error) {
            console.error('Error saving cart to storage:', error);
            return false;
        }
    }

    // Load cart from localStorage
    loadFromStorage() {
        try {
            const savedCart = localStorage.getItem('shoppingCart');
            if (savedCart) {
                const cartData = JSON.parse(savedCart);
                if (cartData && cartData.items) {
                    this.items = cartData.items;
                    this.promoCodeManager.loadFromStorage();
                    this.notifyListeners();
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            return false;
        }
    }

    // Clear cart from storage
    clearStorage() {
        try {
            localStorage.removeItem('shoppingCart');
            this.promoCodeManager.clearStorage();
            return true;
        } catch (error) {
            console.error('Error clearing cart storage:', error);
            return false;
        }
    }

    // Get cart statistics
    getStatistics() {
        const items = this.getItems();
        return {
            totalItems: this.getTotalItems(),
            uniqueItems: items.length,
            totalValue: this.getTotalPrice(),
            averageItemPrice: items.length > 0 ? this.getTotalPrice() / this.getTotalItems() : 0,
            mostExpensiveItem: items.length > 0 ? Math.max(...items.map(item => item.product.price)) : 0,
            leastExpensiveItem: items.length > 0 ? Math.min(...items.map(item => item.product.price)) : 0
        };
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.ShoppingCart = ShoppingCart;
}