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

    // Initialize books
    if (!localStorage.getItem('books')) {
        const sampleBooks = [
            // Fiction
            {
                id: '001',
                isbn: '978-0-061-120-08-4',
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                category: 'Fiction',
                price: 15.99,
                stock: 10,
                description: 'A gripping tale of racial injustice and childhood innocence in the American South.'
            },
            {
                id: '002',
                isbn: '978-0-141-439-51-8',
                title: '1984',
                author: 'George Orwell',
                category: 'Fiction',
                price: 14.99,
                stock: 15,
                description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism.'
            },
            {
                id: '003',
                isbn: '978-0-743-273-56-5',
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                category: 'Fiction',
                price: 12.99,
                stock: 20,
                description: 'A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.'
            },
            // Non-Fiction
            {
                id: '004',
                isbn: '978-0-385-490-81-8',
                title: 'Sapiens',
                author: 'Yuval Noah Harari',
                category: 'Non-Fiction',
                price: 18.99,
                stock: 12,
                description: 'A brief history of humankind, exploring how Homo sapiens came to dominate the world.'
            },
            {
                id: '005',
                isbn: '978-0-307-887-89-8',
                title: 'Thinking, Fast and Slow',
                author: 'Daniel Kahneman',
                category: 'Non-Fiction',
                price: 17.99,
                stock: 8,
                description: 'A groundbreaking tour of the mind explaining the two systems that drive the way we think.'
            },
            // Science
            {
                id: '006',
                isbn: '978-0-553-380-16-8',
                title: 'A Brief History of Time',
                author: 'Stephen Hawking',
                category: 'Science',
                price: 16.99,
                stock: 10,
                description: 'A landmark volume in science writing exploring cosmology, black holes, and the nature of time.'
            },
            {
                id: '007',
                isbn: '978-0-385-514-22-5',
                title: 'The Immortal Life of Henrietta Lacks',
                author: 'Rebecca Skloot',
                category: 'Science',
                price: 15.99,
                stock: 7,
                description: 'The story of Henrietta Lacks and the immortal cell line grown from her cancerous cells.'
            },
            // Technology
            {
                id: '008',
                isbn: '978-0-735-611-31-9',
                title: 'Code Complete',
                author: 'Steve McConnell',
                category: 'Technology',
                price: 39.99,
                stock: 5,
                description: 'A practical handbook of software construction covering design, coding, debugging, and testing.'
            },
            {
                id: '009',
                isbn: '978-0-201-633-61-0',
                title: 'Design Patterns',
                author: 'Gang of Four',
                category: 'Technology',
                price: 44.99,
                stock: 6,
                description: 'Elements of reusable object-oriented software architecture and design patterns.'
            },
            // History
            {
                id: '010',
                isbn: '978-0-385-474-80-4',
                title: 'Guns, Germs, and Steel',
                author: 'Jared Diamond',
                category: 'History',
                price: 18.99,
                stock: 9,
                description: 'An exploration of how geography and environment shaped human societies and history.'
            },
            // Biography
            {
                id: '011',
                isbn: '978-1-501-127-62-4',
                title: 'Steve Jobs',
                author: 'Walter Isaacson',
                category: 'Biography',
                price: 19.99,
                stock: 11,
                description: 'The exclusive biography of Steve Jobs based on extensive interviews.'
            },
            {
                id: '012',
                isbn: '978-0-316-346-62-4',
                title: 'Becoming',
                author: 'Michelle Obama',
                category: 'Biography',
                price: 17.99,
                stock: 14,
                description: 'Former First Lady Michelle Obama\'s memoir chronicling her journey and experiences.'
            }
        ];

        localStorage.setItem('books', JSON.stringify(sampleBooks));
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
