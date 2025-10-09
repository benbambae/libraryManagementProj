// Book Management Logic

// Display books by category on browse page
function displayBooksByCategory() {
    const container = document.getElementById('booksContainer');
    if (!container) return;

    const categories = getAllCategories();
    container.innerHTML = '';

    categories.forEach(category => {
        const books = getBooksByCategory(category);

        const section = document.createElement('div');
        section.className = 'category-section';

        section.innerHTML = `
            <h2>${category}</h2>
            <div class="book-grid">
                ${books.map(book => createBookCard(book)).join('')}
            </div>
        `;

        container.appendChild(section);
    });
}

// Create book card HTML
function createBookCard(book) {
    const stockStatus = book.stock > 0 ? `In Stock (${book.stock})` : 'Out of Stock';
    const stockClass = book.stock > 0 ? '' : 'style="color: red;"';

    return `
        <div class="book-card">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <p class="price">${formatCurrency(book.price)}</p>
            <p ${stockClass}><strong>${stockStatus}</strong></p>
            <a href="book-detail.html?id=${book.id}" class="btn">View Details</a>
        </div>
    `;
}

// Display book details
function displayBookDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (!bookId) {
        document.getElementById('bookDetail').innerHTML = '<p>Book not found</p>';
        return;
    }

    const book = getBookById(bookId);

    if (!book) {
        document.getElementById('bookDetail').innerHTML = '<p>Book not found</p>';
        return;
    }

    const stockStatus = book.stock > 0 ? `In Stock (${book.stock} available)` : 'Out of Stock';
    const canPurchase = book.stock > 0;

    const detailHTML = `
        <div class="book-detail">
            <div class="book-detail-header">
                <h1>${book.title}</h1>
                <p style="font-size: 1.2rem; color: #666;">by ${book.author}</p>
            </div>

            <div class="book-detail-info">
                <div class="info-item">
                    <strong>ISBN:</strong>
                    <span>${book.isbn}</span>
                </div>
                <div class="info-item">
                    <strong>Category:</strong>
                    <span>${book.category}</span>
                </div>
                <div class="info-item">
                    <strong>Price:</strong>
                    <span style="font-size: 1.5rem; color: #27ae60; font-weight: bold;">
                        ${formatCurrency(book.price)}
                    </span>
                </div>
                <div class="info-item">
                    <strong>Availability:</strong>
                    <span style="color: ${book.stock > 0 ? '#27ae60' : '#e74c3c'}; font-weight: bold;">
                        ${stockStatus}
                    </span>
                </div>
            </div>

            <div class="book-description">
                <h3>Description</h3>
                <p>${book.description}</p>
            </div>

            <div class="book-actions">
                <a href="browse.html" class="btn btn-secondary">Back to Browse</a>
                ${canPurchase ? `<a href="purchase.html?id=${book.id}" class="btn">Purchase Book</a>` : ''}
            </div>
        </div>
    `;

    document.getElementById('bookDetail').innerHTML = detailHTML;
}

// Handle add book form
function handleAddBookForm(event) {
    event.preventDefault();

    const bookData = {
        isbn: document.getElementById('isbn').value.trim(),
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        category: document.getElementById('category').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        description: document.getElementById('description').value.trim()
    };

    // Validation
    if (!bookData.isbn || !bookData.title || !bookData.author || !bookData.category) {
        showMessage('message', 'Please fill in all required fields', 'error');
        return;
    }

    if (bookData.price <= 0) {
        showMessage('message', 'Price must be greater than 0', 'error');
        return;
    }

    if (bookData.stock < 0) {
        showMessage('message', 'Stock cannot be negative', 'error');
        return;
    }

    // Check if ISBN already exists
    if (getBookByISBN(bookData.isbn)) {
        showMessage('message', 'A book with this ISBN already exists', 'error');
        return;
    }

    // Add book
    const newBook = addBook(bookData);

    if (newBook) {
        showMessage('message', 'Book added successfully!', 'success');
        document.getElementById('addBookForm').reset();

        // Redirect to book detail after 2 seconds
        setTimeout(() => {
            window.location.href = `book-detail.html?id=${newBook.id}`;
        }, 2000);
    } else {
        showMessage('message', 'Failed to add book. Please try again.', 'error');
    }
}

