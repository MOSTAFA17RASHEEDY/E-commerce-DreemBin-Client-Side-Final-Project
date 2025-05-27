document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("confirmPasswordError").textContent = "";
    document.getElementById("termsError").textContent = "";
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const termsChecked = document.getElementById("terms").checked;

    let isValid = true;

    if (name.length < 3) {
      document.getElementById("nameError").textContent =
        "Name must be at least 3 characters.";
      isValid = false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      document.getElementById("emailError").textContent =
        "Please enter a valid email.";
      isValid = false;
    }

    if (password.length < 6) {
      document.getElementById("passwordError").textContent =
        "Password must be at least 6 characters.";
      isValid = false;
    }

    if (confirmPassword !== password) {
      document.getElementById("confirmPasswordError").textContent =
        "Passwords do not match.";
      isValid = false;
    }

    if (!termsChecked) {
      document.getElementById("termsError").textContent =
        "You must accept the terms & conditions.";
      isValid = false;
    }

    if (isValid) {
      alert("Registration Successful!");
      // Redirect or send data to backend here
      window.location.href = "..//Landing Page/LandingPage.html";
    }
  });
