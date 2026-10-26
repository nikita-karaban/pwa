import type { H3Event } from 'h3'

const COOKIE = 'zg_session'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 дней

const enc = new TextEncoder()

function toBase64Url(bytes: Uint8Array): string {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return toBase64Url(new Uint8Array(sig))
}

/** Сравнение без утечки по времени: сравниваем хеши обеих строк. */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ])
  const x = new Uint8Array(ha)
  const y = new Uint8Array(hb)
  let diff = 0
  for (let i = 0; i < x.length; i++) diff |= x[i]! ^ y[i]!
  return diff === 0
}

function secrets() {
  const { appPassword, sessionSecret } = useRuntimeConfig()
  if (!appPassword || !sessionSecret) {
    throw createError({ statusCode: 500, statusMessage: 'Не заданы NUXT_APP_PASSWORD и NUXT_SESSION_SECRET' })
  }
  return { appPassword, sessionSecret }
}

export async function checkPassword(input: string): Promise<boolean> {
  const { appPassword } = secrets()
  return safeEqual(input, appPassword)
}

export async function startSession(event: H3Event): Promise<void> {
  const { sessionSecret } = secrets()
  const payload = toBase64Url(enc.encode(JSON.stringify({ exp: Date.now() + MAX_AGE * 1000 })))
  const sig = await hmac(sessionSecret, payload)
  setCookie(event, COOKIE, `${payload}.${sig}`, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export function endSession(event: H3Event): void {
  deleteCookie(event, COOKIE, { path: '/' })
}

export async function hasSession(event: H3Event): Promise<boolean> {
  const raw = getCookie(event, COOKIE)
  if (!raw) return false
  const [payload, sig] = raw.split('.')
  if (!payload || !sig) return false
  const { sessionSecret } = secrets()
  if (!(await safeEqual(sig, await hmac(sessionSecret, payload)))) return false
  try {
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const { exp } = JSON.parse(json) as { exp?: number }
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}
