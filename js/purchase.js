// Purchase Management Logic

// Get all purchases
function getAllPurchases() {
    const purchases = localStorage.getItem('purchases');
    return purchases ? JSON.parse(purchases) : [];
}

// Get purchases by user
function getUserPurchases(userId) {
    const purchases = getAllPurchases();
    return purchases.filter(purchase => purchase.userId === userId);
}

// Create purchase
function createPurchase(userId, bookId, quantity = 1) {
    const book = getBookById(bookId);

    if (!book) {
        return {
            success: false,
            message: 'Book not found'
        };
    }

    if (book.stock < quantity) {
        return {
            success: false,
            message: 'Insufficient stock'
        };
    }

    const purchase = {
        id: Date.now().toString(),
        userId: userId,
        bookId: bookId,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookISBN: book.isbn,
        quantity: quantity,
        price: book.price,
        total: book.price * quantity,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    const purchases = getAllPurchases();
    purchases.push(purchase);
    localStorage.setItem('purchases', JSON.stringify(purchases));

    return {
        success: true,
        purchase: purchase
    };
}

// Process payment (simulate)
function processPayment(purchaseId) {
    // Simulate payment processing with 80% success rate
    const success = Math.random() > 0.2;

    const purchases = getAllPurchases();
    const purchaseIndex = purchases.findIndex(p => p.id === purchaseId);

    if (purchaseIndex === -1) {
        return {
            success: false,
            message: 'Purchase not found'
        };
    }

    const purchase = purchases[purchaseIndex];

    if (success) {
        // Update purchase status
        purchases[purchaseIndex].status = 'completed';
        purchases[purchaseIndex].completedAt = new Date().toISOString();
        localStorage.setItem('purchases', JSON.stringify(purchases));

        // Update book stock
        updateBookStock(purchase.bookId, purchase.quantity);

        return {
            success: true,
            message: 'Payment successful! Your purchase is confirmed.',
            purchase: purchases[purchaseIndex]
        };
    } else {
        // Update purchase status to failed
        purchases[purchaseIndex].status = 'failed';
        purchases[purchaseIndex].failedAt = new Date().toISOString();
        localStorage.setItem('purchases', JSON.stringify(purchases));

        return {
            success: false,
            message: 'Payment failed. Please try again or use a different payment method.',
            purchase: purchases[purchaseIndex]
        };
    }
}

// Cancel purchase
function cancelPurchase(purchaseId) {
    const purchases = getAllPurchases();
    const purchaseIndex = purchases.findIndex(p => p.id === purchaseId);

    if (purchaseIndex !== -1) {
        purchases.splice(purchaseIndex, 1);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        return true;
    }
    return false;
}

// Display purchase summary
function displayPurchaseSummary() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (!bookId) {
        document.getElementById('purchaseContainer').innerHTML = '<p>Invalid purchase request</p>';
        return;
    }

    const book = getBookById(bookId);

    if (!book) {
        document.getElementById('purchaseContainer').innerHTML = '<p>Book not found</p>';
        return;
    }

    if (book.stock <= 0) {
        document.getElementById('purchaseContainer').innerHTML = '<p>Sorry, this book is out of stock</p>';
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert('Please login to purchase books');
        window.location.href = 'login.html';
        return;
    }

    const summaryHTML = `
        <div class="purchase-summary">
            <h2>Purchase Summary</h2>

            <div style="margin: 2rem 0;">
                <h3>${book.title}</h3>
                <p style="color: #666;">by ${book.author}</p>
            </div>

            <div class="purchase-item">
                <span>ISBN:</span>
                <span>${book.isbn}</span>
            </div>

            <div class="purchase-item">
                <span>Category:</span>
                <span>${book.category}</span>
            </div>

            <div class="purchase-item">
                <span>Price:</span>
                <span>${formatCurrency(book.price)}</span>
            </div>

            <div class="purchase-item">
                <span>Quantity:</span>
                <span>1</span>
            </div>

            <div class="purchase-total">
                <div class="purchase-item">
                    <span>Total:</span>
                    <span>${formatCurrency(book.price)}</span>
                </div>
            </div>

            <div class="purchase-actions">
                <button onclick="window.location.href='book-detail.html?id=${book.id}'"
                        class="btn btn-secondary">Cancel</button>
                <button onclick="confirmPurchase('${book.id}')"
                        class="btn">Confirm Purchase</button>
            </div>
        </div>

        <div id="message" style="margin-top: 2rem;"></div>
    `;

    document.getElementById('purchaseContainer').innerHTML = summaryHTML;
}

