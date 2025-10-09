# Library Management System

A simple online library system built with vanilla HTML, CSS, and JavaScript that allows visitors to browse books and registered users to manage the library inventory.

## Features

### For All Visitors
- Browse books by categories
- View detailed information about each book (title, author, description, price, etc.)
- View book catalog

### For Registered Users
- All visitor features, plus:
- User authentication (login/register)
- Search books by serial number
- Add new books to the library database
- Purchase books (payment handled by third-party portal)
- View purchase history

## Project Structure

```
libraryManagementProj/
├── index.html              # Landing page
├── login.html              # User login page
├── register.html           # User registration page
├── browse.html             # Browse books by category
├── book-detail.html        # Individual book details
├── add-book.html           # Add new book (admin/registered users)
├── search.html             # Search books by serial number
├── purchase.html           # Purchase confirmation page
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   ├── app.js              # Main application logic
│   ├── auth.js             # Authentication logic
│   ├── books.js            # Book management logic
│   └── purchase.js         # Purchase handling logic
└── README.md               # This file
```

## Technology Stack

- **HTML5**: Structure and content
- **CSS3**: Styling and layout
- **JavaScript (ES6+)**: Application logic and interactivity
- **LocalStorage**: Client-side data persistence

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start browsing!

### Running the Application

Simply open `index.html` in your preferred web browser. No build process or server required.

## User Guide

### For Visitors

1. **Browse Books**:
   - Navigate to the browse page to see books organized by categories
   - Click on any book to view detailed information

2. **View Book Details**:
   - See complete information including title, author, ISBN, price, description
   - View availability status

### For Registered Users

1. **Register**:
   - Click "Register" on the homepage
   - Fill in username, email, and password
   - Submit to create your account

2. **Login**:
   - Click "Login" on the homepage
   - Enter your credentials
   - Access additional features after login

3. **Search Books**:
   - Use the search feature to find books by serial number/ISBN
   - View related product details

4. **Add New Books**:
   - Navigate to "Add Book" page (available after login)
   - Fill in book details (title, author, ISBN, category, price, etc.)
   - Submit to add the book to the database

5. **Purchase Books**:
   - View book details and click "Purchase"
   - Confirm purchase on the purchase page
   - System handles successful/failed payment scenarios
   - View purchase confirmation or error message

## Data Storage

This application uses browser LocalStorage to persist data:
- **users**: Registered user accounts
- **books**: Library book catalog
- **purchases**: User purchase history
- **currentUser**: Currently logged-in user session

## Default Data

The application includes sample books across various categories:
- Fiction
- Non-Fiction
- Science
- Technology
- History
- Biography

## Payment Flow

1. User selects a book to purchase
2. User confirms purchase on purchase page
3. Application simulates payment processing
4. On success: Purchase is recorded, confirmation shown
5. On failure: Error message displayed, no purchase recorded

**Note**: Payment processing is simulated. In production, this would integrate with a third-party payment gateway.

## Limitations (MVP)

- No server-side functionality
- Data stored in browser (cleared if cache is cleared)
- No book borrowing feature (purchase only)
- No real payment processing
- Basic validation and error handling
- Minimal styling (functional over decorative)

## Future Enhancements

- Backend integration with database
- Real payment gateway integration
- Advanced search (by title, author, category)
- User profiles and wishlists
- Book reviews and ratings
- Inventory management
- Admin panel for user management
- Email notifications

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This is an MVP project for educational purposes.

## Support

For issues or questions, please contact the development team.
