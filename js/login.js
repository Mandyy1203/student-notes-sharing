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