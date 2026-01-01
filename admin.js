// Car Rental Management System - Admin Dashboard JavaScript - UPDATED for proper sync with cars page

// Car and booking data (shared with main page via localStorage)
const CARS_STORAGE_KEY = "driveeasy_cars";
const BOOKINGS_STORAGE_KEY = "driveeasy_bookings";

// Variables for car management
let currentCarId = null;
let selectedBookingId = null;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in
  if (!checkLogin()) {
    return;
  }

  // Check if user is admin
  if (!checkAdminAccess()) {
    return;
  }

  // Initialize cars data if not exists
  initializeCarsData();

  // Load data
  loadAdminData();

  // Setup event listeners
  setupAdminEventListeners();

  console.log("Admin Dashboard Initialized - Car Rental Management System");
  // Update dashboard stats
  updateDashboardStats();
});

// Check if user is logged in
function checkLogin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    redirectToLogin();
    return false;
  }
  return true;
}

// Check if user has admin access
function checkAdminAccess() {
  const userEmail = localStorage.getItem("userEmail") || "";
  const adminName = localStorage.getItem("userName") || "Admin";
  const adminNameElement = document.getElementById("adminName");

  if (adminNameElement) {
    adminNameElement.textContent = adminName;
  }

  // Always grant access for demo purposes
  return true;
}

// Initialize cars data if not exists
function initializeCarsData() {
  if (!localStorage.getItem(CARS_STORAGE_KEY)) {
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
        type: "Sedan",
        seats: 5,
        transmission: "Automatic",
        features: ["Air Conditioning", "Bluetooth", "GPS"],
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
        type: "Sedan",
        seats: 5,
        transmission: "Automatic",
        features: ["Air Conditioning", "Bluetooth", "GPS", "Backup Camera"],
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
        type: "Sports Car",
        seats: 4,
        transmission: "Manual",
        features: [
          "Air Conditioning",
          "Premium Sound",
          "Leather Seats",
          "Sport Mode",
        ],
      },
    ];
    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(defaultCars));
  }
}

// Redirect to login page
function redirectToLogin() {
  alert("Please login first. Redirecting to login page...");
  setTimeout(() => {
    window.location.href = "Login.html";
  }, 1000);
}

// Load all admin data
function loadAdminData() {
  loadAdminBookings();
  populateQuickCarSelect();
  updateDashboardStats();
  loadDashboardCarsList();
}

// Get cars from localStorage
function getCars() {
  const carsJson = localStorage.getItem(CARS_STORAGE_KEY);
  if (carsJson) {
    return JSON.parse(carsJson);
  } else {
    // Return empty array if no cars
    return [];
  }
}

// Get bookings from localStorage or use default
function getBookings() {
  const bookingsJson = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  if (bookingsJson) {
    return JSON.parse(bookingsJson);
  } else {
    // Default bookings if none in storage
    const defaultBookings = [
      {
        id: 1,
        customerName: "John Doe",
        customerEmail: "john@example.com",
        carId: 3,
        carModel: "Ford Mustang",
        pickupDate: "2023-06-15",
        returnDate: "2023-06-20",
        status: "active",
      },
      {
        id: 2,
        customerName: "Jane Smith",
        customerEmail: "jane@example.com",
        carId: 1,
        carModel: "Toyota Camry",
        pickupDate: "2023-06-10",
        returnDate: "2023-06-12",
        status: "returned",
      },
    ];
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(defaultBookings));
    return defaultBookings;
  }
}

// Save cars to localStorage
function saveCars(cars) {
  localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(cars));
}

// Save bookings to localStorage
function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}

// Load bookings for admin
function loadAdminBookings() {
  const bookings = getBookings();
  const table = document.getElementById("admin-bookings-table");
  if (!table) return;

  table.innerHTML = "";

  bookings.forEach((booking) => {
    const row = createBookingRow(booking);
    table.appendChild(row);
  });
}

