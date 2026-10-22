# Student Notes Sharing System

A student-friendly cloud computing project using plain HTML/CSS/JavaScript, Supabase Auth, PostgreSQL, private Supabase Storage, and GitHub Pages.

## Cost target
Designed for free-tier use, but free-plan quotas and provider requirements can change. Check the current official plans before deployment. Do not enable paid billing or paste payment details if your project must remain at ₹0. Supabase Free projects may pause after inactivity and storage/egress have limits.

## Files
- `index.html`: landing page
- `login.html`, `register.html`: authentication
- `dashboard.html`: student dashboard
- `browse.html`: search and filter notes
- `upload.html`: PDF upload
- `note.html`: note details and signed download URL
- `admin.html`: subject management and moderation
- `js/config.js`: public Supabase project URL and publishable/anon key
- `supabase/setup.sql`: database, RLS, trigger, bucket and storage policies
- `supabase/make_admin.sql`: manually promote your own account

## 1. Configure Supabase
1. Open your Supabase project dashboard.
2. Open SQL Editor > New query.
3. Paste the complete contents of `supabase/setup.sql` and run it once on a fresh project.
4. In Project Settings / API (or Connect, depending on dashboard layout), copy the Project URL and the publishable key (or legacy anon key). Never use the `service_role` or secret key in browser code.
5. Edit `js/config.js` and replace:
   - `https://YOUR_PROJECT_REF.supabase.co`
   - `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
6. Save the file.

If you already ran a different SQL setup, do not blindly run both scripts. Review the existing tables/policies first or use a fresh project to avoid conflicting schema.

## 2. Register and make your account admin
1. Test the site locally and register using your own email.
2. If email confirmation is enabled, follow the confirmation email and then log in.
3. In Supabase Dashboard > Authentication > Users, copy the UUID for your account.
4. Open `supabase/make_admin.sql`, replace both occurrences of the placeholder with your UUID, and run it in SQL Editor.
5. Log out and log back in. Admin pages and policies use the server-side `is_admin` function.

Never let a normal user select or edit their own `role`. The trigger creates every new profile as `student`.

## 3. Test locally on Ubuntu
From the project root:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`. Do not open HTML files directly with `file://`; use the local server. Stop the server with Ctrl+C.

## 4. Publish with GitHub Pages
1. Create a GitHub repository. A public repository is acceptable for this project; all source files will be visible.
2. Upload the project files and folders to the repository root (so `index.html` is at the root).
3. Open repository Settings > Pages.
4. Under Build and deployment, choose deploy from a branch, select `main` and `/(root)`, then Save.
5. Wait for the published URL shown in Settings > Pages.
6. Add the published website URL to Supabase Authentication > URL Configuration > Site URL and redirect URLs if needed. Include the GitHub Pages project path, such as `https://USERNAME.github.io/REPOSITORY/`.

## Important security notes
- `config.js` contains only the browser publishable/anon key. Supabase RLS policies are essential; a public key alone is not a secret.
- Never publish the database password or service-role/secret key.
- PDFs are stored in a private bucket. Authenticated users can create time-limited signed URLs.
- Admin access is granted manually from the Supabase SQL Editor, not from a public form.
- Client-side checks are for usability only. Database and Storage policies enforce permissions.
- This starter is intended for a small academic demonstration. Before real-world production use, add rate limiting/abuse prevention, moderation workflow, privacy notice, robust orphan-file cleanup, and additional testing.

## Common issues
- `Invalid API key`: check project URL and use the publishable/anon key, not a secret key.
- `Email not confirmed`: open the confirmation email or review Supabase Auth settings.
- `permission denied`: inspect RLS and Storage policies, user session, and whether your account is admin.
- No subjects: run `setup.sql` successfully; ask admin to add more subjects.
- `Failed to fetch`: check URL/key, internet connection, browser console and Supabase project status.

## Viva concepts
Cloud hosting serves static frontend files; Supabase provides managed authentication, PostgreSQL database and object storage. RLS enforces per-user permissions at the backend. Signed URLs provide time-limited access to private PDFs.
