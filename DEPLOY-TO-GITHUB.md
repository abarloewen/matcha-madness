# Push to GitHub & go live

The site is a clean, build-free static project, so it works on GitHub Pages, Vercel or Netlify with no configuration.

A full Git history is included as a portable bundle: **`matchakoeln.bundle`**.

> Note: a partial `.git/` folder may exist in this directory but is not usable (it was created in a sandbox that can't manage Git lock files). Use one of the two options below — both give you a clean repository.

## Option A — Clone the bundle (recommended, keeps history)

```bash
cd ~/Claude/Projects/UMMAH/clients
git clone matchakoeln/matchakoeln.bundle matcha-madness
cd matcha-madness
```

Then create the GitHub repo and push. With the GitHub CLI:

```bash
gh repo create matcha-madness --public --source=. --remote=origin --push
```

Or manually (after creating an empty repo on github.com):

```bash
git remote add origin https://github.com/<your-username>/matcha-madness.git
git push -u origin main
```

## Option B — Start fresh in this folder

```bash
cd ~/Claude/Projects/UMMAH/clients/matchakoeln
rm -rf .git                 # clears the unusable partial repo
git init && git add -A && git commit -m "Matcha Madness website"
git branch -M main
git remote add origin https://github.com/<your-username>/matcha-madness.git
git push -u origin main
```

## Enable GitHub Pages

In the repo: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save.**
Your site goes live at `https://<your-username>.github.io/matcha-madness/` within a minute. The included `.nojekyll` file ensures the `assets/` folder is served correctly.

For a custom domain (e.g. `matchakoeln.de`), add it under Settings → Pages → Custom domain.

## Before going live (recommended)

The site currently pulls the client's original photos straight from their Squarespace CDN. To make the deployment fully self-contained, run once on your Mac:

```bash
node localize-images.js
```

This downloads every image into `assets/img/` and rewrites the HTML to local paths. Commit and push afterwards.

## Alternative hosts

- **Vercel** — `vercel` in the project folder, or import the GitHub repo. No build command; output dir = root.
- **Netlify** — drag the folder onto app.netlify.com, or import the repo.