// Create booking row for admin table
function createBookingRow(booking) {
  const row = document.createElement("tr");
  row.dataset.bookingId = booking.id;

  // Find the car for this booking
  const cars = getCars();
  const car = cars.find((c) => c.id === booking.carId);
  const carName = car ? `${car.brand} ${car.model}` : booking.carModel;

  // Payment and Rental Status logic
  let paymentStatusText = "Pending";
  let paymentBadgeClass = "bg-warning";
  let rentalStatusText = "Rented";
  let rentalBadgeClass = "bg-primary";

  if (booking.status === "completed") {
    paymentStatusText = "Completed";
    paymentBadgeClass = "bg-success";
    rentalStatusText = "Rented";
    rentalBadgeClass = "bg-primary";
  } else if (booking.status === "returned") {
    paymentStatusText = "Completed";
    paymentBadgeClass = "bg-success";
    rentalStatusText = "Returned";
    rentalBadgeClass = "bg-success";
  } else if (booking.status === "cancelled") {
    paymentStatusText = "Cancelled";
    paymentBadgeClass = "bg-danger";
    rentalStatusText = "Available";
    rentalBadgeClass = "bg-info";
  }

  row.innerHTML = `
        <td>${booking.customerName}</td>
        <td>${booking.customerEmail}</td>
        <td>${carName}</td>
        <td>${booking.pickupDate} to ${booking.returnDate}</td>
        <td>
            <span class="badge ${paymentBadgeClass}">${paymentStatusText}</span>
        </td>
        <td>
            <span class="badge ${rentalBadgeClass}">${rentalStatusText}</span>
        </td>
        <td>
            <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-success select-booking-btn" data-booking-id="${booking.id}" title="Select this booking">
                    <i class="fas fa-check"></i>
                </button>
                <button type="button" class="btn btn-outline-info view-booking-btn" data-booking-id="${booking.id}" title="View details">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </td>
    `;

  return row;
}

// Populate quick car select dropdown
function populateQuickCarSelect() {
  const select = document.getElementById("quick-car-select");
  if (!select) return;

  select.innerHTML =
    '<option value="">Select a car to update status...</option>';

  const cars = getCars();
  cars.forEach((car) => {
    const option = document.createElement("option");
    option.value = car.id;
    option.textContent = `${car.brand} ${car.model} (${car.status})`;
    select.appendChild(option);
  });
}

// Update dashboard statistics
function updateDashboardStats() {
  const cars = getCars();
  const bookings = getBookings();

  // Update stats
  document.getElementById("total-cars").textContent = cars.length;
  document.getElementById("available-cars").textContent = cars.filter(
    (c) => c.status === "available"
  ).length;
  document.getElementById("total-bookings").textContent = bookings.length;
  document.getElementById("active-bookings").textContent = bookings.filter(
    (b) => b.status === "active"
  ).length;

  // Also refresh the dashboard car list whenever stats are updated
  loadDashboardCarsList();
}

// Load car list for dashboard table
function loadDashboardCarsList() {
  const carsListContainer = document.getElementById("dashboard-cars-list");
  if (!carsListContainer) return;

  const cars = getCars();

  if (cars.length === 0) {
    carsListContainer.innerHTML =
      '<tr><td colspan="3" class="text-center">No cars in inventory</td></tr>';
    return;
  }

  carsListContainer.innerHTML = "";

  cars.forEach((car) => {
    const row = document.createElement("tr");

    let statusBadgeClass = "bg-success";
    if (car.status === "rented") statusBadgeClass = "bg-danger";
    if (car.status === "maintenance") statusBadgeClass = "bg-warning";

    row.innerHTML = `
            <td><span class="fw-medium">${car.model}</span></td>
            <td>${car.brand}</td>
            <td>
                <span class="badge ${statusBadgeClass}">${
      car.status.charAt(0).toUpperCase() + car.status.slice(1)
    }</span>
            </td>
        `;

    carsListContainer.appendChild(row);
  });
}

