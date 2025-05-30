async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  // Reset error messages
  emailError.innerText = "";
  passwordError.innerText = "";

  try {
    // First, try to get users from localStorage (for newly registered users)
    let users = [];
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      users = JSON.parse(storedUsers);
    }

    // Also try to fetch from JSON file (for existing users)
    try {
      const res = await fetch("/Shared/JSON/users.json");
      const jsonUsers = await res.json();
      users = [...users, ...jsonUsers]; // Combine both sources
    } catch (fetchError) {
      console.log("Could not fetch users.json, using localStorage only");
    }

    const user = users.find((user) => user.email === email);

    if (!user) {
      emailError.innerText = "❌ Email not found.";
    } else if (user.password !== password) {
      passwordError.innerText = "❌ Password is incorrect.";
    } else {
      // Success: store user data and login time (without password)
      const userSession = {
        email: user.email,
        name: user.name,
        loginTime: Date.now(),
      };
      sessionStorage.setItem("userSession", JSON.stringify(userSession));

      // Show success message
      emailError.style.color = "#27ae60";
      emailError.innerText = "✅ Login successful! Redirecting...";

      // Redirect after showing success message
      setTimeout(() => {
        window.location.href = "../Index.html";
      }, 1000);
    }
  } catch (error) {
    emailError.innerText = "⚠️ Error loading user data.";
    console.error("Login error:", error);
  }
}

async function handleRegister(event) {
  event.preventDefault();

  // Get values
  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;

  // Error elements
  const usernameError = document.getElementById("regUsernameError");
  const emailError = document.getElementById("regEmailError");
  const passwordError = document.getElementById("regPasswordError");
  const confirmPasswordError = document.getElementById(
    "regConfirmPasswordError"
  );
  const regMessage = document.getElementById("regMessage");

  // Reset errors
  usernameError.innerText = "";
  emailError.innerText = "";
  passwordError.innerText = "";
  confirmPasswordError.innerText = "";
  regMessage.innerText = "";
  regMessage.className = "";

  // Enhanced Validation
  let valid = true;

  if (username.length < 3) {
    usernameError.innerText = "❌ Username must be at least 3 characters.";
    valid = false;
  }

  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    emailError.innerText = "❌ Invalid email format.";
    valid = false;
  }

  if (password.length < 6) {
    passwordError.innerText = "❌ Password must be at least 6 characters.";
    valid = false;
  }

  if (password !== confirmPassword) {
    confirmPasswordError.innerText = "❌ Passwords do not match.";
    valid = false;
  }

  if (!valid) return;

  // Check if user already exists (check both localStorage and JSON file)
  let existingUsers = [];

  // Get users from localStorage
  const storedUsers = localStorage.getItem("users");
  if (storedUsers) {
    existingUsers = JSON.parse(storedUsers);
  }

  // Also check JSON file users
  try {
    const res = await fetch("/Shared/JSON/users.json");
    const jsonUsers = await res.json();
    existingUsers = [...existingUsers, ...jsonUsers];
  } catch (error) {
    console.log("Could not fetch users.json for validation");
  }

  if (existingUsers.find((u) => u.email === email)) {
    emailError.innerText = "❌ Email already registered.";
    return;
  }

  // Get existing users from localStorage only (for saving)
  let users = [];
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  }

  // Save new user to localStorage
  const newUser = { name: username, email, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Auto-login the new user (create session)
  const userSession = {
    email,
    name: username,
    loginTime: Date.now(),
  };
  sessionStorage.setItem("userSession", JSON.stringify(userSession));

  // Show success message
  regMessage.className = "success-message";
  regMessage.style.color = "#27ae60";
  regMessage.innerText = "✅ Account created successfully! Redirecting...";

  // Redirect to home page after successful registration
  setTimeout(() => {
    window.location.href = "../Index.html";
  }, 1500);
}

// Logout functionality
function handleLogout(event) {
  event.preventDefault();
  sessionStorage.clear();
  localStorage.removeItem("userSession"); // Clean up any old session data
  window.location.href = "../Pages/Login.html";
}

// Initialize form event listeners based on current page
document.addEventListener("DOMContentLoaded", function () {
  // Clear any previous error messages
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach((element) => {
    element.innerText = "";
  });

  // Attach login form handler if on Login page
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Attach register form handler if on Register page
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  // Attach logout handler if logout link exists
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", handleLogout);
  }
});
