// ui.js - User Interface management and DOM manipulation

class UIManager {
    constructor(cart, productManager) {
        this.cart = cart;
        this.productManager = productManager;
        this.currentView = 'products';
        
        // DOM elements
        this.elements = {
            productsGrid: null,
            productsSection: null,
            cartSection: null,
            cartItems: null,
            cartCount: null,
            cartTotal: null,
            cartSubtotal: null,
            emptyCart: null,
            cartFooter: null,
            checkoutModal: null,
            checkoutItems: null,
            checkoutTotal: null,
            successModal: null,
            toast: null,
            toastMessage: null,
            promoCodeInput: null,
            applyPromoBtn: null,
            promoMessage: null,
            appliedPromo: null,
            appliedPromoText: null,
            discountRow: null,
            discountPercent: null,
            discountAmount: null
        };

        this.initializeElements();
        this.bindEvents();
    }

    // Initialize DOM element references
    initializeElements() {
        this.elements.productsGrid = document.getElementById('productsGrid');
        this.elements.productsSection = document.getElementById('productsSection');
        this.elements.cartSection = document.getElementById('cartSection');
        this.elements.cartItems = document.getElementById('cartItems');
        this.elements.cartCount = document.getElementById('cartCount');
        this.elements.cartTotal = document.getElementById('cartTotal');
        this.elements.cartSubtotal = document.getElementById('cartSubtotal');
        this.elements.emptyCart = document.getElementById('emptyCart');
        this.elements.cartFooter = document.getElementById('cartFooter');
        this.elements.checkoutModal = document.getElementById('checkoutModal');
        this.elements.checkoutItems = document.getElementById('checkoutItems');
        this.elements.checkoutTotal = document.getElementById('checkoutTotal');
        this.elements.successModal = document.getElementById('successModal');
        this.elements.toast = document.getElementById('toast');
        this.elements.toastMessage = document.getElementById('toastMessage');
        this.elements.promoCodeInput = document.getElementById('promoCodeInput');
        this.elements.applyPromoBtn = document.getElementById('applyPromoBtn');
        this.elements.promoMessage = document.getElementById('promoMessage');
        this.elements.appliedPromo = document.getElementById('appliedPromo');
        this.elements.appliedPromoText = document.getElementById('appliedPromoText');
        this.elements.discountRow = document.getElementById('discountRow');
        this.elements.discountPercent = document.getElementById('discountPercent');
        this.elements.discountAmount = document.getElementById('discountAmount');
    }

