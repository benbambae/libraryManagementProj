// Authentication Logic

// Get all users
function getAllUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Register new user
function register(username, email, password) {
    const users = getAllUsers();

    // Check if username or email already exists
    const existingUser = users.find(
        user => user.username === username || user.email === email
    );

    if (existingUser) {
        return {
            success: false,
            message: 'Username or email already exists'
        };
    }

    // Validate inputs
    if (!username || !email || !password) {
        return {
            success: false,
            message: 'All fields are required'
        };
    }

    if (password.length < 6) {
        return {
            success: false,
            message: 'Password must be at least 6 characters long'
        };
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return {
        success: true,
        message: 'Registration successful! Please login.'
    };
}

// Login user
function login(username, password) {
    const users = getAllUsers();

    const user = users.find(
        u => (u.username === username || u.email === username) && u.password === password
    );

    if (user) {
        // Store current user (excluding password)
        const currentUser = {
            id: user.id,
            username: user.username,
            email: user.email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        return {
            success: true,
            message: 'Login successful!',
            user: currentUser
        };
    }

    return {
        success: false,
        message: 'Invalid username or password'
    };
}

// Logout user
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Get current logged-in user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Require authentication (redirect if not logged in)
function requireAuth() {
    if (!isLoggedIn()) {
        alert('Please login to access this page');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Handle registration form
function handleRegisterForm(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showMessage('message', 'Passwords do not match', 'error');
        return;
    }

    const result = register(username, email, password);

    if (result.success) {
        showMessage('message', result.message, 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        showMessage('message', result.message, 'error');
    }
}

// Handle login form
function handleLoginForm(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const result = login(username, password);

    if (result.success) {
        showMessage('message', result.message, 'success');
        setTimeout(() => {
            window.location.href = 'browse.html';
        }, 1000);
    } else {
        showMessage('message', result.message, 'error');
    }
}
