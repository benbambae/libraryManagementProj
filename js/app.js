// Main Application Logic

// Initialize sample books and test user if none exist
function initializeData() {
    // Initialize test user
    if (!localStorage.getItem('users')) {
        const testUsers = [
            {
                id: '1',
                username: 'testuser',
                email: 'test@library.com',
                password: 'test123',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(testUsers));
    }

    // Initialize books from Library folder
    if (!localStorage.getItem('books')) {
        // Check if library-data.js is loaded
        if (typeof getLibraryBooks === 'function') {
            const libraryBooks = getLibraryBooks();
            localStorage.setItem('books', JSON.stringify(libraryBooks));
        } else {
            console.error('Library data not loaded. Please include library-data.js');
        }
    }
}

// Get all books
function getAllBooks() {
    const books = localStorage.getItem('books');
    return books ? JSON.parse(books) : [];
}

// Get book by ID
function getBookById(id) {
    const books = getAllBooks();
    return books.find(book => book.id === id);
}

// Get book by ISBN
function getBookByISBN(isbn) {
    const books = getAllBooks();
    return books.find(book => book.isbn === isbn);
}

// Get books by category
function getBooksByCategory(category) {
    const books = getAllBooks();
    return books.filter(book => book.category === category);
}

// Get all categories
function getAllCategories() {
    const books = getAllBooks();
    const categories = [...new Set(books.map(book => book.category))];
    return categories.sort();
}

// Add new book
function addBook(bookData) {
    const books = getAllBooks();

    // Generate new ID
    const maxId = books.reduce((max, book) => {
        const id = parseInt(book.id);
        return id > max ? id : max;
    }, 0);

    const newBook = {
        id: String(maxId + 1).padStart(3, '0'),
        ...bookData
    };

    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));
    return newBook;
}

// Update book stock
function updateBookStock(bookId, quantity) {
    const books = getAllBooks();
    const bookIndex = books.findIndex(book => book.id === bookId);

    if (bookIndex !== -1) {
        books[bookIndex].stock -= quantity;
        localStorage.setItem('books', JSON.stringify(books));
        return true;
    }
    return false;
}

// Display message
function showMessage(elementId, message, type) {
    const messageDiv = document.getElementById(elementId);
    if (messageDiv) {
        messageDiv.innerHTML = `<div class="message ${type}">${message}</div>`;
        messageDiv.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Update navigation based on auth state
function updateNavigation() {
    const currentUser = getCurrentUser();
    const userInfoDiv = document.querySelector('.user-info');

    if (userInfoDiv) {
        if (currentUser) {
            userInfoDiv.innerHTML = `
                <span>Welcome, ${currentUser.username}</span>
                <button onclick="logout()">Logout</button>
            `;
        } else {
            userInfoDiv.innerHTML = '';
        }
    }
}

// Format currency
function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    updateNavigation();
});