// Setup admin event listeners
function setupAdminEventListeners() {
  // Car form submission
  const carForm = document.getElementById("car-form");
  if (carForm) {
    carForm.addEventListener("submit", function (e) {
      e.preventDefault();
      addNewCar();
    });
  }

  // Update car button
  const updateCarBtn = document.getElementById("update-car-btn");
  if (updateCarBtn) {
    updateCarBtn.addEventListener("click", updateCar);
  }

  // Delete car button
  const deleteCarBtn = document.getElementById("delete-car-btn");
  if (deleteCarBtn) {
    deleteCarBtn.addEventListener("click", deleteCar);
  }

  // Clear form button
  const clearFormBtn = document.getElementById("clear-form-btn");
  if (clearFormBtn) {
    clearFormBtn.addEventListener("click", resetCarForm);
  }

  // Update status button
  const updateStatusBtn = document.getElementById("update-status-btn");
  if (updateStatusBtn) {
    updateStatusBtn.addEventListener("click", updateCarStatus);
  }

  // Select booking button clicks
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("select-booking-btn") ||
      e.target.closest(".select-booking-btn")
    ) {
      const btn = e.target.classList.contains("select-booking-btn")
        ? e.target
        : e.target.closest(".select-booking-btn");
      selectedBookingId = parseInt(btn.dataset.bookingId);
      highlightSelectedBooking(selectedBookingId);
    }

    // View booking button
    if (
      e.target.classList.contains("view-booking-btn") ||
      e.target.closest(".view-booking-btn")
    ) {
      const btn = e.target.classList.contains("view-booking-btn")
        ? e.target
        : e.target.closest(".view-booking-btn");
      const bookingId = parseInt(btn.dataset.bookingId);
      viewBookingDetails(bookingId);
    }
  });

  // Mark as returned button
  const markReturnedBtn = document.getElementById("mark-returned-btn");
  if (markReturnedBtn) {
    markReturnedBtn.addEventListener("click", markBookingAsReturned);
  }

  // Cancel booking button
  const cancelBookingBtn = document.getElementById("cancel-booking-btn");
  if (cancelBookingBtn) {
    cancelBookingBtn.addEventListener("click", cancelBooking);
  }

  // Logout button
  const logoutBtn = document.getElementById("btnLogout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Quick car select change event
  const quickCarSelect = document.getElementById("quick-car-select");
  if (quickCarSelect) {
    quickCarSelect.addEventListener("change", function () {
      const carId = parseInt(this.value);
      if (carId) {
        selectCarForEditing(carId);
      } else {
        resetCarForm();
      }
    });
  }

  // Navigation active state handler (now handles section switching)
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const sections = document.querySelectorAll(".admin-section");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Only handle internal links for section switching
      if (href && (href === "#" || href.startsWith("#"))) {
        e.preventDefault();

        // Determine target section ID
        let targetId = href === "#" ? "dashboard-section" : href.substring(1);

        // If it's the dashboard, scroll to top
        if (href === "#" || href === "#dashboard-section") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }

        // Switch sections
        sections.forEach((section) => {
          if (section.id === targetId) {
            section.classList.remove("d-none");
          } else {
            section.classList.add("d-none");
          }
        });

        // Update active link state
        navLinks.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      }
    });
  });
}

// Add new car - UPDATED TO SYNC WITH CARS PAGE
function addNewCar() {
  const model = document.getElementById("carModel").value.trim();
  const brand = document.getElementById("carBrand").value.trim();
  const year = parseInt(document.getElementById("carYear").value);
  const price = parseFloat(document.getElementById("carPrice").value);
  const image =
    document.getElementById("carImage").value.trim() ||
    "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80";

  // Validation
  if (!model || !brand || !year || !price) {
    alert("Please fill in all required fields.");
    return;
  }

  if (year < 2000 || year > new Date().getFullYear() + 1) {
    alert(`Please enter a valid year (2000-${new Date().getFullYear() + 1}).`);
    return;
  }

  if (price < 1) {
    alert("Price must be greater than 0.");
    return;
  }

  const cars = getCars();

  // Check if car already exists
  // Check if car already exists - REMOVED per user request
  /* 
    const existingCar = cars.find(c => 
        c.model.toLowerCase() === model.toLowerCase() && 
        c.brand.toLowerCase() === brand.toLowerCase() && 
        c.year === year
    );
    
    if (existingCar) {
        alert(`A ${brand} ${model} (${year}) already exists in the system.`);
        return;
    }
    */

  // Generate new ID
  let newId = 1;
  if (cars.length > 0) {
    newId = Math.max(...cars.map((c) => c.id)) + 1;
  }

  const newCar = {
    id: newId,
    model: model,
    brand: brand,
    year: year,
    price: price,
    image: image,
    status: "available",
    // Default additional properties
    type: "Sedan",
    seats: 5,
    transmission: "Automatic",
    features: ["Air Conditioning", "Bluetooth", "GPS"],
  };

  cars.push(newCar);
  saveCars(cars);

  // Update UI
  populateQuickCarSelect();
  updateDashboardStats();
  resetCarForm();

  alert(
    `✅ New car added successfully!\n\nCar Details:\n- Model: ${model}\n- Brand: ${brand}\n- Year: ${year}\n- Price: Br${price}/day\n- Status: Available\n\nThis car will appear on the "Available Cars for Rent" page.`
  );
}

