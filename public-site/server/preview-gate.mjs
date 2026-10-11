import { createHmac, timingSafeEqual } from 'node:crypto';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ENV_FILE = resolve(SCRIPT_DIR, '../../ci/.env');

// Read ci/.env without requiring Node's newer --env-file option.
// Variables supplied by systemd take precedence.
if (existsSync(ENV_FILE)) {
  const envText = readFileSync(ENV_FILE, 'utf8').replace(/^\uFEFF/, '');
  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
      if (match[2].startsWith('"')) value = value.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
    } else {
      value = value.replace(/\s+#.*$/, '');
    }
    process.env[match[1]] = value;
  }
}

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 4173);
const DIST_DIR = resolve(process.env.KGP_DIST_DIR || join(SCRIPT_DIR, '../dist'));
const COMING_SOON_FILE = resolve(process.env.KGP_COMING_SOON_FILE || join(SCRIPT_DIR, '../coming-soon.html'));
const PREVIEW_PASSWORD = process.env.PREVIEW_PASSWORD || '';
const PREVIEW_COOKIE_SECRET = process.env.PREVIEW_COOKIE_SECRET || '';
const COOKIE_NAME = '__Host-kgp_preview';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;
const MAX_BODY_BYTES = 4096;
const attempts = new Map();

if (!PREVIEW_PASSWORD || PREVIEW_COOKIE_SECRET.length < 32) {
  throw new Error('Set PREVIEW_PASSWORD and PREVIEW_COOKIE_SECRET (at least 32 characters).');
}
if (!existsSync(join(DIST_DIR, 'index.html'))) {
  throw new Error('Built site not found: ' + join(DIST_DIR, 'index.html') + '. Run npm run build first.');
}
if (!existsSync(COMING_SOON_FILE)) {
  throw new Error('Coming Soon file not found: ' + COMING_SOON_FILE);
}

function sign(expiry) {
  return createHmac('sha256', PREVIEW_COOKIE_SECRET).update(expiry).digest('base64url');
}
function validCookie(req) {
  const cookieHeader = req.headers.cookie || '';
  const token = cookieHeader.match(new RegExp('(?:^|;\\s*)' + COOKIE_NAME + '=([^;]+)'))?.[1];
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2 || !/^\d+$/.test(parts[0])) return false;
  const [expiry, signature] = parts;
  if (Number(expiry) <= Math.floor(Date.now() / 1000)) return false;
  const expected = Buffer.from(sign(expiry));
  const supplied = Buffer.from(signature);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}
function send(res, status, body, type = 'text/plain; charset=utf-8', headers = {}) {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers });
  res.end(body);
}
function readJson(req) {
  return new Promise((resolveBody, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (Buffer.byteLength(data) > MAX_BODY_BYTES) {
        reject(new Error('body_too_large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try { resolveBody(JSON.parse(data || '{}')); } catch { reject(new Error('invalid_json')); }
    });
    req.on('error', reject);
  });
}
function serveStatic(pathname, res) {
  let relative;
  try { relative = decodeURIComponent(pathname).replace(/^\/+/, ''); } catch { return false; }
  const filePath = normalize(join(DIST_DIR, relative));
  if (!filePath.startsWith(DIST_DIR + sep) || !existsSync(filePath) || !statSync(filePath).isFile()) return false;
  const types = { '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.ico':'image/x-icon', '.woff':'font/woff', '.woff2':'font/woff2', '.json':'application/json; charset=utf-8' };
  res.writeHead(200, { 'Content-Type': types[extname(filePath)] || 'application/octet-stream', 'Cache-Control': /\.[a-f0-9]{8,}\./i.test(filePath) ? 'public, max-age=31536000, immutable' : 'public, max-age=300', 'X-Content-Type-Options':'nosniff' });
  createReadStream(filePath).pipe(res);
  return true;
}

createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  const pathname = url.pathname;

  if (pathname === '/__preview/status' && req.method === 'GET') {
    return send(res, validCookie(req) ? 204 : 401, '');
  }
  if (pathname === '/__preview/logout' && req.method === 'POST') {
    return send(res, 200, JSON.stringify({ ok: true }), 'application/json; charset=utf-8', {
      'Set-Cookie': COOKIE_NAME + '=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    });
  }
  if (pathname === '/__preview/auth' && req.method === 'POST') {
    const ip = req.headers['cf-connecting-ip'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const previous = attempts.get(ip);
    if (previous && now - previous.startedAt < 10 * 60 * 1000 && previous.count >= 8) return send(res, 429, 'Too many attempts');
    const state = !previous || now - previous.startedAt >= 10 * 60 * 1000 ? { startedAt: now, count: 0 } : previous;
    state.count += 1;
    attempts.set(ip, state);
    let body;
    try { body = await readJson(req); } catch { return send(res, 400, 'Invalid request'); }
    const supplied = typeof body.password === 'string' ? Buffer.from(body.password) : Buffer.from('');
    const expected = Buffer.from(PREVIEW_PASSWORD);
    const matches = supplied.length === expected.length && timingSafeEqual(supplied, expected);
    if (!matches) return send(res, 401, 'Unauthorized');
    attempts.delete(ip);
    const expiry = String(Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE);
    const token = expiry + '.' + sign(expiry);
    return send(res, 200, JSON.stringify({ ok: true }), 'application/json; charset=utf-8', {
      'Set-Cookie': COOKIE_NAME + '=' + token + '; Path=/; Max-Age=' + COOKIE_MAX_AGE + '; HttpOnly; Secure; SameSite=Lax',
    });
  }
  if (pathname.startsWith('/__preview/')) {
    res.setHeader('Allow', 'GET, POST');
    return send(res, 404, 'Not Found');
  }

  if (pathname.startsWith('/assets/') || pathname === '/favicon.ico' || pathname === '/logo.png') {
    if (serveStatic(pathname, res)) return;
  }

  const isPreviewRoute = pathname === '/preview' || pathname === '/preview/';
  if (!isPreviewRoute && !validCookie(req)) {
    return send(res, 200, readFileSync(COMING_SOON_FILE), 'text/html; charset=utf-8');
  }
  return send(res, 200, readFileSync(join(DIST_DIR, 'index.html')), 'text/html; charset=utf-8');
}).listen(PORT, HOST, () => console.log('KGP preview gate listening on http://' + HOST + ':' + PORT));
