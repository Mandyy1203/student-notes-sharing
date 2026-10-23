document.addEventListener('DOMContentLoaded', async () => {
  // FIX 1: If user is already logged in, bounce them directly to dashboard
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    window.location.replace('dashboard.html');
    return;
  }

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

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        messageEl.textContent = error.message;
        messageEl.style.color = 'var(--danger-color, red)';
      } else {
        // FIX 2: Use replace() so the register page isn't saved in the back button history
        window.location.replace('dashboard.html');
      }
    });
  }
});