(async () => {
  let allNotes = [];
  const render = () => {
    const q = App.$("#search").value.trim().toLowerCase();
    const branch = App.$("#branch").value;
    const semester = App.$("#semester").value;
    const filtered = allNotes.filter(n =>
      (!q || `${n.title} ${n.description||""} ${n.subjectName}`.toLowerCase().includes(q)) &&
      (!branch || n.branch === branch) &&
      (!semester || String(n.semester) === semester)
    );
    App.$("#notes-list").innerHTML = filtered.map(n => App.noteCard(n,n.subjectName)).join("") || "<p class='muted'>No notes match these filters.</p>";
  };
  ["#search","#branch","#semester"].forEach(sel => App.$(sel).addEventListener("input",render));
  try {
    const { data: sessionData } = await db.auth.getSession();
    if (!sessionData.session) { App.message("Log in to browse shared notes. "); }
    allNotes = await App.loadNotes();
    render();
  } catch (error) { App.message(error.message || "Could not load notes.",true); }
})();