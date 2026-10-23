const isBackButton = 
  (performance.getEntriesByType("navigation")[0]?.type === "back_forward") || 
  (window.performance && window.performance.navigation && window.performance.navigation.type === 2);

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    // If you just clicked "Log in", always go straight to the dashboard
    if (event === 'SIGNED_IN') {
      window.location.replace('dashboard.html');
    } 
    // If you were already logged in and hit the back button to get here, skip backward
    else if (isBackButton) {
      window.history.back();
    } 
    // If you directly typed the login URL while already logged in
    else {
      window.location.replace('dashboard.html');
    }
  }
});

window.addEventListener('pageshow', async (e) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    if (e.persisted || isBackButton) {
      window.history.back();
    } else {
      window.location.replace('dashboard.html');
    }
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

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        messageEl.textContent = error.message;
        messageEl.style.color = 'var(--danger-color, red)';
      }
    });
  }
});