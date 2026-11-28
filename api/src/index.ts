export interface Env {
  DB: D1Database;
  ALLOWED_ORIGIN: string;
  ADMIN_API_KEY: string;
  PUBLIC_DISCORD_CLIENT_ID: string;
  PUBLIC_DISCORD_CLIENT_SECRET: string;
  PUBLIC_DISCORD_REDIRECT_URI: string;
  SESSION_SECRET: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  CONTACT_TO_EMAIL: string;
}

function allowedOrigin(request: Request, env: Env): string {
  const requestOrigin = request.headers.get("Origin");
  return requestOrigin === env.ALLOWED_ORIGIN ? requestOrigin : env.ALLOWED_ORIGIN;
}

function corsHeaders(origin: string): HeadersInit {
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-headers": "Content-Type, X-Admin-Key",
    "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
  };
}

const json = (data: unknown, status = 200, origin: string) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...corsHeaders(origin),
    },
  });

function slugify(input: string) {
  const value = input.trim().toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-+|-+$/g, "");
  return value || crypto.randomUUID();
}

function cleanText(input: unknown, max = 500) {
  return String(input ?? "").trim().slice(0, max);
}

// Deliberately small allow-list sanitizer for admin-entered HTML.
// It keeps blog editing convenient while removing scripts, forms and event handlers.
function sanitizeHtml(input: unknown) {
  let html = String(input ?? "");
  html = html.replace(/<\/?(script|style|iframe|object|embed|form|input|textarea|button)[^>]*>/gi, "");
  html = html.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  html = html.replace(/javascript\s*:/gi, "");
  return html.slice(0, 200000);
}


async function hmac(secret: string, value: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {name:"HMAC", hash:"SHA-256"}, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
}
async function signedSession(env: Env, user: any) {
  const payload = btoa(JSON.stringify({id:user.id,name:user.global_name||user.username||"Discord user",exp:Date.now()+1000*60*60*24*7})).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
  return `${payload}.${await hmac(env.SESSION_SECRET,payload)}`;
}

