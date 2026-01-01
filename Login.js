// Car Rental Management System - Authentication JavaScript
// User Database (using localStorage for persistence)
const USER_DB_KEY = "driveeasy_users";
const ADMIN_CODE = "ADMIN123!@#"; // Secret admin authorization code
const WALLET_STORAGE_KEY = "driveeasy_wallet_balance"; // Unified key for wallet

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize user database with one default admin
  initUserDatabase();

  // Initialize form validation
  initializeFormValidation();

  // Setup event listeners
  setupEventListeners();

  // Check for remembered login
  checkRememberedLogin();

  // Hide error message initially
  hideErrorMessage();
});

// Toggle admin code field visibility
function toggleAdminCodeField() {
  const userRole = document.getElementById("userRole").value;
  const adminCodeField = document.getElementById("adminCodeField");

  if (userRole === "admin") {
    adminCodeField.style.display = "block";
    document.getElementById("adminCode").required = true;
  } else {
    adminCodeField.style.display = "none";
    document.getElementById("adminCode").required = false;
  }
}

// Initialize user database in localStorage
function initUserDatabase() {
  if (!localStorage.getItem(USER_DB_KEY)) {
    // Create initial database with one default admin account
    const users = [
      {
        id: 1,
        fullName: "System Administrator",
        email: "admin@driveeasy.com",
        password: "Admin@123", // Strong password
        phoneNumber: "",
        role: "admin",
        walletBalance: 0.0,
        createdAt: new Date().toISOString(),
        isDefaultAdmin: true,
      },
    ];
    localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
  }
}

