function register() {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;

  if (!username || !password) return alert("All fields required");
  if (localStorage.getItem("user:" + username))
    return alert("User already exists");

  localStorage.setItem("user:" + username, password);
  alert("Registered successfully!");
  location.href = "login.html";
}

function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const stored = localStorage.getItem("user:" + username);
  if (stored && stored === password) {
    localStorage.setItem("username", username);
    location.href = "chatbot.html";
  } else {
    alert("Invalid username or password");
  }
}