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
    const res = await fetch("users.json");
    const users = await res.json();

    const user = users.find((user) => user.email === email);

    if (!user) {
      emailError.innerText = "❌ Email not found.";
    } else if (user.password !== password) {
      passwordError.innerText = "❌ Password is incorrect.";
    } else {
      // Success
      window.location.href = "../Landing Page/LandingPage.html";
    }
  } catch (error) {
    emailError.innerText = "⚠️ Error loading user data.";
  }
}
