/* Lantern — private backup export for the monthly Google Drive backup.
   GET /api/backup-export with header  Authorization: Bearer <LANTERN_EXPORT_KEY>
   Returns the same JSON file the Parent portal's "Download a backup" button makes (restorable in Settings).
   It signs in as a dedicated read-only backup account; Firestore rules allow that account to READ one family only.
   Netlify environment variables (Site configuration → Environment variables):
     LANTERN_EXPORT_KEY       long random key; the scheduled backup task sends it
     LANTERN_BACKUP_EMAIL     backup account email
     LANTERN_BACKUP_PASSWORD  backup account password
     LANTERN_FAMILY_UID       the family account to export
   Remove LANTERN_EXPORT_KEY to switch the export off instantly. */
import crypto from 'node:crypto';

const API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyD-pQPV24-tCWuHWbU2zblouX2C0EsBZtM'; // public web key (same as firebase-config.js)
const PROJECT = process.env.FIREBASE_PROJECT_ID || 'lantern-homeschool';
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

function sameKey(a, b) { const x = Buffer.from(String(a || '')), y = Buffer.from(String(b || '')); return x.length === y.length && x.length > 20 && crypto.timingSafeEqual(x, y); }

// Firestore REST values → plain JSON (the shape the app stores)
export function plain(v) {
  if (!v || typeof v !== 'object') return null;
  if ('nullValue' in v) return null;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('stringValue' in v) return v.stringValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(plain);
  if ('mapValue' in v) return fields(v.mapValue.fields || {});
  if ('referenceValue' in v) return v.referenceValue;
  if ('bytesValue' in v) return v.bytesValue;
  if ('geoPointValue' in v) return v.geoPointValue;
  return null;
}
const fields = (f) => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, plain(v)]));

export default async (req) => {
  const KEY = process.env.LANTERN_EXPORT_KEY, FAM = process.env.LANTERN_FAMILY_UID;
  if (!KEY || !FAM || !process.env.LANTERN_BACKUP_EMAIL || !process.env.LANTERN_BACKUP_PASSWORD) return json(503, { error: 'Backup export is not set up.' });
  if (req.method !== 'GET') return json(405, { error: 'Use GET.' });
  if (!sameKey((req.headers.get('authorization') || '').replace(/^Bearer\s+/i, ''), KEY)) { await new Promise((r) => setTimeout(r, 800)); return json(401, { error: 'Not allowed.' }); }
  try {
    const s = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + API_KEY, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: process.env.LANTERN_BACKUP_EMAIL, password: process.env.LANTERN_BACKUP_PASSWORD, returnSecureToken: true }) });
    const sj = await s.json(); if (!s.ok || !sj.idToken) { console.error('backup sign-in failed', sj && sj.error && sj.error.message); return json(502, { error: 'Could not sign in the backup account.' }); }
    const docs = {}; let page = '';
    do {
      const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/families/${encodeURIComponent(FAM)}/docs?pageSize=300${page ? '&pageToken=' + encodeURIComponent(page) : ''}`, { headers: { Authorization: 'Bearer ' + sj.idToken } });
      const rj = await r.json(); if (!r.ok) { console.error('firestore', r.status, rj && rj.error && rj.error.message); return json(502, { error: 'Could not read the school.' }); }
      (rj.documents || []).forEach((d) => { docs[d.name.split('/').pop()] = fields(d.fields || {}); });
      page = rj.nextPageToken || '';
    } while (page);
    if (!docs.family) return json(404, { error: 'No school found.' });
    const kids = Array.isArray(docs.family.kids) ? docs.family.kids : [];
    return json(200, { app: 'lantern-homeschool', v: 1, exported: new Date().toISOString(), school: docs.family.name || 'Lantern', learners: kids.map((k) => k.name), docs });
  } catch (e) { console.error('backup', e && e.message); return json(502, { error: 'Backup failed. Try again later.' }); }
};

export const config = { path: '/api/backup-export' };
