# Dr. Tanvir Fatima Naik Bukht — Academic Portfolio Website

A complete, ready-to-deploy static academic portfolio website. No build
tools, frameworks, or server are required — it is plain HTML, CSS, and
JavaScript, so you can upload it to almost any web host and it will work
immediately.

This guide is written for a **non-developer**. Follow the sections you need.

---

## 1. What's in this folder

```
tanvir-fatima-portfolio/
│
├── index.html              ← the whole website (open this file to view it)
├── robots.txt               ← tells search engines they may index the site
├── sitemap.xml               ← helps search engines find the page
├── README.md                 ← this file
│
├── assets/
│   ├── images/                ← photos (profile photo goes here)
│   ├── icons/                 ← favicon
│   ├── cv/                    ← the downloadable CV PDF goes here
│   └── documents/             ← any other public PDFs/files
│
├── css/
│   └── style.css              ← all visual styling
│
├── js/
│   └── script.js              ← makes the page interactive (menus, filters, etc.)
│
└── data/                      ← ALL editable content lives here, as plain
    ├── profile.js               text files. You do not need to touch
    ├── education.js             index.html, css/, or js/ to update content.
    ├── experience.js
    ├── research.js
    ├── publications.js
    ├── projects.js
    ├── awards.js
    ├── certifications.js
    └── skills.js
```

**Site sections:** Home, About, Academic Profile, Research, Publications,
Projects, Experience, Awards & Achievements, Certifications, Skills &
Expertise, CV, and Contact. There is no separate Teaching, Supervision,
Conferences, or Professional Services section — teaching duties, and any
other roles, belong as entries (or as responsibility bullets within an
entry) in `data/experience.js`, which is meant to hold her **complete**
career history, not just the current position.

**Important note on accuracy:** This site's content is sourced from her
own CV and publications list, cross-checked against her Google Scholar
and dblp profiles. Anywhere information could not be
verified, you'll see the text `[Information to be added]`. Please replace
these placeholders with accurate information — do not leave them visible
on a live, public site.

---

## 2. How to run the site locally (to preview changes)

You don't need to install anything.

1. Open the `tanvir-fatima-portfolio` folder on your computer.
2. Double-click `index.html`. It will open in your default web browser.
3. Every time you save a change to a file in this project, refresh the
   browser tab to see the update.

(Optional, for developers: you can also serve the folder with any static
server, e.g. `npx serve .` or Python's `python3 -m http.server`, but this
is not required.)

---

## 3. How to update profile information

Open **`data/profile.js`** in any plain text editor (Notepad, TextEdit,
VS Code, etc. — not Microsoft Word). Each line looks like:

```js
fullName: "Dr. Tanvir Fatima Naik Bukht",
designation: "Researcher",
department: "Faculty of Computing & Artificial Intelligence",
institution: "Air University, Islamabad, Pakistan",
```

Just edit the text between the quotation marks `" "` and save the file.
Do not delete the commas at the end of lines. Reload `index.html` in your
browser to see the change.

The `biography` field is a list of paragraphs — each one is its own line
in quotes, separated by commas.

---

## 4. How to replace the profile photo

Her real photo is already in place at `assets/images/profile-photo.png`
and linked from `data/profile.js`. To swap in a different photo later:

1. Prepare a professional photograph (square or portrait orientation
   works best; JPG or PNG, ideally at least 600×600px — a transparent-
   background PNG cutout, like the current photo, works especially well
   against the dark hero section).
2. Copy it into the `assets/images/` folder — for example, name it
   `profile-photo-2.jpg`.
3. Open `data/profile.js` and find the `photo` section:

   ```js
   photo: {
     src: "assets/images/profile-photo.png",
     alt: "Dr. Tanvir Fatima Naik Bukht",
     isPlaceholder: false
   },
   ```

4. Change `src` to point at the new file, and update `alt` if needed.
5. Save and reload.

(If you ever remove the photo entirely, set `isPlaceholder: true` and
point `src` back at `assets/images/profile-placeholder.svg` — a
"placeholder, add photo" badge will reappear automatically.)

---

## 5. How to add or edit publications

Open **`data/publications.js`**. Each publication is a block like this:

