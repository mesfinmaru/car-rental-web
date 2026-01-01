// Booking Page JavaScript - UPDATED: No wallet deduction on booking + unified wallet system

// Unified wallet storage key
const WALLET_STORAGE_KEY = 'driveeasy_wallet_balance';
const BOOKINGS_STORAGE_KEY = 'driveeasy_bookings';
const CARS_STORAGE_KEY = 'driveeasy_cars'; // Sync with cars.js keys
const USER_DB_KEY = 'driveeasy_users';

// Full Default cars list (synced with cars.js)
const defaultCars = [
    {
        id: 1,
        model: "Toyota Camry",
        brand: "Toyota",
        year: 2022,
        price: 45,
        image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
        status: "available"
    },
    {
        id: 2,
        model: "Honda Civic",
        brand: "Honda",
        year: 2023,
        price: 40,
        image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
        status: "available"
    },
    {
        id: 3,
        model: "Ford Mustang",
        brand: "Ford",
        year: 2021,
        price: 85,
        image: "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        status: "rented"
    },
    {
        id: 4,
        model: "BMW 3 Series",
        brand: "BMW",
        year: 2023,
        price: 75,
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        status: "available"
    },
    {
        id: 5,
        model: "Tesla Model 3",
        brand: "Tesla",
        year: 2023,
        price: 90,
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
        status: "available"
    },
    {
        id: 6,
        model: "Mercedes-Benz C-Class",
        brand: "Mercedes",
        year: 2022,
        price: 95,
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        status: "available"
    },
    {
        id: 7,
        model: "Audi A4",
        brand: "Audi",
        year: 2023,
        price: 78,
        image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
        status: "available"
    },
    {
        id: 8,
        model: "Toyota RAV4",
        brand: "Toyota",
        year: 2023,
        price: 55,
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
        status: "available"
    },
    {
        id: 9,
        model: "Honda CR-V",
        brand: "Honda",
        year: 2023,
        price: 58,
        image: "https://images.unsplash.com/photo-1599912027610-6df29b6f1c5d",
        status: "available"
    },
    {
        id: 10,
        model: "Porsche 911",
        brand: "Porsche",
        year: 2023,
        price: 250,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
        status: "available"
    },
    {
        id: 11,
        model: "Jeep Wrangler",
        brand: "Jeep",
        year: 2023,
        price: 80,
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d",
        status: "available"
    },
    {
        id: 13,
        model: "Chevrolet Corvette",
        brand: "Chevrolet",
        year: 2023,
        price: 180,
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
        status: "available"
    },
    {
        id: 14,
        model: "Lexus RX",
        brand: "Lexus",
        year: 2023,
        price: 85,
        image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea",
        status: "available"
    },
    {
        id: 15,
        model: "Subaru Outback",
        brand: "Subaru",
        year: 2023,
        price: 52,
        image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb",
        status: "available"
    },
    {
        id: 16,
        model: "BMW X5",
        brand: "BMW",
        year: 2023,
        price: 105,
        image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
        status: "available"
    },
    {
        id: 17,
        model: "Dodge Challenger",
        brand: "Dodge",
        year: 2023,
        price: 95,
        image: "https://images.unsplash.com/photo-1606220838315-056192d5e927",
        status: "available"
    },
    {
        id: 18,
        model: "Kia Sorento",
        brand: "Kia",
        year: 2023,
        price: 65,
        image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5",
        status: "available"
    },
    {
        id: 19,
        model: "Volvo XC90",
        brand: "Volvo",
        year: 2023,
        price: 88,
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
        status: "available"
    },
    {
        id: 20,
        model: "Tesla Model S",
        brand: "Tesla",
        year: 2023,
        price: 120,
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
        status: "available"
    }
];

