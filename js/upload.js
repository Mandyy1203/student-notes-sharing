(async () => {
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
      
      // Save the manually typed subject name to the database
      const payload = {
        title: form.title.value.trim(), 
        description: form.description.value.trim(),
        subject_name: form.subject_name.value.trim(), 
        branch: form.branch.value,
        semester: Number(form.semester.value), 
        file_path: path, 
        file_size: file.size, 
        uploaded_by: user.id
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