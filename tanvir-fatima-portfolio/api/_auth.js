'use strict';
/*
 * Shared sign-in helpers for the site editor (used by login.js and gh.js).
 * Secrets live only in Vercel environment variables:
 *   EDITOR_PASSWORD  – the password you type in the editor (10+ characters)
 *   GITHUB_TOKEN     – fine-grained GitHub token with Contents: Read and write
 */
const crypto = require('crypto');

function problem() {
  const pw = process.env.EDITOR_PASSWORD || '', tok = process.env.GITHUB_TOKEN || '';
  if (!pw || !tok) return 'EDITOR_PASSWORD and GITHUB_TOKEN are not both set on Vercel yet.';
  if (pw.length < 10) return 'EDITOR_PASSWORD must be at least 10 characters.';
  return '';
}
function key() {
  return crypto.createHash('sha256').update('site-editor|' + process.env.EDITOR_PASSWORD + '|' + process.env.GITHUB_TOKEN).digest();
}
function sign(exp) { return crypto.createHmac('sha256', key()).update('v1.' + exp).digest('hex'); }
function same(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function checkPassword(pw) {
  const d = function (s) { return crypto.createHash('sha256').update(String(s)).digest(); };
  return crypto.timingSafeEqual(d(pw), d(process.env.EDITOR_PASSWORD || ''));
}
function issue(seconds) { const exp = Math.floor(Date.now() / 1000) + seconds; return exp + '.' + sign(exp); }
function readSession(req) { const m = /(?:^|;\s*)se_session=([^;]*)/.exec(req.headers.cookie || ''); return m ? m[1] : ''; }
function valid(req) {
  if (problem()) return false;
  const parts = readSession(req).split('.');
  if (parts.length !== 2 || !/^\d+$/.test(parts[0]) || Number(parts[0]) < Date.now() / 1000) return false;
  return same(parts[1], sign(parts[0]));
}
function cookie(value, maxAge) {
  return 'se_session=' + value + '; Path=/api; HttpOnly; Secure; SameSite=Strict' + (maxAge != null ? '; Max-Age=' + maxAge : '');
}
function guard(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.headers['x-editor'] !== '1') { res.status(400).json({ message: 'Bad request' }); return false; }
  return true;
}
module.exports = { problem, checkPassword, issue, valid, cookie, guard };
