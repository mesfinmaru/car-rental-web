// Cars Page JavaScript - UPDATED to sync with admin panel via localStorage

// Unified wallet storage key
const WALLET_STORAGE_KEY = "driveeasy_wallet_balance";
const CARS_STORAGE_KEY = "driveeasy_cars"; // Added for syncing with admin
const USER_DB_KEY = "driveeasy_users";

// Default cars (used as fallback)
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

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in before loading the app
  if (!checkLoginStatus()) {
    // Redirect to login page if not logged in
    redirectToLogin();
    return;
  }

  // Initialize cars data in localStorage if not exists
  // Initialize cars data in localStorage if not exists
  initializeCarsData();

  // Load wallet balance from localStorage if available
  loadWalletBalance();

  // Load cars from localStorage
  loadCars();

  // Display current user info
  displayCurrentUser();

  // Update wallet displays
  updateAllWalletDisplays();

  // Setup event listeners
  setupEventListeners();
});

// Initialize cars data in localStorage if not exists
function initializeCarsData() {
  if (!localStorage.getItem(CARS_STORAGE_KEY)) {
    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(defaultCars));
  }
}

// Load wallet balance from localStorage (PER USER)
function loadWalletBalance() {
  const userRole = localStorage.getItem("userRole");
  if (userRole === "admin") {
    window.walletBalance = 0.0;
    return;
  }

  const userEmail = localStorage.getItem("userEmail");
  if (!userEmail) {
    window.walletBalance = 0.0;
    return;
  }

  const users = JSON.parse(localStorage.getItem(USER_DB_KEY)) || [];
  const user = users.find(
    (u) => u.email.toLowerCase() === userEmail.toLowerCase()
  );

  window.walletBalance = user ? parseFloat(user.walletBalance || 0) : 0.0;
}

// Update all wallet balance displays
function updateAllWalletDisplays() {
  const formattedBalance = `${window.walletBalance.toFixed(2)}`;

  // Update all wallet displays
  const displays = ["walletBadge", "walletBalance"];

  displays.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = formattedBalance;
    }
  });

  // Also update modal balance if modal is open
  const modalBalance = document.getElementById("modalWalletBalance");
  if (modalBalance) {
    modalBalance.textContent = formattedBalance;
  }
}

// Get cars from localStorage
function getCarsFromStorage() {
  const carsJson = localStorage.getItem(CARS_STORAGE_KEY);
  if (carsJson) {
    return JSON.parse(carsJson);
  } else {
    // Use default cars if none in storage
    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(defaultCars));
    return defaultCars;
  }
}

