'use strict';
/* Sign-in for the site editor: GET = status, POST = sign in, DELETE = sign out. */
const auth = require('./_auth');
const WINDOW = 10 * 60 * 1000;
const fails = new Map(); // ip -> { n, t }

function ip(req) { return String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'; }

module.exports = async function (req, res) {
  if (!auth.guard(req, res)) return;
  const problem = auth.problem();
  if (req.method === 'GET') {
    return res.status(200).json({ configured: !problem, reason: problem || undefined, loggedIn: !problem && auth.valid(req) });
  }
  if (req.method === 'DELETE') { res.setHeader('Set-Cookie', auth.cookie('', 0)); return res.status(200).json({ ok: true }); }
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  if (problem) return res.status(503).json({ message: problem });

  const who = ip(req), now = Date.now(), f = fails.get(who);
  if (f && f.n >= 5 && now - f.t < WINDOW) return res.status(429).json({ message: 'Too many attempts. Try again in a few minutes.' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  if (!auth.checkPassword(body.password || '')) {
    const cur = f && now - f.t < WINDOW ? f : { n: 0, t: now };
    cur.n += 1; cur.t = now; fails.set(who, cur);
    await new Promise(function (r) { setTimeout(r, 1200); });
    return res.status(401).json({ message: 'Wrong password' });
  }
  fails.delete(who);
  const remember = !!body.remember;
  const seconds = remember ? 30 * 86400 : 12 * 3600;
  res.setHeader('Set-Cookie', auth.cookie(auth.issue(seconds), remember ? seconds : null));
  return res.status(200).json({ ok: true });
};
