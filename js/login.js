document.addEventListener('DOMContentLoaded', async () => {
  const client = window.supabaseClient || window.supabase;

  // 1. If already logged in, replace login.html in history with dashboard.html
  const { data: { session } } = await client.auth.getSession();
  if (session) {
    window.location.replace('dashboard.html');
    return;
  }

  const loginForm = document.getElementById('login-form');
  const messageEl = document.getElementById('message');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;

      if (messageEl) {
        messageEl.textContent = 'Logging in...';
        messageEl.className = 'message';
      }

      const { error } = await client.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (messageEl) {
          messageEl.textContent = error.message;
          messageEl.className = 'message error';
        }
      } else {
        // 2. Replace login.html in history so Back button skips it!
        window.location.replace('dashboard.html');
      }
    });
  }
});