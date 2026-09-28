'use strict';
/*
 * AI answers for the website's "Ask a question" chat (js/chatbot.js).
 *
 * Optional. Add ONE of these Vercel environment variables and redeploy:
 *   GEMINI_API_KEY     – Google AI Studio key (has a free tier)
 *   ANTHROPIC_API_KEY  – Anthropic (Claude) API key
 * Optional: CHAT_MODEL to choose a different model.
 * Without a key the chat still works, using its built-in answers.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DATA_FILES = [
  path.join(__dirname, '../data/profile.js'),
  path.join(__dirname, '../data/education.js'),
  path.join(__dirname, '../data/experience.js'),
  path.join(__dirname, '../data/research.js'),
  path.join(__dirname, '../data/publications.js'),
  path.join(__dirname, '../data/projects.js'),
  path.join(__dirname, '../data/awards.js'),
  path.join(__dirname, '../data/certifications.js'),
  path.join(__dirname, '../data/skills.js')
];
const VARS = ['PROFILE', 'EDUCATION', 'EXPERIENCE', 'RESEARCH_AREAS', 'PUBLICATIONS', 'PUBLICATION_STATS', 'PROJECTS', 'AWARDS', 'CERTIFICATIONS', 'SKILLS'];

let cache = null, cacheAt = 0;
async function readData(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch (e) { /* fall back to the deployed copy */ }
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (!host) throw new Error('data not found');
  const r = await fetch('https://' + host + '/data/' + path.basename(file));
  if (!r.ok) throw new Error('data ' + r.status);
  return r.text();
}
async function loadData() {
  if (cache && Date.now() - cacheAt < 5 * 60 * 1000) return cache;
  let src = '';
  for (const f of DATA_FILES) src += (await readData(f)) + '\n;\n';
  const expr = '({' + VARS.map(v => v + ': typeof ' + v + ' !== "undefined" ? ' + v + ' : undefined').join(', ') + '})';
  const out = vm.runInNewContext(src + expr, {}, { timeout: 1000 });
  cache = JSON.parse(JSON.stringify(out));
  cacheAt = Date.now();
  return cache;
}

function clean(v) { return v == null || /\[information to be added\]/i.test(String(v)) ? '' : String(v).trim(); }
function buildContext(d) {
  const P = d.PROFILE || {}, L = [];
  const line = (label, v) => { v = clean(v); if (v) L.push(label + ': ' + v); };
  L.push('## Profile');
  line('Name', P.fullName); line('Job title', P.designation); line('Department', P.department);
  line('Institution', P.institution); line('Location', P.location); line('Languages', P.languages);
  line('Headline', P.headline);
  (P.biography || []).forEach(b => line('Bio', b));
  const C = P.contact || {};
  line('Public email', C.email); line('Office', C.office); line('Institution address', C.institutionAddress);
  const S = P.socialLinks || {};
  Object.keys(S).forEach(k => line('Profile link (' + k + ')', S[k]));
  line('CV (PDF)', '/assets/cv/Dr-Tanvir-Fatima-Naik-Bukht-CV.pdf');

  L.push('', '## Education');
  (d.EDUCATION || []).forEach(e => L.push('- ' + [clean(e.degree), clean(e.institution), clean(e.year), clean(e.specialization)].filter(Boolean).join(' | ')));
  L.push('', '## Experience');
  (d.EXPERIENCE || []).forEach(e => {
    L.push('- ' + [clean(e.title), clean(e.organization), clean(e.department), clean(e.location),
      [clean(e.startDate), clean(e.endDate)].filter(Boolean).join(' – '), e.current ? 'CURRENT POSITION' : ''].filter(Boolean).join(' | '));
    (e.responsibilities || []).concat(e.achievements || []).forEach(r => { if (clean(r)) L.push('    • ' + clean(r)); });
  });
  L.push('', '## Research areas');
  (d.RESEARCH_AREAS || []).forEach(r => L.push('- ' + clean(r.title) + ': ' + clean(r.description)));
  const ST = d.PUBLICATION_STATS || {};
  L.push('', '## Publications', 'Totals: ' + [ST.totalPublications && ST.totalPublications + ' publications', ST.totalJournalArticles && ST.totalJournalArticles + ' journal articles',
    ST.totalConferencePapers && ST.totalConferencePapers + ' conference papers', ST.totalCitations && ST.totalCitations + '+ citations'].filter(Boolean).join(', '));
  (d.PUBLICATIONS || []).slice().sort((a, b) => (b.year || 0) - (a.year || 0)).forEach(p => {
    const link = clean(p.link) || (clean(p.doi) ? 'https://doi.org/' + clean(p.doi) : '');
    L.push('- ' + [p.year, p.type, clean(p.title), clean(p.authors), clean(p.venue), link].filter(Boolean).join(' | '));
  });
  L.push('', '## Projects');
  (d.PROJECTS || []).forEach(p => L.push('- ' + [clean(p.title), clean(p.status), clean(p.duration), clean(p.role), clean(p.fundingOrganization) && 'Funding: ' + clean(p.fundingOrganization), clean(p.description)].filter(Boolean).join(' | ')));
  L.push('', '## Awards');
  if (!(d.AWARDS || []).length) L.push('- None listed on the website.');
  (d.AWARDS || []).forEach(a => L.push('- ' + [clean(a.title), clean(a.organization), clean(a.year), clean(a.description)].filter(Boolean).join(' | ')));
  L.push('', '## Certifications');
  (d.CERTIFICATIONS || []).forEach(c => L.push('- ' + [clean(c.title), clean(c.issuer)].filter(Boolean).join(' — ')));
  const SK = d.SKILLS || {};
  L.push('', '## Skills');
  Object.keys(SK).forEach(k => { if ((SK[k] || []).length) L.push('- ' + k + ': ' + SK[k].join(', ')); });
  return L.join('\n');
}
function systemPrompt(d) {
  const P = d.PROFILE || {}, name = P.fullName || 'the academic', email = clean((P.contact || {}).email);
  return 'You are the friendly assistant on the academic portfolio website of ' + name + '. Visitors (students, researchers, collaborators) ask you about her.\n\n' +
    'Rules:\n' +
    '- Answer ONLY from the site information below. Never invent publications, dates, numbers, awards, grants or personal details.\n' +
    '- If the answer is not in the information, say so briefly and suggest emailing her' + (email ? ' at ' + email : '') + '.\n' +
    '- Be concise: 1–5 sentences, or a short bulleted list. Refer to her in the third person.\n' +
    '- When listing publications include the year and venue, and the DOI link when available, as markdown links.\n' +
    '- Stay on topic. For unrelated requests, politely say you can only help with questions about her and her work.\n' +
    '- Do not share a phone number or home address; none are published.\n' +
    '- Reply in the language the visitor writes in.\n\n' +
    '<site_information>\n' + buildContext(d) + '\n</site_information>';
}

