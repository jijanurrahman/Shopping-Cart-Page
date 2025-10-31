// promoCode.js - Promo code management and validation

class PromoCodeManager {
    constructor() {
        this.validCodes = {
            'jijan10': {
                code: 'jijan10',
                discount: 10,
                description: '10% discount'
            },
            'jijan50': {
                code: 'jijan50',
                discount: 50,
                description: '50% discount'
            }
        };
        this.appliedPromo = null;
        this.listeners = [];
    }

    // Add event listener for promo code changes
    addListener(callback) {
        this.listeners.push(callback);
    }

    // Notify all listeners of promo code changes
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.appliedPromo);
            } catch (error) {
                console.error('Error in promo code listener:', error);
            }
        });
    }

    // Validate and apply promo code
    applyPromoCode(code, subtotal) {
        try {
            if (!code || typeof code !== 'string') {
                throw new Error('Invalid promo code format');
            }

            // Convert to lowercase for case-insensitive comparison
            const normalizedCode = code.toLowerCase().trim();

            // Check if promo code is already applied
            if (this.appliedPromo && this.appliedPromo.code === normalizedCode) {
                return {
                    success: false,
                    message: 'This promo code is already applied',
                    type: 'warning'
                };
            }

            // Check if code exists
            if (!this.validCodes[normalizedCode]) {
                return {
                    success: false,
                    message: 'Invalid Promo Code',
                    type: 'error'
                };
            }

            // Apply the promo code
            const promoData = this.validCodes[normalizedCode];
            const discountAmount = (subtotal * promoData.discount) / 100;
            const finalTotal = subtotal - discountAmount;

            this.appliedPromo = {
                code: normalizedCode,
                discount: promoData.discount,
                description: promoData.description,
                discountAmount: discountAmount,
                originalTotal: subtotal,
                finalTotal: finalTotal,
                appliedAt: new Date()
            };

            this.notifyListeners();

            return {
                success: true,
                message: `${promoData.description} applied successfully!`,
                type: 'success',
                promoData: this.appliedPromo
            };

        } catch (error) {
            console.error('Error applying promo code:', error);
            return {
                success: false,
                message: 'An error occurred while applying the promo code',
                type: 'error'
            };
        }
    }

    // Remove applied promo code
    removePromoCode() {
        try {
            if (!this.appliedPromo) {
                return {
                    success: false,
                    message: 'No promo code is currently applied',
                    type: 'warning'
                };
            }

            this.appliedPromo = null;
            this.notifyListeners();

            return {
                success: true,
                message: 'Promo code removed successfully',
                type: 'success'
            };
        } catch (error) {
            console.error('Error removing promo code:', error);
            return {
                success: false,
                message: 'An error occurred while removing the promo code',
                type: 'error'
            };
        }
    }

    // Get current applied promo code
    getAppliedPromo() {
        return this.appliedPromo ? { ...this.appliedPromo } : null;
    }

    // Check if a promo code is currently applied
    hasAppliedPromo() {
        return this.appliedPromo !== null;
    }

    // Calculate totals with promo code applied
    calculateTotals(subtotal) {
        try {
            if (!this.appliedPromo) {
                return {
                    subtotal: subtotal,
                    discountAmount: 0,
                    discountPercent: 0,
                    finalTotal: subtotal,
                    hasDiscount: false
                };
            }

            // Recalculate discount based on current subtotal
            const discountAmount = (subtotal * this.appliedPromo.discount) / 100;
            const finalTotal = subtotal - discountAmount;

            // Update applied promo with new calculations
            this.appliedPromo.discountAmount = discountAmount;
            this.appliedPromo.originalTotal = subtotal;
            this.appliedPromo.finalTotal = finalTotal;

            return {
                subtotal: subtotal,
                discountAmount: discountAmount,
                discountPercent: this.appliedPromo.discount,
                finalTotal: finalTotal,
                hasDiscount: true,
                promoCode: this.appliedPromo.code,
                promoDescription: this.appliedPromo.description
            };
        } catch (error) {
            console.error('Error calculating totals:', error);
            return {
                subtotal: subtotal,
                discountAmount: 0,
                discountPercent: 0,
                finalTotal: subtotal,
                hasDiscount: false
            };
        }
    }

    // Validate promo code format (without applying)
    validatePromoCode(code) {
        try {
            if (!code || typeof code !== 'string') {
                return {
                    isValid: false,
                    message: 'Please enter a promo code'
                };
            }

            const normalizedCode = code.toLowerCase().trim();

            if (normalizedCode.length === 0) {
                return {
                    isValid: false,
                    message: 'Please enter a promo code'
                };
            }

            if (normalizedCode.length > 20) {
                return {
                    isValid: false,
                    message: 'Promo code is too long'
                };
            }

            return {
                isValid: true,
                message: 'Promo code format is valid'
            };
        } catch (error) {
            console.error('Error validating promo code:', error);
            return {
                isValid: false,
                message: 'Invalid promo code format'
            };
        }
    }

    // Get list of available promo codes (for testing/admin purposes)
    getAvailableCodes() {
        return Object.keys(this.validCodes).map(key => ({
            code: key,
            discount: this.validCodes[key].discount,
            description: this.validCodes[key].description
        }));
    }

    // Clear applied promo code (for cart clearing)
    clear() {
        this.appliedPromo = null;
        this.notifyListeners();
    }

    // Save promo code state to localStorage
    saveToStorage() {
        try {
            if (this.appliedPromo) {
                const promoData = {
                    appliedPromo: this.appliedPromo,
                    savedAt: new Date().toISOString()
                };
                localStorage.setItem('appliedPromoCode', JSON.stringify(promoData));
            } else {
                localStorage.removeItem('appliedPromoCode');
            }
            return true;
        } catch (error) {
            console.error('Error saving promo code to storage:', error);
            return false;
        }
    }

    // Load promo code state from localStorage
    loadFromStorage() {
        try {
            const savedPromo = localStorage.getItem('appliedPromoCode');
            if (savedPromo) {
                const promoData = JSON.parse(savedPromo);
                if (promoData && promoData.appliedPromo) {
                    // Validate that the saved promo code is still valid
                    const code = promoData.appliedPromo.code;
                    if (this.validCodes[code]) {
                        this.appliedPromo = promoData.appliedPromo;
                        this.notifyListeners();
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            console.error('Error loading promo code from storage:', error);
            return false;
        }
    }

    // Clear promo code from storage
    clearStorage() {
        try {
            localStorage.removeItem('appliedPromoCode');
            return true;
        } catch (error) {
            console.error('Error clearing promo code storage:', error);
            return false;
        }
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.PromoCodeManager = PromoCodeManager;
}
