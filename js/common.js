window.App = (() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  function message(text, isError = false, target = "#message") {
    const el = $(target);
    if (!el) return;
    el.textContent = text || "";
    el.classList.toggle("error", Boolean(isError));
  }
  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
  }
  function formatDate(value) {
    return new Date(value).toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" });
  }
  async function requireUser() {
    const { data, error } = await db.auth.getSession();
    if (error) throw error;
    if (!data.session) { location.href = "login.html"; return null; }
    return data.session.user;
  }
  async function profile(userId) {
    const { data, error } = await db.from("profiles").select("id,full_name,role").eq("id", userId).single();
    if (error) throw error;
    return data;
  }
  async function isAdmin(userId) {
    const { data, error } = await db.rpc("is_admin", { check_user_id: userId });
    if (error) throw error;
    return data === true;
  }
  async function signOut() {
    const { error } = await db.auth.signOut();
    if (error) message(error.message, true);
    else location.href = "index.html";
  }
  function noteCard(note, subjectName = "") {
    const title = escapeHTML(note.title);
    const description = escapeHTML(note.description || "No description provided.");
    const subject = escapeHTML(subjectName || "General");
    const meta = `${escapeHTML(note.branch)} · Semester ${escapeHTML(note.semester)} · ${formatDate(note.created_at)}`;
    return `<article class="card note-card"><div class="eyebrow">${subject}</div><h3>${title}</h3><p>${description}</p><div class="note-meta">${meta}</div><div class="note-actions"><a class="button small" href="note.html?id=${encodeURIComponent(note.id)}">View details</a></div></article>`;
  }
  async function loadNotes() {
    const { data, error } = await db.from("notes").select("id,title,description,subject_id,branch,semester,file_path,file_size,uploaded_by,created_at,subjects(name)").order("created_at", { ascending:false });
    if (error) throw error;
    return (data || []).map(n => ({ ...n, subjectName: n.subjects?.name || "General" }));
  }
  function bindLogout() {
    const btn = $("#logout");
    if (btn) btn.addEventListener("click", signOut);
  }
  return { $, message, escapeHTML, formatDate, requireUser, profile, isAdmin, signOut, noteCard, loadNotes, bindLogout };
})();