```js
{
  id: "pub-13",
  title: "Your Publication Title Here",
  authors: "T. F. Naik Bukht, et al.",
  venue: "Journal or Conference Name",
  year: 2026,
  type: "journal",            // one of: journal, conference, book-chapter, other
  doi: "10.xxxx/xxxxx",
  link: "https://...",
  abstract: "Optional short abstract."
},
```

To **add** a new publication, copy an existing block (including the curly
braces `{ }`), paste it above or below another one inside the square
brackets `[ ]`, give it a unique `id`, and fill in the details. To
**remove** one, delete its whole block. The publication filters (All /
Journals / Conferences / Book Chapters / Other) and the search box use
the `type`, `title`, `authors`, and `venue` fields automatically — you
don't need to change any other file.

The aggregate numbers shown near the top of the Publications section
(total publications, citations, reads) come from `PUBLICATION_STATS` at
the bottom of the same file — update these periodically from the live
ResearchGate or Google Scholar profile.

---

## 6. How to add research projects

Open **`data/projects.js`** and follow the same pattern — copy a block
inside the square brackets, edit the fields (`title`, `description`,
`role`, `fundingOrganization`, `collaborators`, `duration`,
`researchArea`, `status`), and save.

---

## 7. How to add awards

Open **`data/awards.js`**. It starts as an empty list (`AWARDS = []`),
which shows a polite "information to be added" note on the live site.
Add objects the same way as publications/projects — copy this shape:

```js
{
  title: "Award Name",
  organization: "Awarding Body",
  year: 2025,
  description: "One or two sentences of context."
},
```

As soon as you add at least one entry, the note is replaced automatically
by real cards.

## 7b. How to add certifications

Open **`data/certifications.js`**. Each certification is a simple object:

```js
{
  title: "Certification Name",
  issuer: "Issuing Organization"
},
```

Copy a block, edit `title` and `issuer`, and add or remove entries as
needed inside the `CERTIFICATIONS` array.

## 7a. Adding a complete career history (including teaching)

There is no separate Teaching section on this site — all positions,
including any teaching or instructional roles, live together on one
timeline in **`data/experience.js`**. To add her full career history:

1. Open `data/experience.js`.
2. For each additional position she has held, copy one of the existing
   entry blocks (from the opening `{` to the closing `},`).
3. Fill in `title`, `organization`, `department`, `location`,
   `startDate`, `endDate`, and list her duties as short strings inside
   `responsibilities` (put any teaching/course duties here, e.g.
   `"Taught undergraduate courses in ..."`).
4. Set `current: true` on whichever single entry is her present
   position (only one entry should have this) — it gets a gold
   "Current Position" badge and highlighted border automatically.
5. Save and reload — the timeline re-sorts by however you order the
   array, so put the most relevant/current entry first.

---

## 8. How to replace the CV

The current `assets/cv/Dr-Tanvir-Fatima-Naik-Bukht-CV.pdf` was generated
automatically by converting the supplied Word document to PDF — it's
functional, but for a polished final version you may want to export a
PDF directly from Word/Google Docs yourself (File → Save As / Export →
PDF), which typically preserves fonts and spacing more faithfully than
an automated conversion.

1. Save the CV as a PDF.
2. Name the file **exactly**: `Dr-Tanvir-Fatima-Naik-Bukht-CV.pdf`
3. Copy it into `assets/cv/`, replacing the existing file.
4. That's it — the "Download CV" and "View CV" buttons on the site
   already point at this exact file path, so no code changes are needed.

If you'd prefer a different filename, update the two `href` values in
`index.html` (search for `assets/cv/`) and in `data/profile.js`
(`heroButtons.secondary.href`) to match.

---

## 9. How to change social media / academic profile links

Open `data/profile.js` and edit the `socialLinks` block:

```js
socialLinks: {
  linkedin: "https://www.linkedin.com/in/tanvirfatimanaikbukht/",
  googleScholar: "https://scholar.google.com/citations?hl=en&user=QIKqYG8AAAAJ",
  researchGate: "https://www.researchgate.net/profile/Tanvir-Fatima-Naik-Bukht",
  academiaEdu: "https://independent.academia.edu/tanvirfatimanaikbukht",
  dblp: "https://dblp.org/pid/345/1223.html",
  universityProfile: "https://webdata.au.edu.pk/Pages/Faculties/FCAI/Departments/CGD/FacultyDetail.aspx?fid=2621",
  orcid: "",
  github: ""
}
```