// Helper to get cars from storage
function getCarsFromStorage() {
    const carsJson = localStorage.getItem(CARS_STORAGE_KEY);
    if (carsJson) {
        return JSON.parse(carsJson);
    } else {
        return defaultCars;
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
    
    // Load wallet balance from localStorage if available
    loadWalletBalance();
    
    // Populate car select dropdown
    populateCarSelect();
    
    // Display current user info
    displayCurrentUser();
    
    // Update wallet displays
    updateAllWalletDisplays();
    
    // Setup event listeners
    setupEventListeners();
    
    // Set minimum dates for booking form
    setMinDates();
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

// Populate car select in booking form
function populateCarSelect() {
    const carSelect = document.getElementById('carSelect');
    if (!carSelect) return;
    
    carSelect.innerHTML = '<option value="">Choose a car...</option>';
    
    // Only show available cars from storage
    const allCars = getCarsFromStorage();
    const availableCars = allCars.filter(car => car.status === 'available');
    
    if (availableCars.length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "No cars available at the moment";
        carSelect.appendChild(option);
        carSelect.disabled = true;
        return;
    }
    
    carSelect.disabled = false;
    availableCars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.brand} ${car.model} - ${car.price}/day`;
        carSelect.appendChild(option);
    });
    
    // Check for carId in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedCarId = urlParams.get('carId');
    if (preSelectedCarId) {
        carSelect.value = preSelectedCarId;
    }
}

// Set minimum dates for booking form
function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    const pickupDateInput = document.getElementById('pickupDate');
    const returnDateInput = document.getElementById('returnDate');
    
    if (pickupDateInput) {
        pickupDateInput.min = today;
        pickupDateInput.value = today;
    }
    
    if (returnDateInput) {
        // Set return date to tomorrow by default
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        returnDateInput.min = today;
        returnDateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    // Update return date min when pickup date changes
    if (pickupDateInput) {
        pickupDateInput.addEventListener('change', function() {
            if (returnDateInput) {
                returnDateInput.min = this.value;
                if (new Date(returnDateInput.value) < new Date(this.value)) {
                    returnDateInput.value = this.value;
                }
            }
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('btnLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Recharge wallet button in navbar
    const rechargeWalletBtn = document.getElementById('rechargeWalletBtn');
    if (rechargeWalletBtn) {
        rechargeWalletBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showRechargeModal();
        });
    }
    
    // Recharge wallet button on page
    const rechargeWalletBtnPage = document.getElementById('rechargeWalletBtnPage');
    if (rechargeWalletBtnPage) {
        rechargeWalletBtnPage.addEventListener('click', (e) => {
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
    
    // Booking form submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processBooking();
        });
    }
}

// Process booking form submission - UPDATED: No wallet deduction
function processBooking() {
    const carId = parseInt(document.getElementById('carSelect').value);
    const customerName = document.getElementById('customerName').value;
    const pickupDate = document.getElementById('pickupDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const specialRequests = document.getElementById('specialRequests').value;
    
    if (!carId || !customerName || !pickupDate || !returnDate || !customerEmail || !customerPhone) {
        alert('Please fill in all required fields.');
        return;
    }
    
    if (new Date(returnDate) <= new Date(pickupDate)) {
        alert('Return date must be after pickup date.');
        return;
    }
    
    // Find the selected car from storage
    const allCars = getCarsFromStorage();
    const car = allCars.find(c => c.id === carId);
    if (!car) {
        alert('Selected car not found.');
        return;
    }
    
    // Calculate total amount
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
    const totalAmount = car.price * days;
    
    // IMPORTANT: We DON'T check wallet balance here anymore
    // Payment will be done later from the bookings page
    
    // Create new booking with "active" status (not paid yet)
    const newBooking = {
        id: Date.now(), // Use timestamp for unique ID
        userEmail: localStorage.getItem('userEmail'), // Added for filtering
        customerName: customerName,
        customerEmail: customerEmail,
        carId: carId,
        carModel: car.model,
        pickupDate: pickupDate,
        returnDate: returnDate,
        totalAmount: totalAmount,
        specialRequests: specialRequests, // Added field
        status: 'active'
    };
    
    // Get existing bookings
    let bookings = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY)) || [];
    bookings.push(newBooking);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));

    // UPDATE CAR STATUS: Mark as rented in storage
    const updatedCars = allCars.map(c => {
        if (c.id === carId) {
            return { ...c, status: 'rented' };
        }
        return c;
    });
    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(updatedCars));
    
    // Reset form
    document.getElementById('booking-form').reset();
    setMinDates(); // Reset dates to today
    populateCarSelect(); // Update car list (car still shows as available since not paid yet)
    
    // Show success message with payment info
    alert(`Booking confirmed! Thank you ${customerName}. 
           Your reservation for ${car.brand} ${car.model} 
           from ${pickupDate} to ${returnDate} has been received.
           
           Total Amount: ${totalAmount}
           
           Please visit "My Bookings" page to complete the payment.`);
    
    // Redirect to bookings page immediately
    window.location.href = "bookings.html";
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