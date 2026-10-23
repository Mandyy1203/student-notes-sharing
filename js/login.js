window.addEventListener("pageshow", async (e) => {
  const { data: { session } } = await db.auth.getSession();
  if (session) {
    const navType = performance.getEntriesByType("navigation")[0]?.type;
    if (e.persisted || navType === "back_forward") {
      window.history.back();
    } else {
      window.location.replace("dashboard.html");
    }
  }
});

App.$("#login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  App.message("Logging in...");
  
  const f = new FormData(e.target);
  const { error } = await db.auth.signInWithPassword({
    email: f.get("email").trim(),
    password: f.get("password")
  });

  if (error) {
    App.message(error.message, true);
  } else {
    window.location.replace("dashboard.html");
  }
});