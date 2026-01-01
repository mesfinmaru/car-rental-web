// Main Page JavaScript
const CARS_STORAGE_KEY = 'driveeasy_cars';
const BOOKINGS_STORAGE_KEY = 'driveeasy_bookings';
const WALLET_STORAGE_KEY = 'driveeasy_wallet_balance'; // Unified key
const TRANSACTIONS_STORAGE_KEY = 'driveeasy_transactions';
const USER_DB_KEY = 'driveeasy_users';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    // Check if user is logged in
    checkLoginStatus();
    
    // Load wallet balance
    syncWalletBalance();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup wallet recharge functionality
    setupWalletRecharge();
    
    // Load cars if on main page
    if (document.getElementById('cars-container')) {
        loadCars();
    }
});


// Check login status and update UI
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userGreeting = document.getElementById('userName');
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfoDisplay');
    
    if (isLoggedIn && userGreeting) {
        const userName = localStorage.getItem('userName') || 'User';
        userGreeting.textContent = userName;
        
        // Show user info and logout button
        const logoutBtn = document.getElementById('btnLogout');
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
        }
        
        // Hide login/register buttons if they exist
        if (authButtons) {
            authButtons.classList.add('d-none');
        }
        
        if (userInfo) {
            userInfo.classList.remove('d-none');
        }

        // Show Admin Dashboard button if user is an admin
        const adminDashboardLink = document.getElementById('adminDashboardLink');
        const userRole = localStorage.getItem('userRole');
        
        if (userRole === 'admin') {
            document.body.classList.add('admin-mode');
            if (adminDashboardLink) adminDashboardLink.style.display = 'block';
        }
    } else {
        // User is not logged in, redirect to login
        const logoutBtn = document.getElementById('btnLogout');
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }
        
        // Show login message and redirect
        alert('Terms of Service: By using Car Rental Management System, you agree to our terms and conditions. Please drive safely and return vehicles on time.');
        window.location.href = 'Login.html';
    }
}

// Get wallet balance from localStorage (PER USER)
function getWalletBalance() {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') return 0.00; // Admins have no wallet

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return 0.00;

    const users = JSON.parse(localStorage.getItem(USER_DB_KEY)) || [];
    const user = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    
    return user ? parseFloat(user.walletBalance || 0) : 0.00;
}

// Update wallet balance in localStorage (PER USER)
function updateWalletBalance(newBalance) {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    const users = JSON.parse(localStorage.getItem(USER_DB_KEY)) || [];
    const userIndex = users.findIndex(u => u.email.toLowerCase() === userEmail.toLowerCase());
    
    if (userIndex !== -1) {
        users[userIndex].walletBalance = newBalance;
        localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
        syncWalletBalance();
    }
}

// Sync wallet balance across all displays
function syncWalletBalance() {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') return; // Don't sync for admins

    const balance = getWalletBalance();
    
    // Update ALL possible wallet display elements
    const walletElements = [
        'walletBadge',
        'walletBalance',
        'walletBalanceHero',
        'modalWalletBalance'
    ];
    
    walletElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = `${balance.toFixed(2)}`;
        }
    });
    
    // Also update any elements with data attribute
    document.querySelectorAll('[data-wallet-display]').forEach(element => {
        element.textContent = `${balance.toFixed(2)}`;
    });
}

// Setup wallet recharge functionality
function setupWalletRecharge() {
    // Get modal elements
    const rechargeModalElement = document.getElementById('rechargeModal');
    if (!rechargeModalElement) return;
    
    const rechargeModal = new bootstrap.Modal(rechargeModalElement);
    
    // Recharge buttons (both in navbar and hero)
    const rechargeButtons = [
        document.getElementById('rechargeWalletBtn'),
        document.getElementById('rechargeWalletBtnHero')
    ];
    
    rechargeButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                syncWalletBalance(); // Refresh balance before showing modal
                rechargeModal.show();
            });
        }
    });
    
    // Quick recharge amount buttons
    const quickRechargeButtons = document.querySelectorAll('.quick-recharge-amount');
    quickRechargeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const amount = parseFloat(this.dataset.amount);
            document.getElementById('rechargeAmount').value = amount;
        });
    });
    
    // Process recharge button
    const processRechargeBtn = document.getElementById('processRechargeBtn');
    if (processRechargeBtn) {
        processRechargeBtn.addEventListener('click', function() {
            processRecharge();
        });
    }
    
    // Enter key in recharge amount field
    const rechargeAmountInput = document.getElementById('rechargeAmount');
    if (rechargeAmountInput) {
        rechargeAmountInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                processRecharge();
            }
        });
    }
}

