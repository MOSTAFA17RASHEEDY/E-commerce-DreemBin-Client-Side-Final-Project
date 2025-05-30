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
    const res = await fetch("/Shared/JSON/users.json");
    const users = await res.json();

    const user = users.find((user) => user.email === email);

    if (!user) {
      emailError.innerText = "❌ Email not found.";
    } else if (user.password !== password) {
      passwordError.innerText = "❌ Password is incorrect.";
    } else {
      // Success: store user data and login time (without password)
      const userSession = {
        email: user.email,
        name: user.name, // or any other user info you want to keep
        loginTime: Date.now(),
      };
      sessionStorage.setItem("userSession", JSON.stringify(userSession));
      window.location.href = "../Index.html";
    }
  } catch (error) {
    emailError.innerText = "⚠️ Error loading user data.";
  }
}

document.getElementById("logoutLink").addEventListener("click", function (e) {
  e.preventDefault();
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = "../Pages/Login.html";
});
