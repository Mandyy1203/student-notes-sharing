-- Promote your own registered account to admin.
-- 1. Register through the website first.
-- 2. In Supabase Dashboard > Authentication > Users, copy YOUR user UUID.
-- 3. Replace the UUID below, then run this script in SQL Editor.
-- Do not expose this SQL to ordinary users or put a service-role key in frontend code.
update public.profiles
set role = 'admin'
where id = 'REPLACE-WITH-YOUR-AUTH-USER-UUID'::uuid;

-- Verify exactly one intended profile was changed:
select id, full_name, role from public.profiles
where id = 'REPLACE-WITH-YOUR-AUTH-USER-UUID'::uuid;
