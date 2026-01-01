// Bookings Page JavaScript - UPDATED with unified wallet system

// Unified wallet storage key
const WALLET_STORAGE_KEY = 'driveeasy_wallet_balance';
const BOOKINGS_STORAGE_KEY = 'driveeasy_bookings';
const CARS_STORAGE_KEY = 'driveeasy_cars'; // Sync with other pages
const USER_DB_KEY = 'driveeasy_users';

const cars = [
    {
        id: 1,
        model: "Toyota Camry",
        brand: "Toyota",
        year: 2022,
        price: 45,
        status: "available"
    },
    {
        id: 2,
        model: "Honda Civic",
        brand: "Honda",
        year: 2023,
        price: 40,
        status: "available"
    },
    {
        id: 3,
        model: "Ford Mustang",
        brand: "Ford",
        year: 2021,
        price: 85,
        status: "rented"
    },
    {
        id: 4,
        model: "BMW 3 Series",
        brand: "BMW",
        year: 2023,
        price: 75,
        status: "available"
    },
    {
        id: 5,
        model: "Tesla Model 3",
        brand: "Tesla",
        year: 2023,
        price: 90,
        status: "available"
    },
    {
        id: 6,
        model: "Mercedes-Benz C-Class",
        brand: "Mercedes",
        year: 2022,
        price: 95,
        status: "available"
    }
];

// Helper to get cars from storage
function getCarsFromStorage() {
    const carsJson = localStorage.getItem(CARS_STORAGE_KEY);
    if (carsJson) {
        return JSON.parse(carsJson);
    } else {
        localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(cars));
        return cars;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in before loading the app
    if (!checkLoginStatus()) {
        // Redirect to login page if not logged in
        redirectToLogin();
        return;
    }
    
    // Load wallet balance
    loadWalletBalance();
    
    // Load bookings
    loadBookings();
    
    // Display current user info
    displayCurrentUser();
    
    // Update wallet displays
    updateAllWalletDisplays();
    
    // Setup event listeners
    setupEventListeners();
});


// Load wallet balance from localStorage (PER USER)
function loadWalletBalance() {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
        window.walletBalance = 0.00;
        return;
    }

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.walletBalance = 0.00;
        return;
    }

    const users = JSON.parse(localStorage.getItem(USER_DB_KEY)) || [];
    const user = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    
    window.walletBalance = user ? parseFloat(user.walletBalance || 0) : 0.00;
}

// Update all wallet balance displays
function updateAllWalletDisplays() {
    const formattedBalance = `${window.walletBalance.toFixed(2)}`;
    
    // Update all wallet displays
    const displays = [
        'walletBadge',
        'walletBalance'
    ];
    
    displays.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = formattedBalance;
        }
    });
    
    // Also update modal balance if modal is open
    const modalBalance = document.getElementById('modalWalletBalance');
    if (modalBalance) {
        modalBalance.textContent = formattedBalance;
    }
}

