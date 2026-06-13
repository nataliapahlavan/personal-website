# Personal Website

A simple, static personal site — plain HTML & CSS, no build step.

## Files

- `index.html` — all the content (edit the sections marked with `TODO` / placeholder text)
- `style.css` — all the styling (colors live in the `:root` variables at the top)
- `resume.pdf` — drop your resume here so the "Resume" link works (optional)

## Preview locally

Just open `index.html` in your browser, or run a tiny local server:

```sh
npx serve .
# or
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com), "Add New… → Project", and import the repo.
3. Framework preset: **Other**. No build command, output directory: `./`. Deploy.

Every push to the repo auto-deploys. To use a custom domain, add it under
the project's **Settings → Domains** in Vercel.

You can also deploy without GitHub using the CLI:

```sh
npm i -g vercel
vercel        # follow the prompts
vercel --prod # promote to production
```

## Customizing

- **Colors:** edit the `--accent`, `--bg`, `--text` variables at the top of `style.css`.
  Dark mode values are in the `@media (prefers-color-scheme: dark)` block.
- **Content:** everything is in `index.html`. Add or remove `.entry` blocks
  under Experience and Projects as needed.