function authorized(request: Request, env: Env) {
  return request.headers.get("X-Admin-Key") === env.ADMIN_API_KEY;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = allowedOrigin(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (url.pathname === "/health") return json({ ok: true }, 200, origin);

    // Public contact form: keep the Resend API key exclusively in Worker secrets.
    if (url.pathname === "/v1/contact") {
      if (request.method !== "POST") {
        return json({ error: "method_not_allowed" }, 405, origin);
      }
      if (request.headers.get("Origin") !== env.ALLOWED_ORIGIN) {
        return json({ error: "origin_not_allowed" }, 403, origin);
      }
      const contentLength = Number(request.headers.get("Content-Length") || 0);
      if (contentLength > 12_000) return json({ error: "payload_too_large" }, 413, origin);

      let body: any;
      try {
        const raw = await request.text();
        if (new TextEncoder().encode(raw).byteLength > 12_000) {
          return json({ error: "payload_too_large" }, 413, origin);
        }
        body = JSON.parse(raw);
      } catch {
        return json({ error: "invalid_json" }, 400, origin);
      }

      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return json({ error: "invalid_payload" }, 400, origin);
      }

      // Honeypot: silently accept bot submissions without sending email.
      if (cleanText(body.website, 200)) return json({ ok: true }, 200, origin);

      const name = cleanText(body.name, 80).replace(/[\r\n]+/g, " ");
      const email = cleanText(body.email, 254);
      const message = cleanText(body.message, 5000);
      if (!name || !email || !message || body.consent !== true) {
        return json({ error: "required_fields_missing" }, 400, origin);
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json({ error: "invalid_email" }, 400, origin);
      }
      if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.CONTACT_TO_EMAIL) {
        return json({ error: "mail_service_not_configured" }, 503, origin);
      }

      let resendResponse: Response;
      try {
        resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: env.RESEND_FROM_EMAIL,
            to: [env.CONTACT_TO_EMAIL],
            reply_to: email,
            subject: `[KGPお問い合わせ] ${name}`,
            text: [
              "KGP公式サイトのお問い合わせフォームから送信されました。",
              "",
              `お名前: ${name}`,
              `メールアドレス: ${email}`,
              "",
              "お問い合わせ内容:",
              message,
            ].join("\n"),
          }),
        });
      } catch {
        console.error("Resend email request failed: network error");
        return json({ error: "mail_delivery_failed" }, 502, origin);
      }

      if (!resendResponse.ok) {
        // Do not return provider details or submitted personal data to the browser.
        console.error("Resend email request failed:", resendResponse.status);
        return json({ error: "mail_delivery_failed" }, 502, origin);
      }

      const result: any = await resendResponse.json();
      return json({ ok: true, id: result.id }, 200, origin);
    }


    if (url.pathname === "/oauth/discord/start" && request.method === "GET") {
      const state = crypto.randomUUID();
      const params = new URLSearchParams({client_id: env.PUBLIC_DISCORD_CLIENT_ID, redirect_uri: env.PUBLIC_DISCORD_REDIRECT_URI, response_type:"code", scope:"identify", state});
      const headers = new Headers({Location:`https://discord.com/oauth2/authorize?${params.toString()}`});
      headers.append("Set-Cookie", `kgp_oauth_state=${state}; Path=/; Max-Age=600; Secure; HttpOnly; SameSite=Lax`);
      return new Response(null,{status:302,headers});
    }

    if (url.pathname === "/oauth/discord/callback" && request.method === "GET") {
      const state = url.searchParams.get("state") || "";
      const cookies = request.headers.get("Cookie") || "";
      const stateCookie = cookies.match(/(?:^|;\s*)kgp_oauth_state=([^;]+)/)?.[1] || "";
      if (!state || state !== stateCookie) return new Response("Invalid OAuth state",{status:403});
      const tokenRes = await fetch("https://discord.com/api/oauth2/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:env.PUBLIC_DISCORD_CLIENT_ID,client_secret:env.PUBLIC_DISCORD_CLIENT_SECRET,grant_type:"authorization_code",code:url.searchParams.get("code")||"",redirect_uri:env.PUBLIC_DISCORD_REDIRECT_URI})});
      if(!tokenRes.ok)return new Response("Discord OAuth failed",{status:502});
      const token:any=await tokenRes.json();
      const userRes=await fetch("https://discord.com/api/users/@me",{headers:{Authorization:`Bearer ${token.access_token}`}});
      if(!userRes.ok)return new Response("Discord user lookup failed",{status:502});
      const user:any=await userRes.json();
      const session=await signedSession(env,user);
      const headers=new Headers({Location:`${env.ALLOWED_ORIGIN}/#/account`});
      headers.append("Set-Cookie",`kgp_session=${session}; Path=/; Max-Age=604800; Secure; HttpOnly; SameSite=Lax`);
      headers.append("Set-Cookie",`kgp_oauth_state=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax`);
      return new Response(null,{status:302,headers});
    }



    if (url.pathname === "/v1/news" && request.method === "GET") {
      const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 20), 1), 50);
      const offset = Math.max(Number(url.searchParams.get("offset") || 0), 0);
      const result = await env.DB.prepare(
        "SELECT id, slug, title, excerpt, content_html, category, cover_image_url, published, published_at, created_at, updated_at FROM news WHERE published = 1 ORDER BY COALESCE(published_at, created_at) DESC LIMIT ? OFFSET ?"
      ).bind(limit, offset).all();
      return json({ items: result.results }, 200, origin);
    }

    const match = url.pathname.match(/^\/v1\/news\/([^/]+)$/);
    const adminMatch = url.pathname.match(/^\/v1\/admin\/news\/(\d+)$/);
    if (match && request.method === "GET") {
      const slug = decodeURIComponent(match[1]);
      const row = await env.DB.prepare("SELECT * FROM news WHERE slug = ? AND published = 1").bind(slug).first();
      return row ? json(row, 200, origin) : json({ error: "not_found" }, 404, origin);
    }

    if (!url.pathname.startsWith("/v1/admin/")) return json({ error: "not_found" }, 404, origin);
    if (!authorized(request, env)) return json({ error: "unauthorized" }, 401, origin);

    if (url.pathname === "/v1/admin/news" && request.method === "GET") {
      const result = await env.DB.prepare("SELECT * FROM news ORDER BY updated_at DESC").all();
      return json({ items: result.results }, 200, origin);
    }

    if (url.pathname === "/v1/admin/news" && request.method === "POST") {
      const body = await request.json<any>();
      const title = cleanText(body.title, 120);
      if (!title) return json({ error: "title_required" }, 400, origin);
      const slug = cleanText(body.slug, 120) || slugify(title);
      const published = body.published ? 1 : 0;
      const publishedAt = published ? (cleanText(body.published_at, 40) || new Date().toISOString()) : null;
      const result = await env.DB.prepare(
        "INSERT INTO news (slug,title,excerpt,content_html,category,cover_image_url,published,published_at,updated_at) VALUES (?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP) RETURNING *"
      ).bind(slug, title, cleanText(body.excerpt, 300), sanitizeHtml(body.content_html), cleanText(body.category, 40) || "お知らせ", cleanText(body.cover_image_url, 1000), published, publishedAt).first();
      return json(result, 201, origin);
    }

    if (adminMatch && request.method === "PUT") {
      const id = Number(adminMatch[1]);
      if (!Number.isInteger(id)) return json({ error: "invalid_id" }, 400, origin);
      const body = await request.json<any>();
      const published = body.published ? 1 : 0;
      const publishedAt = published ? (cleanText(body.published_at, 40) || new Date().toISOString()) : null;
      const result = await env.DB.prepare(
        "UPDATE news SET slug=?, title=?, excerpt=?, content_html=?, category=?, cover_image_url=?, published=?, published_at=?, updated_at=CURRENT_TIMESTAMP WHERE id=? RETURNING *"
      ).bind(cleanText(body.slug, 120), cleanText(body.title, 120), cleanText(body.excerpt, 300), sanitizeHtml(body.content_html), cleanText(body.category, 40) || "お知らせ", cleanText(body.cover_image_url, 1000), published, publishedAt, id).first();
      return result ? json(result, 200, origin) : json({ error: "not_found" }, 404, origin);
    }

    if (adminMatch && request.method === "DELETE") {
      const id = Number(adminMatch[1]);
      await env.DB.prepare("DELETE FROM news WHERE id = ?").bind(id).run();
      return json({ ok: true }, 200, origin);
    }

    return json({ error: "not_found" }, 404, origin);
  },
};
