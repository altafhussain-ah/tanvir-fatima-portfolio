'use strict';
/*
 * Forwards the site editor's requests to GitHub using the server-side GITHUB_TOKEN,
 * but only for a signed-in editor and only for the few endpoints the editor needs.
 */
const auth = require('./_auth');
const REPO = (process.env.GITHUB_REPO || 'altafhussain-ah/tanvir-fatima-portfolio').toLowerCase();

function allowed(method, p) {
  if (typeof p !== 'string' || /\.\.|\/\/|#|\s|\\/.test(p)) return false;
  const base = '/repos/' + REPO, lower = p.toLowerCase();
  let rest;
  if (lower === base) rest = '';
  else if (lower.indexOf(base + '/') === 0) rest = p.slice(base.length);
  else return false;
  if (rest === '') return method === 'GET';
  if (/^\/contents\/[^?]+(\?ref=[\w.%-]+)?$/.test(rest)) return method === 'GET';
  if (/^\/git\/(blobs|trees|commits)$/.test(rest)) return method === 'POST';
  if (/^\/git\/commits\/[0-9a-f]{40}$/.test(rest)) return method === 'GET';
  if (/^\/git\/ref\/heads\/[\w.%-]+$/.test(rest)) return method === 'GET';
  if (/^\/git\/refs\/heads\/[\w.%-]+$/.test(rest)) return method === 'PATCH';
  return false;
}

module.exports = async function (req, res) {
  if (!auth.guard(req, res)) return;
  const problem = auth.problem();
  if (problem) return res.status(503).json({ message: problem });
  if (!auth.valid(req)) return res.status(401).json({ message: 'Please sign in again.' });
  const p = req.query && req.query.p;
  if (!allowed(req.method, p)) return res.status(403).json({ message: 'That request is not allowed by the site editor.' });

  let body;
  if (req.method !== 'GET') body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  try {
    const r = await fetch('https://api.github.com' + p, {
      method: req.method,
      headers: Object.assign({
        Authorization: 'Bearer ' + process.env.GITHUB_TOKEN,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'site-editor'
      }, body ? { 'Content-Type': 'application/json' } : {}),
      body: body
    });
    if (r.status === 401) {
      return res.status(502).json({ message: 'GitHub rejected the token saved on Vercel (GITHUB_TOKEN). It has probably expired: create a new one and replace it under Vercel → Settings → Environment Variables, then redeploy.' });
    }
    const text = await r.text();
    res.status(r.status);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.send(text || '{}');
  } catch (e) {
    return res.status(502).json({ message: 'Could not reach GitHub. Please try again.' });
  }
};