// Select car for editing
function selectCarForEditing(carId) {
  const cars = getCars();
  const car = cars.find((c) => c.id === carId);
  if (!car) {
    alert("Car not found.");
    return;
  }

  currentCarId = carId;

  // Fill form with car data
  document.getElementById("carModel").value = car.model;
  document.getElementById("carBrand").value = car.brand;
  document.getElementById("carYear").value = car.year;
  document.getElementById("carPrice").value = car.price;
  document.getElementById("carImage").value = car.image || "";

  // Enable update and delete buttons
  document.getElementById("update-car-btn").disabled = false;
  document.getElementById("delete-car-btn").disabled = false;

  // Change submit button text
  const submitBtn = document.querySelector('#car-form button[type="submit"]');
  if (submitBtn) {
    submitBtn.textContent = "Update Car Instead";
    submitBtn.classList.remove("btn-primary");
    submitBtn.classList.add("btn-warning");
  }

  // Scroll to form
  document.getElementById("manage-cars").scrollIntoView({ behavior: "smooth" });
}

// Update selected car
function updateCar() {
  if (!currentCarId) {
    alert(
      'Please select a car to update first. Use the "Select a car" dropdown above.'
    );
    return;
  }

  const cars = getCars();
  const carIndex = cars.findIndex((c) => c.id === currentCarId);
  if (carIndex === -1) {
    alert("Car not found.");
    return;
  }

  const model = document.getElementById("carModel").value.trim();
  const brand = document.getElementById("carBrand").value.trim();
  const year = parseInt(document.getElementById("carYear").value);
  const price = parseFloat(document.getElementById("carPrice").value);
  const image = document.getElementById("carImage").value.trim();

  if (!model || !brand || !year || !price) {
    alert("Please fill in all required fields.");
    return;
  }

  // Update car - preserve existing properties
  const updatedCar = {
    ...cars[carIndex], // Keep existing properties
    model: model,
    brand: brand,
    year: year,
    price: price,
  };

  if (image) updatedCar.image = image;

  cars[carIndex] = updatedCar;
  saveCars(cars);

  // Update UI
  populateQuickCarSelect();
  resetCarForm();

  alert(
    `✅ Car updated successfully!\n\nUpdated Details:\n- Model: ${model}\n- Brand: ${brand}\n- Year: ${year}\n- Price: Br${price}/day\n\nChanges will reflect on the "Available Cars for Rent" page.`
  );
}

// Delete selected car
function deleteCar() {
  if (!currentCarId) {
    alert(
      'Please select a car to delete first. Use the "Select a car" dropdown above.'
    );
    return;
  }

  if (
    !confirm(
      '⚠️ Are you sure you want to delete this car? It will be removed from the "Available Cars for Rent" page as well.'
    )
  )
    return;

  const cars = getCars();
  const carIndex = cars.findIndex((c) => c.id === currentCarId);
  if (carIndex === -1) {
    alert("Car not found.");
    return;
  }

  const car = cars[carIndex];

  // Check if car has active bookings
  const bookings = getBookings();
  const hasActiveBookings = bookings.some(
    (b) => b.carId === currentCarId && b.status === "active"
  );

  if (hasActiveBookings) {
    alert("Cannot delete car with active bookings. Cancel the bookings first.");
    return;
  }

  // Remove car
  cars.splice(carIndex, 1);
  saveCars(cars);

  // Update UI
  populateQuickCarSelect();
  updateDashboardStats();
  resetCarForm();

  alert(
    `✅ Car "${car.brand} ${car.model}" deleted successfully! It has been removed from the system.`
  );
}

// Update car status from quick select
function updateCarStatus() {
  const carId = parseInt(document.getElementById("quick-car-select").value);
  const status = document.getElementById("quick-status-select").value;

  if (!carId) {
    alert("Please select a car.");
    return;
  }

  const cars = getCars();
  const carIndex = cars.findIndex((c) => c.id === carId);
  if (carIndex === -1) {
    alert("Car not found.");
    return;
  }

  const oldStatus = cars[carIndex].status;
  const car = cars[carIndex];

  // Don't update if status is the same
  if (oldStatus === status) {
    alert(
      `Car "${car.brand} ${car.model}" is already "${status}". No changes made.`
    );
    return;
  }

  cars[carIndex].status = status;
  saveCars(cars);

  // Update UI
  populateQuickCarSelect();
  updateDashboardStats();

  alert(
    `✅ Car status updated!\n\nCar: ${car.brand} ${car.model}\nOld Status: ${oldStatus}\nNew Status: ${status}\n\nThis change will reflect on the "Available Cars for Rent" page.`
  );
}

