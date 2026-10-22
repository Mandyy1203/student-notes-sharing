(async () => {
  try {
    const user = await App.requireUser(); if (!user) return;
    const subjectSelect = App.$("#subject");
    const { data: subjects, error: subjectError } = await db.from("subjects").select("id,name,branch,semester").order("name");
    if (subjectError) throw subjectError;
    subjectSelect.innerHTML = '<option value="">Select a subject</option>' + (subjects || []).map(s => `<option value="${s.id}">${App.escapeHTML(s.name)} · ${App.escapeHTML(s.branch)} · Sem ${s.semester}</option>`).join("");
    if (!subjects?.length) App.message("No subjects yet. Ask the project administrator to add subjects.", false);
  } catch (error) { App.message(error.message || "Could not load upload form.", true); }
  App.$("#upload-form").addEventListener("submit", async event => {
    event.preventDefault();
    const form = event.currentTarget, button = form.querySelector("button[type=submit]");
    try {
      const user = await App.requireUser(); if (!user) return;
      const file = form.file.files[0];
      if (!file) throw new Error("Choose a PDF file.");
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) throw new Error("Only PDF files are allowed.");
      if (file.size <= 0 || file.size > window.APP_CONFIG.MAX_FILE_SIZE_BYTES) throw new Error("The PDF must be smaller than 10 MB.");
      button.disabled = true; App.message("Uploading PDF…");
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g,"-").slice(-100);
      const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await db.storage.from(window.APP_CONFIG.STORAGE_BUCKET).upload(path,file,{contentType:"application/pdf",upsert:false});
      if (uploadError) throw uploadError;
      const payload = {
        title: form.title.value.trim(), description: form.description.value.trim(),
        subject_id: Number(form.subject_id.value), branch: form.branch.value,
        semester: Number(form.semester.value), file_path: path, file_size: file.size, uploaded_by: user.id
      };
      const { error: insertError } = await db.from("notes").insert(payload);
      if (insertError) {
        await db.storage.from(window.APP_CONFIG.STORAGE_BUCKET).remove([path]);
        throw insertError;
      }
      App.message("Notes uploaded successfully!");
      form.reset();
      setTimeout(() => location.href = "dashboard.html", 900);
    } catch (error) { App.message(error.message || "Upload failed.", true); }
    finally { button.disabled = false; }
  });
})();