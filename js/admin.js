(async () => {
  try {
    const user = await App.requireUser(); if (!user) return;
    const p = await App.profile(user.id);
    if (p.role !== "admin") { location.href = "dashboard.html"; return; }
    const render = async () => {
      const notes = await App.loadNotes();
      App.$("#notes-list").innerHTML = notes.map(n => `<article class="card admin-row"><div><strong>${App.escapeHTML(n.title)}</strong><div class="note-meta">${App.escapeHTML(n.subjectName)} · ${App.escapeHTML(n.branch)} · Sem ${n.semester} · ${App.formatDate(n.created_at)}</div></div><div class="note-actions"><a class="button small" href="note.html?id=${n.id}">View</a><button class="button small danger" data-delete="${n.id}" type="button">Delete</button></div></article>`).join("") || "<p class='muted'>No notes uploaded yet.</p>";
      App.$("#notes-list").querySelectorAll("[data-delete]").forEach(btn => btn.addEventListener("click", async () => {
        const n = notes.find(x => String(x.id) === btn.dataset.delete);
        if (!n || !confirm(`Delete “${n.title}” and its PDF?`)) return;
        btn.disabled = true;
        const { error: storageError } = await db.storage.from(window.APP_CONFIG.STORAGE_BUCKET).remove([n.file_path]);
        if (storageError) { btn.disabled=false; return App.message(storageError.message,true); }
        const { error } = await db.from("notes").delete().eq("id",n.id);
        if (error) { btn.disabled=false; return App.message(error.message,true); }
        await render();
      }));
    };
    await render();
    App.$("#subject-form").addEventListener("submit", async event => {
      event.preventDefault();
      const f = event.currentTarget;
      const { error } = await db.from("subjects").insert({name:f.name.value.trim(),branch:f.branch.value.trim(),semester:Number(f.semester.value)});
      if (error) return App.message(error.message,true,"#subject-message");
      App.message("Subject added.",false,"#subject-message"); f.reset(); f.branch.value="ENTC";
    });
  } catch (error) { App.message(error.message || "Could not load admin dashboard.",true); }
})();