// Load cars into the cars container
function loadCars() {
  const carsContainer = document.getElementById("cars-container");
  if (!carsContainer) return;

  carsContainer.innerHTML = "";

  const cars = getCarsFromStorage();

  if (cars.length === 0) {
    carsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-car fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No cars available at the moment</h4>
                <p class="text-muted">Please check back later or contact support.</p>
            </div>
        `;
    return;
  }

  // Show all cars from storage
  cars.forEach((car) => {
    const carCard = createCarCard(car);
    carsContainer.appendChild(carCard);
  });
}

// Create a car card element
function createCarCard(car) {
  const col = document.createElement("div");
  col.className = "col-md-4 mb-4";

  const card = document.createElement("div");
  card.className = "card car-card h-100";

  const isAvailable = car.status === "available";
  const statusText = isAvailable
    ? "Available"
    : car.status === "rented"
    ? "Rented"
    : car.status.charAt(0).toUpperCase() + car.status.slice(1);

  card.innerHTML = `
        <div class="car-image">
            <img src="${car.image}" alt="${car.model}" class="img-fluid">
        </div>
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">${car.brand} ${car.model}</h5>
            <p class="card-text"><i class="fas fa-calendar-alt me-2"></i>Year: ${
              car.year
            }</p>
            <p class="card-text"><i class="fas fa-tag me-2"></i>Price: <span class="price">Br${
              car.price
            }/day</span></p>
            <p class="card-text">
                <i class="fas fa-circle me-2"></i>Status: 
                <span class="${
                  isAvailable ? "status-available" : "status-rented"
                }">
                    ${statusText}
                </span>
            </p>
            <div class="mt-auto">
                ${
                  isAvailable
                    ? `<a href="booking.html?carId=${car.id}" class="btn btn-outline-primary w-100">
                         Book This Car
                       </a>`
                    : `<button class="btn btn-secondary w-100 disabled" disabled>
                         <i class="fas fa-lock me-1"></i>Rented
                       </button>`
                }
            </div>
        </div>
    `;

  col.appendChild(card);
  return col;
}

// Setup event listeners
function setupEventListeners() {
  // Logout button
  const logoutBtn = document.getElementById("btnLogout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Recharge wallet button in navbar
  const rechargeWalletBtn = document.getElementById("rechargeWalletBtn");
  if (rechargeWalletBtn) {
    rechargeWalletBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showRechargeModal();
    });
  }

  // Recharge wallet button on page
  const rechargeWalletBtnPage = document.getElementById(
    "rechargeWalletBtnPage"
  );
  if (rechargeWalletBtnPage) {
    rechargeWalletBtnPage.addEventListener("click", (e) => {
      e.preventDefault();
      showRechargeModal();
    });
  }

  // Process recharge button
  const processRechargeBtn = document.getElementById("processRechargeBtn");
  if (processRechargeBtn) {
    processRechargeBtn.addEventListener("click", processRecharge);
  }

  // Recharge amount buttons
  document.querySelectorAll(".quick-recharge-amount").forEach((btn) => {
    btn.addEventListener("click", function () {
      const amount = this.dataset.amount;
      document.getElementById("rechargeAmount").value = amount;
    });
  });

  // Refresh cars button (if exists)
  const refreshCarsBtn = document.getElementById("refreshCarsBtn");
  if (refreshCarsBtn) {
    refreshCarsBtn.addEventListener("click", () => {
      loadCars();
      alert("Cars list refreshed from storage!");
    });
  }
}

// Setup recharge modal
function setupRechargeModal() {
  // Initialize Bootstrap modal if available
  if (typeof bootstrap !== "undefined") {
    // The modal will be initialized when shown
  }
}

// Show recharge modal
function showRechargeModal() {
  const rechargeModalElement = document.getElementById("rechargeModal");
  if (!rechargeModalElement) return;

  // Update modal balance display
  document.getElementById(
    "modalWalletBalance"
  ).textContent = `${window.walletBalance.toFixed(2)}`;

  // Show modal
  const rechargeModal = new bootstrap.Modal(rechargeModalElement);
  rechargeModal.show();
}

// Process recharge
function processRecharge() {
  const rechargeAmountInput = document.getElementById("rechargeAmount");
  const paymentMethodSelect = document.getElementById("paymentMethod");

  const rechargeAmount = parseFloat(rechargeAmountInput.value);
  const paymentMethod = paymentMethodSelect.value;

  if (!rechargeAmount || rechargeAmount <= 0) {
    alert("Please enter a valid recharge amount.");
    return;
  }

  if (!paymentMethod) {
    alert("Please select a payment method.");
    return;
  }

  // Simulate payment processing
  alert(
    `Processing ${rechargeAmount.toFixed(2)} payment via ${paymentMethod}...`
  );

  // Add to wallet balance (PER USER)
  const userEmail = localStorage.getItem("userEmail");
  const userRole = localStorage.getItem("userRole");

  if (userRole === "admin") {
    alert("Admins cannot have wallet balances.");
    return;
  }

  if (!userEmail) return;

  window.walletBalance += rechargeAmount;

  const users = JSON.parse(localStorage.getItem(USER_DB_KEY)) || [];
  const userIndex = users.findIndex(
    (u) => u.email.toLowerCase() === userEmail.toLowerCase()
  );

  if (userIndex !== -1) {
    users[userIndex].walletBalance = window.walletBalance.toFixed(2);
    localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
  }

  updateAllWalletDisplays();

  // Close modal
  const rechargeModal = bootstrap.Modal.getInstance(
    document.getElementById("rechargeModal")
  );
  rechargeModal.hide();

  // Reset form
  rechargeAmountInput.value = "";
  paymentMethodSelect.value = "";

  // Show success message
  if (window.showToast) {
    window.showToast(
      `Successfully added Br${rechargeAmount.toFixed(
        2
      )} to your wallet!\nNew balance: Br${window.walletBalance.toFixed(2)}`,
      "wallet",
      5000
    );
  } else {
    alert(
      `Successfully added ${rechargeAmount.toFixed(
        2
      )} to your wallet!\nNew balance: ${window.walletBalance.toFixed(2)}`
    );
  }
}

// Check login status
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");

  if (isLoggedIn && userRole === "admin") {
    document.body.classList.add("admin-mode");
    const adminDashboardLink = document.getElementById("adminDashboardLink");
    if (adminDashboardLink) adminDashboardLink.style.display = "block";
  }

  return isLoggedIn;
}

// Display current user information
function displayCurrentUser() {
  // Get user info from localStorage
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName") || "User";

  // Update user info in the UI
  const userNameElement = document.getElementById("userName");
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
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("userToken");
}

// Logout function
function logout() {
  // Show confirmation dialog
  if (confirm("Are you sure you want to logout?")) {
    // Clear all session data (except wallet balance and cars)
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userToken");

    // Show logout message
    alert("Logged out successfully! Redirecting to login page...");

    // Redirect to login page after a short delay
    setTimeout(() => {
      window.location.href = "Login.html";
    }, 1000);
  }
}

// Add a function to refresh cars (can be called from other pages)
function refreshCarsDisplay() {
  loadCars();
}
