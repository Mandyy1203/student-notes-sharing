// 1. Aggressively listen for any authentication state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    window.location.replace('dashboard.html');
  }
});

// 2. Beat the browser's "Back" button cache (BFCache)
window.addEventListener('pageshow', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    window.location.replace('dashboard.html');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const messageEl = document.getElementById('message');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;
      
      messageEl.textContent = 'Logging in...';
      messageEl.style.color = 'inherit';

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        messageEl.textContent = error.message;
        messageEl.style.color = 'var(--danger-color, red)';
      }
      // Note: We don't need a redirect here anymore because the onAuthStateChange listener at the top will automatically catch the success and redirect!
    });
  }
});