// Reset car form
function resetCarForm() {
  currentCarId = null;
  document.getElementById("car-form").reset();
  document.getElementById("update-car-btn").disabled = true;
  document.getElementById("delete-car-btn").disabled = true;
  document.getElementById("quick-car-select").value = "";

  // Reset submit button
  const submitBtn = document.querySelector('#car-form button[type="submit"]');
  if (submitBtn) {
    submitBtn.textContent = "Add Car";
    submitBtn.classList.remove("btn-warning");
    submitBtn.classList.add("btn-primary");
  }
}

// Mark booking as returned
function markBookingAsReturned() {
  if (!selectedBookingId) {
    alert(
      "Please select a booking first by clicking the checkmark icon (✓) next to it."
    );
    return;
  }

  const bookings = getBookings();
  const bookingIndex = bookings.findIndex((b) => b.id === selectedBookingId);
  if (bookingIndex === -1) {
    alert("Booking not found.");
    return;
  }

  // Update booking status
  bookings[bookingIndex].status = "returned";

  // Update car status to available
  const carId = bookings[bookingIndex].carId;
  const cars = getCars();
  const carIndex = cars.findIndex((c) => c.id === carId);
  if (carIndex !== -1) {
    // Check if car is already available
    if (cars[carIndex].status === "available") {
      alert(
        `This car (${cars[carIndex].brand} ${cars[carIndex].model}) is already available. No changes needed.`
      );
      return;
    }
    cars[carIndex].status = "available";
    saveCars(cars);
  }

  saveBookings(bookings);

  // Update UI
  loadAdminBookings();
  populateQuickCarSelect();
  updateDashboardStats();

  alert(
    "✅ Booking marked as returned! The car is now available on the main page."
  );
}

// Cancel booking
function cancelBooking() {
  if (!selectedBookingId) {
    alert(
      "Please select a booking first by clicking the checkmark icon (✓) next to it."
    );
    return;
  }

  if (!confirm("⚠️ Are you sure you want to cancel this booking?")) return;

  const bookings = getBookings();
  const bookingIndex = bookings.findIndex((b) => b.id === selectedBookingId);
  if (bookingIndex === -1) {
    alert("Booking not found.");
    return;
  }

  // Update booking status
  bookings[bookingIndex].status = "cancelled";

  // Update car status to available
  const carId = bookings[bookingIndex].carId;
  const cars = getCars();
  const carIndex = cars.findIndex((c) => c.id === carId);
  if (carIndex !== -1) {
    cars[carIndex].status = "available";
    saveCars(cars);
  }

  saveBookings(bookings);

  // Update UI
  loadAdminBookings();
  populateQuickCarSelect();
  updateDashboardStats();

  alert("✅ Booking cancelled! The car is now available on the main page.");
}

// View booking details
function viewBookingDetails(bookingId) {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    alert("Booking not found.");
    return;
  }

  const cars = getCars();
  const car = cars.find((c) => c.id === booking.carId);
  const carName = car ? `${car.brand} ${car.model}` : booking.carModel;

  const displayStatus =
    booking.status === "completed" || booking.status === "returned"
      ? "Returned"
      : booking.status.charAt(0).toUpperCase() + booking.status.slice(1);

  alert(
    `📋 Booking Details:\n\n` +
      `Customer: ${booking.customerName}\n` +
      `Email: ${booking.customerEmail}\n` +
      `Car: ${carName}\n` +
      `Period: ${booking.pickupDate} to ${booking.returnDate}\n` +
      `Status: ${displayStatus}\n` +
      `Booking ID: ${booking.id}`
  );
}

// Highlight selected booking
function highlightSelectedBooking(bookingId) {
  // Remove previous highlights
  const rows = document.querySelectorAll("#admin-bookings-table tr");
  rows.forEach((row) => row.classList.remove("table-primary"));

  // Add highlight to selected row
  const selectedRow = document.querySelector(
    `tr[data-booking-id="${bookingId}"]`
  );
  if (selectedRow) {
    selectedRow.classList.add("table-primary");
  }
}

// Logout function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    // Clear session data (except cars and bookings data)
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("userToken");
    localStorage.removeItem("rememberMe");

    // Show logout message
    alert("Logged out successfully! Redirecting to login page...");

    // Redirect to login page
    setTimeout(() => {
      window.location.href = "Login.html";
    }, 1000);
  }
}
