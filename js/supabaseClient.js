document.addEventListener('DOMContentLoaded', async () => {
  const client = window.supabaseClient || window.supabase;

  const { data: { session } } = await client.auth.getSession();
  if (session) {
    window.location.replace('dashboard.html');
    return;
  }

  const registerForm = document.getElementById('register-form');
  const messageEl = document.getElementById('message');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const fullName = registerForm.full_name ? registerForm.full_name.value.trim() : '';
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value;

      if (messageEl) {
        messageEl.textContent = 'Creating account...';
        messageEl.className = 'message';
      }

      const { error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });

      if (error) {
        if (messageEl) {
          messageEl.textContent = error.message;
          messageEl.className = 'message error';
        }
      } else {
        window.location.replace('dashboard.html');
      }
    });
  }
});