// Process wallet recharge
function processRecharge() {
    const amountInput = document.getElementById('rechargeAmount');
    const paymentMethod = document.getElementById('paymentMethod');
    
    // Validate amount
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) {
        alert('Please enter a valid recharge amount.');
        amountInput.focus();
        return;
    }
    
    // Validate payment method
    if (!paymentMethod.value) {
        alert('Please select a payment method.');
        paymentMethod.focus();
        return;
    }
    
    // Get current balance
    const currentBalance = getWalletBalance();
    const newBalance = currentBalance + amount;
    
    // Update wallet balance
    updateWalletBalance(newBalance);
    
    // Create transaction record
    const transaction = {
        id: Date.now(),
        type: 'recharge',
        amount: amount,
        previousBalance: currentBalance,
        newBalance: newBalance,
        paymentMethod: paymentMethod.value,
        date: new Date().toISOString(),
        status: 'completed'
    };
    
    // Save transaction to localStorage
    saveTransaction(transaction);
    
    // Show success message
    const rechargeModal = bootstrap.Modal.getInstance(document.getElementById('rechargeModal'));
    if (rechargeModal) {
        rechargeModal.hide();
    }
    
    // Show success message
    if (window.showToast) {
        window.showToast(`Successfully added Br${amount.toFixed(2)} to your wallet!\nNew balance: Br${newBalance.toFixed(2)}`, 'wallet', 5000);
    } else {
        alert(`Successfully added ${amount.toFixed(2)} to your wallet!\nNew balance: ${newBalance.toFixed(2)}`);
    }
    
    // Reset form
    document.getElementById('rechargeForm').reset();
}

// Save transaction to localStorage
function saveTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_STORAGE_KEY)) || [];
    transactions.push(transaction);
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
}