Leave any field as an empty string `""` to hide that link from the
Contact section. Fill in a URL to make it appear automatically.

---

## 10. Connecting the contact form

The contact form on the site currently works client-side only (it shows
a confirmation message but does not send an email — there is no backend
in a static site). To actually receive messages, the simplest options
for a non-developer are:

- **Formspree** (https://formspree.io) — free tier available. Create an
  account, get a form endpoint URL, and set it as the form's `action`
  attribute in `index.html` (search for `id="contactForm"`), e.g.
  `<form id="contactForm" action="https://formspree.io/f/yourFormId" method="POST">`.
- **Netlify Forms** — if you deploy on Netlify (see below), add the
  attribute `netlify` to the `<form>` tag and Netlify will handle
  submissions automatically, no extra service required.

---

## 11. Deployment

The finished site is entirely static — `index.html` in the root folder,
plus `css/`, `js/`, `data/`, and `assets/`. Any of the following will
work with **no changes**.

### cPanel / shared hosting / Apache / Nginx
1. Compress this whole folder into a `.zip` (if your host requires it),
   or connect via FTP/File Manager.
2. Upload the **contents** of this folder (not the folder itself) into
   `public_html` (or your site's web root).
3. Make sure `index.html` ends up directly inside `public_html`, e.g.
   `public_html/index.html`, `public_html/css/style.css`, etc.
4. Visit your domain — the site should load immediately.

### GitHub Pages
1. Create a new GitHub repository and upload all files from this folder
   to it (keeping the folder structure).
2. In the repository, go to **Settings → Pages**.
3. Under "Build and deployment", choose **Deploy from a branch**, select
   your main branch and the `/ (root)` folder, then save.
4. GitHub will publish the site at `https://yourusername.github.io/yourrepo/`
   within a few minutes.

### Netlify
1. Go to https://app.netlify.com, sign in, and choose "Add new site →
   Deploy manually".
2. Drag and drop this entire folder onto the upload area.
3. Netlify will publish it instantly with a live URL. You can add a
   custom domain later under Site settings → Domain management.

### Vercel
1. Go to https://vercel.com, sign in, and create a New Project.
2. Choose "Deploy" via the CLI or connect a GitHub repo containing this
   folder — no build command or output directory settings are needed
   (it's a static site).

---

## 12. SEO notes

- The page title, meta description, and Open Graph tags are set in
  `index.html` and mirrored in `data/profile.js` (`seo` object) so they
  stay in sync when content is regenerated.
- Update `siteUrl` in `data/profile.js`, and the `og:url`/`canonical`
  tags plus `sitemap.xml` and `robots.txt`, once you know the site's real
  domain (they currently use a placeholder `https://www.example.com/`).

---

## 13. Before going live — a quick checklist

- [x] Profile photo added (`assets/images/profile-photo.png`)
- [x] CV PDF added (`assets/cv/Dr-Tanvir-Fatima-Naik-Bukht-CV.pdf`, converted from the supplied .docx)
- [x] Professional email added in `data/profile.js` → `contact.email`
- [ ] Decide whether to publish a phone number (intentionally left off for privacy — see `data/profile.js` comment)
- [ ] Fill in remaining `[Information to be added]` placeholders (a few education/experience fields, office location, ORCID, GitHub)
- [ ] Confirm the CV PDF formatting looks right after the Word→PDF conversion; re-export a cleaner PDF directly from Word if you'd like more control over layout
- [ ] Replace `https://www.example.com/` with your real domain in `index.html`, `data/profile.js`, `robots.txt`, and `sitemap.xml`
- [ ] Connect the contact form to Formspree or Netlify Forms (Section 10)
- [ ] Open the site on a phone, tablet, and desktop to check the layout
- [ ] Click every navigation link, filter, and button once to confirm nothing is broken

---

## 14. Support

This site uses no external frameworks or build tools — everything is
readable, plain HTML/CSS/JavaScript, so any web developer (or a
sufficiently patient non-developer with a text editor) can maintain it
going forward without needing this specific toolchain.
