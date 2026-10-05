/**
 * POST /api/lustro: newsletter sign-up from the "Lustro marki osobistej" quiz → MailerLite.
 * Runs as a Vercel Function (prerender = false); the API key never reaches the browser.
 *
 * The browser sends only what the visitor typed + the ids of the checked items. Score, stage and
 * the list of missing items are recomputed here from src/data/lustro.ts (not trusted from the client).
 *
 * MailerLite setup (see README → "Lustro"): custom fields lustro_wynik (number), lustro_etap (text),
 * lustro_braki + lustro_braki_2 (text), optional group (MAILERLITE_GROUP_ID), and "Double opt-in for API and
 * integrations" switched ON, so every new subscriber gets a confirmation e-mail first.
 */
import type { APIRoute } from 'astro';
import { MAILERLITE_API_KEY, MAILERLITE_GROUP_ID } from 'astro:env/server';
import { lustroItemIds, lustroMissing, lustroScore, lustroStageFor } from '@/data/lustro';

export const prerender = false;

const MAILERLITE_ENDPOINT = 'https://connect.mailerlite.com/api/subscribers';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** MailerLite text fields are capped; keep the list readable and inside the limit */
const MAX_FIELD_LENGTH = 1000;
const MAX_BODY_BYTES = 8_000;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

/** Plain single-line text: no control characters, collapsed whitespace, length-capped */
const clean = (value: unknown, max: number) =>
  typeof value === 'string'
    ? value
        .replace(/[\u0000-\u001f\u007f]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, max)
    : '';

/**
 * Splits the missing-items list into MailerLite-sized text fields on item boundaries:
 * lustro_braki holds the first ~1000 chars, lustro_braki_2 the rest (all 31 items ≈ 1300 chars).
 */
function missingFields(missing: string[]) {
  const chunks = [''];
  for (const title of missing) {
    const last = chunks.length - 1;
    const joined = chunks[last] ? `${chunks[last]}; ${title}` : title;
    if (joined.length <= MAX_FIELD_LENGTH || !chunks[last]) chunks[last] = joined;
    else chunks.push(title);
  }
  return { lustro_braki: chunks[0] || 'brak', lustro_braki_2: chunks.slice(1).join('; ') };
}

const isSameHost = (origin: string, url: string) => {
  try {
    return new URL(origin).host === new URL(url).host;
  } catch {
    return false; // e.g. Origin: null (sandboxed iframes, file://)
  }
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Same-origin only (browsers always send Origin on POST fetches)
  const origin = request.headers.get('origin');
  if (origin && !isSameHost(origin, request.url)) {
    return json({ ok: false, error: 'forbidden' }, 403);
  }

  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'too_large' }, 413);
  }

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot: humans never see this field. Pretend success so bots learn nothing.
  if (clean(data.website, 200)) return json({ ok: true });

  const email = clean(data.email, 254).toLowerCase();
  const name = clean(data.name, 100);
  if (!EMAIL_PATTERN.test(email)) return json({ ok: false, error: 'invalid_email' }, 400);
  // GDPR: explicit, unticked-by-default consent is required server-side too
  if (data.consent !== true) return json({ ok: false, error: 'consent_required' }, 400);

  const checked = Array.isArray(data.checked)
    ? data.checked.filter(
        (id): id is string => typeof id === 'string' && lustroItemIds.includes(id),
      )
    : [];
  const score = lustroScore(checked);
  const stage = lustroStageFor(score);
  const missing = lustroMissing(checked);

  if (!MAILERLITE_API_KEY) {
    console.error('[lustro] MAILERLITE_API_KEY is not set');
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  const payload = {
    email,
    fields: {
      ...(name && { name }),
      lustro_wynik: score,
      lustro_etap: stage.name,
      ...missingFields(missing),
    },
    ...(MAILERLITE_GROUP_ID && { groups: [MAILERLITE_GROUP_ID] }),
    ...(clientAddress && { ip_address: clientAddress }),
  };

  try {
    const response = await fetch(MAILERLITE_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) return json({ ok: true });

    const detail = await response.text().catch(() => '');
    console.error(`[lustro] MailerLite ${response.status}: ${detail.slice(0, 500)}`);
    // 422 = MailerLite rejected the address (typo domain, role account, …)
    return response.status === 422
      ? json({ ok: false, error: 'invalid_email' }, 400)
      : json({ ok: false, error: 'upstream' }, 502);
  } catch (error) {
    console.error('[lustro] MailerLite request failed', error);
    return json({ ok: false, error: 'upstream' }, 502);
  }
};

export const ALL: APIRoute = () => json({ ok: false, error: 'method_not_allowed' }, 405);
