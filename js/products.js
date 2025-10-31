// products.js - Product data and management

class ProductManager {
    constructor() {
        this.products = [
            {
                id: 1,
                name: "Wireless Headphones",
                description: "High-quality Bluetooth headphones with noise cancellation",
                price: 99.99,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
            },
            {
                id: 2,
                name: "Smart Watch",
                description: "Feature-rich smartwatch with health monitoring",
                price: 199.99,
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"
            },
            {
                id: 3,
                name: "Laptop Stand",
                description: "Ergonomic aluminum laptop stand for better posture",
                price: 49.99,
                image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop"
            },
            {
                id: 4,
                name: "Wireless Mouse",
                description: "Precision wireless mouse with ergonomic design",
                price: 29.99,
                image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop"
            },
            {
                id: 5,
                name: "USB-C Hub",
                description: "Multi-port USB-C hub with HDMI, USB 3.0, and SD card slots",
                price: 39.99,
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop"
            },
            {
                id: 6,
                name: "Portable Charger",
                description: "20000mAh portable power bank with fast charging",
                price: 34.99,
                image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop"
            },
            {
                id: 7,
                name: "Bluetooth Speaker",
                description: "Waterproof Bluetooth speaker with 360° sound",
                price: 79.99,
                image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop"
            },
            {
                id: 8,
                name: "Webcam HD",
                description: "1080p HD webcam with auto-focus and built-in microphone",
                price: 69.99,
                image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300&h=300&fit=crop"
            },
            {
                id: 9,
                name: "Gaming Keyboard",
                description: "Mechanical RGB gaming keyboard with programmable keys",
                price: 129.99,
                image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop"
            },
            {
                id: 10,
                name: "Monitor Stand",
                description: "Adjustable monitor stand with storage compartment",
                price: 59.99,
                image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop"
            },
            {
                id: 11,
                name: "Phone Case",
                description: "Protective phone case with wireless charging support",
                price: 24.99,
                image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop"
            },
            {
                id: 12,
                name: "Tablet Stand",
                description: "Adjustable tablet stand for desk or bedside use",
                price: 19.99,
                image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop"
            }
        ];
    }

    // Get all products
    getAllProducts() {
        return this.products;
    }

    // Get product by ID
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    // Search products by name or description
    searchProducts(query) {
        if (!query) return this.products;
        
        const searchTerm = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }

    // Filter products by price range
    filterByPriceRange(minPrice, maxPrice) {
        return this.products.filter(product => 
            product.price >= minPrice && product.price <= maxPrice
        );
    }

    // Sort products
    sortProducts(sortBy = 'name', order = 'asc') {
        const sortedProducts = [...this.products];
        
        sortedProducts.sort((a, b) => {
            let comparison = 0;
            
            switch(sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'price':
                    comparison = a.price - b.price;
                    break;
                default:
                    comparison = a.name.localeCompare(b.name);
            }
            
            return order === 'desc' ? -comparison : comparison;
        });
        
        return sortedProducts;
    }

    // Validate product data
    validateProduct(product) {
        const errors = [];

        if (!product.name || product.name.trim() === '') {
            errors.push('Product name is required');
        }

        if (!product.description || product.description.trim() === '') {
            errors.push('Product description is required');
        }

        if (!product.price || product.price <= 0) {
            errors.push('Product price must be greater than 0');
        }

        if (!product.image || product.image.trim() === '') {
            errors.push('Product image is required');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Format price for display
    formatPrice(price) {
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(price);
        } catch (error) {
            console.error('Error formatting price:', error);
            return `$${price.toFixed(2)}`;
        }
    }

    // Check if product is available (for future inventory management)
    isProductAvailable(productId) {
        const product = this.getProductById(productId);
        return product ? true : false;
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.ProductManager = ProductManager;
}