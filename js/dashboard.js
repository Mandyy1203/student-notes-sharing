(async () => {
  App.bindLogout();
  try {
    const user = await App.requireUser(); if (!user) return;
    const p = await App.profile(user.id);
    App.$("#welcome").textContent = `Welcome, ${p.full_name || user.email || "student"}`;
    if (p.role === "admin") App.$("#admin-link").classList.remove("hidden");
    const [notes, subjects] = await Promise.all([
      App.loadNotes(),
      db.from("subjects").select("id", { count:"exact", head:true })
    ]);
    if (subjects.error) throw subjects.error;
    App.$("#notes-count").textContent = notes.length;
    App.$("#subjects-count").textContent = subjects.count ?? "—";
    App.$("#notes-list").innerHTML = notes.slice(0,6).map(n => App.noteCard(n,n.subjectName)).join("") || "<p class='muted'>No notes yet. Be the first to upload one.</p>";
  } catch (error) { App.message(error.message || "Could not load dashboard.", true); }
})();