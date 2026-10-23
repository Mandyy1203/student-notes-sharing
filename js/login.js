document.addEventListener('DOMContentLoaded', async () => {
  // FIX 1: If user is already logged in, bounce them directly to dashboard
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    window.location.replace('dashboard.html');
    return;
  }

  const loginForm = document.getElementById('login-form');
  const messageEl = document.getElementById('message');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;
      
      messageEl.textContent = 'Logging in...';
      messageEl.style.color = 'inherit';

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        messageEl.textContent = error.message;
        messageEl.style.color = 'var(--danger-color, red)';
      } else {
        // FIX 2: Use replace() so the login page isn't saved in the back button history
        window.location.replace('dashboard.html');
      }
    });
  }
});