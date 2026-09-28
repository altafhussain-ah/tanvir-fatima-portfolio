/*
 * chatbot.js — "Ask a question" assistant for the portfolio.
 *
 * Answers visitors' questions from the site's own content (data/*.js).
 * If the site's server has an AI key configured (see api/chat.js), questions are
 * answered by the AI instead, still grounded only in this site's content.
 * Without a key — or if the AI is unavailable — the built-in answers are used.
 */
(function () {
  'use strict';

  /* ---------------- site content ---------------- */
  var P = typeof PROFILE !== 'undefined' ? PROFILE : {};
  var EDU = typeof EDUCATION !== 'undefined' ? EDUCATION : [];
  var EXP = typeof EXPERIENCE !== 'undefined' ? EXPERIENCE : [];
  var RES = typeof RESEARCH_AREAS !== 'undefined' ? RESEARCH_AREAS : [];
  var PUBS = typeof PUBLICATIONS !== 'undefined' ? PUBLICATIONS : [];
  var STATS = typeof PUBLICATION_STATS !== 'undefined' ? PUBLICATION_STATS : {};
  var PROJ = typeof PROJECTS !== 'undefined' ? PROJECTS : [];
  var AW = typeof AWARDS !== 'undefined' ? AWARDS : [];
  var CERT = typeof CERTIFICATIONS !== 'undefined' ? CERTIFICATIONS : [];
  var SK = typeof SKILLS !== 'undefined' ? SKILLS : {};

  var NAME = P.fullName || 'Dr. Tanvir Fatima Naik Bukht';
  var cvLink = document.querySelector('#cv a[href$=".pdf"], a[href$=".pdf"]');
  var CV = cvLink ? cvLink.getAttribute('href') : 'assets/cv/Dr-Tanvir-Fatima-Naik-Bukht-CV.pdf';
  var EMAIL = P.contact && P.contact.email;

  /* ---------------- helpers ---------------- */
  var BLANK = /\[information to be added\]/i;
  function ok(v) { return v != null && String(v).trim() !== '' && !BLANK.test(String(v)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function link(href, text) {
    var ext = /^(https?:|mailto:)/i.test(href);
    return '<a href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(text) + '</a>';
  }
  function inPage(hash, text) { return '<a href="' + esc(hash) + '" data-chat-close>' + esc(text) + '</a>'; }
  function list(items) { return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>'; }
  function p(s) { return '<p>' + s + '</p>'; }
  function firstSentence(s) { s = String(s || '').trim(); var m = s.match(/^[\s\S]*?[.!?](\s|$)/); return (m ? m[0] : s).trim(); }
  function article(word) { return /^[aeiou]/i.test(word || '') ? 'an' : 'a'; }
  function byYear(a, b) { return (b.year || 0) - (a.year || 0); }
  function venueShort(v) { return String(v || '').replace(/,\s*[\d(].*$/, '').replace(/^Proceedings of (the )?/i, ''); }
  function pubHref(pb) { return ok(pb.link) ? pb.link : (ok(pb.doi) ? 'https://doi.org/' + pb.doi : ''); }
  function pubLine(pb) {
    var href = pubHref(pb);
    var t = href ? link(href, pb.title) : esc(pb.title);
    var meta = [pb.year, venueShort(pb.venue)].filter(Boolean).join(', ');
    return t + (meta ? ' <span class="chat-meta">(' + esc(meta) + ')</span>' : '');
  }
  function mailLink() { return ok(EMAIL) ? link('mailto:' + EMAIL, EMAIL) : inPage('#contact', 'the contact form'); }
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9+#.\- ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  // word-start match; a trailing "$" means whole word only
  function has(q, words) {
    var n = 0;
    words.forEach(function (w) {
      var whole = w.slice(-1) === '$';
      if (q.indexOf(' ' + (whole ? w.slice(0, -1) + ' ' : w)) >= 0) n++;
    });
    return n;
  }

  /* ---------------- understanding the question ---------------- */
  var INTENTS = [
    { id: 'citations', w: ['citation', 'cited', 'scholar$', 'google scholar', 'h-index', 'hindex', 'impact'] },
    { id: 'pubs', w: ['publication', 'paper', 'article', 'journal', 'conference', 'publish', 'wrote', 'written'] },
    { id: 'research', w: ['research', 'area', 'interest', 'focus', 'field', 'specializ', 'specialis', 'topic', 'work on', 'working on'] },
    { id: 'education', w: ['education', 'degree', 'phd$', 'ph.d', 'doctorate', 'studied', 'study', 'master', 'mphil', 'm.phil', 'mcs$', 'qualification', 'graduat'] },
    { id: 'experience', w: ['experience', 'job', 'career', 'position', 'lecturer', 'teach', 'employ', 'role', 'work at', 'works at', 'worked', 'work$', 'works$', 'affiliat', 'employer', 'currently', 'designation'] },
    { id: 'contact', w: ['contact', 'email', 'e-mail', 'mail', 'reach', 'office', 'address', 'meet', 'phone', 'call', 'get in touch', 'whatsapp'] },
    { id: 'cv', w: ['cv$', 'cv.', 'resume', 'curriculum'] },
    { id: 'certs', w: ['certif', 'cisco', 'ccna', 'huawei', 'hcia', 'cnss', 'course'] },
    { id: 'skills', w: ['skill', 'tool', 'technolog', 'software', 'programming'] },
    { id: 'projects', w: ['project', 'grant', 'fund'] },
    { id: 'awards', w: ['award', 'honour', 'honor', 'prize', 'scholarship', 'recognition', 'achievement'] },
    { id: 'coauthors', w: ['collaborat', 'co-author', 'coauthor', 'colleague', 'work with', 'works with'] },
    { id: 'language', w: ['language', 'speak', 'urdu', 'english'] },
    { id: 'supervision', w: ['supervis', 'student', 'admission', 'join her', 'mentor', 'phd position', 'vacanc'] },
    { id: 'links', w: ['linkedin', 'researchgate', 'orcid', 'dblp', 'academia', 'social', 'profile link'] },
    { id: 'about', w: ['who is', 'about her', 'tell me about', 'introduce', 'bio$', 'biography', 'summary', 'who are'] },
    { id: 'greet', w: ['hi$', 'hello', 'hey$', 'salam', 'assalam', 'aoa$', 'good morning', 'good afternoon', 'good evening'] },
    { id: 'thanks', w: ['thank', 'thx', 'shukriya', 'jazak'] }
  ];
  var STOP = ('what which who whom whose is are was were be been the a an of on in for to and or her she hers herself does do did has have had ' +
    'about any some me tell show list give can could would you your please with by from at this that these those there their how many much more most ' +
    'latest recent recently new newest all dr dr. tanvir fatima naik bukht i want know find get related regarding work works worked paper papers ' +
    'publication publications article articles journal journals conference conferences published publish research area areas topic topics field fields ' +
    'year years written wrote any her? is? has? done doing did? kind type types also other').split(' ');
  var ALIAS = {
    ai: ['deep learning', 'neural', 'cnn', 'machine learning', 'artificial intelligence', 'quantum'],
    ml: ['machine learning', 'deep learning', 'xgboost', 'neural'],
    medical: ['medical', 'cancer', 'tumor', 'tumour', 'liver', 'diagnosis', 'mammograph', 'covid'],
    health: ['medical', 'cancer', 'tumor', 'liver', 'diagnosis', 'covid'],
    cancer: ['cancer', 'tumor', 'tumour', 'mammograph'],
    security: ['security', 'cyber', 'ddos', 'attack'],
    cybersecurity: ['security', 'cyber', 'ddos', 'attack'],
    iot: ['iot', 'internet of thing'],
    activity: ['activity', 'action', 'interaction', 'exergame'],
    har: ['activity', 'action'],
    vision: ['vision', 'image', 'video', 'recognition', 'detection', 'segmentation'],
    games: ['game', 'exergame', 'sport'],
    gaming: ['game', 'exergame', 'sport']
  };
  function topicTerms(q) {
    return q.split(' ').map(function (t) { return t.replace(/^[.\-]+|[.\-?]+$/g, ''); })
      .filter(function (t) { return t && t.length > 1 && STOP.indexOf(t) < 0 && !/^\d+$/.test(t); });
  }
  function expand(terms) {
    var out = [];
    terms.forEach(function (t) {
      out.push(t.length > 4 ? t.replace(/(ies|es|s)$/, '') : t);
      (ALIAS[t] || []).forEach(function (a) { out.push(a); });
    });
    return out;
  }
  function searchPubs(terms) {
    var ex = expand(terms);
    return PUBS.map(function (pb) {
      var hay = ' ' + norm(pb.title + ' ' + pb.venue) + ' ';
      var s = 0;
      ex.forEach(function (t) { if (hay.indexOf(t) >= 0) s++; });
      return { pb: pb, s: s };
    }).filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s || byYear(a.pb, b.pb); })
      .map(function (x) { return x.pb; });
  }

  /* ---------------- answers ---------------- */
  var A = {
    about: function () {
      var who = NAME + (ok(P.designation) ? ' is ' + article(P.designation) + ' ' + P.designation : '') +
        (ok(P.department) ? ' in the ' + P.department : '') + (ok(P.institution) ? ', ' + P.institution : '') + '.';
      return p(esc(ok(P.introduction) ? P.introduction : who)) +
        p('Ask me about her research, publications, education, experience or how to contact her.');
    },
    research: function () {
      if (!RES.length) return null;
      return p('Her research focuses on ' + RES.length + ' main areas:') +
        list(RES.map(function (r) { return '<strong>' + esc(r.title) + '</strong> — ' + esc(firstSentence(r.description)); })) +
        p('You can ask for papers on any of these, for example “papers on medical imaging”.');
    },
    pubs: function () {
      var total = STATS.totalPublications || PUBS.length;
      var parts = [];
      if (STATS.totalJournalArticles) parts.push(STATS.totalJournalArticles + ' journal articles');
      if (STATS.totalConferencePapers) parts.push(STATS.totalConferencePapers + ' conference papers');
      var intro = 'She has ' + total + ' publications' + (parts.length ? ' (' + parts.join(' and ') + ')' : '') +
        (STATS.totalCitations ? ', cited ' + STATS.totalCitations + '+ times' : '') + '. Her most recent:';
      return p(esc(intro)) + list(PUBS.slice().sort(byYear).slice(0, 5).map(pubLine)) +
        p(inPage('#publications', 'See all publications') + ', or ask me for papers on a topic.');
    },
    pubSearch: function (terms) {
      var hits = searchPubs(terms);
      if (!hits.length) return null;
      var out = p('Publications related to “' + esc(terms.join(' ')) + '” (' + hits.length + '):') + list(hits.slice(0, 6).map(pubLine));
      if (hits.length > 6) out += p('…and ' + (hits.length - 6) + ' more in the ' + inPage('#publications', 'Publications') + ' section.');
      return out;
    },
    pubsByYear: function (y) {
      var hits = PUBS.filter(function (pb) { return +pb.year === y; });
      if (!hits.length) {
        var ys = PUBS.map(function (pb) { return +pb.year; }).filter(Boolean);
        return p('No publications from ' + y + ' are listed. Her publications span ' + Math.min.apply(null, ys) + '–' + Math.max.apply(null, ys) + '.');
      }
      return p(hits.length + ' publication' + (hits.length > 1 ? 's' : '') + ' from ' + y + ':') + list(hits.map(pubLine));
    },
    citations: function () {
      var s = STATS.totalCitations ? p('Her work has been cited ' + esc(STATS.totalCitations) + '+ times, across ' + esc(STATS.totalPublications || PUBS.length) + ' publications.') : '';
      var gs = P.socialLinks && ok(P.socialLinks.googleScholar) ? p('Up-to-date figures are on her ' + link(P.socialLinks.googleScholar, 'Google Scholar profile') + '.') : '';
      return (s + gs) || null;
    },
    education: function () {
      if (!EDU.length) return null;
      return p('Her academic qualifications:') + list(EDU.map(function (e) {
        return '<strong>' + esc(e.degree) + '</strong> — ' + esc(e.institution) + (ok(e.year) ? ' <span class="chat-meta">(' + esc(e.year) + ')</span>' : '');
      }));
    },
    experience: function () {
      if (!EXP.length) return null;
      var cur = EXP.filter(function (e) { return e.current; })[0] || EXP[0];
      var others = EXP.filter(function (e) { return e !== cur; });
      var out = p('She is currently ' + article(cur.title) + ' <strong>' + esc(cur.title) + '</strong> at ' + esc(cur.organization) +
        (ok(cur.department) ? ' (' + esc(cur.department) + ')' : '') + (ok(cur.startDate) ? ', since ' + esc(cur.startDate) : '') + '.');
      if (others.length) {
        out += p('Earlier positions:') + list(others.map(function (e) {
          return esc(e.title) + ', ' + esc(e.organization) + ' <span class="chat-meta">(' + esc([e.startDate, e.endDate].filter(ok).join(' – ')) + ')</span>';
        }));
      }
      return out;
    },
    contact: function (q) {
      var items = [];
      if (ok(EMAIL)) items.push('Email: ' + link('mailto:' + EMAIL, EMAIL));
      if (P.contact && ok(P.contact.office)) items.push('Office: ' + esc(P.contact.office));
      if (P.contact && ok(P.contact.institutionAddress)) items.push('Address: ' + esc(P.contact.institutionAddress));
      var out = p('You can reach her here:') + list(items) + p('Or send a message with the ' + inPage('#contact', 'contact form') + '.');
      if (/ (phone|call|number|whatsapp)/.test(q)) out += p('A phone number isn’t published on this website.');
      return out;
    },
    cv: function () { return p('You can ' + link(CV, 'open or download her CV (PDF)') + '.'); },
    certs: function () {
      if (!CERT.length) return null;
      return p('Her professional certifications:') + list(CERT.map(function (c) { return esc(c.title) + (ok(c.issuer) ? ' <span class="chat-meta">— ' + esc(c.issuer) + '</span>' : ''); }));
    },
    skills: function () {
      var groups = [['research', 'Research'], ['technical', 'Technical'], ['teaching', 'Teaching'], ['professional', 'Professional']]
        .filter(function (g) { return (SK[g[0]] || []).length; })
        .map(function (g) { return '<strong>' + g[1] + ':</strong> ' + esc(SK[g[0]].join(', ')); });
      return groups.length ? list(groups) : null;
    },
    projects: function () {
      if (!PROJ.length) return null;
      return p('Research projects:') + list(PROJ.map(function (pr) {
        return '<strong>' + esc(pr.title) + '</strong>' + (ok(pr.status) ? ' <span class="chat-meta">(' + esc(pr.status) + ')</span>' : '') + ' — ' + esc(firstSentence(pr.description));
      }));
    },
    awards: function () {
      if (!AW.length) return p('No awards are listed on this website yet. For details, you could email her at ' + mailLink() + '.');
      return p('Awards and recognition:') + list(AW.map(function (a) { return '<strong>' + esc(a.title) + '</strong>' + (ok(a.organization) ? ', ' + esc(a.organization) : '') + (ok(a.year) ? ' (' + esc(a.year) + ')' : ''); }));
    },
    coauthors: function () {
      var count = {};
      PUBS.forEach(function (pb) {
        var t = String(pb.authors || '').split(/,\s*/), seen = {};
        for (var i = 0; i < t.length; i++) {
          var name = t[i];
          if (t[i + 1] && /^([A-Z]\.?[\s-]?)+$/.test(t[i + 1])) { name += ', ' + t[i + 1]; i++; }
          name = name.trim();
          if (!name || /bukht/i.test(name) || seen[name]) continue;
          seen[name] = 1; count[name] = (count[name] || 0) + 1;
        }
      });
      var top = Object.keys(count).sort(function (a, b) { return count[b] - count[a]; }).slice(0, 6);
      if (!top.length) return null;
      return p('Her most frequent co-authors:') + list(top.map(function (n) { return esc(n) + ' <span class="chat-meta">(' + count[n] + ' papers)</span>'; }));
    },
    language: function () { return ok(P.languages) ? p('She speaks ' + esc(String(P.languages).replace(/,\s*([^,]*)$/, ' and $1')) + '.') : null; },
    supervision: function () {
      return p('This website doesn’t list information about student supervision or openings. The best way to ask is to email her at ' + mailLink() + '.');
    },
    links: function () {
      var L = P.socialLinks || {}, names = { googleScholar: 'Google Scholar', researchGate: 'ResearchGate', linkedin: 'LinkedIn', orcid: 'ORCID', dblp: 'dblp', academiaEdu: 'Academia.edu', universityProfile: 'University faculty page', github: 'GitHub' };
      var items = Object.keys(names).filter(function (k) { return ok(L[k]); }).map(function (k) { return link(L[k], names[k]); });
      return items.length ? p('Her profiles:') + list(items) : null;
    },
    greet: function () {
      return p('Hello! I can answer questions about ' + esc(NAME) + ': her research, publications, education, experience, and how to contact her.');
    },
    thanks: function () { return p('You’re welcome! Is there anything else you’d like to know?'); },
    help: function () {
      return p('I’m not sure about that one. I can tell you about her research, publications, education, experience, certifications, or how to contact her.') +
        (ok(EMAIL) ? p('For anything else, you can email her at ' + mailLink() + '.') : '');
    }
  };

  function answer(raw) {
    var q = ' ' + norm(raw) + ' ';
    var years = raw.match(/\b(19|20)\d{2}\b/g);
    var WEAK = ['about', 'greet', 'thanks'];
    var scored = INTENTS.map(function (it, i) { return { id: it.id, s: has(q, it.w), i: i, weak: WEAK.indexOf(it.id) >= 0 }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return (a.weak - b.weak) || b.s - a.s || a.i - b.i; });
    var top = scored.length ? scored[0].id : null;
    var terms = topicTerms(q);
    var out;

    if (years && (!top || top === 'pubs' || top === 'research')) return A.pubsByYear(+years[0]);
    if ((top === 'pubs' || top === 'research') && terms.length) {
      out = A.pubSearch(terms);
      if (out) return out;
      if (top === 'pubs') return p('I couldn’t find publications about “' + esc(terms.join(' ')) + '”.') + (A.research() || '');
    }
    if (top && A[top]) { out = A[top](q); if (out) return out; }
    if (terms.length) { out = A.pubSearch(terms); if (out) return out; }
    return A.help();
  }

  /* ---------------- AI replies (optional) ---------------- */
  function md(text) {
    var links = [];
    var s = esc(text).replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)\s]+)\)/g, function (m, t, u) {
      links.push('<a href="' + u + '" target="_blank" rel="noopener">' + t + '</a>'); return '\u0000' + (links.length - 1) + '\u0000';
    });
    s = s.replace(/(^|[\s(])((?:https?:\/\/)[^\s<)]+)/g, function (m, pre, u) {
      var trail = u.match(/[.,;:!?]+$/); if (trail) u = u.slice(0, -trail[0].length);
      links.push('<a href="' + u + '" target="_blank" rel="noopener">' + u + '</a>');
      return pre + '\u0000' + (links.length - 1) + '\u0000' + (trail ? trail[0] : '');
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    var html = '', listType = null, para = [];
    function flushPara() { if (para.length) { html += '<p>' + para.join('<br>') + '</p>'; para = []; } }
    function closeList() { if (listType) { html += '</' + listType + '>'; listType = null; } }
    s.split('\n').forEach(function (line) {
      var t = line.trim(), m;
      if ((m = t.match(/^[-*•]\s+(.*)$/)) || (m = t.match(/^\d+[.)]\s+(.*)$/))) {
        var type = /^\d/.test(t) ? 'ol' : 'ul';
        flushPara();
        if (listType !== type) { closeList(); html += '<' + type + '>'; listType = type; }
        html += '<li>' + m[1] + '</li>';
      } else if (!t) { flushPara(); closeList(); }
      else { closeList(); para.push(t); }
    });
    flushPara(); closeList();
    return html.replace(/\u0000(\d+)\u0000/g, function (m, i) { return links[+i]; });
  }
  function textOf(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent.replace(/\s+/g, ' ').trim(); }

  /* ---------------- UI ---------------- */
  var ICON_CHAT = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.2-4.3A8 8 0 1 1 21 12Z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/></svg>';
  var ICON_CLOSE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var ICON_SEND = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';
  var SUGGESTIONS = ['What is her research about?', 'Latest publications', 'Papers on medical imaging', 'Education', 'How can I contact her?', 'Download CV'];

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var launcher = el('button', 'chat-launcher', ICON_CHAT + '<span class="chat-label">Ask a question</span>');
  launcher.type = 'button';
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'chatPanel');

  var panel = el('div', 'chat-panel');
  panel.id = 'chatPanel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Ask about ' + NAME);
  panel.setAttribute('aria-hidden', 'true');

  var head = el('div', 'chat-head');
  head.appendChild(el('div', 'chat-avatar', ICON_CHAT));
  var titles = el('div');
  titles.appendChild(el('div', 'chat-title', 'Ask about ' + esc(P.shortName || 'Dr. Tanvir')));
  var sub = el('div', 'chat-sub', 'Answers from this website');
  titles.appendChild(sub);
  head.appendChild(titles);
  var closeBtn = el('button', 'chat-close', ICON_CLOSE);
  closeBtn.type = 'button'; closeBtn.setAttribute('aria-label', 'Close chat');
  head.appendChild(closeBtn);

  var log = el('div', 'chat-log');
  log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite');
  var chips = el('div', 'chat-chips');
  var form = el('form', 'chat-form');
  var input = el('textarea', 'chat-input');
  input.rows = 1; input.placeholder = 'Type your question…'; input.setAttribute('aria-label', 'Your question'); input.maxLength = 600;
  var send = el('button', 'chat-send', ICON_SEND);
  send.type = 'submit'; send.setAttribute('aria-label', 'Send'); send.disabled = true;
  form.appendChild(input); form.appendChild(send);
  var note = el('p', 'chat-note', 'Answers are based on the information on this website.');

  panel.appendChild(head); panel.appendChild(log); panel.appendChild(chips); panel.appendChild(form); panel.appendChild(note);
  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  var history = [], busy = false, started = false, aiMode = false, aiChecked = false;

  function scrollDown() { log.scrollTop = log.scrollHeight; }
  function addMsg(who, html) {
    var m = el('div', 'chat-msg ' + who, html);
    log.appendChild(m); scrollDown();
    return m;
  }
  function typing() { return addMsg('bot', '<span class="chat-typing" aria-label="Typing"><span></span><span></span><span></span></span>'); }
  function drawChips() {
    chips.innerHTML = '';
    SUGGESTIONS.forEach(function (s) {
      var c = el('button', 'chat-chip'); c.type = 'button'; c.textContent = s;
      c.addEventListener('click', function () { ask(s); });
      chips.appendChild(c);
    });
  }
  function checkAI() {
    if (aiChecked) return; aiChecked = true;
    fetch('/api/chat', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (j && j.ai) {
          aiMode = true;
          sub.textContent = 'AI assistant · answers from this website';
          note.textContent = 'AI answers can make mistakes. For anything important, please email her.';
        }
      })
      .catch(function () {});
  }
  function open() {
    panel.classList.add('is-open'); panel.setAttribute('aria-hidden', 'false');
    launcher.classList.add('is-hidden'); launcher.setAttribute('aria-expanded', 'true');
    if (!started) {
      started = true;
      addMsg('bot', p('Hello! I can answer questions about ' + esc(NAME) + ': her research, publications, education, experience, and how to get in touch.') + p('What would you like to know?'));
      drawChips();
    }
    checkAI();
    setTimeout(function () { input.focus(); }, 60);
  }
  function close() {
    panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true');
    launcher.classList.remove('is-hidden'); launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }
  function reply(html, plain) {
    addMsg('bot', html);
    history.push({ role: 'assistant', content: plain != null ? plain : textOf(html) });
  }
  function ask(text) {
    text = String(text || '').trim();
    if (!text || busy) return;
    busy = true; send.disabled = true;
    chips.innerHTML = '';
    addMsg('user', esc(text));
    history.push({ role: 'user', content: text });
    input.value = ''; autosize();
    var t = typing();
    function builtIn() { t.remove(); reply(answer(text)); done(); }
    if (aiMode) {
      fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Chat': '1' },
        body: JSON.stringify({ messages: history.slice(-8) })
      }).then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
        .then(function (j) {
          if (!j || !j.reply) throw new Error('empty');
          t.remove(); reply(md(j.reply), j.reply); done();
        })
        .catch(builtIn);
    } else {
      setTimeout(builtIn, 380);
    }
  }
  function done() { busy = false; send.disabled = !input.value.trim(); if (panel.classList.contains('is-open')) input.focus(); }
  function autosize() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; }

  launcher.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
  input.addEventListener('input', function () { send.disabled = busy || !input.value.trim(); autosize(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input.value); }
  });
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  log.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-chat-close]');
    if (a && window.matchMedia('(max-width: 600px)').matches) close();
  });

  window.SiteChat = { answer: function (q) { return answer(q); }, open: open };
})();