// Show success message
function showSuccessMessage(message) {
    // Create success alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Get cars from localStorage
function getCars() {
    const carsJson = localStorage.getItem(CARS_STORAGE_KEY);
    if (carsJson) {
        try {
            const cars = JSON.parse(carsJson);
            
            // Validate car structure and ensure required properties
            return cars.map(car => ({
                id: car.id || 0,
                model: car.model || 'Unknown Model',
                brand: car.brand || 'Unknown Brand',
                year: car.year || new Date().getFullYear(),
                price: car.price || 0,
                image: car.image || 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80',
                status: car.status || 'available',
                type: car.type || 'Sedan',
                seats: car.seats || 5,
                transmission: car.transmission || 'Automatic',
                features: car.features || ['Air Conditioning', 'Bluetooth', 'GPS']
            }));
        } catch (error) {
            console.error('Error parsing cars data:', error);
            return getDefaultCars();
        }
    } else {
        return getDefaultCars();
    }
}

// Default cars if none in storage
const defaultCars = [
  {
    id: 1,
    model: "Toyota Camry",
    brand: "Toyota",
    year: 2022,
    price: 45,
    image:
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
    status: "available",
  },
  {
    id: 2,
    model: "Honda Civic",
    brand: "Honda",
    year: 2023,
    price: 40,
    image:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
    status: "available",
  },
  {
    id: 3,
    model: "Ford Mustang",
    brand: "Ford",
    year: 2021,
    price: 85,
    image:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    status: "rented",
  },
  {
    id: 4,
    model: "BMW 3 Series",
    brand: "BMW",
    year: 2023,
    price: 75,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    status: "available",
  },
  {
    id: 5,
    model: "Tesla Model 3",
    brand: "Tesla",
    year: 2023,
    price: 90,
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    status: "available",
  },
  {
    id: 6,
    model: "Mercedes-Benz C-Class",
    brand: "Mercedes",
    year: 2022,
    price: 95,
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    status: "available",
  },
  {
    id: 1,
    model: "Camry",
    brand: "Toyota",
    year: 2023,
    price: 45,
    image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5",
    status: "available",
  },
  {
    id: 2,
    model: "Civic",
    brand: "Honda",
    year: 2023,
    price: 42,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2",
    status: "available",
  },
  {
    id: 3,
    model: "Mustang",
    brand: "Ford",
    year: 2023,
    price: 85,
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753",
    status: "available",
  },
  {
    id: 4,
    model: "3 Series",
    brand: "BMW",
    year: 2023,
    price: 75,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e",
    status: "available",
  },
  {
    id: 5,
    model: "Model 3",
    brand: "Tesla",
    year: 2023,
    price: 90,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
    status: "available",
  },
  {
    id: 6,
    model: "C-Class",
    brand: "Mercedes-Benz",
    year: 2023,
    price: 95,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8",
    status: "available",
  },
  {
    id: 7,
    model: "A4",
    brand: "Audi",
    year: 2023,
    price: 78,
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
    status: "available",
  },
  {
    id: 8,
    model: "RAV4",
    brand: "Toyota",
    year: 2023,
    price: 55,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
    status: "available",
  },
  {
    id: 9,
    model: "CR-V",
    brand: "Honda",
    year: 2023,
    price: 58,
    image: "https://images.unsplash.com/photo-1599912027610-6df29b6f1c5d",
    status: "available",
  },
  {
    id: 10,
    model: "911",
    brand: "Porsche",
    year: 2023,
    price: 250,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    status: "available",
  },
  {
    id: 11,
    model: "Wrangler",
    brand: "Jeep",
    year: 2023,
    price: 80,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d",
    status: "available",
  },
  {
    id: 13,
    model: "Corvette",
    brand: "Chevrolet",
    year: 2023,
    price: 180,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
    status: "available",
  },
  {
    id: 14,
    model: "RX",
    brand: "Lexus",
    year: 2023,
    price: 85,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea",
    status: "available",
  },
  {
    id: 15,
    model: "Outback",
    brand: "Subaru",
    year: 2023,
    price: 52,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb",
    status: "available",
  },
  {
    id: 16,
    model: "X5",
    brand: "BMW",
    year: 2023,
    price: 105,
    image:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    status: "available",
  },
  {
    id: 17,
    model: "Challenger",
    brand: "Dodge",
    year: 2023,
    price: 95,
    image: "https://images.unsplash.com/photo-1606220838315-056192d5e927",
    status: "available",
  },
  {
    id: 18,
    model: "Sorento",
    brand: "Kia",
    year: 2023,
    price: 65,
    image:
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    status: "available",
  },
  {
    id: 19,
    model: "XC90",
    brand: "Volvo",
    year: 2023,
    price: 88,
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    status: "available",
  },
  {
    id: 20,
    model: "Model S",
    brand: "Tesla",
    year: 2023,
    price: 120,
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80",
    status: "available",
  },
];

// Load cars on main page - ENHANCED with search/filter functionality
function loadCars() {
    const cars = getCars();
    const container = document.getElementById('cars-container');
    if (!container) return;
    
    // Get search filters (if any)
    const searchInput = document.getElementById('searchInput');
    const filterType = document.getElementById('filterType');
    const filterPrice = document.getElementById('filterPrice');
    
    let filteredCars = [...cars];
    
    // Apply search filter
    if (searchInput && searchInput.value.trim()) {
        const searchTerm = searchInput.value.toLowerCase().trim();
        filteredCars = filteredCars.filter(car => 
            car.brand.toLowerCase().includes(searchTerm) ||
            car.model.toLowerCase().includes(searchTerm) ||
            car.type.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply type filter
    if (filterType && filterType.value !== 'all') {
        filteredCars = filteredCars.filter(car => car.type === filterType.value);
    }
    
    // Apply price filter
    if (filterPrice && filterPrice.value !== 'all') {
        switch(filterPrice.value) {
            case 'low':
                filteredCars = filteredCars.filter(car => car.price < 50);
                break;
            case 'medium':
                filteredCars = filteredCars.filter(car => car.price >= 50 && car.price <= 100);
                break;
            case 'high':
                filteredCars = filteredCars.filter(car => car.price > 100);
                break;
        }
    }
    
    // Update car count display
    updateCarCount(filteredCars.length);
    
    container.innerHTML = '';
    
    if (filteredCars.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-car fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No cars available at the moment</h4>
                <p>Please adjust your search criteria or check back later.</p>
                <button class="btn btn-outline-primary mt-2" onclick="resetFilters()">
                    <i class="fas fa-redo me-1"></i>Reset Filters
                </button>
            </div>
        `;
        return;
    }
    
    filteredCars.forEach(car => {
        const carCard = createCarCard(car);
        container.appendChild(carCard);
    });
}

// Update car count display
function updateCarCount(count) {
    const carCountElement = document.getElementById('carCount');
    if (carCountElement) {
        carCountElement.textContent = count;
    }
}

// Create car card for main page - ENHANCED with more details
function createCarCard(car) {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-lg-3 mb-4';
    
    const card = document.createElement('div');
    card.className = 'card car-card h-100 shadow-sm';
    card.dataset.carId = car.id;
    
    // Create features list
    const featuresList = car.features && car.features.length > 0 
        ? car.features.slice(0, 3).map(feature => `<span class="badge bg-light text-dark me-1 mb-1">${feature}</span>`).join('')
        : '';
    
    card.innerHTML = `
        <div class="position-relative">
            <img src="${car.image}" class="card-img-top car-image" alt="${car.brand} ${car.model}">
            <span class="position-absolute top-0 end-0 m-2 badge bg-primary">${car.type}</span>
        </div>
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">${car.brand} ${car.model}</h5>
            <p class="card-text">
                <small class="text-muted">
                    <i class="fas fa-calendar-alt me-1"></i>${car.year} 
                    <i class="fas fa-users ms-3 me-1"></i>${car.seats} seats
                    <i class="fas fa-cog ms-3 me-1"></i>${car.transmission}
                </small>
            </p>
            ${featuresList ? `<div class="features mb-2">${featuresList}</div>` : ''}
            <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-0 text-primary">Br${car.price}<small class="text-muted">/day</small></h5>
                        ${car.status === 'available' 
                            ? `<small class="text-success"><i class="fas fa-check-circle me-1"></i>Available Now</small>`
                            : `<small class="text-danger"><i class="fas fa-times-circle me-1"></i>Rented</small>`
                        }
                    </div>
                    ${car.status === 'available'
                        ? `<button class="btn btn-primary rent-btn" data-car-id="${car.id}">
                             <i class="fas fa-calendar-alt me-1"></i>Rent Now
                           </button>`
                        : `<button class="btn btn-secondary disabled" disabled>
                             <i class="fas fa-lock me-1"></i>Rented
                           </button>`
                    }
                </div>
            </div>
        </div>
    `;
    
    col.appendChild(card);
    return col;
}

// Setup event listeners - ENHANCED with search/filter listeners
function setupEventListeners() {
    // Rent buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('rent-btn') || e.target.closest('.rent-btn')) {
            const btn = e.target.classList.contains('rent-btn') ? e.target : e.target.closest('.rent-btn');
            const carId = parseInt(btn.dataset.carId);
            
            // Check if user is logged in
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                showLoginAlert();
                return;
            }
            
            // Redirect to booking page or open booking modal
            openBookingModal(carId);
        }
    });
    
    // Search input event listener
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            loadCars();
        }, 300));
    }
    
    // Filter change event listeners
    const filterType = document.getElementById('filterType');
    if (filterType) {
        filterType.addEventListener('change', function() {
            loadCars();
        });
    }
    
    const filterPrice = document.getElementById('filterPrice');
    if (filterPrice) {
        filterPrice.addEventListener('change', function() {
            loadCars();
        });
    }
    
    // Refresh cars button (if you have one)
    const refreshCarsBtn = document.getElementById('refreshCarsBtn');
    if (refreshCarsBtn) {
        refreshCarsBtn.addEventListener('click', function() {
            loadCars();
            showAlert('Cars list refreshed!', 'success');
        });
    }
    
    // Admin link (if present)
    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            checkAdminAccess();
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('btnLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }

    // Locations Modal
    const locationsTrigger = document.getElementById('locations-trigger');
    if (locationsTrigger) {
        locationsTrigger.addEventListener('click', function() {
            const locationsModal = new bootstrap.Modal(document.getElementById('locationsModal'));
            locationsModal.show();
        });
    }
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show login alert
function showLoginAlert() {
    const alertHTML = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>Welcome to Car Rental Management System! Please login to book a car.</strong> You need to be logged in to make a booking.
            <div class="mt-2">
                <a href="auth.html" class="btn btn-sm btn-warning me-2">Login</a>
                <a href="auth.html?action=register" class="btn btn-sm btn-outline-warning">Register</a>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const alertContainer = document.getElementById('alertContainer') || document.body;
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = alertHTML;
    
    if (alertContainer.id === 'alertContainer') {
        alertContainer.innerHTML = alertDiv.innerHTML;
    } else {
        alertContainer.insertBefore(alertDiv.firstChild, alertContainer.firstChild);
    }
}

// Open booking modal or redirect to booking page
function openBookingModal(carId) {
    const cars = getCars();
    const car = cars.find(c => c.id === carId);
    
    if (!car) {
        showAlert('Car not found. Please try again.', 'danger');
        return;
    }
    
    // Check if car is available
    if (car.status !== 'available') {
        showAlert(`Sorry, the ${car.brand} ${car.model} is not available for booking.`, 'warning');
        return;
    }
    
    // Save selected car to localStorage for booking page
    localStorage.setItem('selectedCarId', carId);
    localStorage.setItem('selectedCarData', JSON.stringify(car));
    
    // Redirect to booking page
    window.location.href = 'booking.html';
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const alertContainer = document.getElementById('alertContainer') || document.body;
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = alertHTML;
    
    if (alertContainer.id === 'alertContainer') {
        alertContainer.innerHTML = alertDiv.innerHTML;
    } else {
        alertContainer.insertBefore(alertDiv.firstChild, alertContainer.firstChild);
        
        // Auto-remove alert after 5 seconds
        setTimeout(() => {
            const alert = document.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 5000);
    }
}

// Reset all filters
function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterType = document.getElementById('filterType');
    const filterPrice = document.getElementById('filterPrice');
    
    if (searchInput) searchInput.value = '';
    if (filterType) filterType.value = 'all';
    if (filterPrice) filterPrice.value = 'all';
    
    loadCars();
    showAlert('Filters have been reset.', 'info');
}

// Check admin access
function checkAdminAccess() {
    const userEmail = localStorage.getItem('userEmail') || '';
    const isAdmin = userEmail.includes('admin') || 
                    userEmail.includes('manager') || 
                    userEmail === 'admin@driveeasy.com' ||
                    userEmail === 'manager@driveeasy.com';
    
    if (isAdmin) {
        window.location.href = 'admin.html';
    } else {
        showAlert('You do not have admin access. Redirecting to main page...', 'warning');
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 2000);
    }
}

// Logout function for main page
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        localStorage.removeItem('userToken');
        localStorage.removeItem('rememberMe');
        
        // Show logout message
        showAlert('Logged out successfully!', 'success');
        
        // Reload page to update UI after a short delay
        setTimeout(() => {
            window.location.href = 'Login.html';
        }, 1500);
    }
}