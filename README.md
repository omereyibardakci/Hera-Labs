# Hera Labs

Independent software studio building carefully crafted mobile applications focused on simplicity, performance, and meaningful user experiences.

## Live Website

https://omereyibardakci.github.io/Hera-Labs/

## Products

- **Korteks** — Education
- **Eşref Saati** — Lifestyle
- **Heros** — Community

## Technology

- HTML
- CSS
- JavaScript

## Features

- Bilingual (TR / EN)
- Dark & Light Theme
- Responsive Design
- Accessibility
- SEO Optimized
- GitHub Pages Ready

## Project Structure

```
Hera-Labs/
├── index.html              # Main site
├── 404.html                # Not found page
├── manifest.webmanifest    # Web app manifest
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/                # Section stylesheets
    ├── js/                 # Application scripts
    ├── i18n/               # English and Turkish translations
    ├── images/             # Brand and product imagery
    └── favicon/            # Favicon assets
```

## Local Development

This site loads translations over HTTP. Open it through a local server rather than the file system.

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages Deployment

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Deploy from the default branch using the root directory.
4. Ensure `.nojekyll` remains in the repository root.

The site is configured for GitHub Pages project URLs and future custom domains.

## License

MIT
