# How to Find Your Supabase Service Role Key

## Quick Answer:
The **service_role key** is on the same API page, but it's **hidden by default** for security.

## Step-by-Step Instructions:

1. **Go to Supabase Dashboard**
   - Open your project at supabase.com

2. **Navigate to API Settings**
   - Click **Settings** (⚙️ gear icon) in the left sidebar
   - Click **API** under "Project Settings"

3. **Find the Keys Section**
   You'll see something like this:

   ```
   Project URL
   https://xxxxx.supabase.co
   
   anon public
   eyJhbGc..... [Copy button]
   
   service_role secret
   •••••••••••••••••••• [👁️ eye icon]
   ```

4. **Reveal the Service Role Key**
   - Look for "**service_role**" (not anon/public)
   - It will show dots: •••••••••••••••••••
   - Click the **👁️ eye icon** or "Reveal" button next to it
   - Copy the revealed key (starts with `eyJ...`)

5. **Update Your .env File**
   - Copy `backend/.env.example` to `backend/.env`
   - Paste the service_role key you just copied

## Visual Guide:

```
┌─────────────────────────────────────────┐
│  Project API Keys                        │
├─────────────────────────────────────────┤
│                                          │
│  Project URL                             │
│  https://xxxxx.supabase.co    [Copy]   │
│                                          │
│  anon public  ← Use for ANON_KEY        │
│  eyJhbGc...                   [Copy]   │
│                                          │
│  service_role secret  ← YOU NEED THIS!  │
│  ••••••••••••••••••  [👁️ Show] [Copy] │
│     ↑                                    │
│     Click the eye to reveal!             │
│                                          │
└─────────────────────────────────────────┘
```

## What Each Key Is For:

| Key Name | In Supabase | Use For | Security |
|----------|-------------|---------|----------|
| SUPABASE_URL | Project URL | Both anon and service | Public |
| SUPABASE_ANON_KEY | anon public / Publishable Key | Client-side, respects RLS | Safe to expose |
| SUPABASE_SERVICE_KEY | service_role secret | Server-side, BYPASSES RLS | **Keep secret!** |

## ⚠️ Important Security Notes:

1. **NEVER commit the .env file** to Git (it's in .gitignore)
2. The **service_role key bypasses all security rules** - only use it on the backend
3. The **anon key is safe** to use in the frontend (it respects Row Level Security)

## Alternative: Using Environment Variables in Supabase

If you can't find the service_role key, you can also:

1. Go to **Settings** → **API**
2. Look for **"Project API keys"** heading
3. Under that, there should be a **"service_role"** row

## Still Can't Find It?

The service_role key should ALWAYS be available. If you still don't see it:

1. Make sure you're logged into the correct Supabase project
2. Try refreshing the page
3. Check if you have the right permissions (you should be the project owner)
4. The key is usually right below the "anon" key on the same page

## Your Current Setup:

Based on your `.env.example`, you have:
- ✅ SUPABASE_URL: `https://mvbgqjimwotshuqnzibs.supabase.co`
- ✅ SUPABASE_ANON_KEY: Already filled in
- ❌ SUPABASE_SERVICE_KEY: Need to get this from dashboard

Once you have all three, you're ready to go! 🚀