// Load bookings into the bookings table
function loadBookings() {
    const bookingsTable = document.getElementById('bookings-table');
    bookingsTable.innerHTML = '';
    
    // Get bookings from localStorage
    const allBookings = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY)) || [];
    
    // Get currently logged in user
    const currentUserEmail = localStorage.getItem('userEmail');
    
    // Filter bookings for the current user
    const bookings = allBookings.filter(booking => booking.userEmail === currentUserEmail);
    
    if (bookings.length === 0) {
        bookingsTable.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-5">
                    <i class="fas fa-clipboard-list fa-3x mb-3"></i><br>
                    No bookings found
                    <p class="mt-2">
                        <a href="booking.html" class="btn btn-primary mt-3">
                            <i class="fas fa-plus me-2"></i>Make Your First Booking
                        </a>
                    </p>
                </td>
            </tr>
        `;
        return;
    }
    
    bookings.forEach(booking => {
        const row = document.createElement('tr');
        
        // Find the car for this booking
        const allCars = getCarsFromStorage();
        const car = allCars.find(c => c.id === booking.carId);
        const carName = car ? `${car.brand} ${car.model}` : booking.carModel;
        
        // Calculate the number of days
        const pickupDate = new Date(booking.pickupDate);
        const returnDate = new Date(booking.returnDate);
        const days = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
        
        // Determine status and button text
        let paymentBadge, rentalBadge, buttonHtml;
        if (booking.status === 'returned') {
            paymentBadge = '<span class="badge bg-success">Completed</span>';
            rentalBadge = '<span class="badge bg-success">Returned</span>';
            buttonHtml = '<span class="text-muted"><i class="fas fa-check-circle me-1"></i>Returned</span>';
        } else if (booking.status === 'completed') {
            paymentBadge = '<span class="badge bg-success">Completed</span>';
            rentalBadge = '<span class="badge bg-primary">Rented</span>';
            buttonHtml = '<span class="text-muted"><i class="fas fa-check-circle me-1"></i>Paid</span>';
        } else if (booking.status === 'cancelled') {
            paymentBadge = '<span class="badge bg-danger">Cancelled</span>';
            rentalBadge = '<span class="badge bg-info">Available</span>';
            buttonHtml = '<span class="text-muted"><i class="fas fa-times-circle me-1"></i>Cancelled</span>';
        } else {
            paymentBadge = '<span class="badge bg-warning">Pending</span>';
            rentalBadge = '<span class="badge bg-primary">Rented</span>';
            buttonHtml = `<button class="btn btn-sm btn-success pay-btn" data-booking-id="${booking.id}">
                            <i class="fas fa-wallet me-1"></i>Pay Now
                         </button>`;
        }
        
        const requestsText = booking.specialRequests && booking.specialRequests.trim() !== '' 
            ? booking.specialRequests 
            : '<span class="text-muted italic">No special request</span>';
            
        row.innerHTML = `
            <td>#${booking.id}</td>
            <td>${booking.customerName}</td>
            <td>${carName}</td>
            <td>${booking.pickupDate} to ${booking.returnDate} (${days} days)</td>
            <td>Br${booking.totalAmount || (car?.price || 0) * days}</td>
            <td>${requestsText}</td>
            <td>${paymentBadge}</td>
            <td>${rentalBadge}</td>
            <td>${buttonHtml}</td>
        `;
        
        bookingsTable.appendChild(row);
    });
    
    // Add event listeners to pay buttons
    document.querySelectorAll('.pay-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingId = parseInt(this.dataset.bookingId);
            initiatePayment(bookingId);
        });
    });
}

// Initiate payment for a booking
function initiatePayment(bookingId) {
    // Get bookings from localStorage
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY)) || [];
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
        alert('Booking not found.');
        return;
    }
    
    // Check if booking is already paid/returned
    if (booking.status === 'returned' || booking.status === 'completed') {
        alert('This booking is already processed (Paid/Returned).');
        return;
    }
    
    // Check if booking is cancelled
    if (booking.status === 'cancelled') {
        alert('This booking has been cancelled.');
        return;
    }
    
    // Show payment confirmation
    if (confirm(`Pay ${booking.totalAmount} for booking #${bookingId}?\n\nCar: ${booking.carModel}\nCustomer: ${booking.customerName}\nPeriod: ${booking.pickupDate} to ${booking.returnDate}`)) {
        processBookingPayment(bookingId);
    }
}

// Process booking payment
function processBookingPayment(bookingId) {
    // Get bookings from localStorage
    let bookings = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY)) || [];
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) return;
    
    const booking = bookings[bookingIndex];
    
    // Check wallet balance
    if (window.walletBalance < booking.totalAmount) {
        const shortage = booking.totalAmount - window.walletBalance;
        alert(`Insufficient wallet balance. You need ${shortage.toFixed(2)} more. Please recharge your wallet.`);
        showRechargeModal();
        return;
    }
    
    // Ask for final confirmation
    if (!confirm(`Final confirmation: Deduct ${booking.totalAmount} from your wallet for booking #${bookingId}?`)) {
        return;
    }
    
    // Deduct from wallet (PER USER)
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    window.walletBalance -= booking.totalAmount;
    
    const users = JSON.parse(localStorage.getItem(USER_DB_KEY)) || [];
    const userIndex = users.findIndex(u => u.email.toLowerCase() === userEmail.toLowerCase());
    
    if (userIndex !== -1) {
        users[userIndex].walletBalance = window.walletBalance.toFixed(2);
        localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
    }
    
    updateAllWalletDisplays();
    
    // Update booking status
    bookings[bookingIndex].status = 'completed'; // Keep internal key, just UI changes to 'Returned' elsewhere if needed, or change key too? 
    // Actually, user said change "Completed" to "Returned", implying the label. 
    // But Marking it as Returned in admin is the final step.
    // For now, let's keep 'completed' for paid status but display it as 'Returned' if the user wants.
    // Wait, if it's just paid, maybe it should still say "Paid"? 
    // The user screenshot showed "Completed" in the admin dashboard.
    // I'll keep the logic but update the UI labels as I did above.
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    
    // Update UI
    loadBookings();
    
    // Show success message
    alert(`Payment successful! ${booking.totalAmount} deducted from your wallet.\nBooking #${bookingId} is now completed.\nYour remaining balance: $${window.walletBalance.toFixed(2)}`);
}

