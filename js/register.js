// Detect if the user arrived here by clicking the browser's "Back" button
const isBackButton = 
  (performance.getEntriesByType("navigation")[0]?.type === "back_forward") || 
  (window.performance && window.performance.navigation && window.performance.navigation.type === 2);

// 1. Listen for authentication state
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    if (isBackButton) {
      window.history.back(); // Skip backward to the homepage or Google
    } else {
      window.location.replace('dashboard.html');
    }
  }
});

// 2. Handle the Browser's Back-Forward Cache (BFCache)
window.addEventListener('pageshow', async (event) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    if (event.persisted || isBackButton) {
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