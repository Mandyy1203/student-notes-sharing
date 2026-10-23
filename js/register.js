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

App.$("#register-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  App.message("Creating account...");
  
  const f = new FormData(e.target);
  const fullName = (f.get("full_name") || "").trim();
  const email = f.get("email").trim();
  const password = f.get("password");

  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });

  if (error) {
    App.message(error.message, true);
    return;
  }

  if (data?.user) {
    await db.from("profiles").upsert({
      id: data.user.id,
      full_name: fullName,
      role: "student"
    });
  }

  window.location.replace("dashboard.html");
});