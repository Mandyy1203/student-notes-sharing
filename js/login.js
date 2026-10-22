document.querySelector("#login-form").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("button[type=submit]");
  button.disabled = true; App.message("Logging in…");
  const email = form.email.value.trim();
  const password = form.password.value;
  const { error } = await db.auth.signInWithPassword({ email, password });
  button.disabled = false;
  if (error) return App.message(error.message, true);
  location.href = "dashboard.html";
});