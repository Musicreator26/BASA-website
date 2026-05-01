# Brunei Aquatics (BASA) — Website

Official website for the **Brunei Amateur Swimming Association (BASA)** / **Brunei Aquatics** — the national governing body for swimming, diving, water polo, artistic swimming and open water swimming in Brunei Darussalam.

🌐 **Live site:** https://Musicreator26.github.io/BASA-website/ *(once GitHub Pages is enabled)*

---

## Quick start

This is a **plain HTML / CSS / JavaScript** static website — no build tools, no frameworks. To preview it locally, just open `index.html` in any browser.

For the records page (which loads JSON), you'll want to serve via a simple local web server:

```bash
# Python 3
python -m http.server 8000
# Then open http://localhost:8000
```

---

## Pages

| File | Description |
|---|---|
| `index.html` | Home — hero, mission/vision, about, objectives, values, executive committee |
| `clubs.html` | All 14 affiliated clubs with contact info |
| `records.html` | National Open + Age Group Records (live-filtered, JSON-driven) |
| `selections.html` | National team & technical officials selection |
| `agm.html` | AGM minutes, constitution, audited reports |
| `anti-doping.html` | WADA / BDADC anti-doping policy & education |
| `contact.html` | Contact info + secured contact form |
| `register.html` | Clubs & swimmers registration forms |

---

## How to update content (no coding required)

### 📊 Update National Records

Records are stored in two plain-text JSON files. Open them in any text editor.

**`data/records-open.json`** — National Open Records
**`data/records-age-group.json`** — National Age Group Records

Each record has these fields:

```json
{
  "event": "100m Freestyle",
  "gender": "M",          // "M" or "F"
  "course": "LCM",        // "LCM" (50m) or "SCM" (25m)
  "age_group": "13-14",   // age-group file only — e.g. "10 & Under", "11-12", "13-14", "15-17"
  "time": "52.10",        // mm:ss.ss or ss.ss
  "holder": "Swimmer Name",
  "location": "City, Country",
  "date": "2025-06-15"
}
```

Update the `"updated"` field at the top of the file with the date you last edited records.

### 🏊 Update affiliated clubs

Edit the club cards in `clubs.html` — each is a `<article class="club-card">` block. Copy/paste an existing block, change the name, email and phone.

### 👥 Update Executive Committee

Edit the `<div class="member-card">` blocks in `index.html` (Leadership section).

### 📄 Add downloadable documents (AGM minutes, constitution, etc.)

1. Create a `documents/` folder in this repo.
2. Upload your PDF files there (e.g. `documents/agm-2025.pdf`).
3. In `agm.html` (or `anti-doping.html`), find the matching list item and replace `href="#"` with `href="documents/agm-2025.pdf"`.

---

## How to enable the registration & contact forms

The forms in `register.html` and `contact.html` are wired to **Formspree** (free tier — no backend required). Steps:

1. Go to <https://formspree.io> and sign up using **contact@bruneiaquatics.com**.
2. Create three forms (you'll get an endpoint URL for each):
   - **Swimmer Registration**
   - **Club Affiliation**
   - **Contact**
3. Each form gives you a URL like `https://formspree.io/f/abc123xyz`.
4. Open the HTML files and replace these placeholders:
   - `register.html` — replace **both** instances of `REPLACE_WITH_YOUR_FORMSPREE_ID` with your two endpoint IDs
   - `contact.html` — replace `YOUR_FORM_ID` with the contact form endpoint ID

Submissions will arrive in your email automatically. No server, no database.

---

## Hosting on GitHub Pages

1. Push this folder to a GitHub repo named **`BASA-website`** under the account `Musicreator26`.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/ (root)`**.
4. Save. Within a minute, the site will be live at:
   `https://Musicreator26.github.io/BASA-website/`

The included `.nojekyll` file ensures GitHub Pages serves all files without any Jekyll processing.

### Custom domain (optional)

To use a domain like `bruneiaquatics.org`:
1. Add a `CNAME` file at the root containing your domain.
2. Configure DNS at your registrar (CNAME record → `Musicreator26.github.io`).
3. In GitHub Pages settings, enter your custom domain and tick "Enforce HTTPS".

---

## Brand & design

Inspired by **World Aquatics** with **Brunei** national accents:

| Token | Hex | Usage |
|---|---|---|
| Deep Blue | `#002a5c` | Primary headings, dark backgrounds |
| Aquatics Blue | `#0066b2` | Primary brand colour |
| Cyan | `#00a9e0` | Accents, hovers |
| Brunei Yellow | `#f7e017` | Highlights, CTAs |
| Black | `#0a0a0a` | High-contrast accents |

Typography: **Inter** (loaded from Google Fonts).

---

## Folder structure

```
BASA-website/
├── index.html
├── clubs.html
├── records.html
├── selections.html
├── agm.html
├── anti-doping.html
├── contact.html
├── register.html
├── css/styles.css
├── js/
│   ├── main.js
│   └── records.js
├── data/
│   ├── records-open.json
│   └── records-age-group.json
├── images/
│   ├── logo.png
│   └── exec-committee.jpg
├── .nojekyll
├── .gitignore
└── README.md
```

---

## Licence

© Brunei Aquatics (BASA). All rights reserved.

Stock imagery sourced from Unsplash (free for commercial use under the [Unsplash Licence](https://unsplash.com/license)).

---

## Need help?

Email **contact@bruneiaquatics.com**.