// Confirm purchase
function confirmPurchase(bookId) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert('Please login to purchase books');
        window.location.href = 'login.html';
        return;
    }

    // Create purchase
    const result = createPurchase(currentUser.id, bookId);

    if (!result.success) {
        showMessage('message', result.message, 'error');
        return;
    }

    // Disable purchase button
    const buttons = document.querySelectorAll('.purchase-actions button');
    buttons.forEach(btn => btn.disabled = true);

    showMessage('message', 'Processing payment...', 'success');

    // Simulate payment processing delay
    setTimeout(() => {
        const paymentResult = processPayment(result.purchase.id);

        if (paymentResult.success) {
            showMessage('message', paymentResult.message, 'success');

            // Show purchase confirmation
            setTimeout(() => {
                displayPurchaseConfirmation(paymentResult.purchase);
            }, 2000);
        } else {
            showMessage('message', paymentResult.message, 'error');

            // Re-enable buttons
            buttons.forEach(btn => btn.disabled = false);

            // Remove failed purchase
            cancelPurchase(result.purchase.id);
        }
    }, 2000);
}

// Display purchase confirmation
function displayPurchaseConfirmation(purchase) {
    const confirmationHTML = `
        <div class="purchase-summary">
            <h2 style="color: #27ae60;">Purchase Successful!</h2>

            <div style="margin: 2rem 0; padding: 1.5rem; background-color: #d4edda; border-radius: 8px;">
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">
                    <strong>Order ID:</strong> ${purchase.id}
                </p>
                <p style="font-size: 1.1rem;">
                    <strong>Date:</strong> ${new Date(purchase.completedAt).toLocaleString()}
                </p>
            </div>

            <div style="margin: 2rem 0;">
                <h3>${purchase.bookTitle}</h3>
                <p style="color: #666;">by ${purchase.bookAuthor}</p>
            </div>

            <div class="purchase-item">
                <span>ISBN:</span>
                <span>${purchase.bookISBN}</span>
            </div>

            <div class="purchase-item">
                <span>Quantity:</span>
                <span>${purchase.quantity}</span>
            </div>

            <div class="purchase-total">
                <div class="purchase-item">
                    <span>Total Paid:</span>
                    <span>${formatCurrency(purchase.total)}</span>
                </div>
            </div>

            <div class="purchase-actions">
                <button onclick="window.location.href='browse.html'"
                        class="btn btn-secondary">Continue Shopping</button>
                <button onclick="window.location.href='index.html'"
                        class="btn">Go to Home</button>
            </div>
        </div>
    `;

    document.getElementById('purchaseContainer').innerHTML = confirmationHTML;
}

// Display user purchase history
function displayPurchaseHistory() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        requireAuth();
        return;
    }

    const purchases = getUserPurchases(currentUser.id);
    const container = document.getElementById('purchaseHistory');

    if (!container) return;

    if (purchases.length === 0) {
        container.innerHTML = '<p>You have no purchase history yet.</p>';
        return;
    }

    // Sort by date (newest first)
    purchases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const tableHTML = `
        <h2>Purchase History</h2>
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${purchases.map(purchase => `
                    <tr>
                        <td>${purchase.id}</td>
                        <td>${purchase.bookTitle}</td>
                        <td>${purchase.bookAuthor}</td>
                        <td>${purchase.quantity}</td>
                        <td>${formatCurrency(purchase.total)}</td>
                        <td style="color: ${purchase.status === 'completed' ? '#27ae60' :
                                           purchase.status === 'failed' ? '#e74c3c' : '#f39c12'}">
                            ${purchase.status.toUpperCase()}
                        </td>
                        <td>${new Date(purchase.createdAt).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = tableHTML;
}
