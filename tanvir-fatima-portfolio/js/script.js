/**
 * script.js
 * -----------------------------------------------------------------------
 * Renders all dynamic content from the /data files into the page, and
 * wires up navigation, filtering, search, and small UI interactions.
 * No build step required — plain JS, loaded after the data/*.js files.
 * -----------------------------------------------------------------------
 */
(function () {
  "use strict";

  var ICONS = {
    activity: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    brain: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2a3.5 3.5 0 0 0-3.5 3.5V6a3 3 0 0 0-2 5.24A3 3 0 0 0 5.5 17a3.5 3.5 0 0 0 4 3.46A3.5 3.5 0 0 0 13 18V5.5A3.5 3.5 0 0 0 9.5 2z"/><path d="M14.5 2A3.5 3.5 0 0 1 18 5.5V6a3 3 0 0 1 2 5.24A3 3 0 0 1 18.5 17a3.5 3.5 0 0 1-4 3.46A3.5 3.5 0 0 1 11 18V5.5A3.5 3.5 0 0 1 14.5 2z"/></svg>',
    medical: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/></svg>',
    shield: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
    network: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v6m0 0-5.5 4M12 13l5.5 4"/></svg>'
  };

  var CONTACT_ICONS = {
    email: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
    institution: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4v18M13 21V11h6v10"/></svg>',
    office: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z"/></svg>'
  };

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function safe(v, fallback) {
    if (v === undefined || v === null || v === "") return fallback || "[Information to be added]";
    return v;
  }

  /* ---------------------------------------------------------------------
     HERO / ABOUT
     --------------------------------------------------------------------- */
  function renderProfile() {
    if (typeof PROFILE === "undefined") return;

    document.title = PROFILE.seo.title;
    setMeta('meta[name="description"]', PROFILE.seo.description);
    setMeta('meta[property="og:title"]', PROFILE.seo.title);
    setMeta('meta[property="og:description"]', PROFILE.seo.description);

    document.getElementById("heroName").textContent = PROFILE.fullName;
    document.getElementById("heroCredentials").textContent = PROFILE.headline;
    document.getElementById("heroAffiliation").textContent = PROFILE.institution;
    document.getElementById("heroIntro").textContent = PROFILE.introduction;

    var photoImg = document.getElementById("heroPhoto");
    photoImg.src = PROFILE.photo.src;
    photoImg.alt = PROFILE.photo.alt;
    if (PROFILE.photo.isPlaceholder) {
      document.getElementById("photoFlag").hidden = false;
    }

    var tagsWrap = document.getElementById("heroTags");
    if (tagsWrap && typeof RESEARCH_AREAS !== "undefined") {
      RESEARCH_AREAS.slice(0, 4).forEach(function (area) {
        tagsWrap.appendChild(el("span", "hero-tag", area.title));
      });
    }

    var statsWrap = document.getElementById("heroStats");
    if (typeof PUBLICATION_STATS !== "undefined") {
      var stats = [
        { value: PUBLICATION_STATS.totalPublications, label: "Publications" },
        { value: PUBLICATION_STATS.totalCitations + "+", label: "Citations" },
        { value: PUBLICATION_STATS.totalJournalArticles, label: "Journal Articles" }
      ];
      stats.forEach(function (s) {
        var wrap = el("div", "");
        wrap.appendChild(el("div", "hero-stat-value", s.value));
        wrap.appendChild(el("div", "hero-stat-label", s.label));
        statsWrap.appendChild(wrap);
      });
    }

    document.getElementById("aboutRole").textContent = PROFILE.designation;
    document.getElementById("aboutInstitution").textContent = PROFILE.department + ", " + PROFILE.institution;
    document.getElementById("aboutLocation").textContent = PROFILE.location;
    var langEl = document.getElementById("aboutLanguages");
    if (langEl) langEl.textContent = safe(PROFILE.languages);

    var aboutBody = document.getElementById("aboutBody");
    PROFILE.biography.forEach(function (para) {
      aboutBody.appendChild(el("p", "", para));
    });

    // Contact section
    var list = document.getElementById("contactInfoList");
    var items = [
      { icon: "email", label: "Professional Email", value: safe(PROFILE.contact.email) },
      { icon: "institution", label: "Institution", value: safe(PROFILE.contact.institutionAddress) },
      { icon: "office", label: "Office", value: safe(PROFILE.contact.office) }
    ];
    items.forEach(function (item) {
      var row = el("div", "contact-info-item");
      var icon = el("div", "contact-info-icon", CONTACT_ICONS[item.icon]);
      var text = el("div", "");
      text.appendChild(el("div", "contact-info-label", item.label));
      text.appendChild(el("div", "contact-info-value", item.value));
      row.appendChild(icon);
      row.appendChild(text);
      list.appendChild(row);
    });

    var socialWrap = document.getElementById("socialLinks");
    var socialLabels = {
      linkedin: "LinkedIn", googleScholar: "Google Scholar", researchGate: "ResearchGate",
      academiaEdu: "Academia.edu", dblp: "dblp", orcid: "ORCID", github: "GitHub", universityProfile: "Faculty Profile"
    };
    Object.keys(PROFILE.socialLinks).forEach(function (key) {
      var href = PROFILE.socialLinks[key];
      if (!href) return;
      var a = el("a", "social-link", socialLabels[key] || key);
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      socialWrap.appendChild(a);
    });
  }

  function setMeta(selector, content) {
    var m = document.querySelector(selector);
    if (m) m.setAttribute("content", content);
  }

  /* ---------------------------------------------------------------------
     ACADEMIC PROFILE (education timeline)
     --------------------------------------------------------------------- */
  function renderEducation() {
    if (typeof EDUCATION === "undefined") return;
    var wrap = document.getElementById("educationTimeline");
    EDUCATION.forEach(function (edu) {
      var item = el("div", "timeline-item");
      item.appendChild(el("span", "timeline-dot"));
      var card = el("div", "timeline-card");
      card.appendChild(el("div", "timeline-year", safe(edu.year)));
      card.appendChild(el("div", "timeline-title", safe(edu.degree)));
      card.appendChild(el("div", "timeline-org", safe(edu.institution)));
      card.appendChild(el("div", "timeline-sub", "Specialization: " + safe(edu.specialization)));
      item.appendChild(card);
      wrap.appendChild(item);
    });
  }

  /* ---------------------------------------------------------------------
     EXPERIENCE
     --------------------------------------------------------------------- */
  function renderExperience() {
    if (typeof EXPERIENCE === "undefined") return;
    var wrap = document.getElementById("experienceTimeline");
    EXPERIENCE.forEach(function (job) {
      var item = el("div", "timeline-item" + (job.current ? " is-current" : ""));
      item.appendChild(el("span", "timeline-dot"));
      var card = el("div", "timeline-card");
      var meta = el("div", "timeline-meta");
      meta.appendChild(el("span", "timeline-year", safe(job.startDate) + " – " + safe(job.endDate)));
      if (job.current) meta.appendChild(el("span", "badge-current", "Current Position"));
      card.appendChild(meta);
      card.appendChild(el("div", "timeline-title", safe(job.title)));
      card.appendChild(el("div", "timeline-org", safe(job.organization) + (job.department ? " — " + job.department : "")));
      card.appendChild(el("div", "timeline-sub", safe(job.location)));

      if (job.responsibilities && job.responsibilities.length) {
        var respList = el("ul", "timeline-list");
        job.responsibilities.forEach(function (r) { respList.appendChild(el("li", "", r)); });
        card.appendChild(respList);
      }
      if (job.achievements && job.achievements.length) {
        var achTitle = el("div", "timeline-sub", "Achievements");
        achTitle.style.marginTop = "14px";
        achTitle.style.fontWeight = "700";
        card.appendChild(achTitle);
        var achList = el("ul", "timeline-list");
        job.achievements.forEach(function (a) { achList.appendChild(el("li", "", a)); });
        card.appendChild(achList);
      }
      item.appendChild(card);
      wrap.appendChild(item);
    });
  }

  /* ---------------------------------------------------------------------
     RESEARCH
     --------------------------------------------------------------------- */
  function renderResearch() {
    if (typeof RESEARCH_AREAS === "undefined") return;
    var grid = document.getElementById("researchGrid");
    RESEARCH_AREAS.forEach(function (area) {
      var card = el("div", "research-card");
      card.appendChild(el("div", "research-icon", ICONS[area.icon] || ICONS.activity));
      card.appendChild(el("h3", "", area.title));
      card.appendChild(el("p", "", area.description));
      var kw = el("div", "keyword-list");
      area.keywords.forEach(function (k) { kw.appendChild(el("span", "keyword-chip", k)); });
      card.appendChild(kw);
      grid.appendChild(card);
    });

    // Overview bars: publication count per research area
    var barsWrap = document.getElementById("overviewBars");
    var maxCount = Math.max.apply(null, RESEARCH_AREAS.map(function (a) { return (a.relatedPublicationIds || []).length; }).concat([1]));
    RESEARCH_AREAS.forEach(function (area) {
      var count = (area.relatedPublicationIds || []).length;
      var row = el("div", "overview-bar-row");
      row.appendChild(el("div", "overview-bar-label", area.title));
      var track = el("div", "overview-bar-track");
      var fill = el("div", "overview-bar-fill");
      fill.dataset.width = Math.round((count / maxCount) * 100) + "%";
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(el("div", "overview-bar-count", String(count)));
      barsWrap.appendChild(row);
    });
  }

  /* ---------------------------------------------------------------------
     PUBLICATIONS
     --------------------------------------------------------------------- */
  var currentFilter = "all";
  var currentSearch = "";

  function renderPubStats() {
    if (typeof PUBLICATION_STATS === "undefined") return;
    var strip = document.getElementById("pubStatsStrip");
    var stats = [
      { value: PUBLICATION_STATS.totalPublications, label: "Total Publications" },
      { value: PUBLICATION_STATS.totalJournalArticles, label: "Journal Articles" },
      { value: PUBLICATION_STATS.totalConferencePapers, label: "Conference Papers" },
      { value: PUBLICATION_STATS.totalCitations + "+", label: "Citations" }
    ];
    stats.forEach(function (s) {
      var box = el("div", "pub-stat");
      box.appendChild(el("div", "pub-stat-value", String(s.value)));
      box.appendChild(el("div", "pub-stat-label", s.label));
      strip.appendChild(box);
    });
    var note = el("p", "form-note", PUBLICATION_STATS.sourceNote);
    note.style.flexBasis = "100%";
    strip.appendChild(note);
  }

  function typeLabel(type) {
    return { journal: "Journal Article", conference: "Conference Paper", "book-chapter": "Book Chapter", other: "Other" }[type] || "Publication";
  }

  function renderPublications() {
    if (typeof PUBLICATIONS === "undefined") return;
    var list = document.getElementById("pubList");
    list.innerHTML = "";

    var filtered = PUBLICATIONS.filter(function (p) {
      var matchesFilter = currentFilter === "all" || p.type === currentFilter;
      var haystack = (p.title + " " + p.authors + " " + p.venue).toLowerCase();
      var matchesSearch = !currentSearch || haystack.indexOf(currentSearch.toLowerCase()) !== -1;
      return matchesFilter && matchesSearch;
    });

    // Sort newest first (unknown years sink to bottom)
    filtered.sort(function (a, b) { return (b.year || 0) - (a.year || 0); });

    if (!filtered.length) {
      list.appendChild(el("div", "pub-empty", "No publications match your filters."));
      return;
    }

    filtered.forEach(function (p) {
      var card = el("div", "pub-card");
      card.appendChild(el("span", "pub-type-tag", typeLabel(p.type) + (p.year ? " · " + p.year : "")));
      card.appendChild(el("h3", "pub-title", p.title));
      card.appendChild(el("div", "pub-authors", p.authors));
      card.appendChild(el("div", "pub-venue", p.venue));
      if (p.abstract && p.abstract !== "[Information to be added]") {
        card.appendChild(el("p", "pub-abstract", p.abstract));
      }
      var links = el("div", "pub-links");
      if (p.link) {
        var a = el("a", "pub-link", "View Publication ↗");
        a.href = p.link; a.target = "_blank"; a.rel = "noopener noreferrer";
        links.appendChild(a);
      }
      if (p.doi && p.doi !== "[Information to be added]") {
        links.appendChild(el("span", "pub-link", "DOI: " + p.doi));
      }
      card.appendChild(links);
      list.appendChild(card);
    });
  }

  function wirePublicationControls() {
    var filterBtns = document.querySelectorAll(".pub-filter-btn");
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        currentFilter = btn.dataset.filter;
        renderPublications();
      });
    });
    var search = document.getElementById("pubSearch");
    search.addEventListener("input", function () {
      currentSearch = search.value.trim();
      renderPublications();
    });
  }

  /* ---------------------------------------------------------------------
     PROJECTS / TEACHING / SUPERVISION / AWARDS / CONFERENCES / SERVICES / SKILLS
     --------------------------------------------------------------------- */
  function renderProjects() {
    if (typeof PROJECTS === "undefined") return;
    var grid = document.getElementById("projectsGrid");
    PROJECTS.forEach(function (p) {
      var card = el("div", "research-card");
      card.appendChild(el("h3", "", safe(p.title)));
      card.appendChild(el("p", "", safe(p.description)));
      var meta = el("div", "timeline-list");
      meta.appendChild(el("li", "", "Role: " + safe(p.role)));
      meta.appendChild(el("li", "", "Funding: " + safe(p.fundingOrganization)));
      meta.appendChild(el("li", "", "Collaborators: " + safe(p.collaborators)));
      meta.appendChild(el("li", "", "Duration: " + safe(p.duration)));
      meta.appendChild(el("li", "", "Research Area: " + safe(p.researchArea)));
      meta.appendChild(el("li", "", "Status: " + safe(p.status)));
      card.appendChild(meta);
      grid.appendChild(card);
    });
  }

  function renderEmptyCardSection(dataArr, gridId, emptyMessage, renderCard) {
    var grid = document.getElementById(gridId);
    if (!dataArr || !dataArr.length) {
      grid.appendChild(el("div", "info-panel", emptyMessage));
      return;
    }
    dataArr.forEach(function (item) { grid.appendChild(renderCard(item)); });
  }

  var CERT_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M9 14.5 7 22l5-3 5 3-2-7.5"/></svg>';

  function renderCertifications() {
    if (typeof CERTIFICATIONS === "undefined") return;
    renderEmptyCardSection(
      CERTIFICATIONS, "certificationsGrid",
      "[Information to be added] — No professional certifications could be verified at the time this site was built.",
      function (cert) {
        var card = el("div", "cert-card");
        card.appendChild(el("div", "cert-icon", CERT_ICON));
        var body = el("div", "");
        body.appendChild(el("h3", "", cert.title));
        body.appendChild(el("p", "", cert.issuer));
        card.appendChild(body);
        return card;
      }
    );
  }

  function renderAwards() {
    if (typeof AWARDS === "undefined") return;
    renderEmptyCardSection(
      AWARDS, "awardsGrid",
      "[Information to be added] — No specific awards, honors, or scholarships could be verified from public sources at the time this site was built. Verified awards will be listed here once confirmed.",
      function (a) {
        var card = el("div", "research-card");
        card.appendChild(el("h3", "", a.title));
        card.appendChild(el("p", "", a.organization + " · " + a.year));
        card.appendChild(el("p", "", a.description));
        return card;
      }
    );
  }

  function renderSkills() {
    if (typeof SKILLS === "undefined") return;
    var grid = document.getElementById("skillsGrid");
    var groups = [
      { key: "research", title: "Research" },
      { key: "technical", title: "Technical" },
      { key: "teaching", title: "Teaching" },
      { key: "professional", title: "Professional" }
    ];
    groups.forEach(function (g) {
      var card = el("div", "skill-category");
      card.appendChild(el("h3", "", g.title));
      var entries = SKILLS[g.key] || [];
      if (!entries.length) {
        card.appendChild(el("p", "skill-empty-note", "[Information to be added]"));
      } else {
        var list = el("div", "skill-tag-list");
        entries.forEach(function (skill) { list.appendChild(el("span", "skill-tag", skill)); });
        card.appendChild(list);
      }
      grid.appendChild(card);
    });
  }

  /* ---------------------------------------------------------------------
     NAVIGATION
     --------------------------------------------------------------------- */
  function initNav() {
    var navbar = document.getElementById("navbar");
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");

    window.addEventListener("scroll", function () {
      navbar.classList.toggle("is-scrolled", window.scrollY > 12);
      toggleBackToTop();
    });

    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    menu.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    // Active link highlighting via IntersectionObserver
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    var links = menu.querySelectorAll(".nav-link");
    if ("IntersectionObserver" in window && sections.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            links.forEach(function (l) {
              l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id);
            });
          }
        });
      }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
      sections.forEach(function (s) { observer.observe(s); });
    }
  }

  function initScrollProgress() {
    var bar = document.getElementById("scrollProgress");
    if (!bar) return;
    function update() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function toggleBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    btn.classList.toggle("is-visible", window.scrollY > 480);
  }

  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------------------
     SCROLL REVEAL + STAT BAR ANIMATION
     --------------------------------------------------------------------- */
  function initReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (t) { io.observe(t); });
  }

  function initBarAnimation() {
    var bars = document.querySelectorAll(".overview-bar-fill");
    if (!("IntersectionObserver" in window)) {
      bars.forEach(function (b) { b.style.width = b.dataset.width; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width;
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { io.observe(b); });
  }

  /* ---------------------------------------------------------------------
     CONTACT FORM (client-side only — see README for hooking up a service)
     --------------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    var status = document.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      status.textContent = "Thank you — your message has been captured. (Connect this form to an email service to receive messages — see README.md.)";
      status.classList.add("success");
      form.reset();
    });
  }

  /* ---------------------------------------------------------------------
     INIT
     --------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("footerYear").textContent = new Date().getFullYear();

    renderProfile();
    renderEducation();
    renderExperience();
    renderResearch();
    renderPubStats();
    renderPublications();
    wirePublicationControls();
    renderProjects();
    renderAwards();
    renderCertifications();
    renderSkills();

    initNav();
    initBackToTop();
    initReveal();
    initBarAnimation();
    initContactForm();
    initScrollProgress();
  });
})();