// Handle search by ISBN
function handleSearch(event) {
    event.preventDefault();

    const searchTerm = document.getElementById('searchInput').value.trim();

    if (!searchTerm) {
        showMessage('message', 'Please enter an ISBN to search', 'error');
        return;
    }

    const book = getBookByISBN(searchTerm);
    const resultsContainer = document.getElementById('searchResults');

    if (book) {
        resultsContainer.innerHTML = `
            <div class="search-results">
                <h3>Search Results</h3>
                <div class="book-grid">
                    ${createBookCard(book)}
                </div>
            </div>
        `;
    } else {
        resultsContainer.innerHTML = `
            <div class="message error">
                No book found with ISBN: ${searchTerm}
            </div>
        `;
    }
}

// Add custom category option
function setupCategorySelect() {
    const categorySelect = document.getElementById('category');
    if (!categorySelect) return;

    const existingCategories = getAllCategories();

    // Clear existing options except the first one
    categorySelect.innerHTML = '<option value="">Select a category</option>';

    // Add existing categories
    existingCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Add "Other" option for custom category
    const otherOption = document.createElement('option');
    otherOption.value = 'other';
    otherOption.textContent = 'Other (specify below)';
    categorySelect.appendChild(otherOption);

    // Show/hide custom category input
    const customCategoryDiv = document.createElement('div');
    customCategoryDiv.className = 'form-group hidden';
    customCategoryDiv.id = 'customCategoryGroup';
    customCategoryDiv.innerHTML = `
        <label for="customCategory">Custom Category:</label>
        <input type="text" id="customCategory" name="customCategory">
    `;

    categorySelect.parentElement.after(customCategoryDiv);

    categorySelect.addEventListener('change', function() {
        const customGroup = document.getElementById('customCategoryGroup');
        if (this.value === 'other') {
            customGroup.classList.remove('hidden');
        } else {
            customGroup.classList.add('hidden');
        }
    });
}

// Get category value (handles custom category)
function getCategoryValue() {
    const categorySelect = document.getElementById('category');
    if (categorySelect.value === 'other') {
        const customCategory = document.getElementById('customCategory').value.trim();
        return customCategory || '';
    }
    return categorySelect.value;
}

// Update the handleAddBookForm to use getCategoryValue
function handleAddBookFormWithCustomCategory(event) {
    event.preventDefault();

    const category = getCategoryValue();

    if (!category) {
        showMessage('message', 'Please select or enter a category', 'error');
        return;
    }

    const bookData = {
        isbn: document.getElementById('isbn').value.trim(),
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        category: category,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        description: document.getElementById('description').value.trim()
    };

    // Validation
    if (!bookData.isbn || !bookData.title || !bookData.author) {
        showMessage('message', 'Please fill in all required fields', 'error');
        return;
    }

    if (bookData.price <= 0) {
        showMessage('message', 'Price must be greater than 0', 'error');
        return;
    }

    if (bookData.stock < 0) {
        showMessage('message', 'Stock cannot be negative', 'error');
        return;
    }

    // Check if ISBN already exists
    if (getBookByISBN(bookData.isbn)) {
        showMessage('message', 'A book with this ISBN already exists', 'error');
        return;
    }

    // Add book
    const newBook = addBook(bookData);

    if (newBook) {
        showMessage('message', 'Book added successfully!', 'success');
        document.getElementById('addBookForm').reset();

        // Redirect to book detail after 2 seconds
        setTimeout(() => {
            window.location.href = `book-detail.html?id=${newBook.id}`;
        }, 2000);
    } else {
        showMessage('message', 'Failed to add book. Please try again.', 'error');
    }
}
