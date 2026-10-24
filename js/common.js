window.App = (() => {
  const $ = (selector, root = document) => root.querySelector(selector);

  function message(text, isError = false, target = "#message") {
    const el = $(target);
    if (!el) return;
    el.textContent = text || "";
    el.classList.toggle("error", Boolean(isError));
  }

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));
  }

  function formatDate(value) {
    if (!value) return "Recent";
    return new Date(value).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  async function requireUser() {
    const { data, error } = await db.auth.getSession();
    if (error) throw error;
    if (!data.session) {
      location.href = "login.html";
      return null;
    }
    return data.session.user;
  }

  async function profile(userId) {
    const { data, error } = await db
      .from("profiles")
      .select("id,full_name,role")
      .eq("id", userId)
      .single();
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
    const title = escapeHTML(note.title || "Untitled Note");
    const description = escapeHTML(note.description || "Verified lecture notes and reference material.");
    const subject = escapeHTML(subjectName || note.subjectName || note.subject_name || "General");
    const branch = escapeHTML(note.branch || "Engineering");
    const semester = escapeHTML(String(note.semester || "—"));
    const dateStr = formatDate(note.created_at);
    const sizeStr = note.file_size ? `${(note.file_size / 1024 / 1024).toFixed(2)} MB` : "PDF Document";

    return `
      <article class="note-card">
        <div>
          <div class="card-meta-top">
            <div class="badge-group">
              <span class="subject-tag">${branch}</span>
              <span class="subject-tag">Sem ${semester}</span>
            </div>
            <span class="subject-tag file-badge-pdf">PDF</span>
          </div>
          <h3 class="card-title">${title}</h3>
          <div class="card-subject">${subject}</div>
          <p class="card-desc">${description}</p>
        </div>
        <div class="card-footer">
          <div class="note-info">
            <span class="author">${sizeStr}</span>
            <span>${dateStr}</span>
          </div>
          <a class="download-btn" href="note.html?id=${encodeURIComponent(note.id)}">
            View details →
          </a>
        </div>
      </article>
    `;
  }

  async function loadNotes() {
    const { data, error } = await db
      .from("notes")
      .select("*, subjects(name)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(n => ({
      ...n,
      subjectName: n.subject_name || n.subjects?.name || "General"
    }));
  }

  function bindLogout() {
    const btn = $("#logout");
    if (btn) btn.addEventListener("click", signOut);
  }

  // Automatically swap "Log in" / "Sign up" links to "Dashboard" / "Browse" when user is already logged in
  if (window.db?.auth) {
    db.auth.getSession().then(({ data }) => {
      if (data?.session) {
        document.querySelectorAll('.topbar nav a[href="login.html"]').forEach(el => {
          el.textContent = "Dashboard";
          el.href = "dashboard.html";
        });
        document.querySelectorAll('.topbar nav a[href="register.html"]').forEach(el => {
          el.textContent = "Browse Notes";
          el.href = "browse.html";
        });
        document.querySelectorAll('.hero a[href="register.html"]').forEach(el => {
          el.textContent = "Go to Dashboard →";
          el.href = "dashboard.html";
        });
      }
    });
  }

  return {
    $,
    message,
    escapeHTML,
    formatDate,
    requireUser,
    profile,
    isAdmin,
    signOut,
    noteCard,
    loadNotes,
    bindLogout
  };
})();