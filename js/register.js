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
        options: {
          data: { full_name: fullName }
        }
      });

      if (error) {
        messageEl.textContent = error.message;
        messageEl.style.color = 'var(--danger-color, red)';
      }
    });
  }
});