// Get all users from database
function getUsers() {
  const usersJson = localStorage.getItem(USER_DB_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

// Save user to database
function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
}

// Find user by email
function findUserByEmail(email) {
  const users = getUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

// Validate user credentials
function validateUserCredentials(email, password) {
  const user = findUserByEmail(email);
  if (!user) return false;

  // In a real app, you would hash the password
  return user.password === password;
}

// Check if email already exists
function emailExists(email) {
  return findUserByEmail(email) !== undefined;
}

// Validate admin authorization code
function validateAdminCode(code) {
  // You can make this more complex in a real application
  // For demo purposes, we're using a simple comparison
  return code === ADMIN_CODE;
}

// Initialize form validation
function initializeFormValidation() {
  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
}

// Setup event listeners
function setupEventListeners() {
  // Password visibility toggle
  const togglePassword = document.getElementById("togglePassword");
  if (togglePassword) {
    togglePassword.addEventListener("click", function () {
      const passwordInput = document.getElementById("password");
      const icon = this.querySelector("i");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  }

  // Signup password visibility toggle
  const toggleSignupPassword = document.getElementById("toggleSignupPassword");
  if (toggleSignupPassword) {
    toggleSignupPassword.addEventListener("click", function () {
      const passwordInput = document.getElementById("signupPassword");
      const icon = this.querySelector("i");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  }

  // Confirm password visibility toggle
  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword"
  );
  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener("click", function () {
      const passwordInput = document.getElementById("confirmPassword");
      const icon = this.querySelector("i");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  }

  // Admin code visibility toggle (added dynamically)
  document.addEventListener("click", function (e) {
    if (e.target.closest("#toggleAdminCode")) {
      const adminCodeInput = document.getElementById("adminCode");
      const icon = e.target.closest("#toggleAdminCode").querySelector("i");

      if (adminCodeInput.type === "password") {
        adminCodeInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        adminCodeInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    }
  });

  // Login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Signup form submission
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
  }

  // Open signup modal
  const openSignupModal = document.getElementById("openSignupModal");
  if (openSignupModal) {
    openSignupModal.addEventListener("click", function (e) {
      e.preventDefault();
      const signupModal = new bootstrap.Modal(
        document.getElementById("signupModal")
      );
      signupModal.show();
      // Clear any previous messages
      hideSignupMessages();
      // Reset role selection
      document.getElementById("userRole").value = "";
      document.getElementById("adminCodeField").style.display = "none";
    });
  }

  // Forgot password
  const forgotPassword = document.getElementById("forgotPassword");
  if (forgotPassword) {
    forgotPassword.addEventListener("click", handleForgotPassword);
  }

  // Privacy and Terms links
  const privacyLink = document.getElementById("privacyLink");
  if (privacyLink) {
    privacyLink.addEventListener("click", showPrivacyPolicy);
  }

  const termsLink = document.getElementById("termsLink");
  if (termsLink) {
    termsLink.addEventListener("click", showTermsOfService);
  }
}

// Handle login form submission
function handleLogin(event) {
  event.preventDefault();
  event.stopPropagation();

  const form = event.target;

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  // Get form values
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  // Show loading state
  showLoading(true);

  // Hide any previous error
  hideErrorMessage();

  // Simulate API call delay
  setTimeout(() => {
    // Validate credentials against user database
    if (validateUserCredentials(email, password)) {
      // Login successful
      handleLoginSuccess(email, rememberMe);
    } else {
      // Login failed
      handleLoginFailure();
    }

    // Hide loading state
    showLoading(false);
  }, 1500);
}

// Handle successful login
function handleLoginSuccess(email, rememberMe) {
  // Get user details
  const user = findUserByEmail(email);

  if (!user) {
    handleLoginFailure();
    return;
  }

  // Save login state
  saveLoginState(user, rememberMe);

  // Show success message
  showSuccessMessage();

  // Redirect based on role
  setTimeout(() => {
    redirectBasedOnRole(user.role);
  }, 1500);
}

// Redirect user based on their role
function redirectBasedOnRole(role) {
  if (role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "main.html";
  }
}

// Handle failed login
function handleLoginFailure() {
  showErrorMessage("Invalid email or password. Please try again.");

  // Shake animation for error feedback
  const form = document.getElementById("loginForm");
  form.classList.add("shake");
  setTimeout(() => {
    form.classList.remove("shake");
  }, 500);
}

// Handle signup form submission
function handleSignup(event) {
  event.preventDefault();
  event.stopPropagation();

  const form = event.target;

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  // Get form values
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const userRole = document.getElementById("userRole").value;
  const adminCode = document.getElementById("adminCode")?.value || "";

  // Clear previous messages
  hideSignupMessages();

  // Validate passwords match
  if (password !== confirmPassword) {
    showSignupError("Passwords do not match. Please try again.");
    return;
  }

  // Validate password strength
  if (!isPasswordStrong(password)) {
    showSignupError(
      "Password must be at least 8 characters long, contain both letters and numbers, and include at least one special character."
    );
    return;
  }

  // Check if email already exists - REMOVED per user request
  // if (emailExists(email)) {
  //     showSignupError('This email is already registered. Please use a different email or try logging in.');
  //     return;
  // }

  // Validate email format
  if (!isValidEmail(email)) {
    showSignupError("Please enter a valid email address.");
    return;
  }

  // Validate full name
  if (fullName.length < 2) {
    showSignupError("Please enter your full name.");
    return;
  }

  // Validate role selection
  if (!userRole) {
    showSignupError("Please select an account type.");
    return;
  }

  // Special validation for admin registration
  if (userRole === "admin") {
    // Validate admin code
    if (!adminCode) {
      showSignupError(
        "Admin authorization code is required for admin registration."
      );
      return;
    }

    if (!validateAdminCode(adminCode)) {
      showSignupError(
        "Invalid admin authorization code. Admin accounts can only be created by authorized personnel."
      );
      return;
    }

    // Additional password strength requirements for admin
    if (!isAdminPasswordStrong(password)) {
      showSignupError(
        "Admin password must be at least 12 characters long, contain uppercase, lowercase, numbers, and special characters."
      );
      return;
    }
  }

  // Create new user object
  const newUser = {
    id: Date.now(), // Simple ID generation
    fullName: fullName,
    email: email.toLowerCase(),
    password: password, // In a real app, this should be hashed
    phoneNumber: phoneNumber,
    role: userRole,
    walletBalance: 0.0, // Initialize balance to 0.0
    createdAt: new Date().toISOString(),
    isDefaultAdmin: false,
  };

  // Save user to database
  saveUser(newUser);

  // Show success message
  showSignupSuccess(
    "Account created successfully! You can now log in with your credentials."
  );

  // Clear form and close modal after delay
  setTimeout(() => {
    form.reset();
    const signupModal = bootstrap.Modal.getInstance(
      document.getElementById("signupModal")
    );
    signupModal.hide();

    // Auto-fill email in login form
    document.getElementById("email").value = email;
    document.getElementById("password").value = "";

    // Reset admin code field visibility
    document.getElementById("adminCodeField").style.display = "none";

    // Focus on password field
    document.getElementById("password").focus();
  }, 2000);
}

// Save login state to localStorage
function saveLoginState(user, rememberMe) {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userEmail", user.email);
  localStorage.setItem("userName", user.fullName);
  localStorage.setItem("userId", user.id);
  localStorage.setItem("userRole", user.role);

  // Set token (simulated)
  localStorage.setItem("userToken", generateToken());

  // Save remember me preference
  if (rememberMe) {
    localStorage.setItem("rememberMe", "true");
  } else {
    localStorage.removeItem("rememberMe");
  }
}

// Generate a simple token (for demo purposes)
function generateToken() {
  return (
    "token_" + Math.random().toString(36).substr(2) + Date.now().toString(36)
  );
}

// Handle forgot password
function handleForgotPassword(event) {
  event.preventDefault();

  const email = prompt(
    "Please enter your email address to reset your password:"
  );

  if (email) {
    // Check if email exists
    const user = findUserByEmail(email);

    if (!user) {
      alert("No account found with this email address.");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      // Simulate sending reset email
      showLoading(true);

      setTimeout(() => {
        showLoading(false);
        alert(
          `Password reset instructions have been sent to ${email}. Please check your inbox.`
        );
      }, 1000);
    } else {
      alert("Please enter a valid email address.");
    }
  }
}

// Check for remembered login
function checkRememberedLogin() {
  const rememberMe = localStorage.getItem("rememberMe");
  const userEmail = localStorage.getItem("userEmail");

  if (rememberMe === "true" && userEmail) {
    document.getElementById("rememberMe").checked = true;

    // Pre-fill the email
    document.getElementById("email").value = userEmail;
  }
}

// Show loading state
function showLoading(isLoading) {
  const loginButton = document.getElementById("loginButton");
  const loginSpinner = document.getElementById("loginSpinner");

  if (isLoading) {
    loginButton.disabled = true;
    loginSpinner.style.display = "inline-block";
  } else {
    loginButton.disabled = false;
    loginSpinner.style.display = "none";
  }
}

// Show error message
function showErrorMessage(message) {
  const errorElement = document.getElementById("loginError");
  if (errorElement) {
    errorElement.querySelector("span").textContent =
      message || "Invalid credentials. Please try again.";
    errorElement.style.display = "flex";

    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideErrorMessage();
    }, 5000);
  }
}

// Hide error message
function hideErrorMessage() {
  const errorElement = document.getElementById("loginError");
  if (errorElement) {
    errorElement.style.display = "none";
  }
}

// Show success message
function showSuccessMessage() {
  const successElement = document.getElementById("loginSuccess");
  if (successElement) {
    successElement.style.display = "flex";
  }
}

// Show signup error message
function showSignupError(message) {
  const errorElement = document.getElementById("signupError");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

// Show signup success message
function showSignupSuccess(message) {
  const successElement = document.getElementById("signupSuccess");
  if (successElement) {
    successElement.textContent = message;
    successElement.style.display = "block";
  }
}

// Hide signup messages
function hideSignupMessages() {
  const errorElement = document.getElementById("signupError");
  const successElement = document.getElementById("signupSuccess");

  if (errorElement) errorElement.style.display = "none";
  if (successElement) successElement.style.display = "none";
}

// Check password strength for regular users
function isPasswordStrong(password) {
  // At least 8 characters, containing both letters and numbers
  const minLength = 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  return password.length >= minLength && hasLetter && hasNumber;
}

// Check password strength for admin users (more strict)
function isAdminPasswordStrong(password) {
  // At least 12 characters, containing uppercase, lowercase, numbers, and special characters
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  );
}

// Show privacy policy (demo)
function showPrivacyPolicy(event) {
  event.preventDefault();
  alert(
    "Privacy Policy: Your data is secure with us. We do not share your personal information with third parties without your consent."
  );
}

// Show terms of service (demo)
function showTermsOfService(event) {
  event.preventDefault();
  alert(
    "Terms of Service: By using Car Rental Management System, you agree to our terms and conditions. Please drive safely and return vehicles on time."
  );
}

// Clear session data (for logout)
function clearSessionData() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userToken");
  localStorage.removeItem("rememberMe");
}

// Utility function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