async function askClaude(system, messages) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: process.env.CHAT_MODEL || 'claude-haiku-4-5', max_tokens: 600, temperature: 0.3, system: system, messages: messages })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j.error && j.error.message) || 'Anthropic ' + r.status);
  return (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n');
}
async function askGemini(system, messages) {
  const model = process.env.CHAT_MODEL || 'gemini-2.5-flash';
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent', {
    method: 'POST',
    headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
      generationConfig: Object.assign({ maxOutputTokens: 700, temperature: 0.3 }, /2\.5-flash/.test(model) ? { thinkingConfig: { thinkingBudget: 0 } } : {})
    })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j.error && j.error.message) || 'Gemini ' + r.status);
  const c = (j.candidates || [])[0];
  return ((c && c.content && c.content.parts) || []).map(p => p.text || '').join('');
}

// Simple abuse protection (per server instance).
const hits = new Map();
let hour = { n: 0, t: Date.now() };
function limited(ip) {
  const now = Date.now();
  if (now - hour.t > 3600e3) hour = { n: 0, t: now };
  if (++hour.n > 300) return true;
  const recent = (hits.get(ip) || []).filter(t => now - t < 10 * 60e3);
  recent.push(now);
  if (hits.size > 5000) hits.clear();
  hits.set(ip, recent);
  return recent.length > 20;
}

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const provider = process.env.ANTHROPIC_API_KEY ? 'anthropic' : (process.env.GEMINI_API_KEY ? 'gemini' : '');
  if (req.method === 'GET') return res.status(200).json({ ai: !!provider });
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  if (req.headers['x-chat'] !== '1') return res.status(400).json({ message: 'Bad request' });
  if (!provider) return res.status(503).json({ message: 'AI answers are not set up.' });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ message: 'Too many questions right now. Please try again in a few minutes.' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  let msgs = Array.isArray(body && body.messages) ? body.messages : [];
  msgs = msgs.filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-8)
    .map(m => ({ role: m.role, content: m.content.slice(0, m.role === 'user' ? 600 : 2000) }));
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  const merged = [];
  msgs.forEach(m => { const last = merged[merged.length - 1]; if (last && last.role === m.role) last.content += '\n\n' + m.content; else merged.push({ role: m.role, content: m.content }); });
  if (!merged.length || merged[merged.length - 1].role !== 'user') return res.status(400).json({ message: 'No question received.' });

  try {
    const system = systemPrompt(await loadData());
    const reply = provider === 'anthropic' ? await askClaude(system, merged) : await askGemini(system, merged);
    if (!reply || !reply.trim()) throw new Error('empty reply');
    return res.status(200).json({ reply: reply.trim().slice(0, 4000) });
  } catch (e) {
    console.error('chat error:', e && e.message);
    return res.status(502).json({ message: 'The assistant is unavailable right now.' });
  }
};
