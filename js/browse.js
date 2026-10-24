(async () => {
  const notesList = App.$("#notes-list");
  const searchInput = App.$("#search");
  const branchSelect = App.$("#branch");
  const semesterSelect = App.$("#semester");

  let allNotes = [];

  function renderNotes() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const selectedBranch = (branchSelect?.value || "").trim().toLowerCase();
    const selectedSem = (semesterSelect?.value || "").trim();

    const filtered = allNotes.filter(note => {
      const title = (note.title || "").toLowerCase();
      const desc = (note.description || "").toLowerCase();
      const subject = (note.subjectName || note.subject_name || "").toLowerCase();
      const branch = (note.branch || "").toLowerCase();
      const semester = String(note.semester || "").trim();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        desc.includes(query) ||
        subject.includes(query);
      const matchesBranch = !selectedBranch || branch === selectedBranch;
      const matchesSem = !selectedSem || semester === selectedSem;

      return matchesSearch && matchesBranch && matchesSem;
    });

    if (filtered.length === 0) {
      notesList.innerHTML = "";
      App.message(
        allNotes.length === 0
          ? "No notes have been uploaded yet. Be the first to share!"
          : "No notes match your search filters."
      );
      return;
    }

    App.message(`Showing ${filtered.length} ${filtered.length === 1 ? "note" : "notes"}`);
    notesList.innerHTML = filtered.map(n => App.noteCard(n, n.subjectName)).join("");
  }

  try {
    App.message("Loading notes…");
    // Require login if RLS requires authenticated users to read notes
    const user = await App.requireUser();
    if (!user) return;

    allNotes = await App.loadNotes();
    renderNotes();
  } catch (error) {
    App.message(error.message || "Could not load notes.", true);
  }

  searchInput?.addEventListener("input", renderNotes);
  branchSelect?.addEventListener("change", renderNotes);
  semesterSelect?.addEventListener("change", renderNotes);
})();