# The admin panel

A password-protected editor at **`/admin`** on your live site. You can change
every word and image on the portfolio from it, on a laptop or a phone, and
publish without touching code.

---

## One-time setup

The panel will not work until you add four environment variables in Vercel.
This takes about five minutes and you only do it once.

### 1. Create a GitHub token

The panel saves by committing to your repository, so it needs permission to
write to it.

1. Go to **github.com → your avatar → Settings → Developer settings →
   Personal access tokens → Fine-grained tokens → Generate new token**
2. Fill it in:
   - **Token name:** `portfolio-admin`
   - **Expiration:** 1 year (set a reminder to renew it)
   - **Repository access:** *Only select repositories* → `Josiah-Johnmark-Portfolio`
   - **Permissions → Repository permissions → Contents:** change to **Read and write**
3. Press **Generate token** and copy it. It starts with `github_pat_`.
   **You cannot see it again after you leave the page.**

Give it nothing beyond Contents write on this one repository. If it ever leaks,
that is the whole of the damage, and you can revoke it from the same page.

### 2. Add the variables in Vercel

Go to **vercel.com → your project → Settings → Environment Variables**, and add
these four for **all environments**:

| Name | Value |
|---|---|
| `ADMIN_PASSWORD` | A password you choose. Make it long — see the note below. |
| `SESSION_SECRET` | A long random string. One is suggested below. |
| `GITHUB_TOKEN` | The `github_pat_…` token from step 1. |
| `GITHUB_REPO` | `josiahjohnmark/Josiah-Johnmark-Portfolio` |

A `GITHUB_BRANCH` variable is optional and defaults to `main`.

A `SESSION_SECRET` generated for you:

```
XqrGYKYrnPxyTxqVg4GR_Z4hOwwi4wuy_YVkjM1tZfA
```

**About the password.** It is the only thing standing between the internet and
your repository, on a public URL. Use a full passphrase — four or five unrelated
words, at least 20 characters. Not your name, not `admin123`. The server rejects
anything under 8 characters and slows repeated wrong guesses, but a long
password is the real protection.

### 3. Redeploy

Vercel only picks up new environment variables on a fresh deploy. Go to
**Deployments → the most recent one → ⋯ → Redeploy**.

### 4. Open it

Visit `https://your-site.vercel.app/admin`, enter your password, and the
dashboard loads. Check **Help & status** in the sidebar first — it shows
whether the server can reach GitHub, and names anything still missing.

---

## Using it

**Sections** are in the sidebar:

| Section | What you edit |
|---|---|
| Profile & contact | Name, role, the hero sentence, availability badge, email, WhatsApp, Telegram, social links, CV |
| About | Your story paragraphs, quick facts, the graphite drawings |
| Projects | Everything about each project, plus adding and removing them |
| Explorations | The personal experiments strip |
| What I do | The four disciplines |
| Help & status | How publishing works, and whether the server is configured |

**Nothing is live until you press Publish.** Edit as much as you like; the bar
at the bottom shows *Unpublished changes* until you do. Publishing writes a
commit to GitHub, Vercel rebuilds, and the live site updates in about a minute.

The optional box next to the Publish button is a short note about what you
changed. It becomes the commit message, so your history reads sensibly later.

**Reordering.** Use the ↑ and ↓ buttons on any list — projects, case study
sections, screenshots, paragraphs. Project numbers (01, 02…) are worked out
from the order, so you never type them.

**Deleting** takes two taps: ✕, then *Sure?*. It cancels itself after a few
seconds if you do not confirm.

---

## Adding a project

1. **Projects → + Add project**
2. Title, category, summary, role, platform, year, tools.
3. Drop a cover image. Choose *Fill the frame* for photos and key art, or
   *Fit inside* for a logo or app icon, and set the background colour behind it.
   Leave the cover empty and the site draws a typographic cover from the title.
4. Add case study sections — each becomes a numbered block.
5. Add screens. Mark each one *Phone* or *Square* so it sits in the right grid.
6. Use ↑ to move it up the page if it should not be last.
7. Publish.

---

## Images

Drop any PNG or JPG onto an image box. Before it leaves your browser it is
resized to a sensible maximum, converted to WebP and given a clean filename.
A 6MB phone screenshot usually lands around 200KB, so adding images does not
slow the site down.

Longest edge by use: project covers 1600px, screenshots 1200px, explorations
1280px, drawings 1100px.

Uploads are committed immediately, before you press Publish — so an image you
upload and then discard stays in the repository. Harmless, but that is why you
may see images you no longer use in `public/images/`.

Explorations are the exception: they use a matched pair of files, a still and
an animated version, so you set the shared **image name** and the panel previews
both. Add those two files to `public/images/thumbnails/` and
`public/images/animations/` yourself.

---

## If something goes wrong

**"That password is not right"** — check `ADMIN_PASSWORD` in Vercel, and that
you redeployed after adding it.

**"Too many attempts"** — wait ten minutes, or redeploy to reset it.

**"This file changed since you loaded it"** — something else saved first,
usually another tab or a push from your computer. Reload the panel and redo
that edit. This is the protection against two edits overwriting each other.

**A red list of things to fix** — required fields are empty or malformed. Each
line names the field. Nothing is sent until they are all fixed; the same checks
run again on the server, so a bad payload cannot reach the live site.

**Signed out unexpectedly** — sessions last 8 hours. Sign in again.

**Rolling back.** Every publish is a commit. In GitHub, open
`src/data/content.json` → History, find the version you want, and revert it.
The site rebuilds from it automatically.

---

## Running it locally

`npm run dev` serves the panel at `http://localhost:3000/admin`, but the
`/api` routes are Vercel Serverless Functions and do not run under plain Vite —
sign-in will fail. To run the whole thing locally, use `vercel dev` with the
same environment variables in a `.env.local` file.

Day to day it is easier to just use the live panel.

---

## How it fits together

```
/admin  (admin.html)          A separate build entry. None of this code
   │                          ships to visitors of the public site.
   ▼
/api/auth      password → signed, HttpOnly, 8-hour session cookie
/api/content   reads and writes src/data/content.json through GitHub
/api/upload    receives an already-optimised image, commits it
/api/status    reports whether the server is configured correctly
   │
   ▼
GitHub commit → Vercel rebuild → live site
```

The public site reads `src/data/content.json` at build time, so visitors pay
nothing for any of this — no database, no API calls, no loading spinner.
`src/data/schema.ts` defines the shape and the validation rules, and is used by
the site, the panel and the server, so the three cannot drift apart.
