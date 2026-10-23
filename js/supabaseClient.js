(function () {
  if (!window.supabase || !window.APP_CONFIG) {
    console.error("Supabase client library or config is missing.");
    return;
  }
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.APP_CONFIG;
  if (!SUPABASE_URL || SUPABASE_URL.includes("YOUR_PROJECT_REF") ||
      !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")) {
    console.warn("Set the Supabase URL and publishable/anon key in js/config.js.");
  }
  window.db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();