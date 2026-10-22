document.querySelector("#register-form").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("button[type=submit]");
  const fullName = form.full_name.value.trim();
  if (fullName.length < 2) return App.message("Please enter your full name.", true);
  button.disabled = true; App.message("Creating your account…");
  const { data, error } = await db.auth.signUp({
    email: form.email.value.trim(),
    password: form.password.value,
    options: { data: { full_name: fullName } }
  });
  button.disabled = false;
  if (error) return App.message(error.message, true);
  if (data.session) location.href = "dashboard.html";
  else App.message("Account created. Check your email for a confirmation link, then log in. If confirmation emails are disabled, you can log in now.");
});