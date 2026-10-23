const isBackButton = 
  (performance.getEntriesByType("navigation")[0]?.type === "back_forward") || 
  (window.performance && window.performance.navigation && window.performance.navigation.type === 2);

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    if (event === 'SIGNED_IN') {
      window.location.replace('dashboard.html');
    } else if (isBackButton) {
      window.history.back();
    } else {
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
  const registerForm = document.getElementById('register-form');
  const messageEl = document.getElementById('message');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = registerForm.full_name.value;
      const email = registerForm.email.value;
      const password = registerForm.password.value;
      
      messageEl.textContent = 'Creating account...';
      messageEl.style.color = 'inherit';

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });

      if (error) {
        messageEl.textContent = error.message;
        messageEl.style.color = 'var(--danger-color, red)';
      }
    });
  }
});