    // Bind event listeners
    bindEvents() {
        // View cart button
        const viewCartBtn = document.getElementById('viewCartBtn');
        if (viewCartBtn) {
            viewCartBtn.addEventListener('click', () => this.showCart());
        }

        // Back to products button
        const backToProducts = document.getElementById('backToProducts');
        if (backToProducts) {
            backToProducts.addEventListener('click', () => this.showProducts());
        }

        // Clear cart button
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.showCheckout());
        }

        // Close checkout modal
        const closeCheckout = document.getElementById('closeCheckout');
        if (closeCheckout) {
            closeCheckout.addEventListener('click', () => this.hideCheckout());
        }

        // Confirm checkout button
        const confirmCheckout = document.getElementById('confirmCheckout');
        if (confirmCheckout) {
            confirmCheckout.addEventListener('click', () => this.confirmCheckout());
        }

        // Close success modal
        const closeSuccess = document.getElementById('closeSuccess');
        if (closeSuccess) {
            closeSuccess.addEventListener('click', () => this.hideSuccess());
        }

        // Promo code events
        if (this.elements.applyPromoBtn) {
            this.elements.applyPromoBtn.addEventListener('click', () => this.applyPromoCode());
        }

        if (this.elements.promoCodeInput) {
            this.elements.promoCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyPromoCode();
                }
            });
        }

        // Close modals on backdrop click
        if (this.elements.checkoutModal) {
            this.elements.checkoutModal.addEventListener('click', (e) => {
                if (e.target === this.elements.checkoutModal) {
                    this.hideCheckout();
                }
            });
        }

        if (this.elements.successModal) {
            this.elements.successModal.addEventListener('click', (e) => {
                if (e.target === this.elements.successModal) {
                    this.hideSuccess();
                }
            });
        }
    }

    // Render all products
    renderProducts() {
        if (!this.elements.productsGrid) return;

        const products = this.productManager.getAllProducts();
        this.elements.productsGrid.innerHTML = '';

        products.forEach(product => {
            const productElement = this.createProductElement(product);
            this.elements.productsGrid.appendChild(productElement);
        });
    }

    // Create individual product element
    createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = 'bg-white rounded-lg shadow-md overflow-hidden product-card';
        
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" 
                 class="w-full h-48 object-cover"
                 onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                    <button onclick="window.app.addToCart(${product.id})" 
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <i class="fas fa-cart-plus"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        return productDiv;
    }

    // Show products section
    showProducts() {
        this.currentView = 'products';
        this.elements.productsSection.classList.remove('hidden');
        this.elements.cartSection.classList.add('hidden');
    }

    // Show cart section
    showCart() {
        this.currentView = 'cart';
        this.elements.productsSection.classList.add('hidden');
        this.elements.cartSection.classList.remove('hidden');
        this.renderCart();
    }

    // Render cart items
    renderCart() {
        if (!this.elements.cartItems) return;

        const cartItems = this.cart.getItems();
        
        if (cartItems.length === 0) {
            this.showEmptyCart();
            return;
        }

        this.hideEmptyCart();
        this.elements.cartItems.innerHTML = '';

        cartItems.forEach(item => {
            const cartItemElement = this.createCartItemElement(item);
            this.elements.cartItems.appendChild(cartItemElement);
        });

        this.updateCartTotal();
    }

    // Create cart item element
    createCartItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex items-center justify-between p-4 border border-gray-200 rounded-lg';
        
        itemDiv.innerHTML = `
            <div class="flex items-center space-x-4">
                <img src="${item.product.image}" alt="${item.product.name}" 
                     class="w-16 h-16 object-cover rounded-lg"
                     onerror="this.src='https://via.placeholder.com/64x64?text=No+Image'">
                <div>
                    <h4 class="font-semibold text-gray-800">${item.product.name}</h4>
                    <p class="text-gray-600 text-sm">${item.product.price.toFixed(2)} each</p>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                    <button onclick="window.app.updateQuantity(${item.product.id}, ${item.quantity - 1})"
                            class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            ${item.quantity <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-minus text-xs"></i>
                    </button>
                    <input type="number" value="${item.quantity}" min="1" max="99"
                           onchange="window.app.updateQuantity(${item.product.id}, parseInt(this.value) || 1)"
                           class="w-16 text-center border border-gray-300 rounded-lg py-1">
                    <button onclick="window.app.updateQuantity(${item.product.id}, ${item.quantity + 1})"
                            class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                        <i class="fas fa-plus text-xs"></i>
                    </button>
                </div>
                <div class="text-right">
                    <p class="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
                <button onclick="window.app.removeFromCart(${item.product.id})"
                        class="text-red-600 hover:text-red-800 transition-colors ml-4">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        return itemDiv;
    }

    // Show empty cart message
    showEmptyCart() {
        this.elements.emptyCart.classList.remove('hidden');
        this.elements.cartFooter.classList.add('hidden');
    }

    // Hide empty cart message
    hideEmptyCart() {
        this.elements.emptyCart.classList.add('hidden');
        this.elements.cartFooter.classList.remove('hidden');
    }

    // Update cart count in header
    updateCartCount() {
        const totalItems = this.cart.getTotalItems();
        if (this.elements.cartCount) {
            this.elements.cartCount.textContent = totalItems;
            
            // Add bounce animation
            this.elements.cartCount.classList.add('cart-bounce');
            setTimeout(() => {
                this.elements.cartCount.classList.remove('cart-bounce');
            }, 500);
        }
    }

    // Update cart total and pricing display
    updateCartTotal() {
        const pricingDetails = this.cart.getPricingDetails();
        
        // Update subtotal
        if (this.elements.cartSubtotal) {
            this.elements.cartSubtotal.textContent = pricingDetails.subtotal.toFixed(2);
        }
        
        // Update discount display
        if (pricingDetails.hasDiscount) {
            this.showDiscountRow(pricingDetails);
        } else {
            this.hideDiscountRow();
        }
        
        // Update final total
        if (this.elements.cartTotal) {
            this.elements.cartTotal.textContent = pricingDetails.finalTotal.toFixed(2);
        }
        
        // Update applied promo display
        this.updatePromoDisplay();
    }

    // Show discount row
    showDiscountRow(pricingDetails) {
        if (this.elements.discountRow) {
            this.elements.discountRow.classList.remove('hidden');
            
            if (this.elements.discountPercent) {
                this.elements.discountPercent.textContent = pricingDetails.discountPercent;
            }
            
            if (this.elements.discountAmount) {
                this.elements.discountAmount.textContent = pricingDetails.discountAmount.toFixed(2);
            }
        }
    }

    // Hide discount row
    hideDiscountRow() {
        if (this.elements.discountRow) {
            this.elements.discountRow.classList.add('hidden');
        }
    }

    // Apply promo code
    applyPromoCode() {
        if (!this.elements.promoCodeInput) return;
        
        const promoCode = this.elements.promoCodeInput.value.trim();
        
        if (!promoCode) {
            this.showPromoMessage('Please enter a promo code', 'error');
            return;
        }
        
        const result = this.cart.applyPromoCode(promoCode);
        
        if (result.success) {
            this.elements.promoCodeInput.value = '';
            this.showPromoMessage(result.message, result.type);
            this.updateCartTotal();
        } else {
            this.showPromoMessage(result.message, result.type);
        }
    }

    // Show promo code message
    showPromoMessage(message, type) {
        if (!this.elements.promoMessage) return;
        
        this.elements.promoMessage.textContent = message;
        this.elements.promoMessage.className = `mt-2 text-sm ${this.getMessageClass(type)}`;
        this.elements.promoMessage.classList.remove('hidden');
        
        // Hide message after 5 seconds
        setTimeout(() => {
            if (this.elements.promoMessage) {
                this.elements.promoMessage.classList.add('hidden');
            }
        }, 5000);
    }

    // Get CSS class for message type
    getMessageClass(type) {
        switch (type) {
            case 'success':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            case 'warning':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    }

    // Update promo display
    updatePromoDisplay() {
        const appliedPromo = this.cart.getAppliedPromo();
        
        if (appliedPromo && this.elements.appliedPromo && this.elements.appliedPromoText) {
            this.elements.appliedPromoText.textContent = `${appliedPromo.code.toUpperCase()} - ${appliedPromo.description}`;
            this.elements.appliedPromo.classList.remove('hidden');
        } else if (this.elements.appliedPromo) {
            this.elements.appliedPromo.classList.add('hidden');
        }
    }

    // Clear cart with confirmation
    clearCart() {
        if (this.cart.isEmpty()) {
            this.showToast('Cart is already empty', 'info');
            return;
        }

        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart.clearCart();
            this.showToast('Cart cleared successfully', 'success');
        }
    }

    // Show checkout modal
    showCheckout() {
        if (this.cart.isEmpty()) {
            this.showToast('Your cart is empty', 'warning');
            return;
        }

        this.renderCheckoutItems();
        this.elements.checkoutModal.classList.remove('hidden');
        this.elements.checkoutModal.classList.add('modal-backdrop');
    }

    // Hide checkout modal
    hideCheckout() {
        this.elements.checkoutModal.classList.add('hidden');
        this.elements.checkoutModal.classList.remove('modal-backdrop');
    }

    // Render checkout items
    renderCheckoutItems() {
        if (!this.elements.checkoutItems) return;

        const cartItems = this.cart.getItems();
        this.elements.checkoutItems.innerHTML = '';

        cartItems.forEach(item => {
            const checkoutItemElement = document.createElement('div');
            checkoutItemElement.className = 'flex justify-between items-center py-2 border-b';
            checkoutItemElement.innerHTML = `
                <div class="flex items-center space-x-2">
                    <span class="font-medium">${item.product.name}</span>
                    <span class="text-gray-500">x${item.quantity}</span>
                </div>
                <span class="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
            `;
            this.elements.checkoutItems.appendChild(checkoutItemElement);
        });

        // Update checkout total
        if (this.elements.checkoutTotal) {
            this.elements.checkoutTotal.textContent = this.cart.getTotalPrice().toFixed(2);
        }
    }

    // Confirm checkout
    confirmCheckout() {
        if (this.cart.isEmpty()) {
            this.showToast('Your cart is empty', 'warning');
            return;
        }

        // Simulate checkout process
        const confirmButton = document.getElementById('confirmCheckout');
        if (confirmButton) {
            confirmButton.classList.add('btn-loading');
            confirmButton.disabled = true;
        }

        // Simulate API call delay
        setTimeout(() => {
            this.hideCheckout();
            this.cart.clearCart();
            this.showSuccess();
            
            // Reset button
            if (confirmButton) {
                confirmButton.classList.remove('btn-loading');
                confirmButton.disabled = false;
            }
        }, 2000);
    }

    // Show success modal
    showSuccess() {
        this.elements.successModal.classList.remove('hidden');
    }

    // Hide success modal
    hideSuccess() {
        this.elements.successModal.classList.add('hidden');
        this.showProducts();
    }

    // Show toast notification
    showToast(message, type = 'success') {
        if (!this.elements.toast || !this.elements.toastMessage) return;

        // Set message
        this.elements.toastMessage.textContent = message;

        // Set toast color based on type
        this.elements.toast.className = 'fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50';
        
        switch (type) {
            case 'success':
                this.elements.toast.classList.add('bg-green-600', 'text-white');
                break;
            case 'error':
                this.elements.toast.classList.add('bg-red-600', 'text-white');
                break;
            case 'warning':
                this.elements.toast.classList.add('bg-yellow-600', 'text-white');
                break;
            case 'info':
                this.elements.toast.classList.add('bg-blue-600', 'text-white');
                break;
        }

        // Show toast
        setTimeout(() => {
            this.elements.toast.classList.add('toast-show');
        }, 100);

        // Hide toast after 3 seconds
        setTimeout(() => {
            this.elements.toast.classList.remove('toast-show');
        }, 3000);

        // Reset toast classes after animation
        setTimeout(() => {
            this.elements.toast.className = 'fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50';
        }, 3300);
    }

    // Handle cart updates
    onCartUpdate() {
        this.updateCartCount();
        if (this.currentView === 'cart') {
            this.renderCart();
        }
    }

    // Initialize UI
    initialize() {
        this.renderProducts();
        this.updateCartCount();
        
        // Set up cart listener
        this.cart.addListener(() => this.onCartUpdate());
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.UIManager = UIManager;
}