// Setup event listeners
function setupEventListeners() {
    // Logout button
    document.getElementById('btnLogout').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
    
    // Recharge wallet button in navbar
    document.getElementById('rechargeWalletBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showRechargeModal();
    });
    
    // Recharge wallet button on page
    const rechargeBtnPage = document.getElementById('rechargeWalletBtnPage');
    if (rechargeBtnPage) {
        rechargeBtnPage.addEventListener('click', (e) => {
            e.preventDefault();
            showRechargeModal();
        });
    }
    
    // Process recharge button
    const processRechargeBtn = document.getElementById('processRechargeBtn');
    if (processRechargeBtn) {
        processRechargeBtn.addEventListener('click', processRecharge);
    }
    
    // Recharge amount buttons
    document.querySelectorAll('.quick-recharge-amount').forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = this.dataset.amount;
            document.getElementById('rechargeAmount').value = amount;
        });
    });
}

// Setup recharge modal
function setupRechargeModal() {
    // Initialize Bootstrap modal if available
    if (typeof bootstrap !== 'undefined') {
        // The modal will be initialized when shown
    }
}

// Show recharge modal
function showRechargeModal() {
    const rechargeModalElement = document.getElementById('rechargeModal');
    if (!rechargeModalElement) return;
    
    // Update modal balance display
    document.getElementById('modalWalletBalance').textContent = `${window.walletBalance.toFixed(2)}`;
    
    // Show modal
    const rechargeModal = new bootstrap.Modal(rechargeModalElement);
    rechargeModal.show();
}

// Process recharge
function processRecharge() {
    const rechargeAmountInput = document.getElementById('rechargeAmount');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    
    const rechargeAmount = parseFloat(rechargeAmountInput.value);
    const paymentMethod = paymentMethodSelect.value;
    
    if (!rechargeAmount || rechargeAmount <= 0) {
        alert('Please enter a valid recharge amount.');
        return;
    }
    
    if (!paymentMethod) {
        alert('Please select a payment method.');
        return;
    }
    
    // Simulate payment processing
    alert(`Processing ${rechargeAmount.toFixed(2)} payment via ${paymentMethod}...`);
    
    // Add to wallet balance (PER USER)
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');

    if (userRole === 'admin') {
        alert('Admins cannot have wallet balances.');
        return;
    }

    if (!userEmail) return;

    window.walletBalance += rechargeAmount;
    
    const users = JSON.parse(localStorage.getItem(USER_DB_KEY)) || [];
    const userIndex = users.findIndex(u => u.email.toLowerCase() === userEmail.toLowerCase());
    
    if (userIndex !== -1) {
        users[userIndex].walletBalance = window.walletBalance.toFixed(2);
        localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
    }
    
    updateAllWalletDisplays();
    
    // Close modal
    const rechargeModal = bootstrap.Modal.getInstance(document.getElementById('rechargeModal'));
    rechargeModal.hide();
    
    // Reset form
    rechargeAmountInput.value = '';
    paymentMethodSelect.value = '';
    
    // Show success message
    if (window.showToast) {
        window.showToast(`Successfully added Br${rechargeAmount.toFixed(2)} to your wallet!\nNew balance: Br${window.walletBalance.toFixed(2)}`, 'wallet', 5000);
    } else {
        alert(`Successfully added ${rechargeAmount.toFixed(2)} to your wallet!\nNew balance: ${window.walletBalance.toFixed(2)}`);
    }
}

// Check login status
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (isLoggedIn && userRole === 'admin') {
        document.body.classList.add('admin-mode');
        const adminDashboardLink = document.getElementById('adminDashboardLink');
        if (adminDashboardLink) adminDashboardLink.style.display = 'block';
    }
    
    return isLoggedIn;
}

// Display current user information
function displayCurrentUser() {
    // Get user info from localStorage
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName') || 'User';
    
    // Update user info in the UI
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
    
    console.log(`Logged in as: ${userName} (${userEmail})`);
}

// Redirect to login page
function redirectToLogin() {
    // Clear any existing data
    clearSessionData();
    
    // Redirect to auth.html (login page)
    window.location.href = "Login.html";
}

// Clear session data
function clearSessionData() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userToken');
}

// Logout function
function logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        // Clear all session data (except wallet balance)
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userToken');
        
        // Show logout message
        alert('Logged out successfully! Redirecting to login page...');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = "Login.html";
        }, 1000);
    }
}