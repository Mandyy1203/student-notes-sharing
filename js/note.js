(async () => {
  try {
    const user = await App.requireUser();
    if (!user) return;

    const id = new URLSearchParams(location.search).get("id");
    if (!id || !/^\d+$/.test(id)) throw new Error("A valid note ID is required.");

    const { data: note, error } = await db
      .from("notes")
      .select("*, subjects(name)")
      .eq("id", id)
      .single();
    if (error) throw error;

    const p = await App.profile(user.id);
    const admin = p.role === "admin";

    const { data: signed, error: signedError } = await db.storage
      .from(window.APP_CONFIG.STORAGE_BUCKET)
      .createSignedUrl(note.file_path, 60);
    if (signedError) throw signedError;

    const subjectLabel = note.subject_name || note.subjects?.name || "General";
    const el = App.$("#note-detail");

    el.innerHTML = `
      <div class="card-meta-top">
        <div class="badge-group">
          <span class="subject-tag">${App.escapeHTML(note.branch)}</span>
          <span class="subject-tag">Semester ${note.semester}</span>
        </div>
        <span class="subject-tag file-badge-pdf">${(note.file_size / 1024 / 1024).toFixed(2)} MB PDF</span>
      </div>
      <div class="eyebrow">${App.escapeHTML(subjectLabel)}</div>
      <h1>${App.escapeHTML(note.title)}</h1>
      <p class="muted">${App.escapeHTML(note.description || "No description provided.")}</p>
      <p class="note-meta">Uploaded on ${App.formatDate(note.created_at)}</p>
      <div class="note-actions">
        <a class="button" href="${App.escapeHTML(signed.signedUrl)}" target="_blank" rel="noopener">
          Open / Download PDF ↗
        </a>
        ${
          admin || note.uploaded_by === user.id
            ? '<button id="delete-note" class="button danger" type="button">Delete note</button>'
            : ""
        }
      </div>
    `;

    const del = App.$("#delete-note");
    if (del) {
      del.addEventListener("click", async () => {
        if (!confirm("Delete this note and its PDF? This cannot be undone.")) return;
        del.disabled = true;
        const { error: fileError } = await db.storage
          .from(window.APP_CONFIG.STORAGE_BUCKET)
          .remove([note.file_path]);
        if (fileError) {
          del.disabled = false;
          return App.message(fileError.message, true);
        }
        const { error: rowError } = await db.from("notes").delete().eq("id", note.id);
        if (rowError) {
          del.disabled = false;
          return App.message(rowError.message, true);
        }
        location.href = "browse.html";
      });
    }
  } catch (error) {
    App.message(error.message || "Could not load this note.", true);
    App.$("#note-detail").innerHTML =
      "<p class='muted'>Unable to display this note. Make sure you are logged in and the link is valid.</p>";
  }
})();