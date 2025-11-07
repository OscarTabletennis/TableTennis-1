import type { DB } from './types'
const KEY = 'tt_db_v1'
export function loadDB(): DB { try { const raw = localStorage.getItem(KEY); return raw? JSON.parse(raw) as DB : { players: [], matches: [] } } catch { return { players: [], matches: [] } } }
export function saveDB(db: DB) { localStorage.setItem(KEY, JSON.stringify(db)) }
export function exportJSON(): string { return JSON.stringify(loadDB(), null, 2) }
export function importJSON(json: string) { const parsed = JSON.parse(json) as DB; if (!parsed.players || !parsed.matches) throw new Error('Invalid JSON'); saveDB(parsed) }
export function clearDB() { saveDB({ players: [], matches: [] }) }
