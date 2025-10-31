# 🛒 Shopping Cart Project

A modern, feature-rich shopping cart application built with vanilla JavaScript, HTML, and TailwindCSS. This project demonstrates clean code architecture, modular design patterns, and a responsive user interface.

## 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Core Modules](#core-modules)
- [Promo Codes](#promo-codes)
- [Browser Support](#browser-support)
- [License](#license)

## ✨ Features

### Shopping Experience
- **Product Catalog**: Browse 12 pre-loaded tech products with images and descriptions
- **Add to Cart**: Seamless product addition with visual feedback
- **Quantity Management**: Increment, decrement, or manually input quantities
- **Remove Items**: Individual item removal with confirmation
- **Cart Persistence**: LocalStorage integration for cart data retention
- **Real-time Updates**: Dynamic cart count and total price calculations

### Discount System
- **Promo Code Support**: Apply discount codes for instant savings
- **Multiple Discount Tiers**: 10% and 50% discount options
- **Discount Validation**: Real-time promo code verification
- **Visual Feedback**: Clear success/error messages for promo applications

### User Interface
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Toast Notifications**: Non-intrusive feedback for user actions
- **Modal Dialogs**: Checkout and success confirmation modals
- **Empty State Handling**: Friendly messages for empty cart scenarios
- **Smooth Animations**: CSS transitions for enhanced UX

### Advanced Features
- **Cart Validation**: Comprehensive validation before checkout
- **Price Calculations**: Accurate subtotal, discount, and total computations
- **Error Handling**: Robust error management with user-friendly messages
- **Statistics Tracking**: Cart analytics and product metrics
- **Search & Filter**: Product search and price range filtering capabilities
- **Sort Options**: Sort products by name or price

## 🎥 Demo

### Main Features
1. **Product Browsing**: View all available products in a grid layout
2. **Cart Management**: Add, update quantities, and remove items
3. **Promo Codes**: Apply discount codes (try `jijan10` or `jijan50`)
4. **Checkout Process**: Review order and complete purchase

## 🛠 Technologies

- **HTML5**: Semantic markup structure
- **CSS3**: Custom styles with TailwindCSS framework
- **JavaScript (ES6+)**: Modern JavaScript with classes and modules
- **TailwindCSS**: Utility-first CSS framework via CDN
- **Font Awesome**: Icon library for UI elements
- **LocalStorage API**: Client-side data persistence

## 📁 Project Structure

```
Shopping Cart project/
├── index.html              # Main HTML file
├── style.css              # Custom CSS styles
├── js/
│   ├── products.js        # Product data and management
│   ├── cart.js            # Shopping cart logic
│   ├── promoCode.js       # Promo code validation and management
│   ├── ui.js              # UI rendering and DOM manipulation
│   └── script.js          # Main application initialization
└── README.md              # Project documentation
```

## 🚀 Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required!

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/jijanurrahman/Shopping-Cart-Page.git
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

3. **Access the application**
   - Direct: Open `index.html` in browser
   - Server: Navigate to `http://localhost:8000`

## 💻 Usage

### Adding Products to Cart
1. Browse the product catalog on the home page
2. Click the "Add to Cart" button on any product
3. View the cart count update in the header

### Managing Cart Items
1. Click "View Cart" to see your shopping cart
2. Adjust quantities using +/- buttons or manual input
3. Remove items using the trash icon
4. Clear entire cart with "Clear Cart" button

### Applying Promo Codes
1. Navigate to your cart
2. Enter a promo code in the input field
3. Click "Apply" to activate the discount
4. See the discount reflected in your total

### Completing Checkout
1. Click "Checkout" button in cart
2. Review your order in the modal
3. Click "Confirm Purchase" to complete
4. Cart will be cleared upon successful checkout

## 🧩 Core Modules

### 1. ProductManager (`products.js`)
Manages product data and operations.

**Key Methods:**
- `getAllProducts()`: Retrieve all products
- `getProductById(id)`: Get specific product
- `searchProducts(query)`: Search by name/description
- `filterByPriceRange(min, max)`: Filter by price
- `sortProducts(sortBy, order)`: Sort products
- `validateProduct(product)`: Validate product data
- `formatPrice(price)`: Format price for display

**Product Schema:**
```javascript
{
  id: Number,
  name: String,
  description: String,
  price: Number,
  image: String (URL)
}
```

### 2. ShoppingCart (`cart.js`)
Handles cart operations and state management.

**Key Methods:**
- `addItem(product, quantity)`: Add product to cart
- `removeItem(productId)`: Remove product from cart
- `updateQuantity(productId, newQuantity)`: Update item quantity
- `clearCart()`: Empty the cart
- `getItems()`: Get all cart items
- `getTotalItems()`: Get total item count
- `getSubtotal()`: Calculate subtotal
- `getTotalPrice()`: Calculate final price with discounts
- `validateCart()`: Validate cart before checkout
- `saveToStorage()`: Persist cart to localStorage
- `loadFromStorage()`: Load cart from localStorage

**Cart Item Schema:**
```javascript
{
  product: Product,
  quantity: Number,
  addedAt: Date
}
```

### 3. PromoCodeManager (`promoCode.js`)
Manages promo code validation and discount calculations.

**Key Methods:**
- `applyPromoCode(code, subtotal)`: Apply and validate promo code
- `removePromoCode()`: Remove applied promo code
- `getAppliedPromo()`: Get current promo details
- `calculateTotals(subtotal)`: Calculate pricing with discount
- `validatePromoCode(code)`: Validate code format
- `saveToStorage()`: Persist promo state
- `loadFromStorage()`: Load promo state

**Valid Promo Codes:**
- `jijan10`: 10% discount
- `jijan50`: 50% discount

### 4. UIManager (`ui.js`)
Handles all UI rendering and DOM manipulation.

**Key Methods:**
- `renderProducts()`: Display product grid
- `renderCart()`: Display cart items
- `updateCartCount()`: Update cart badge
- `updateCartTotal()`: Update pricing display
- `showToast(message, type)`: Show notification
- `showCheckout()`: Display checkout modal
- `confirmCheckout()`: Process checkout
- `applyPromoCode()`: Handle promo code application

### 5. ShoppingApp (`script.js`)
Main application controller and initialization.

**Key Methods:**
- `initialize()`: Bootstrap application
- `addToCart(productId, quantity)`: Add product to cart
- `removeFromCart(productId)`: Remove product from cart
- `updateQuantity(productId, newQuantity)`: Update quantity
- `applyPromoCode(code)`: Apply promo code
- `validateCheckout()`: Validate before checkout
- `processCheckout()`: Handle checkout process
- `getCartSummary()`: Get cart summary data

## 🎁 Promo Codes

Test the discount system with these promo codes:

| Code | Discount | Description |
|------|----------|-------------|
| `jijan10` | 10% | Get 10% off your total |
| `jijan50` | 50% | Get 50% off your total |

**How to Use:**
1. Add items to your cart
2. Navigate to cart view
3. Enter promo code in the input field
4. Click "Apply" button
5. Discount will be automatically calculated

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)

**Minimum Requirements:**
- ES6 JavaScript support
- LocalStorage API
- CSS Grid and Flexbox

## 🏗 Architecture Highlights

### Design Patterns
- **Class-based Architecture**: Modular OOP approach
- **Observer Pattern**: Event listeners for cart updates
- **Separation of Concerns**: Clear module boundaries
- **Single Responsibility**: Each class has one primary purpose

### Code Quality
- **Error Handling**: Try-catch blocks with user feedback
- **Input Validation**: Comprehensive validation for all inputs
- **Type Safety**: Parameter validation and type checking
- **Defensive Programming**: Null checks and edge case handling

### Performance
- **Efficient DOM Updates**: Minimal reflows and repaints
- **Event Delegation**: Optimized event handling
- **LocalStorage Caching**: Reduced data loss on refresh
- **Lazy Loading**: Images loaded on demand

## 🔧 Customization

### Adding New Products
Edit `js/products.js` and add to the products array:

```javascript
{
  id: 13,
  name: "Your Product",
  description: "Product description",
  price: 99.99,
  image: "https://your-image-url.com/image.jpg"
}
```

### Adding New Promo Codes
Edit `js/promoCode.js` in the `validCodes` object:

```javascript
'NEWCODE': {
  code: 'newcode',
  discount: 25,
  description: '25% discount'
}
```

### Styling
- Modify TailwindCSS classes in `index.html`
- Add custom styles in `style.css`
- Update color scheme via Tailwind utility classes

## 📝 Future Enhancements

- [ ] User authentication and accounts
- [ ] Product categories and filtering
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Multiple currency support
- [ ] Backend API integration
- [ ] Payment gateway integration
- [ ] Order history tracking
- [ ] Email notifications
- [ ] Advanced search with filters

### Coding Standards
- Use ES6+ JavaScript features
- Follow existing code style and structure
- Add comments for complex logic
- Test thoroughly before submitting

## 📝 License

This project is developed by **Jijanur Rahman** as part of personal practice in Advanced JavaScript, HTML, CSS, and Tailwind CSS with a primary focus on frontend development.


```


## 📧 Contact

For any questions or suggestions, please contact:
- **Developer**: [Jijanur Rahman](https://jijanurrahman.netlify.app)
- **Project**: Online Library (Book Review System)


## 🙏 Acknowledgments

- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Font Awesome](https://fontawesome.com/) for the icon library
- [Unsplash](https://unsplash.com/) for product images

**⭐ If you found this project helpful, please give it a star!**

