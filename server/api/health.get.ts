import type { D1Database } from '@cloudflare/workers-types'

// Проверка привязки к базе D1: возвращает список созданных таблиц.
export default defineEventHandler(async (event) => {
  const db = (event.context.cloudflare?.env as { DB?: D1Database } | undefined)?.DB
  if (!db) return { ok: true, db: false }
  const { results } = await db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name <> 'd1_migrations' ORDER BY name")
    .all<{ name: string }>()
  return { ok: true, db: true, tables: results.map((r) => r.name) }
})
