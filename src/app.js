/* Lantern Homeschool — app logic. Plain JS, no libraries. */
(function () {
  'use strict';
  const COURSES = window.LH_COURSES;
  const GEN = window.LH_GEN;

  /* ─────────────── constants ─────────────── */
  const SUBJ = [
    { k: 'math', n: 'Math', c: 'math' },
    { k: 'ela', n: 'English', c: 'ela' },
    { k: 'sci', n: 'Science', c: 'sci' },
    { k: 'soc', n: 'Social Studies', c: 'soc' },
    { k: 'ai', n: 'AI & Me', c: 'ai' },
    { k: 'fin', n: 'Money Smart', c: 'fin' }
  ];
  // One background theme per subject, unlocked by finishing any course (every unit mastered) in that subject.
  const THEMES = [
    { id: 'galaxy', n: 'Galaxy', s: 'math', d: 'Stars, planets and space dust' },
    { id: 'storybook', n: 'Storybook', s: 'ela', d: 'Warm pages and floating letters' },
    { id: 'ocean', n: 'Ocean Deep', s: 'sci', d: 'Bubbles, fish and seaweed' },
    { id: 'treasure', n: 'Treasure Map', s: 'soc', d: 'Dotted trails and a compass' },
    { id: 'circuit', n: 'Circuit City', s: 'ai', d: 'Glowing neon circuits' },
    { id: 'gold', n: 'Gold Rush', s: 'fin', d: 'Shiny coins and sparkles' },
    // these unlock with a badge instead of a finished course
    { id: 'beach', n: 'Caribbean Beach', b: 'hola', d: 'Palm trees, turquoise sea and seashells' },
    { id: 'rainbow', n: 'Rainbow Sky', b: 'streak3', d: 'A big rainbow and fluffy clouds' },
    { id: 'fiesta', n: 'Fiesta', b: 'planner', d: 'Papel picado flags and confetti' },
    { id: 'dino', n: 'Dino Land', b: 'speller', d: 'Friendly dinosaurs and a volcano' },
    { id: 'jungle', n: 'Jungle Safari', b: 'bookworm', d: 'Leafy vines and jungle flowers' },
    { id: 'robots', n: 'Robot Workshop', b: 'coder', d: 'Gears, bolts and a robot buddy' }
  ];
  const EXTRA = [
    { k: 'read', n: 'Independent reading' }, { k: 'pe', n: 'Physical education' }, { k: 'art', n: 'Art & music' },
    { k: 'field', n: 'Field trip' }, { k: 'life', n: 'Life skills' }, { k: 'span', n: 'Spanish' }, { k: 'quest', n: 'Projects (Quests)' }, { k: 'cte', n: 'Career & technical (trades)' }, { k: 'code', n: 'Coding' }, { k: 'other', n: 'Other' }
  ];
  const SUBJ_NAME = Object.fromEntries([...SUBJ, ...EXTRA].map((s) => [s.k, s.n]));
  const COLORS = ['#3461C1', '#C2453A', '#2F8A57', '#7B4FA6', '#C27A12', '#1F8A8A', '#B23A7A', '#5B6B2F'];
  const GRADE_NAME = (g) => (g === 1 ? '1st' : g === 2 ? '2nd' : g === 3 ? '3rd' : g + 'th') + ' grade';
  const LETTER = (avg) => (avg == null ? '—' : avg >= 90 ? 'A' : avg >= 80 ? 'B' : avg >= 70 ? 'C' : avg >= 60 ? 'D' : 'F');
  const POINTS = { A: 4, B: 3, C: 2, D: 1, F: 0 };
  const BADGES = [
    { id: 'first', n: 'First steps', d: 'Mastered your first unit' },
    { id: 'perfect', n: 'Perfect score', d: 'Scored 100% on a quiz' },
    { id: 'explore10', n: 'Explorer', d: 'Opened 10 lessons' },
    { id: 'streak3', n: '3-day streak', d: 'Learned 3 days in a row' },
    { id: 'streak7', n: '7-day streak', d: 'Learned 7 days in a row' },
    { id: 'hours10', n: '10 hours', d: 'Logged 10 hours of learning' },
    { id: 'hours50', n: '50 hours', d: 'Logged 50 hours of learning' },
    { id: 'master5', n: 'Five down', d: 'Mastered 5 units' },
    { id: 'course', n: 'Course complete', d: 'Finished every unit in a course' },
    { id: 'grade', n: 'Grade complete', d: 'Finished every course in a grade' },
    { id: 'watch10', n: 'Good listener', d: 'Watched 10 video lessons' },
    { id: 'speller', n: 'Spelling star', d: 'Mastered 5 spelling lists' },
    { id: 'bookworm', n: 'Bookworm', d: 'Finished 5 books' },
    { id: 'author', n: 'Young author', d: 'Wrote 5 journal entries' },
    { id: 'hola', n: '¡Hola!', d: 'Mastered 4 Spanish lessons' },
    { id: 'planner', n: 'Plan finisher', d: 'Finished 5 daily plans' },
    { id: 'thinker', n: 'Big thinker', d: 'Answered 4 conundrums' },
    { id: 'quest', n: 'Quest hero', d: 'Finished a Quest and its Show Day' },
    { id: 'weekly', n: 'Friday champion', d: 'Scored 80% or more on 4 weekly quizzes' },
    { id: 'trades', n: 'Trades explorer', d: 'Finished a Career Paths trade pathway' },
    { id: 'coder', n: 'Young coder', d: 'Finished 5 Code Lab lessons' },
    { id: 'hablo', n: '¡Hablo español!', d: 'Mastered every Spanish 2 lesson' }
  ];

  /* ─────────────── tiny helpers ─────────────── */
  const $ = (s, r) => (r || document).querySelector(s);
  function h(tag, attrs) {
    const el = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'style') el.setAttribute('style', v);
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'html') el.innerHTML = v; // only used with static, trusted strings
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (let i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) c.forEach((x) => add(el, x));
    else el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const todayStr = (d) => { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const parseDay = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const fmtDate = (s) => parseDay(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const fmtHours = (min) => (min / 60).toFixed(1);
  const initials = (n) => (n || '?').trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  async function hashPin(pin, salt) {
    const txt = 'lantern|' + salt + '|' + pin;
    try { const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt)); return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join(''); }
    catch (e) { let x = 5381; for (const c of txt) x = ((x << 5) + x + c.charCodeAt(0)) >>> 0; return 'd' + x.toString(16); }
  }

  /* ─────────────── storage: claude.ai account (db) or this device ─────────────── */
  const Store = {
    mode: 'loading', provider: null, prefix: '', uid: null, db: null, user: null, downloads: null, cache: {}, queues: {}, subs: [], salt: 'local',
    path(name) { return this.prefix + name; },
    async init() {
      // Hosted version (e.g. Netlify): family accounts through Firebase when firebase-config.js provides a config.
      if (window.LANTERN_FIREBASE && window.firebase && window.firebase.initializeApp) {
        try {
          if (!window.firebase.apps.length) window.firebase.initializeApp(window.LANTERN_FIREBASE);
          const fs = window.firebase.firestore();
          try { await fs.enablePersistence({ synchronizeTabs: true }); } catch (e) { /* private window or another tab: online-only is fine */ }
          this.db = fs; this.mode = 'auth'; return;
        } catch (e) { console.warn('Firebase setup failed; saving on this device instead.', e); }
      }
      let db = null, user = null, dl = null;
      try {
        if (window.claude && window.claude.use) {
          [db, user, dl] = await Promise.all([window.claude.use('db'), window.claude.use('user'), window.claude.use('downloads')]);
        }
      } catch (e) { /* fall through to device mode */ }
      this.downloads = dl;
      this.user = user;
      const id = user ? await user.id() : null;
      if (db && id) { this.db = db; this.uid = id; this.salt = id; this.mode = 'cloud'; this.provider = 'claude'; this.prefix = 'data/users/' + id + '/'; }
      else { this.mode = 'local'; }
    },
    useFirebase(u) { this.uid = u.uid; this.salt = u.uid; this.prefix = 'families/' + u.uid + '/docs/'; this.mode = 'cloud'; this.provider = 'firebase'; },
    localKey(name) { return 'lantern:' + name; },
    async get(name, tries) {
      tries = tries || 0;
      if (this.mode === 'cloud') {
        try { const s = await this.db.doc(this.path(name)).get(); const v = s.exists ? s.data() : null; this.cache[name] = v ? JSON.parse(JSON.stringify(v)) : null; return this.cache[name]; }
        catch (e) { if (e && e.code === 'unavailable' && tries < 4) { await new Promise((r) => setTimeout(r, 600 + Math.random() * 900)); return this.get(name, tries + 1); } throw e; }
      }
      try { const raw = localStorage.getItem(this.localKey(name)); this.cache[name] = raw ? JSON.parse(raw) : null; } catch (e) { this.cache[name] = this.cache[name] || null; }
      return this.cache[name];
    },
    // Coalesced, one-at-a-time writes per document.
    set(name, data) {
      this.cache[name] = data;
      const q = this.queues[name] || (this.queues[name] = { busy: false, next: null });
      q.next = data;
      if (!q.busy) this._drain(name);
    },
    async _drain(name) {
      const q = this.queues[name];
      q.busy = true;
      while (q.next) {
        const data = q.next; q.next = null;
        if (this.mode === 'cloud') {
          try { await this.db.doc(this.path(name)).set(data); }
          catch (e) {
            if (e && e.code === 'unavailable') { await new Promise((r) => setTimeout(r, 800)); if (!q.next) q.next = data; continue; }
            if (e && (e.code === 'invalid_argument' || e.code === 'not_granted' || e.code === 'revoked')) { this.fallbackToLocal(); this._writeLocal(name, data); continue; }
            if (e && e.code === 'permission-denied') toast('Saving was refused. Check that the Firestore rules from the setup guide are published.');
            else if (e && (e.code === 'quota_exceeded' || e.code === 'resource-exhausted')) toast('Storage is full. Clear old hour logs or check your database plan.');
            else toast('Could not save just now. Your work is kept on this screen; try again shortly.');
          }
        } else this._writeLocal(name, data);
      }
      q.busy = false;
    },
    _writeLocal(name, data) { try { localStorage.setItem(this.localKey(name), JSON.stringify(data)); } catch (e) { /* storage blocked */ } },
    fallbackToLocal() {
      if (this.mode !== 'cloud') return;
      this.mode = 'local'; this.subs.forEach((u) => u()); this.subs = [];
      for (const k in this.cache) if (this.cache[k]) this._writeLocal(k, this.cache[k]);
      toast('This account can only view here, so progress is now saved on this device.');
      render();
    },
    watch(name) {
      if (this.mode !== 'cloud') return;
      if (this.subs[name]) return;
      const unsub = this.db.doc(this.path(name)).onSnapshot((snap) => {
        if (snap.metadata.hasPendingWrites) return;
        const v = snap.exists ? JSON.parse(JSON.stringify(snap.data())) : null;
        if (JSON.stringify(v) === JSON.stringify(this.cache[name])) return;
        const q = this.queues[name]; if (q && (q.busy || q.next)) return;
        this.cache[name] = v; scheduleRender();
      }, () => { /* terminal: keep working from cache */ });
      this.subs[name] = unsub; this.subs.push(unsub);
    },
    async remove(name) {
      delete this.cache[name];
      if (this.mode === 'cloud') { try { await this.db.doc(this.path(name)).delete(); } catch (e) { /* ignore */ } }
      try { localStorage.removeItem(this.localKey(name)); } catch (e) { /* ignore */ }
    }
  };

  /* ─────────────── app state ─────────────── */
  const S = { screen: 'loading', who: null, view: {}, quiz: null, ptab: 'overview', pkid: null, rgrade: null, cgrade: 1 };
  const fam = () => Store.cache.family;
  const kidDoc = (id) => Store.cache['kid-' + id] || (Store.cache['kid-' + id] = { prog: {}, viewed: {}, badges: {}, days: {} });
  const logDoc = (id) => Store.cache['log-' + id] || (Store.cache['log-' + id] = { e: [] });
  const kids = () => (fam() && fam().kids) || [];
  const kidById = (id) => kids().find((k) => k.id === id);
  const settings = () => Object.assign({ passMark: 80, freeRoam: true, yearStart: defaultYearStart(), weeklyGoal: 20 }, (fam() && fam().settings) || {});
  function defaultYearStart() { const d = new Date(); const y = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1; return y + '-08-15'; }
  function saveFamily() { Store.set('family', fam()); }
  function saveKid(id) { Store.set('kid-' + id, kidDoc(id)); }
  function saveLog(id) { Store.set('log-' + id, logDoc(id)); }

  /* ─────────────── progress maths ─────────────── */
  const course = (g, s) => COURSES[g + '-' + s];
  /* Core vs bonus. A learner's grade completion counts the original units of Math, English, Science and
     Social Studies. Units added later, AI & Me and Money Smart are bonus unless the parent counts them
     (per learner, Report cards tab). Bonus work still earns badges, themes and transcript credit. */
  const CORE_SUBJ = { math: 1, ela: 1, sci: 1, soc: 1 };
  const kidPlan = (kidId) => Object.assign({ extra: false, ai: false, fin: false }, (kidById(kidId) || {}).plan || {});
  // Each course has a difficulty path (c.order: unit titles easiest → hardest) and a required set
  // (the original first units plus any unit marked req). Saved progress stays keyed by array index.
  function cmeta(c) {
    if (c._path && c._n === c.u.length) return c;
    const idx = c.u.map((u, i) => i), byT = {}; c.u.forEach((u, i) => { byT[u.t] = i; });
    const path = (c.order || []).map((t) => byT[t]).filter((i) => i != null);
    idx.forEach((i) => { if (!path.includes(i)) path.push(i); });
    c._path = path; c._req = c.u.map((u, i) => (c.core == null ? true : i < c.core || !!u.req)); c._n = c.u.length; return c;
  }
  const coursePath = (c) => cmeta(c)._path;
  function isReqUnit(kidId, g, s, i) { const c = cmeta(course(g, s)), p = kidPlan(kidId); if (CORE_SUBJ[s]) return p.extra || c._req[i]; return !!p[s]; }
  function requiredUnits(kidId, g, s) { const c = course(g, s); return c.u.filter((u, i) => isReqUnit(kidId, g, s, i)).length; }
  function unitMastered(kidId, key) { const kd = kidDoc(kidId); const p = kd.prog[key]; return !!((p && p.best >= settings().passMark) || (kd.done && kd.done[key])); }
  function courseStats(kidId, g, s) {
    const c = course(g, s); const prog = kidDoc(kidId).prog; const reqN = requiredUnits(kidId, g, s); const required = reqN > 0;
    let all = 0, core = 0, sum = 0, tried = 0, next = -1, nextBonus = -1;
    coursePath(c).forEach((i) => {
      const key = g + '-' + s + '-' + i; const p = prog[key]; if (p) { tried++; sum += p.best; } const rq = required && isReqUnit(kidId, g, s, i);
      if (unitMastered(kidId, key)) { all++; if (rq) core++; }
      else if (rq) { if (next < 0) next = i; } else if (nextBonus < 0) nextBonus = i;
    });
    const total = required ? reqN : c.u.length, mastered = required ? core : all;
    return { total, mastered, pct: Math.round((mastered / total) * 100), avg: tried ? Math.round(sum / tried) : null, tried,
      next: next >= 0 ? next : nextBonus, required, reqN, bonusTotal: required ? c.u.length - reqN : 0, bonusMastered: required ? all - core : 0,
      reqDone: required && core === reqN, allDone: all === c.u.length };
  }
  function unlockedThemes(kidId) {
    const out = {};
    const bd = kidDoc(kidId).badges || {};
    THEMES.forEach((t) => { if (t.b) { if (bd[t.b]) out[t.id] = true; return; } for (let g = 1; g <= 12; g++) { if (COURSES[g + '-' + t.s] && courseStats(kidId, g, t.s).pct === 100) { out[t.id] = g; break; } } });
    return out;
  }
  function kidTheme(kidId) { const t = kidDoc(kidId).theme; return t && unlockedThemes(kidId)[t] ? t : null; }
  function gradeStats(kidId, g) {
    const cs = SUBJ.map((s) => courseStats(kidId, g, s.k));
    const rq = cs.filter((c) => c.required);
    const pct = rq.length ? Math.round(rq.reduce((a, c) => a + c.pct, 0) / rq.length) : 0;
    const tried = rq.reduce((a, c) => a + c.tried, 0);
    const sum = rq.reduce((a, c) => a + (c.avg != null ? c.avg * c.tried : 0), 0);
    const bonus = cs.reduce((a, c) => { if (c.required) { a.m += c.bonusMastered; a.t += c.bonusTotal; } else { a.m += c.mastered; a.t += c.total; } return a; }, { m: 0, t: 0 });
    return { pct, avg: tried ? Math.round(sum / tried) : null, courses: cs, mastered: rq.reduce((a, c) => a + c.mastered, 0), total: rq.reduce((a, c) => a + c.total, 0), bonusMastered: bonus.m, bonusTotal: bonus.t };
  }
  // Weekly hours goal: by grade band (default) or one number for everyone.
  const GOAL_BANDS = [[2, 8], [5, 10], [8, 12], [12, 15]];
  const gradeGoal = (g) => GOAL_BANDS.find((b) => g <= b[0])[1];
  const goalFor = (kidId) => { const st = settings(); const k = kidById(kidId); return st.goalAuto === false || !k ? st.weeklyGoal : gradeGoal(k.grade); };
  function minutes(kidId, filter) { return logDoc(kidId).e.filter(filter || (() => true)).reduce((a, e) => a + (e.m || 0), 0); }
  function weekStart() { const d = new Date(); const day = (d.getDay() + 6) % 7; d.setDate(d.getDate() - day); return todayStr(d); }
  const minutesWeek = (id) => minutes(id, (e) => e.d >= weekStart());
  const minutesYear = (id) => minutes(id, (e) => e.d >= settings().yearStart);
  function streak(kidId) {
    const days = kidDoc(kidId).days || {}; let n = 0; const d = new Date();
    if (!days[todayStr(d)]) d.setDate(d.getDate() - 1);
    while (days[todayStr(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function lastActive(kidId) { const ds = Object.keys(kidDoc(kidId).days || {}).sort(); return ds.length ? ds[ds.length - 1] : null; }

  function checkBadges(kidId) {
    const k = kidDoc(kidId); k.badges = k.badges || {}; const got = [];
    const prog = Object.values(k.prog); const pass = settings().passMark;
    const masteredN = prog.filter((p) => p.best >= pass).length;
    const totalMin = minutes(kidId); const st = streak(kidId);
    const earn = (id, ok) => { if (ok && !k.badges[id]) { k.badges[id] = Date.now(); got.push(id); } };
    earn('first', masteredN >= 1); earn('perfect', prog.some((p) => p.best === 100));
    earn('explore10', Object.keys(k.viewed || {}).length >= 10);
    earn('streak3', st >= 3); earn('streak7', st >= 7);
    earn('hours10', totalMin >= 600); earn('hours50', totalMin >= 3000); earn('master5', masteredN >= 5);
    let anyCourse = false, anyGrade = false;
    for (let g = 1; g <= 12; g++) { const gs = gradeStats(kidId, g); if (gs.courses.some((c) => c.pct === 100)) anyCourse = true; if (gs.pct === 100) anyGrade = true; }
    earn('course', anyCourse); earn('grade', anyGrade);
    earn('watch10', Object.keys(k.watched || {}).length >= 10);
    const lit = litDoc(kidId);
    earn('speller', Object.values(lit.spell || {}).filter((x) => x.best >= pass).length >= 5);
    earn('bookworm', booksFinished(kidId) >= 5); earn('author', (lit.jr || []).length >= 5);
    earn('hola', esMastered(kidId) >= 4); earn('hablo', ES2.units.length > 0 && es2Mastered(kidId) >= ES2.units.length);
    const dd = dayDoc(kidId); earn('planner', Object.values(dd.days || {}).filter((r) => r.celebrated).length >= 5); earn('thinker', Object.keys(dd.con || {}).length >= 4); earn('quest', ((dd.q || {}).hist || []).length >= 1);
    { const cd = dd.code || {}, L = window.LH_CODE || { blocks: [], python: [] }; const nb = L.blocks.filter((x) => { const r = (cd.b || {})[x.id]; return r && r.best >= pass && (r.un || r.cdo); }).length; const np = L.python.filter((x) => x.ex.every((e) => (((cd.p || {})[x.id] || {})[e.id] || {}).ok)).length; earn('coder', nb + np >= 5); }
    earn('trades', Object.values(dd.car || {}).some((t) => t && t.done));
    earn('weekly', Object.values(dd.weeks || {}).filter((w) => w.quiz && w.quiz.first.score >= 80).length >= 4);
    if (got.length) { saveKid(kidId); got.forEach((id) => { toast('Badge earned: ' + BADGES.find((b) => b.id === id).n, 'badge'); THEMES.filter((t) => t.b === id).forEach((t) => toast('New background unlocked: ' + t.n + '! Pick it in My themes.', 'badge')); }); }
  }

  /* ─────────────── learning-time tracker ─────────────── */
  const Timer = {
    on: null, last: 0, pending: {}, tick: null,
    start(kidId, subj) { this.stop(); this.on = { kidId, subj }; this.last = Date.now(); this.tick = setInterval(() => this.accrue(), 15000); markActive(kidId); },
    accrue() { if (!this.on) return; const now = Date.now(); if (document.visibilityState === 'visible') { const key = this.on.kidId + '|' + todayStr() + '|' + this.on.subj; this.pending[key] = (this.pending[key] || 0) + Math.min(now - this.last, 60000) / 1000; } this.last = now; updateTimerChip(); },
    stop() { if (this.on) { this.accrue(); this.flush(); } clearInterval(this.tick); this.on = null; },
    secondsToday(kidId) { let s = 0; for (const k in this.pending) if (k.startsWith(kidId + '|' + todayStr())) s += this.pending[k]; return s; },
    flush() {
      const touched = new Set();
      for (const key in this.pending) {
        const sec = this.pending[key]; const min = Math.floor(sec / 60); if (!min) continue;
        this.pending[key] = sec - min * 60;
        const [kidId, d, s] = key.split('|'); const log = logDoc(kidId);
        let e = log.e.find((x) => x.auto && x.d === d && x.s === s);
        if (!e) { e = { id: uid(), d, s, m: 0, auto: true, n: 'Lessons and quizzes in Lantern' }; log.e.push(e); }
        e.m += min; touched.add(kidId);
      }
      touched.forEach((id) => { saveLog(id); checkBadges(id); });
    }
  };
  document.addEventListener('visibilitychange', () => { if (Timer.on) { Timer.accrue(); if (document.visibilityState === 'hidden') Timer.flush(); else Timer.last = Date.now(); } });
  function markActive(kidId) { const k = kidDoc(kidId); k.days = k.days || {}; const t = todayStr(); if (!k.days[t]) { k.days[t] = 1; saveKid(kidId); checkBadges(kidId); } }
  function updateTimerChip() { const el = $('#timer-chip'); if (el && Timer.on) { const id = Timer.on.kidId; const m = minutes(id, (e) => e.d === todayStr()) + Math.floor(Timer.secondsToday(id) / 60); el.textContent = m + ' min learned today'; } }

  /* ─────────────── toasts ─────────────── */
  function toast(msg, kind) {
    let wrap = $('#toasts'); if (!wrap) { wrap = h('div', { id: 'toasts', 'aria-live': 'polite' }); document.body.appendChild(wrap); }
    const t = h('div', { class: 'toast' + (kind ? ' ' + kind : '') }, msg); wrap.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3800);
  }

  /* ─────────────── rendering ─────────────── */
  let renderQueued = false;
  function scheduleRender() {
    const a = document.activeElement;
    if ((a && /INPUT|SELECT|TEXTAREA/.test(a.tagName)) || Player.playing) { S.dirty = true; return; }
    if (renderQueued) return; renderQueued = true; requestAnimationFrame(() => { renderQueued = false; render(); });
  }
  document.addEventListener('focusout', () => { if (S.dirty) { S.dirty = false; setTimeout(scheduleRender, 50); } });

  function go(screen, view) { lumiClose(); Player.stop(); if (!['lesson', 'quiz', 'spell', 'journal', 'spanish'].includes(screen)) Timer.stop(); S.screen = screen; S.view = view || {}; render(); window.scrollTo(0, 0); }

  function render() {
    const root = $('#app'); root.innerHTML = '';
    const scr = {
      loading: viewLoading, auth: viewAuth, setup: viewSetup, picker: viewPicker, pin: viewPin,
      home: viewKidHome, course: viewCourse, lesson: viewLesson, quiz: viewQuiz, result: viewResult, parent: viewParent, spell: viewSpell, reading: viewReading, journal: viewJournal, spanish: viewSpanish, mq: viewMQ, conundrum: viewConundrum, quest: viewQuest, career: viewCareer, code: viewCode
    }[S.screen] || viewPicker;
    if (S.who) Player.applyKid(S.who);
    root.appendChild(scr());
    const th = S.who && ['home', 'course', 'lesson', 'quiz', 'result', 'spell', 'reading', 'journal', 'spanish', 'mq', 'conundrum', 'quest', 'career', 'code'].includes(S.screen) ? kidTheme(S.who) : null;
    if (th) document.body.dataset.kidtheme = th; else delete document.body.dataset.kidtheme;
    updateTimerChip();
  }

  function topbar(right) {
    const f = fam();
    return h('header', { class: 'topbar' },
      h('div', { class: 'brand' }, h('span', { class: 'lamp', 'aria-hidden': 'true' }), h('div', null, h('div', { class: 'brand-name' }, (f && f.name) || 'Lantern Homeschool'), h('div', { class: 'brand-sub' }, 'Self-paced school · grades 1–12'))),
      h('div', { class: 'top-right' }, right));
  }
  function avatar(k, size) { return h('span', { class: 'avatar' + (size ? ' ' + size : ''), style: '--av:' + (k.color || COLORS[0]) }, initials(k.name)); }
  function ring(pct, label, size) {
    const r = 42, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    const wrap = h('div', { class: 'ring ' + (size || ''), role: 'img', 'aria-label': (label || 'Progress') + ' ' + pct + '%' });
    wrap.innerHTML = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="${r}" class="ring-bg"/><circle cx="50" cy="50" r="${r}" class="ring-fg" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 50 50)"/></svg>`;
    wrap.appendChild(h('div', { class: 'ring-num' }, h('b', null, pct + '%'), label ? h('small', null, label) : null));
    return wrap;
  }
  function bar(pct, cls) { return h('div', { class: 'bar ' + (cls || ''), role: 'progressbar', 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('i', { style: 'width:' + pct + '%' })); }
  function modeBanner() {
    if (Store.mode === 'local') return h('div', { class: 'banner' }, h('b', null, 'Saved on this device only. '), window.claude ? 'Progress is kept in this browser. Sign in to Claude with the family account to sync across devices.' : 'Progress is kept in this browser. Clearing browser data erases it.');
    return null;
  }

  /* ── loading ── */
  function viewLoading() { return h('main', { class: 'center-screen' }, h('div', { class: 'lamp big pulse', 'aria-hidden': 'true' }), h('p', { class: 'muted' }, 'Opening your school…')); }

  /* ── family account sign-in (hosted version with Firebase) ── */
  function authError(x) {
    const c = (x && x.code) || '';
    if (c === 'mismatch') return 'The two passwords do not match.';
    if (c === 'auth/email-already-in-use') return 'That email already has an account. Sign in instead.';
    if (c === 'auth/invalid-email') return 'Enter a valid email address.';
    if (c === 'auth/weak-password') return 'Choose a password with at least 6 characters.';
    if (c === 'auth/invalid-credential' || c === 'auth/wrong-password' || c === 'auth/user-not-found' || c === 'auth/invalid-login-credentials') return 'The email or password is not right.';
    if (c === 'auth/too-many-requests') return 'Too many tries. Wait a few minutes, then try again.';
    if (c === 'auth/network-request-failed') return 'No internet connection. Check your connection and try again.';
    if (c === 'auth/operation-not-allowed') return 'Email sign-in is turned off for this site. The site owner needs to enable it in Firebase.';
    return 'Something went wrong (' + (c || 'unknown error') + '). Try again.';
  }
  function viewAuth() {
    const v = S.view; v.mode = v.mode || 'in';
    const isUp = v.mode === 'up', isReset = v.mode === 'reset';
    const form = h('form', { class: 'card form', onsubmit: async (e) => {
      e.preventDefault();
      const email = $('#a-email').value.trim(); const pw = isReset ? '' : $('#a-pw').value; const err = $('#a-err'); err.textContent = '';
      const btn = form.querySelector('button[type=submit]'); btn.disabled = true;
      try {
        const auth = window.firebase.auth();
        if (isReset) { await auth.sendPasswordResetEmail(email); toast('Check your email for a link to reset your password.'); S.view = { mode: 'in' }; render(); return; }
        if (isUp) { if (pw !== $('#a-pw2').value) throw { code: 'mismatch' }; await auth.createUserWithEmailAndPassword(email, pw); }
        else await auth.signInWithEmailAndPassword(email, pw);
      } catch (x) { err.textContent = authError(x); btn.disabled = false; }
    } },
      h('label', { for: 'a-email' }, 'Email'), h('input', { id: 'a-email', type: 'email', autocomplete: 'email', required: true }),
      isReset ? null : [h('label', { for: 'a-pw' }, 'Password'), h('input', { id: 'a-pw', type: 'password', autocomplete: isUp ? 'new-password' : 'current-password', minlength: 6, required: true })],
      isUp ? [h('label', { for: 'a-pw2' }, 'Repeat password'), h('input', { id: 'a-pw2', type: 'password', autocomplete: 'new-password', required: true })] : null,
      h('p', { id: 'a-err', class: 'err', role: 'alert' }),
      h('button', { class: 'btn primary', type: 'submit' }, isUp ? 'Create account' : isReset ? 'Send reset link' : 'Sign in'));
    const links = v.mode === 'in'
      ? [h('button', { class: 'btn ghost', type: 'button', onclick: () => { S.view = { mode: 'up' }; render(); } }, 'Create a family account'), h('button', { class: 'btn ghost', type: 'button', onclick: () => { S.view = { mode: 'reset' }; render(); } }, 'Forgot password?')]
      : [h('button', { class: 'btn ghost', type: 'button', onclick: () => { S.view = { mode: 'in' }; render(); } }, 'I already have an account')];
    const main = h('main', { class: 'narrow' },
      h('div', { class: 'setup-head' }, h('span', { class: 'lamp big', 'aria-hidden': 'true' }),
        h('h1', null, isUp ? 'Create your family account' : isReset ? 'Reset your password' : 'Sign in to your homeschool'),
        h('p', { class: 'lede' }, isUp ? 'One account per family. Next you set a parent PIN and add each learner with their own PIN.' : isReset ? 'Enter your email and we will send a link to choose a new password.' : 'Use your family account. Learners pick their name and PIN after you sign in.')),
      form, h('div', { class: 'actions' }, links));
    return h('div', null, topbar(), main);
  }
  function signOut() { Player.stop(); Timer.stop(); window.firebase.auth().signOut().then(() => location.reload(), () => location.reload()); }

  /* ── first-run setup ── */
  function viewSetup() {
    const v = S.view; v.step = v.step || 1;
    const main = h('main', { class: 'narrow' });
    main.appendChild(h('div', { class: 'setup-head' }, h('span', { class: 'lamp big', 'aria-hidden': 'true' }), h('h1', null, 'Set up your homeschool'), h('p', { class: 'lede' }, 'Create the parent login, then add each learner with their own PIN. It takes about two minutes.')));
    add(main, modeBanner());
    const steps = h('ol', { class: 'steps' }, ['School & parent PIN', 'Add learners'].map((t, i) => h('li', { class: v.step === i + 1 ? 'on' : v.step > i + 1 ? 'done' : '' }, t)));
    main.appendChild(steps);
    if (v.step === 1) {
      const form = h('form', { class: 'card form', onsubmit: async (e) => {
        e.preventDefault();
        const name = $('#f-name').value.trim(), p1 = $('#f-pin').value.trim(), p2 = $('#f-pin2').value.trim();
        const err = $('#f-err');
        if (!name) return (err.textContent = 'Give your school a name.');
        if (!/^\d{4,6}$/.test(p1)) return (err.textContent = 'The parent PIN must be 4 to 6 digits.');
        if (p1 !== p2) return (err.textContent = 'The two PINs do not match.');
        Store.cache.family = { v: 1, name, parentPin: await hashPin(p1, Store.salt), parentPinLen: p1.length, created: Date.now(), settings: { passMark: 80, freeRoam: true, yearStart: defaultYearStart(), weeklyGoal: 20 }, kids: [] };
        saveFamily(); S.view = { step: 2 }; render();
      } },
        h('label', { for: 'f-name' }, 'School name'), h('input', { id: 'f-name', required: true, placeholder: 'e.g. Rivera Family Academy', maxlength: 48, autocomplete: 'off' }),
        h('div', { class: 'row2' },
          h('div', null, h('label', { for: 'f-pin' }, 'Parent PIN (4–6 digits)'), h('input', { id: 'f-pin', type: 'password', inputmode: 'numeric', maxlength: 6, autocomplete: 'new-password' })),
          h('div', null, h('label', { for: 'f-pin2' }, 'Repeat PIN'), h('input', { id: 'f-pin2', type: 'password', inputmode: 'numeric', maxlength: 6, autocomplete: 'new-password' }))),
        h('p', { class: 'hint' }, 'The parent PIN opens the parent portal: reports, hours, settings. Keep it private from your learners.'),
        h('p', { id: 'f-err', class: 'err', role: 'alert' }),
        h('button', { class: 'btn primary', type: 'submit' }, 'Continue'));
      main.appendChild(form);
    } else {
      main.appendChild(kidList(true));
      main.appendChild(kidForm(null, () => render()));
      main.appendChild(h('div', { class: 'actions' }, h('button', { class: 'btn primary', disabled: kids().length ? null : true, onclick: () => go('picker') }, kids().length ? 'Finish setup' : 'Add at least one learner')));
    }
    return h('div', null, topbar(), main);
  }
  function kidList(compact) {
    if (!kids().length) return h('p', { class: 'muted' }, 'No learners yet.');
    return h('ul', { class: 'kid-list' }, kids().map((k) => h('li', null, avatar(k), h('div', null, h('b', null, k.name), h('div', { class: 'muted small' }, GRADE_NAME(k.grade))))));
  }
  function kidForm(kid, done) {
    const isNew = !kid; const id = isNew ? 'new' : kid.id; let color = (kid && kid.color) || COLORS[kids().length % COLORS.length];
    const sw = h('div', { class: 'swatches', role: 'radiogroup', 'aria-label': 'Avatar color' }, COLORS.map((c) => h('button', { type: 'button', class: 'swatch' + (c === color ? ' on' : ''), style: '--sw:' + c, 'aria-label': 'Color ' + c, role: 'radio', 'aria-checked': c === color ? 'true' : 'false', onclick: (e) => { color = c; sw.querySelectorAll('.swatch').forEach((b) => { b.classList.remove('on'); b.setAttribute('aria-checked', 'false'); }); e.currentTarget.classList.add('on'); e.currentTarget.setAttribute('aria-checked', 'true'); } })));
    const gradeSel = h('select', { id: 'k-grade-' + id }, Array.from({ length: 12 }, (_, i) => h('option', { value: i + 1, selected: kid && kid.grade === i + 1 ? true : null }, GRADE_NAME(i + 1))));
    return h('form', { class: 'card form', onsubmit: async (e) => {
      e.preventDefault();
      const name = $('#k-name-' + id).value.trim(), grade = Number(gradeSel.value), pin = $('#k-pin-' + id).value.trim(); const err = $('#k-err-' + id);
      if (!name) return (err.textContent = 'Enter the learner\'s first name.');
      if (isNew && !/^\d{4}$/.test(pin)) return (err.textContent = 'Choose a 4-digit PIN for this learner.');
      if (!isNew && pin && !/^\d{4}$/.test(pin)) return (err.textContent = 'A new PIN must be 4 digits, or leave it blank to keep the current one.');
      if (isNew) {
        const k = { id: uid(), name, grade, color, pin: await hashPin(pin, Store.salt), created: Date.now() };
        fam().kids.push(k); Store.cache['kid-' + k.id] = { prog: {}, viewed: {}, badges: {}, days: {} }; Store.cache['log-' + k.id] = { e: [] };
        saveFamily(); saveKid(k.id); saveLog(k.id); toast(name + ' was added.');
      } else {
        Object.assign(kid, { name, grade, color }); if (pin) kid.pin = await hashPin(pin, Store.salt); saveFamily(); toast('Saved ' + name + '.');
      }
      done && done();
    } },
      h('h3', null, isNew ? 'Add a learner' : 'Edit ' + kid.name),
      h('div', { class: 'row2' },
        h('div', null, h('label', { for: 'k-name-' + id }, 'First name'), h('input', { id: 'k-name-' + id, value: kid ? kid.name : '', maxlength: 32, autocomplete: 'off' })),
        h('div', null, h('label', { for: 'k-grade-' + id }, 'Grade level'), gradeSel)),
      h('div', { class: 'row2' },
        h('div', null, h('label', { for: 'k-pin-' + id }, isNew ? 'Learner PIN (4 digits)' : 'New PIN (optional)'), h('input', { id: 'k-pin-' + id, type: 'password', inputmode: 'numeric', maxlength: 4, autocomplete: 'new-password' })),
        h('div', null, h('span', { class: 'label' }, 'Avatar color'), sw)),
      h('p', { id: 'k-err-' + id, class: 'err', role: 'alert' }),
      h('button', { class: 'btn primary', type: 'submit' }, isNew ? 'Add learner' : 'Save changes'));
  }

  /* ── who's learning ── */
  function viewPicker() {
    const main = h('main', { class: 'wrap' });
    add(main, modeBanner());
    main.appendChild(h('h1', { class: 'picker-title' }, 'Who\'s learning today?'));
    const grid = h('div', { class: 'picker' });
    kids().forEach((k) => {
      const gs = gradeStats(k.id, k.grade);
      grid.appendChild(h('button', { class: 'pick', onclick: () => go('pin', { who: k.id }) }, avatar(k, 'xl'), h('span', { class: 'pick-name' }, k.name), h('span', { class: 'pick-sub' }, GRADE_NAME(k.grade) + ' · ' + gs.pct + '% done')));
    });
    grid.appendChild(h('button', { class: 'pick parent', onclick: () => go('pin', { who: 'parent' }) }, h('span', { class: 'avatar xl parent-av', 'aria-hidden': 'true' }, h('span', { class: 'key' })), h('span', { class: 'pick-name' }, 'Parent portal'), h('span', { class: 'pick-sub' }, 'Reports, hours, settings')));
    main.appendChild(grid);
    return h('div', null, topbar(), main);
  }

  /* ── PIN pad ── */
  function viewPin() {
    const who = S.view.who; const isParent = who === 'parent'; const k = isParent ? null : kidById(who);
    const len = isParent ? fam().parentPinLen || 4 : 4; let entry = '';
    const dots = h('div', { class: 'dots', 'aria-hidden': 'true' });
    const status = h('p', { class: 'err', role: 'alert' });
    const live = h('span', { class: 'sr-only', 'aria-live': 'polite' });
    const draw = () => { dots.innerHTML = ''; for (let i = 0; i < len; i++) dots.appendChild(h('i', { class: i < entry.length ? 'f' : '' })); live.textContent = entry.length + ' of ' + len + ' digits'; };
    const check = async () => {
      const hash = await hashPin(entry, Store.salt);
      if (hash === (isParent ? fam().parentPin : k.pin)) {
        if (isParent) { S.ptab = 'overview'; go('parent'); } else { S.who = k.id; go('home'); }
      } else { status.textContent = 'That PIN is not right. Try again.'; entry = ''; draw(); dots.classList.add('shake'); setTimeout(() => dots.classList.remove('shake'), 400); }
    };
    const press = (d) => { status.textContent = ''; if (d === 'del') entry = entry.slice(0, -1); else if (entry.length < len) entry += d; draw(); if (entry.length === len) check(); };
    const pad = h('div', { class: 'pad' }, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((d) => d === '' ? h('span') : h('button', { type: 'button', class: 'key-btn' + (d === 'del' ? ' del' : ''), 'aria-label': d === 'del' ? 'Delete digit' : d, onclick: () => press(d) }, d === 'del' ? '⌫' : d)));
    const onKey = (e) => { if (S.screen !== 'pin') return document.removeEventListener('keydown', onKey); if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('del'); else if (e.key === 'Escape') go('picker'); };
    document.addEventListener('keydown', onKey);
    draw();
    const main = h('main', { class: 'pin-screen' },
      isParent ? h('span', { class: 'avatar xl parent-av', 'aria-hidden': 'true' }, h('span', { class: 'key' })) : avatar(k, 'xl'),
      h('h1', null, isParent ? 'Parent portal' : 'Hi, ' + k.name + '!'),
      h('p', { class: 'muted' }, 'Enter your ' + len + '-digit PIN'), dots, live, status, pad,
      h('div', { class: 'pin-foot' }, h('button', { class: 'btn ghost', onclick: () => go('picker') }, 'Back'), isParent ? h('button', { class: 'btn ghost', onclick: () => go('pin', { who: 'parent', forgot: true }) }, 'Forgot PIN?') : null));
    if (isParent && S.view.forgot) main.appendChild(forgotBox());
    return h('div', null, topbar(), main);
  }
  function forgotBox() {
    return h('form', { class: 'card form forgot', onsubmit: async (e) => {
      e.preventDefault(); const n = $('#fg-name').value.trim(), p = $('#fg-pin').value.trim(), err = $('#fg-err');
      if (n !== fam().name) return (err.textContent = 'The school name does not match exactly.');
      if (!/^\d{4,6}$/.test(p)) return (err.textContent = 'The new PIN must be 4 to 6 digits.');
      fam().parentPin = await hashPin(p, Store.salt); fam().parentPinLen = p.length; saveFamily(); toast('Parent PIN reset.'); go('pin', { who: 'parent' });
    } }, h('h3', null, 'Reset the parent PIN'), h('p', { class: 'hint' }, 'Type your school name exactly as it appears at the top of the page, then choose a new PIN.'),
      h('label', { for: 'fg-name' }, 'School name'), h('input', { id: 'fg-name', autocomplete: 'off' }),
      h('label', { for: 'fg-pin' }, 'New parent PIN'), h('input', { id: 'fg-pin', type: 'password', inputmode: 'numeric', maxlength: 6, autocomplete: 'new-password' }),
      h('p', { id: 'fg-err', class: 'err', role: 'alert' }), h('button', { class: 'btn primary', type: 'submit' }, 'Reset PIN'));
  }

  /* ── learner screens ── */
  function kidBar() {
    const k = kidById(S.who);
    return topbar([h('span', { id: 'timer-chip', class: 'chip', hidden: Timer.on ? null : true }), h('span', { class: 'who' }, avatar(k, 'sm'), h('span', { class: 'who-name' }, k.name)), h('button', { class: 'btn ghost sm', onclick: () => { S.who = null; go('picker'); } }, 'Switch user')]);
  }
  const ACCENT = { US: 'American', GB: 'British', AU: 'Australian', IN: 'Indian', CA: 'Canadian', IE: 'Irish', NZ: 'New Zealand', ZA: 'South African', NG: 'Nigerian', KE: 'Kenyan', PH: 'Filipino', SG: 'Singaporean', HK: 'Hong Kong', TZ: 'Tanzanian' };
  const voiceLabel = (v) => { const cc = (v.lang.split(/[-_]/)[1] || '').toUpperCase(); const nm = v.name.replace(/^(Microsoft|Google|Apple)\s+/i, '').replace(/\s*Online \(Natural\)/i, ' (natural)').replace(/\s*-\s*English.*$/i, '').replace(/\s*\(.*English.*\)$/i, ''); return nm + (ACCENT[cc] ? ' · ' + ACCENT[cc] : ''); };
  function voicePicker(k) {
    const kd = kidDoc(k.id), pv = kd.voice || {}, vs = Player.englishVoices();
    const save = (patch) => { kd.voice = Object.assign({}, kd.voice, patch); saveKid(k.id); Player.applyKid(k.id); };
    const preview = () => say('Hi ' + k.name + '! This is the voice that will read your lessons and spelling words.', 1);
    if (!Player.synth) return h('p', { class: 'muted small' }, 'This browser can\'t read aloud, so there are no voices to choose from.');
    const sel = h('select', { id: 'vp-voice', onchange: (e) => { save({ name: e.target.value || null }); preview(); } },
      h('option', { value: '' }, 'Automatic (best on this device)'),
      vs.slice().sort((a, b) => voiceLabel(a).localeCompare(voiceLabel(b))).map((v) => h('option', { value: v.name, selected: pv.name === v.name ? true : null }, voiceLabel(v))));
    const rate = pv.rate || Player.rate || 1;
    return h('section', { class: 'card voice-card' },
      h('div', { class: 'row2' },
        h('div', null, h('label', { for: 'vp-voice' }, 'Voice'), vs.length ? sel : h('p', { class: 'small muted' }, 'Voices are still loading. Come back in a moment.'),
          pv.name && !vs.some((v) => v.name === pv.name) && vs.length ? h('p', { class: 'small muted' }, 'Your saved voice isn\'t on this device, so the automatic voice is used here.') : null),
        h('div', null, h('span', { class: 'label' }, 'Speed'), h('div', { class: 'speed-row', role: 'radiogroup', 'aria-label': 'Reading speed' },
          [[0.8, 'Slower'], [1, 'Normal'], [1.2, 'Faster']].map(([r, n]) => h('button', { type: 'button', role: 'radio', 'aria-checked': rate === r ? 'true' : 'false', class: 'chip-btn' + (rate === r ? ' on' : ''), onclick: () => { save({ rate: r }); render(); setTimeout(preview, 50); } }, n))))),
      h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn primary sm', onclick: preview }, icon('voice'), ' Hear my voice'),
        h('span', { class: 'small muted' }, 'Used for video lessons, spelling words and "Hear it" buttons on this device.')));
  }
  function viewKidHome() {
    const k = kidById(S.who); if (!k) return viewPicker();
    const g = S.view.grade || k.grade; const gs = gradeStats(k.id, g); const kd = kidDoc(k.id);
    const main = h('main', { class: 'wrap' });
    add(main, modeBanner());
    const st = streak(k.id), wk = minutesWeek(k.id);
    main.appendChild(h('section', { class: 'hero-card' },
      ring(gs.pct, 'of ' + GRADE_NAME(g), 'lg'),
      h('div', { class: 'hero-text' },
        h('p', { class: 'eyebrow' }, GRADE_NAME(g) + (g !== k.grade ? ' · exploring' : '')),
        h('h1', null, greeting() + ', ' + k.name + '.'),
        h('p', { class: 'lede' }, gs.mastered + ' of ' + gs.total + ' units mastered' + (gs.bonusMastered ? ' · ' + gs.bonusMastered + ' bonus' : '') + (gs.avg != null ? ' · average quiz score ' + gs.avg + '%' : '')),
        h('div', { class: 'stat-row' },
          stat(st + (st === 1 ? ' day' : ' days'), 'streak'), stat(fmtHours(wk) + ' / ' + goalFor(k.id) + ' h', 'this week'), stat(Object.keys(kd.badges || {}).length + '/' + BADGES.length, 'badges')),
        settings().freeRoam ? h('div', { class: 'grade-switch' }, h('label', { for: 'gsel' }, 'Grade'), h('select', { id: 'gsel', onchange: (e) => { S.view.grade = Number(e.target.value); render(); } }, Array.from({ length: 12 }, (_, i) => h('option', { value: i + 1, selected: g === i + 1 ? true : null }, GRADE_NAME(i + 1) + (i + 1 === k.grade ? ' (my grade)' : ''))))) : null)));
    if (g === k.grade) { main.appendChild(todayCard(k)); main.appendChild(h('div', { class: 'two-col' }, weekCard(k), questCard(k))); if (carOn(k)) main.appendChild(carCard(k)); const cc = codeCard(k); if (cc) main.appendChild(cc); }
    main.appendChild(h('h2', { class: 'sec' }, 'Your subjects'));
    main.appendChild(h('div', { class: 'subjects' }, SUBJ.map((s, i) => {
      const c = course(g, s.k), cs = gs.courses[i]; const nextU = cs.next >= 0 ? c.u[cs.next] : null;
      const bonusNext = nextU && cs.reqDone;
      return h('article', { class: 'subj ' + s.c + (cs.required ? '' : ' is-bonus') },
        h('div', { class: 'subj-top' }, h('span', { class: 'subj-tag' }, s.n), cs.required ? null : h('span', { class: 'bonus-tag' }, 'Bonus'), h('span', { class: 'subj-pct' }, cs.pct + '%')),
        h('h3', null, c.t), bar(cs.pct, s.c),
        h('p', { class: 'muted small' }, cs.mastered + '/' + cs.total + ' units' + (cs.bonusTotal ? ' · bonus ' + cs.bonusMastered + '/' + cs.bonusTotal : '') + (cs.avg != null ? ' · avg ' + cs.avg + '%' : '')),
        h('div', { class: 'subj-actions' },
          cs.reqDone || (!nextU) ? h('span', { class: 'done-pill' }, 'Course complete') : null,
          nextU ? h('button', { class: 'btn ' + (bonusNext ? 'ghost' : 'primary') + ' sm', onclick: () => go('lesson', { g, s: s.k, i: cs.next }) }, bonusNext ? 'Bonus' : cs.tried ? 'Continue' : 'Start', h('span', { class: 'next-u' }, ': ' + nextU.t)) : null,
          h('button', { class: 'btn ghost sm', onclick: () => go('course', { g, s: s.k }) }, 'All units')));
    })));
    const un = unlockedThemes(k.id), cur = kidTheme(k.id);
    main.appendChild(h('h2', { class: 'sec' }, 'Reading, writing & Spanish'));
    main.appendChild(litCards(k));
    main.appendChild(h('h2', { class: 'sec' }, 'My themes'));
    main.appendChild(h('ul', { class: 'themes' },
      h('li', null, h('button', { type: 'button', class: 'theme-card' + (!cur ? ' on' : ''), 'aria-pressed': !cur ? 'true' : 'false', onclick: () => { kd.theme = null; saveKid(k.id); render(); } }, h('span', { class: 'sw th-default', 'aria-hidden': 'true' }), h('b', null, 'Classic'), h('small', null, 'The original Lantern look'))),
      THEMES.map((t) => { const got = un[t.id], sn = SUBJ_NAME[t.s];
        return h('li', null, h('button', { type: 'button', class: 'theme-card' + (cur === t.id ? ' on' : '') + (got ? '' : ' locked'), disabled: got ? null : true, 'aria-pressed': cur === t.id ? 'true' : 'false', onclick: () => { kd.theme = t.id; saveKid(k.id); render(); } },
          h('span', { class: 'sw th-' + t.id, 'aria-hidden': 'true' }), got ? null : h('span', { class: 'lock', 'aria-hidden': 'true', html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1zm2 0h6V7a3 3 0 0 0-6 0v3z"/></svg>' }),
          h('b', null, t.n), h('small', null, got ? t.d : t.b ? 'Earn the "' + (BADGES.find((x) => x.id === t.b) || {}).n + '" badge to unlock' : 'Finish any ' + sn + ' course to unlock'))); })));
    main.appendChild(h('h2', { class: 'sec' }, 'My reading voice'));
    main.appendChild(voicePicker(k));
    main.appendChild(h('h2', { class: 'sec' }, 'Badges'));
    main.appendChild(h('ul', { class: 'badges' }, BADGES.map((b) => { const on = kd.badges && kd.badges[b.id]; return h('li', { class: 'badge' + (on ? ' on' : '') }, h('span', { class: 'medal', 'aria-hidden': 'true' }), h('b', null, b.n), h('small', null, on ? 'Earned ' + new Date(on).toLocaleDateString() : b.d)); })));
    return h('div', null, kidBar(), main);
  }
  function stat(v, l) { return h('div', { class: 'stat' }, h('b', null, v), h('small', null, l)); }
  function greeting() { const hr = new Date().getHours(); return hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening'; }

  function unitStatus(kidId, g, s, i) {
    const kd = kidDoc(kidId), key = g + '-' + s + '-' + i; const p = kd.prog[key]; const pass = settings().passMark;
    if (kd.done && kd.done[key] && !(p && p.best >= pass)) return { cls: 'mastered', t: 'Complete · marked by parent' };
    if (!p) return kidDoc(kidId).viewed[g + '-' + s + '-' + i] ? { cls: 'open', t: 'Started' } : { cls: 'new', t: 'Not started' };
    if (p.best >= pass) { const ck = checkState(kidId, key), tg = (dayDoc(kidId).taught || {})[key];
      if (tg) return { cls: 'mastered', t: 'Teacher ★ · ' + p.best + '%' };
      if (ck && ck.strong) return { cls: 'mastered', t: 'Strong ✓✓ · ' + p.best + '%' };
      if (ck && ck.weak) return { cls: 'trying', t: 'Review needed · best ' + p.best + '%' }; }
    return p.best >= pass ? { cls: 'mastered', t: 'Mastered · ' + p.best + '%' } : { cls: 'trying', t: 'Best ' + p.best + '% · keep going' };
  }
  function viewCourse() {
    const { g, s } = S.view; const c = course(g, s); const kidId = S.who; const cs = courseStats(kidId, g, s); const sm = SUBJ.find((x) => x.k === s);
    const main = h('main', { class: 'wrap' },
      h('button', { class: 'btn ghost sm back', onclick: () => go('home', { grade: g }) }, '← Dashboard'),
      h('header', { class: 'course-head ' + sm.c }, h('p', { class: 'eyebrow' }, GRADE_NAME(g) + ' · ' + sm.n), h('h1', null, c.t), h('div', { class: 'course-meta' }, bar(cs.pct, sm.c), h('span', null, cs.pct + '% complete · ' + cs.mastered + ' of ' + cs.total + ' units mastered' + (cs.bonusTotal ? ' · bonus ' + cs.bonusMastered + ' of ' + cs.bonusTotal : '') + (cs.required ? '' : ' · bonus course')))),
      h('ol', { class: 'units' }, coursePath(c).map((i, n) => { const u = c.u[i]; const st = unitStatus(kidId, g, s, i); const w = (kidDoc(kidId).watched || {})[g + '-' + s + '-' + i]; const isB = cs.required && !isReqUnit(kidId, g, s, i); return h('li', { class: 'unit ' + st.cls }, h('button', { class: 'unit-btn', onclick: () => go('lesson', { g, s, i }) }, h('span', { class: 'unit-n' }, (isB ? 'Bonus · ' : '') + 'Unit ' + (n + 1)), h('span', { class: 'unit-t' }, u.t), h('span', { class: 'watched-tag' }, w ? 'Video watched' : ''), h('span', { class: 'pill ' + st.cls }, st.t))); })),
      h('section', { class: 'card resources' }, h('h3', null, 'Course resources'), h('ul', null, c.r.map((r) => h('li', null, extLink(r))))));
    return h('div', null, kidBar(), main);
  }
  function extLink(r) { return h('a', { href: r[1], target: '_blank', rel: 'noopener noreferrer', class: 'ext' }, r[0], h('span', { class: 'sr-only' }, ' (opens in a new tab)')); }
  function viewLesson() {
    const { g, s, i } = S.view; const c = course(g, s); const u = c.u[i]; const kidId = S.who; const sm = SUBJ.find((x) => x.k === s);
    const id = g + '-' + s + '-' + i; const kd = kidDoc(kidId); const path = coursePath(c), pos = path.indexOf(i), prevI = pos > 0 ? path[pos - 1] : null, nextI = pos < path.length - 1 ? path[pos + 1] : null;
    if (!kd.viewed[id]) { kd.viewed[id] = Date.now(); saveKid(kidId); checkBadges(kidId); }
    if (!Timer.on || Timer.on.kidId !== kidId || Timer.on.subj !== s) Timer.start(kidId, s);
    const st = unitStatus(kidId, g, s, i); const res = (u.r || []).concat(c.r.filter((r) => !(u.r || []).some((x) => x[1] === r[1]))).slice(0, 3);
    const main = h('main', { class: 'wrap lesson' },
      h('button', { class: 'btn ghost sm back', onclick: () => go('course', { g, s }) }, '← ' + c.t),
      h('article', { class: 'lesson-card' },
        h('p', { class: 'eyebrow ' + sm.c }, sm.n + ' · Unit ' + (pos + 1) + ' of ' + c.u.length), h('h1', null, u.t), h('span', { class: 'pill ' + st.cls }, st.t),
        h('h2', { class: 'mini' }, 'Watch'), videoPlayer(g, s, i, () => startQuiz(g, s, i)),
        h('h2', { class: 'mini' }, 'Read'), h('ul', { class: 'points' }, u.l.map((p) => h('li', null, p))),
        u.try ? h('div', { class: 'try' }, h('b', null, 'Try it'), h('p', null, u.try)) : null,
        u.lab ? teachLab(u, id) : null,
        h('h2', { class: 'mini' }, 'Go deeper'), h('ul', { class: 'res-list' }, res.map((r) => h('li', null, extLink(r)))),
        h('div', { class: 'quiz-cta' }, h('div', null, h('b', null, 'Ready? Take the quiz.'), h('p', { class: 'muted small' }, (u.g ? '5 fresh problems each try' : Math.min(5, u.q.length) + ' questions' + (u.q.length > 5 ? ', different ones each try' : '')) + ' · score ' + settings().passMark + '% or higher to master this unit')), h('button', { class: 'btn primary', onclick: () => startQuiz(g, s, i) }, 'Start quiz'))),
      lumiFab({ kidId, g, s, i, unit: u.t, points: u.l, mode: 'lesson' }),
      h('nav', { class: 'lesson-nav' }, prevI != null ? h('button', { class: 'btn ghost sm', onclick: () => go('lesson', { g, s, i: prevI }) }, '← Previous unit') : h('span'), nextI != null ? h('button', { class: 'btn ghost sm', onclick: () => go('lesson', { g, s, i: nextI }) }, 'Next unit →') : h('span')));
    return h('div', null, kidBar(), main);
  }
  /* question memory: each learner sees questions they haven't seen before (or saw longest ago) first */
  const qHash = (t) => { let x = 5381; for (let i = 0; i < t.length; i++) x = ((x << 5) + x + t.charCodeAt(i)) | 0; return (x >>> 0).toString(36); };
  const dayNum = () => Math.floor(Date.now() / 6e4); // minutes, so same-day repeats still rotate oldest-first
  function seenMap(kidId) { const d = dayDoc(kidId); return d.seen || (d.seen = {}); }
  function markSeen(kidId, item) { if (!kidId || !item) return; const m = seenMap(kidId); m[qHash(item.q + '|' + item.a)] = dayNum(); const ks = Object.keys(m); if (ks.length > 3000) ks.sort((a, b) => m[a] - m[b]).slice(0, ks.length - 3000).forEach((k) => delete m[k]); }
  const lastSeen = (kidId, q, a) => { const v = kidId ? seenMap(kidId)[qHash(q + '|' + a)] : undefined; return v == null ? -1 : v; };
  function buildQuestions(u, kidId, n) {
    n = n || 5; kidId = kidId === undefined ? S.who : kidId;
    if (u.g && GEN[u.g]) { const out = []; let guard = 0, loose = 0; while (out.length < n && guard++ < 80) { const p = GEN[u.g](); if (!p || !p.w || p.w.length < 2 || out.some((x) => x.q === p.q)) continue; if (lastSeen(kidId, p.q, p.a) >= 0 && loose++ < 40) continue; out.push({ q: p.q, a: p.a, v: p.v || null, choices: shuffle([p.a, ...p.w.slice(0, 3)]) }); } return out; }
    const rows = shuffle(u.q).sort((a, b) => lastSeen(kidId, a[0], a[1]) - lastSeen(kidId, b[0], b[1])).slice(0, Math.min(n, u.q.length));
    return shuffle(rows).map((row) => ({ q: row[0], a: row[1], v: row[5] && typeof row[5] === 'object' ? row[5] : null, choices: shuffle(row.slice(1, 5).filter((x) => typeof x === 'string')) }));
  }
  function startQuiz(g, s, i) { S.quiz = { g, s, i, qs: buildQuestions(course(g, s).u[i]), at: 0, right: 0, picked: null }; go('quiz', { g, s, i }); }
  function pic(spec, cls) { const s = spec && window.LH_VIS ? window.LH_VIS(spec) : ''; if (!s) return null; const d = h('div', { class: cls || 'q-pic' }); d.innerHTML = s; return d; }
  function lumi(mood, text) { const w = h('div', { class: 'lumi-row' }); const m = h('span', { class: 'lumi-wrap' }); m.innerHTML = window.LH_MASCOT ? window.LH_MASCOT(mood) : ''; w.appendChild(m); if (text) w.appendChild(h('p', { class: 'bubble' }, text)); return w; }
  const CHEER = ['Correct! You\'re glowing!', 'Yes! Great thinking!', 'Nailed it!', 'Brilliant!', 'That\'s right — keep shining!', 'Super job!'];
  const OOPS = ['Not quite — you\'ve got this!', 'Good try! Mistakes help us learn.', 'Almost! Let\'s look at the answer.', 'Keep going — every try makes you stronger.'];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  function confetti() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = h('div', { class: 'confetti', 'aria-hidden': 'true' });
    for (let k = 0; k < 28; k++) { const i = h('i'); i.style.left = (Math.random() * 100) + '%'; i.style.animationDelay = (Math.random() * 0.25) + 's'; i.style.setProperty('--dx', ((Math.random() - 0.5) * 160) + 'px'); i.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg'); i.className = 'c' + (k % 5); box.appendChild(i); }
    document.body.appendChild(box); setTimeout(() => box.remove(), 1800);
  }
  function viewQuiz() {
    const Q = S.quiz; const c = course(Q.g, Q.s); const u = c.u[Q.i]; const item = Q.qs[Q.at]; const sm = SUBJ.find((x) => x.k === Q.s);
    const answered = Q.picked != null;
    const choices = h('div', { class: 'choices', role: 'group', 'aria-label': 'Answer choices' }, item.choices.map((ch, n) => {
      let cls = 'choice'; if (answered) { if (ch === item.a) cls += ' right'; else if (n === Q.picked) cls += ' wrong'; }
      return h('button', { class: cls, disabled: answered ? true : null, onclick: () => { Q.picked = n; markSeen(S.who, item); Q.msg = ch === item.a ? pick(CHEER) : pick(OOPS); if (ch === item.a) { Q.right++; confetti(); } render(); } }, h('span', { class: 'letter' }, 'ABCD'[n]), h('span', null, ch));
    }));
    const ok = answered && item.choices[Q.picked] === item.a;
    const fb = answered ? h('div', { class: 'feedback ' + (ok ? 'ok' : 'no'), role: 'status' }, lumi(ok ? 'cheer' : 'oops', ok ? (Q.msg || 'Correct!') : (Q.msg || 'Not quite.') + ' The answer is ' + item.a + '.')) : null;
    const next = answered ? h('button', { class: 'btn primary', onclick: () => { if (Q.at < Q.qs.length - 1) { Q.at++; Q.picked = null; render(); } else finishQuiz(); } }, Q.at < Q.qs.length - 1 ? 'Next question' : 'See my score') : null;
    const main = h('main', { class: 'wrap quiz' },
      h('div', { class: 'quiz-head' }, h('p', { class: 'eyebrow ' + sm.c }, u.t), h('div', { class: 'q-progress' }, 'Question ' + (Q.at + 1) + ' of ' + Q.qs.length), bar(Math.round((Q.at / Q.qs.length) * 100), sm.c)),
      h('section', { class: 'q-card' }, h('h1', { class: 'q-text' }, item.q), pic(item.v), choices, fb, h('div', { class: 'q-actions' }, h('button', { class: 'btn ghost sm', onclick: () => { S.quiz = null; go('lesson', { g: Q.g, s: Q.s, i: Q.i }); } }, 'Leave quiz'), next)),
      answered ? null : lumiFab({ kidId: S.who, g: Q.g, s: Q.s, i: Q.i, unit: u.t, points: u.l, mode: 'quiz', question: item.q, choices: item.choices }));
    setTimeout(() => { const b = answered ? $('.q-actions .primary') : $('.choice'); b && b.focus({ preventScroll: true }); }, 0);
    return h('div', null, kidBar(), main);
  }
  function finishQuiz() {
    const Q = S.quiz; const kidId = S.who; const id = Q.g + '-' + Q.s + '-' + Q.i; const score = Math.round((Q.right / Q.qs.length) * 100);
    const kd = kidDoc(kidId); const prev = kd.prog[id]; const pass = settings().passMark;
    const wasMastered = prev && prev.best >= pass; const themesBefore = unlockedThemes(kidId);
    kd.prog[id] = { best: Math.max(score, prev ? prev.best : 0), last: score, tries: (prev ? prev.tries : 0) + 1, at: Date.now(), first: prev ? prev.first : Date.now() };
    saveKid(kidId); saveDay(kidId); if (!wasMastered && score >= pass) scheduleCheck(kidId, id); Timer.accrue(); Timer.flush(); checkBadges(kidId);
    const newTheme = THEMES.find((t) => !themesBefore[t.id] && unlockedThemes(kidId)[t.id]);
    S.quiz.result = { score, pass: score >= pass, newly: !wasMastered && score >= pass, theme: newTheme ? newTheme.id : null };
    go('result', { g: Q.g, s: Q.s, i: Q.i });
  }
  function viewResult() {
    const Q = S.quiz; if (!Q || !Q.result) return viewKidHome();
    const r = Q.result; const c = course(Q.g, Q.s); const sm = SUBJ.find((x) => x.k === Q.s); const path = coursePath(c), pos = path.indexOf(Q.i), nextI = pos < path.length - 1 ? path[pos + 1] : null;
    const main = h('main', { class: 'wrap result' },
      h('section', { class: 'result-card ' + (r.pass ? 'pass' : 'retry') },
        (() => { const st = h('div', { class: 'result-stars' }); st.innerHTML = window.LH_STARS ? window.LH_STARS(r.score >= 100 ? 3 : r.score >= settings().passMark ? 2 : r.score >= 40 ? 1 : 0) : ''; return st; })(),
        ring(r.score, Q.right + ' of ' + Q.qs.length, 'lg'),
        lumi(r.pass ? 'cheer' : 'think', r.pass ? (r.score >= 100 ? 'A perfect score! You\'re a superstar!' : 'You did it! I\'m so proud of you.') : 'Let\'s review together and try again. You can do it!'),
        h('h1', null, r.pass ? (r.newly ? 'Unit mastered!' : 'Great work!') : 'Almost there'),
        r.theme ? (() => { const t = THEMES.find((x) => x.id === r.theme); const on = kidTheme(S.who) === t.id; return h('div', { class: 'unlock-card', role: 'status' }, h('p', { class: 'eyebrow' }, 'Course complete · new theme unlocked'), h('span', { class: 'sw th-' + t.id, 'aria-hidden': 'true' }), h('b', null, t.n + ': ' + t.d), on ? h('span', { class: 'small muted' }, 'It\'s on now!') : h('button', { class: 'btn primary sm', onclick: () => { kidDoc(S.who).theme = t.id; saveKid(S.who); confetti(); render(); } }, 'Use my new theme')); })() : null,
        r.pass ? (() => { const key = Q.g + '-' + Q.s + '-' + Q.i, d = dayDoc(S.who); d.explain = d.explain || {}; const ta = h('textarea', { id: 'xp-in', rows: 2, maxlength: 400, placeholder: 'In my own words…' }, d.explain[key] || '');
          return h('form', { class: 'explain-box', onsubmit: (e) => { e.preventDefault(); const t = ta.value.trim(); if (!t) return; d.explain[key] = t; saveDay(S.who); toast('Saved! Explaining it is how you really learn it.'); render(); } },
            h('label', { for: 'xp-in' }, 'Teach it back: explain the big idea in your own words (1–2 sentences)'), ta, h('button', { class: 'btn ghost sm', type: 'submit' }, d.explain[key] ? 'Update' : 'Save my explanation')); })() : null,
        h('p', { class: 'lede' }, r.pass ? 'You scored ' + r.score + '% on ' + c.u[Q.i].t + '.' : 'You need ' + settings().passMark + '% to master this unit. Review the lesson and try again — every try gets fresh questions.'),
        h('div', { class: 'actions' },
          r.pass && nextI != null ? h('button', { class: 'btn primary', onclick: () => go('lesson', { g: Q.g, s: Q.s, i: nextI }) }, 'Next unit: ' + c.u[nextI].t) : null,
          !r.pass ? h('button', { class: 'btn primary', onclick: () => startQuiz(Q.g, Q.s, Q.i) }, 'Try again') : null,
          h('button', { class: 'btn ghost', onclick: () => go('lesson', { g: Q.g, s: Q.s, i: Q.i }) }, 'Review lesson'),
          h('button', { class: 'btn ghost', onclick: () => go('course', { g: Q.g, s: Q.s }) }, sm.n + ' units'))));
    return h('div', null, kidBar(), main);
  }

  /* ── parent portal ── */
  function viewParent() {
    const tabs = [['overview', 'Overview'], ['week', 'Weekly check-in'], ['reports', 'Report cards'], ['hours', 'Hours log'], ['literacy', 'Reading & languages'], ['curriculum', 'Curriculum'], ['careers', 'Careers & coding'], ['tutor', 'AI tutor'], ['settings', 'Settings']];
    const main = h('main', { class: 'wrap' }, modeBanner(),
      h('nav', { class: 'tabs', role: 'tablist' }, tabs.map(([k, n]) => h('button', { role: 'tab', 'aria-selected': S.ptab === k ? 'true' : 'false', class: 'tab' + (S.ptab === k ? ' on' : ''), onclick: () => { S.ptab = k; render(); } }, n))));
    const body = { overview: pOverview, week: pWeek, reports: pReports, hours: pHours, literacy: pLiteracy, curriculum: pCurriculum, careers: pCareers, tutor: pTutor, settings: pSettings }[S.ptab]();
    main.appendChild(body);
    return h('div', null, topbar([h('span', { class: 'chip parent-chip' }, 'Parent'), h('button', { class: 'btn ghost sm', onclick: () => go('picker') }, 'Lock portal'), Store.provider === 'firebase' ? h('button', { class: 'btn ghost sm', onclick: signOut }, 'Sign out') : null]), main);
  }
  /* ── backup & restore: one file with the whole school ── */
  const KID_DOCS = ['kid-', 'log-', 'lit-', 'lang-', 'day-', 'lumi-'];
  function backupData() {
    const docs = { family: fam() };
    kids().forEach((k) => KID_DOCS.forEach((p) => { const v = Store.cache[p + k.id]; if (v) docs[p + k.id] = v; }));
    return { app: 'lantern-homeschool', v: 1, exported: new Date().toISOString(), school: fam().name, learners: kids().map((k) => k.name), docs };
  }
  async function downloadBackup() {
    const f = fam(); const data = JSON.stringify(backupData());
    await offer((f.name || 'lantern').replace(/\W+/g, '-') + '-backup-' + todayStr() + '.json', data);
    f.settings = Object.assign({}, f.settings, { lastBackup: todayStr() }); saveFamily(); render();
  }
  async function waitSaved(ms) { const end = Date.now() + (ms || 15000); while (Date.now() < end) { if (!Object.values(Store.queues).some((q) => q.busy || q.next)) return true; await new Promise((r) => setTimeout(r, 200)); } return false; }
  function restoreBackup(file) {
    const rd = new FileReader();
    rd.onload = async () => {
      let b; try { b = JSON.parse(rd.result); } catch (e) { return toast('That file isn\'t a Lantern backup.'); }
      if (!b || b.app !== 'lantern-homeschool' || !b.docs || !b.docs.family || !Array.isArray(b.docs.family.kids)) return toast('That file isn\'t a Lantern backup.');
      const when = b.exported ? new Date(b.exported).toLocaleString() : 'an unknown date';
      if (!confirm('Restore "' + (b.school || 'school') + '" from ' + when + '?\n\nLearners in the backup: ' + (b.learners || []).join(', ') + '.\n\nThis replaces everything in this school with the backup. Anything done since then will be lost.')) return;
      const okName = /^(family|(kid|log|lit|lang|day|lumi)-[a-z0-9]+)$/;
      Object.entries(b.docs).forEach(([name, data]) => { if (okName.test(name) && data && typeof data === 'object') Store.set(name, data); });
      toast('Restoring…'); await waitSaved(); toast('Restored! Reloading…'); setTimeout(() => location.reload(), 800);
    };
    rd.readAsText(file);
  }
  function backupCard() {
    const last = settings().lastBackup; const inp = h('input', { type: 'file', accept: '.json,application/json', hidden: true, onchange: (e) => { const f = e.target.files && e.target.files[0]; if (f) restoreBackup(f); e.target.value = ''; } });
    return h('article', { class: 'card backup-card' }, h('h3', null, 'Backup'),
      h('p', null, 'Download one file with your whole school: learners, progress, quiz scores, hours, reading logs, journals, Spanish, Quests and settings. Keep it in Google Drive or email it to yourself.'),
      h('p', { class: 'small muted' }, (last ? 'Last backup: ' + fmtDate(last) + '. ' : 'No backup downloaded yet. ') + 'Tip: download one at the end of each month and each school year for your records.'),
      h('div', { class: 'actions' }, h('button', { class: 'btn primary sm', onclick: downloadBackup }, 'Download a backup'), h('button', { class: 'btn ghost sm', onclick: () => inp.click() }, 'Restore from a backup…'), inp),
      h('p', { class: 'small muted' }, 'Restoring replaces this school with the backup. Children\'s PINs and your parent PIN come back as they were in the backup.'));
  }
  // Grades whose courses have been expanded have a difficulty path (c.order). Flag when a learner is close to
  // (or already in) a grade that still has the original short course, so the parent knows to ask for it.
  function expandAlerts() {
    const out = [];
    kids().forEach((k) => SUBJ.filter((s) => CORE_SUBJ[s.k]).forEach((s) => {
      const nx = nextUnitFor(k, s.k); if (!nx) return; const c = course(nx.g, s.k);
      if (!c.order) { out.push({ k, s, g: nx.g, now: true }); return; }
      if (settings().advance === false || nx.g >= 12 || (course(nx.g + 1, s.k) || {}).order) return;
      const left = c.u.filter((u, i) => !unitMastered(k.id, nx.g + '-' + s.k + '-' + i)).length;
      if (left <= 5) out.push({ k, s, g: nx.g + 1, left, now: false, from: nx.g });
    }));
    return out;
  }
  function pOverview() {
    const wrap = h('section', null, h('h1', { class: 'p-title' }, 'How everyone is doing'));
    const lb = settings().lastBackup; if (kids().length && (!lb || (Date.now() - parseDay(lb).getTime()) > 30 * 864e5)) wrap.appendChild(h('div', { class: 'banner backup-nudge' }, (lb ? 'Your last backup was ' + fmtDate(lb) + '. ' : 'You haven\'t downloaded a backup yet. ') + (Store.mode === 'cloud' ? 'Your school is saved online, but a monthly backup file is good for your records. ' : 'This copy saves only on this device — download a backup so nothing is lost if it breaks. '), h('button', { class: 'btn ghost xs', onclick: downloadBackup }, 'Download a backup')));
    const ea = expandAlerts(); if (ea.length) {
      const grades = Array.from(new Set(ea.map((x) => x.g))).sort((a, b) => a - b);
      wrap.appendChild(h('div', { class: 'banner expand-nudge' }, h('b', null, '📚 Next grade coming up'), h('ul', null, ea.map((x) => h('li', null, x.now ? x.k.name + ' is now working in ' + GRADE_NAME(x.g) + ' ' + x.s.n + ', which still has the shorter original course.' : x.k.name + ' has ' + x.left + ' lesson' + (x.left === 1 ? '' : 's') + ' left in ' + GRADE_NAME(x.from) + ' ' + x.s.n + '. ' + GRADE_NAME(x.g) + ' ' + x.s.n + ' hasn\'t been expanded yet.'))),
        h('p', { class: 'small' }, 'Ask Claude: "Expand ' + grades.map(GRADE_NAME).join(' and ') + ' for my kids."')));
    }
    if (!kids().length) { wrap.appendChild(h('div', { class: 'empty card' }, h('p', null, 'No learners yet. Add your first learner in Settings.'), h('button', { class: 'btn primary', onclick: () => { S.ptab = 'settings'; render(); } }, 'Add a learner'))); return wrap; }
    wrap.appendChild(h('div', { class: 'overview' }, kids().map((k) => {
      const goal = goalFor(k.id) * 60; const gs = gradeStats(k.id, k.grade); const wk = minutesWeek(k.id), yr = minutesYear(k.id); const la = lastActive(k.id); const kd = kidDoc(k.id);
      return h('article', { class: 'kid-card' },
        h('header', null, avatar(k), h('div', null, h('h2', null, k.name), h('p', { class: 'muted small' }, GRADE_NAME(k.grade) + ' · last active ' + (la ? fmtDate(la) : 'not yet'))), ring(gs.pct, 'grade', 'sm')),
        (() => { const ah = SUBJ.map((s) => { const nx = nextUnitFor(k, s.k); return nx && nx.ahead ? s.n + ' (' + GRADE_NAME(nx.g) + ')' : null; }).filter(Boolean); return ah.length ? h('p', { class: 'ahead-note' }, '🚀 Finished ' + GRADE_NAME(k.grade) + ' work and moving ahead in: ' + ah.join(', ')) : null; })(),
        h('div', { class: 'subj-bars' }, SUBJ.map((s, i) => { const c = gs.courses[i]; return h('div', { class: 'sb' + (c.required ? '' : ' is-bonus') }, h('span', { class: 'sb-n' }, s.n + (c.required ? '' : ' (bonus)')), bar(c.pct, s.c), h('span', { class: 'sb-v' }, c.pct + '%'), h('span', { class: 'sb-g' }, LETTER(c.avg))); })),
        h('dl', { class: 'facts' },
          h('div', null, h('dt', null, 'Average score'), h('dd', null, gs.avg != null ? gs.avg + '% (' + LETTER(gs.avg) + ')' : '—')),
          h('div', null, h('dt', null, 'This week'), h('dd', { class: wk >= goal ? 'good' : '' }, fmtHours(wk) + ' / ' + goalFor(k.id) + ' h')),
          h('div', null, h('dt', null, 'School year'), h('dd', null, fmtHours(yr) + ' h')),
          h('div', null, h('dt', null, 'Streak · badges'), h('dd', null, streak(k.id) + ' d · ' + Object.keys(kd.badges || {}).length))),
        h('div', { class: 'kid-actions' },
          h('button', { class: 'btn ghost sm', onclick: () => { S.ptab = 'reports'; S.pkid = k.id; S.rgrade = k.grade; render(); } }, 'Report card'),
          h('button', { class: 'btn ghost sm', onclick: () => { S.ptab = 'hours'; S.pkid = k.id; render(); } }, 'Hours'),
          h('button', { class: 'btn ghost sm', onclick: () => { S.ptab = 'reports'; S.pkid = k.id; S.rgrade = k.grade; S.detail = true; render(); } }, 'Unit detail')));
    })));
    return wrap;
  }
  function kidSelect(onchange) {
    if (!S.pkid || !kidById(S.pkid)) S.pkid = kids()[0] && kids()[0].id;
    return h('select', { id: 'p-kid', onchange: (e) => { S.pkid = e.target.value; S.rgrade = null; onchange && onchange(); render(); } }, kids().map((k) => h('option', { value: k.id, selected: k.id === S.pkid ? true : null }, k.name)));
  }
  function reportRows(k, g) {
    return SUBJ.map((s) => { const c = course(g, s.k), st = courseStats(k.id, g, s.k); const min = minutes(k.id, (e) => e.s === s.k); return { subj: s, title: c.t, pct: st.pct, avg: st.avg, letter: LETTER(st.avg), mastered: st.mastered, total: st.total, hours: fmtHours(min), credit: c.credit, bonus: !st.required, bonusM: st.bonusMastered, bonusT: st.bonusTotal }; });
  }
  function transcript(k) {
    const rows = [];
    for (let g = 9; g <= 12; g++) SUBJ.forEach((s) => { const st = courseStats(k.id, g, s.k); if (st.tried || st.mastered) { const c = course(g, s.k); rows.push({ g, title: c.t, pct: st.pct, letter: LETTER(st.avg), done: st.pct === 100, credit: st.pct === 100 ? c.credit || 1 : 0 }); } });
    const L = langDoc(k.id);
    if (L.doneAt && L.doneGrade >= 9) { const bs = ES.units.map((u) => ((L.units || {})[u.id] || {}).best).filter((x) => x != null); const avg = bs.length ? Math.round(bs.reduce((a, b) => a + b, 0) / bs.length) : null; rows.push({ g: L.doneGrade, title: 'Spanish 1: Beginner (Language Lab)', pct: 100, letter: LETTER(avg), done: true, credit: 0.5 }); }
    if (L.done2At && (L.done2Grade || k.grade) >= 9) { const bs = ES2.units.map((u) => ((L.units || {})[u.id] || {}).best).filter((x) => x != null); const avg = bs.length ? Math.round(bs.reduce((a, b) => a + b, 0) / bs.length) : null; rows.push({ g: L.done2Grade || k.grade, title: 'Spanish 2 (Language Lab)', pct: 100, letter: LETTER(avg), done: true, credit: 0.5 }); }
    const CT = (window.LH_CAREERS || { tracks: [] }).tracks, cd = (dayDoc(k.id).car || {}), tDone = CT.filter((tr) => (cd[tr.id] || {}).done);
    if (k.grade >= 9 && tDone.length) { const bs = []; tDone.forEach((tr) => tr.mods.forEach((m) => { const r = ((cd[tr.id] || {}).m || {})[m.id]; if (r && r.best != null) bs.push(r.best); })); const avg = bs.length ? Math.round(bs.reduce((a, b) => a + b, 0) / bs.length) : null;
      rows.push({ g: k.grade, title: 'Career Exploration: Skilled Trades (' + tDone.length + ' of 8 pathways)', pct: Math.round((tDone.length / 8) * 100), letter: LETTER(avg), done: tDone.length >= 8, credit: tDone.length >= 8 ? 0.5 : 0 }); }
    const PYL = (window.LH_CODE || { python: [] }).python, pcd = ((dayDoc(k.id).code || {}).p) || {};
    if (k.grade >= 9 && PYL.length && PYL.every((x) => x.ex.every((e) => ((pcd[x.id] || {})[e.id] || {}).ok))) rows.push({ g: k.grade, title: 'Introduction to Programming (Python)', pct: 100, letter: '—', done: true, credit: 0.5 });
    const done = rows.filter((r) => r.done && r.letter !== '—');
    const gpa = done.length ? (done.reduce((a, r) => a + POINTS[r.letter], 0) / done.length).toFixed(2) : null;
    return { rows, gpa, credits: rows.reduce((a, r) => a + r.credit, 0) };
  }
  function setDone(kidId, keys, on) {
    const kd = kidDoc(kidId); kd.done = kd.done || {};
    keys.forEach((key) => { if (on) kd.done[key] = Date.now(); else delete kd.done[key]; });
    saveKid(kidId); checkBadges(kidId); render();
  }
  function planCard(k) {
    const p = kidPlan(k.id);
    const opt = (key, label, hint) => h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: p[key] ? true : null, onchange: (e) => { k.plan = Object.assign(kidPlan(k.id), { [key]: e.target.checked }); saveFamily(); checkBadges(k.id); render(); } }), ' ' + label, h('span', { class: 'muted small' }, ' — ' + hint));
    return h('article', { class: 'card plan-card' }, h('h3', null, 'What counts toward ' + k.name + '\'s grade'),
      h('p', { class: 'hint' }, 'Math, English, Science and Social Studies always count. Anything left unchecked is bonus: ' + k.name + ' can still do it, earn badges, themes and transcript credit, but it never lowers grade completion.'),
      opt('extra', 'New units in Math, English, Science and Social Studies', 'the bonus lessons at the end of each course'),
      opt('ai', 'AI & Me', 'the artificial-intelligence course'),
      opt('fin', 'Money Smart', 'the financial-literacy course'));
  }
  function pReports() {
    const wrap = h('section', null, h('h1', { class: 'p-title' }, 'Report cards'));
    if (!kids().length) { wrap.appendChild(h('p', { class: 'muted' }, 'Add a learner first.')); return wrap; }
    const k = kidById(S.pkid) || kids()[0]; S.pkid = k.id; const g = S.rgrade || k.grade;
    wrap.appendChild(h('div', { class: 'filters' },
      h('label', { for: 'p-kid' }, 'Learner'), kidSelect(),
      h('label', { for: 'r-grade' }, 'Grade'), h('select', { id: 'r-grade', onchange: (e) => { S.rgrade = Number(e.target.value); render(); } }, Array.from({ length: 12 }, (_, i) => h('option', { value: i + 1, selected: g === i + 1 ? true : null }, GRADE_NAME(i + 1))))));
    const rows = reportRows(k, g); const gs = gradeStats(k.id, g);
    wrap.appendChild(planCard(k));
    const tbl = h('div', { class: 'table-wrap' }, h('table', { class: 'report' },
      h('thead', null, h('tr', null, ['Subject', 'Course', 'Units mastered', 'Complete', 'Avg score', 'Grade', 'Hours'].map((t) => h('th', { scope: 'col' }, t)))),
      h('tbody', null, rows.map((r) => h('tr', { class: r.bonus ? 'is-bonus' : null }, h('td', null, h('span', { class: 'dot ' + r.subj.c }), r.subj.n, r.bonus ? h('span', { class: 'bonus-tag' }, 'Bonus') : null), h('td', null, r.title), h('td', { class: 'num' }, r.mastered + '/' + r.total + (r.bonusT ? ' (+' + r.bonusM + '/' + r.bonusT + ' bonus)' : '')), h('td', { class: 'num' }, r.pct + '%'), h('td', { class: 'num' }, r.avg != null ? r.avg + '%' : '—'), h('td', { class: 'num grade-cell' }, r.letter), h('td', { class: 'num' }, r.hours)))),
      h('tfoot', null, h('tr', null, h('td', { colspan: 2 }, 'Overall (required work)'), h('td', { class: 'num' }, gs.mastered + '/' + gs.total), h('td', { class: 'num' }, gs.pct + '%'), h('td', { class: 'num' }, gs.avg != null ? gs.avg + '%' : '—'), h('td', { class: 'num grade-cell' }, LETTER(gs.avg)), h('td', { class: 'num' }, fmtHours(minutes(k.id)))))));
    wrap.appendChild(h('article', { class: 'card report-card' }, h('header', { class: 'rc-head' }, avatar(k), h('div', null, h('h2', null, k.name + ' · ' + GRADE_NAME(g)), h('p', { class: 'muted small' }, 'Grades use each unit\'s best quiz score. A ≥ 90 · B ≥ 80 · C ≥ 70 · D ≥ 60. Hours are all logged time per subject. Overall counts required work only; bonus work is shown but never lowers it.'))), tbl,
      h('div', { class: 'actions' }, h('button', { class: 'btn primary sm', onclick: () => downloadReport(k, g) }, 'Download report card'), h('button', { class: 'btn ghost sm', onclick: () => { S.detail = !S.detail; render(); } }, S.detail ? 'Hide unit detail' : 'Show unit detail'))));
    if (S.detail) {
      wrap.appendChild(h('p', { class: 'hint' }, 'Use "Mark complete" for work done another way, such as a lesson taught at the kitchen table or covered last year. It counts toward completion but not toward quiz averages, and you can undo it.'));
      wrap.appendChild(h('div', { class: 'detail-grid' }, SUBJ.map((s) => { const c = course(g, s.k); const cs = courseStats(k.id, g, s.k); const kd = kidDoc(k.id);
        const keys = c.u.map((u, i) => g + '-' + s.k + '-' + i); const open = keys.filter((key) => !unitMastered(k.id, key));
        return h('section', { class: 'card detail' }, h('h3', null, h('span', { class: 'dot ' + s.c }), c.t, cs.required ? null : h('span', { class: 'bonus-tag' }, 'Bonus')),
          h('ol', null, coursePath(c).map((i) => { const u = c.u[i]; const key = keys[i]; const p = kd.prog[key]; const st = unitStatus(k.id, g, s.k, i); const wv = (kd.watched || {})[key]; const manual = kd.done && kd.done[key]; const passed = p && p.best >= settings().passMark;
            return h('li', null, h('span', null, (cs.required && !isReqUnit(k.id, g, s.k, i) ? 'Bonus · ' : '') + u.t), h('span', { class: 'pill ' + st.cls }, p ? (passed ? st.t.replace(/ · \d+%$/, '') + ' ' + p.best + '%' : 'Best ' + p.best + '%') + ' · ' + p.tries + (p.tries === 1 ? ' try' : ' tries') + (manual && !passed ? ' · marked complete' : '') : st.t), wv ? h('span', { class: 'watched-tag' }, ' · video watched') : null,
              passed ? null : h('button', { class: 'btn ghost xs', onclick: () => setDone(k.id, [key], !manual) }, manual ? 'Undo' : 'Mark complete'),
              (dayDoc(k.id).explain || {})[key] ? h('span', { class: 'small explain-q' }, '"' + dayDoc(k.id).explain[key] + '"') : null,
              passed ? h('button', { class: 'btn ghost xs', title: 'Mark when they can teach this to you', onclick: () => { const d = dayDoc(k.id); d.taught = d.taught || {}; if (d.taught[key]) delete d.taught[key]; else d.taught[key] = Date.now(); saveDay(k.id); render(); } }, (dayDoc(k.id).taught || {})[key] ? 'Undo teacher ★' : 'They taught it to me ★') : null); })),
          open.length > 1 ? h('button', { class: 'btn ghost xs', onclick: () => setDone(k.id, open, true) }, 'Mark all ' + open.length + ' remaining complete') : null); })));
    }
    const tr = transcript(k);
    wrap.appendChild(h('article', { class: 'card transcript' },
      h('h2', null, 'High school transcript'),
      tr.rows.length ? [
        h('p', { class: 'muted small' }, 'Each completed core course earns 1.0 credit; AI & Me, Money Smart and Spanish 1 earn 0.5. GPA is unweighted (A = 4.0) and counts completed courses only.'),
        h('div', { class: 'table-wrap' }, h('table', { class: 'report' }, h('thead', null, h('tr', null, ['Grade', 'Course', 'Status', 'Letter', 'Credit'].map((t) => h('th', { scope: 'col' }, t)))), h('tbody', null, tr.rows.map((r) => h('tr', null, h('td', { class: 'num' }, r.g), h('td', null, r.title), h('td', null, r.done ? 'Completed' : 'In progress · ' + r.pct + '%'), h('td', { class: 'num grade-cell' }, r.letter), h('td', { class: 'num' }, r.credit.toFixed(1))))), h('tfoot', null, h('tr', null, h('td', { colspan: 3 }, 'Cumulative'), h('td', { class: 'num' }, tr.gpa ? 'GPA ' + tr.gpa : '—'), h('td', { class: 'num' }, tr.credits.toFixed(1)))))),
        h('div', { class: 'actions' }, h('button', { class: 'btn primary sm', onclick: () => downloadTranscript(k) }, 'Download transcript'))
      ] : h('p', { class: 'muted' }, 'High school courses (grades 9–12) appear here once ' + k.name + ' starts one.')));
    return wrap;
  }
  function pHours() {
    const wrap = h('section', null, h('h1', { class: 'p-title' }, 'Hours log'));
    if (!kids().length) { wrap.appendChild(h('p', { class: 'muted' }, 'Add a learner first.')); return wrap; }
    const k = kidById(S.pkid) || kids()[0]; S.pkid = k.id; const log = logDoc(k.id); const ys = settings().yearStart;
    wrap.appendChild(h('div', { class: 'filters' }, h('label', { for: 'p-kid' }, 'Learner'), kidSelect()));
    const bySubj = {}; log.e.filter((e) => e.d >= ys).forEach((e) => { bySubj[e.s] = (bySubj[e.s] || 0) + e.m; });
    const total = Object.values(bySubj).reduce((a, b) => a + b, 0); const maxV = Math.max(1, ...Object.values(bySubj));
    wrap.appendChild(h('div', { class: 'hours-top' },
      h('article', { class: 'card' }, h('h3', null, 'Since ' + fmtDate(ys)), h('p', { class: 'big-num' }, fmtHours(total), h('small', null, ' hours')), h('p', { class: 'muted small' }, 'This week: ' + fmtHours(minutesWeek(k.id)) + ' of ' + goalFor(k.id) + ' h goal')),
      h('article', { class: 'card' }, h('h3', null, 'By subject'), Object.keys(bySubj).length ? h('ul', { class: 'hbars' }, Object.entries(bySubj).sort((a, b) => b[1] - a[1]).map(([s, m]) => h('li', null, h('span', null, SUBJ_NAME[s] || s), h('div', { class: 'bar ' + (SUBJ.some((x) => x.k === s) ? s : 'other') }, h('i', { style: 'width:' + Math.round((m / maxV) * 100) + '%' })), h('span', { class: 'num' }, fmtHours(m) + ' h')))) : h('p', { class: 'muted small' }, 'No time logged yet. Lesson and quiz time is logged automatically.'))));
    const subjSel = h('select', { id: 'h-subj' }, [...SUBJ, ...EXTRA].map((s) => h('option', { value: s.k }, s.n)));
    wrap.appendChild(h('form', { class: 'card form inline-form', onsubmit: (e) => {
      e.preventDefault(); const d = $('#h-date').value, m = Math.round(Number($('#h-min').value)), n = $('#h-note').value.trim(); const err = $('#h-err');
      if (!d) return (err.textContent = 'Pick a date.'); if (!(m > 0 && m <= 720)) return (err.textContent = 'Enter minutes between 1 and 720.');
      log.e.push({ id: uid(), d, s: subjSel.value, m, n, auto: false }); saveLog(k.id); checkBadges(k.id); toast('Logged ' + m + ' minutes.'); render();
    } }, h('h3', null, 'Add time done away from the screen'),
      h('div', { class: 'row4' },
        h('div', null, h('label', { for: 'h-date' }, 'Date'), h('input', { id: 'h-date', type: 'date', value: todayStr(), max: todayStr() })),
        h('div', null, h('label', { for: 'h-subj' }, 'Subject'), subjSel),
        h('div', null, h('label', { for: 'h-min' }, 'Minutes'), h('input', { id: 'h-min', type: 'number', min: 1, max: 720, step: 1, value: 30 })),
        h('div', { class: 'grow' }, h('label', { for: 'h-note' }, 'Note'), h('input', { id: 'h-note', placeholder: 'e.g. Library visit, soccer practice', maxlength: 80 }))),
      h('p', { id: 'h-err', class: 'err', role: 'alert' }), h('button', { class: 'btn primary sm', type: 'submit' }, 'Add entry')));
    const entries = log.e.slice().sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0));
    wrap.appendChild(h('article', { class: 'card' }, h('div', { class: 'card-head' }, h('h3', null, 'Entries'), h('button', { class: 'btn ghost sm', onclick: () => downloadCSV(k) }, 'Download CSV')),
      entries.length ? h('div', { class: 'table-wrap' }, h('table', { class: 'report' }, h('thead', null, h('tr', null, ['Date', 'Subject', 'Minutes', 'Note', 'Source', ''].map((t) => h('th', { scope: 'col' }, t)))),
        h('tbody', null, entries.slice(0, 200).map((e) => h('tr', null, h('td', null, fmtDate(e.d)), h('td', null, SUBJ_NAME[e.s] || e.s), h('td', { class: 'num' }, e.m), h('td', null, e.n || ''), h('td', null, e.auto ? 'Automatic' : e.kid ? 'Learner' : 'Parent'),
          h('td', null, S.confirmDel === e.id ? h('span', { class: 'confirm' }, h('button', { class: 'btn danger xs', onclick: () => { log.e = log.e.filter((x) => x.id !== e.id); S.confirmDel = null; saveLog(k.id); render(); } }, 'Delete'), h('button', { class: 'btn ghost xs', onclick: () => { S.confirmDel = null; render(); } }, 'Keep')) : h('button', { class: 'btn ghost xs', 'aria-label': 'Delete entry from ' + fmtDate(e.d), onclick: () => { S.confirmDel = e.id; render(); } }, 'Remove'))))))) : h('p', { class: 'muted small' }, 'No entries yet.')));
    return wrap;
  }
  function pCurriculum() {
    const g = S.cgrade;
    const wrap = h('section', null, h('h1', { class: 'p-title' }, 'Curriculum & sources'),
      h('p', { class: 'lede' }, 'Aligned to U.S. standards (Common Core for math and English, NGSS for science). Each unit has a narrated video lesson, a short written lesson and links to free resources. Every link was checked on ' + new Date(2026, 9, 9).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) + '.'),
      h('div', { class: 'grade-strip', role: 'tablist', 'aria-label': 'Grade' }, Array.from({ length: 12 }, (_, i) => h('button', { role: 'tab', 'aria-selected': g === i + 1 ? 'true' : 'false', class: 'gchip' + (g === i + 1 ? ' on' : ''), onclick: () => { S.cgrade = i + 1; render(); } }, String(i + 1)))));
    wrap.appendChild(h('div', { class: 'detail-grid' }, SUBJ.map((s) => { const c = course(g, s.k); return h('section', { class: 'card detail' }, h('h3', null, h('span', { class: 'dot ' + s.c }), c.t, c.credit ? h('span', { class: 'credit' }, c.credit.toFixed(1) + ' credit') : null), h('ol', null, c.u.map((u) => h('li', null, h('span', null, u.t), h('span', { class: 'muted small' }, u.g ? 'Generated practice' : u.q.length + ' questions')))), h('ul', { class: 'res-list small' }, c.r.map((r) => h('li', null, extLink(r))))); })));
    wrap.appendChild(h('article', { class: 'card' }, h('h3', null, 'Free resources used'), h('ul', { class: 'src-list' }, [
      ['Khan Academy', 'https://www.khanacademy.org/', 'Video lessons and practice for math, reading, science, history, civics and finance.'],
      ['OpenStax', 'https://openstax.org/details/books/biology-2e', 'Free, peer-reviewed high school and college textbooks.'],
      ['CommonLit', 'https://www.commonlit.org/texts', 'Free reading passages for grades 3–12 (free account required).'],
      ['Project Gutenberg', 'https://www.gutenberg.org/ebooks/bookshelf/20', 'Free classic books in the public domain.'],
      ['Starfall', 'https://www.starfall.com/h/learn-to-read/', 'Free learn-to-read phonics program for early readers.'],
      ['Storyline Online', 'https://storylineonline.net/library', 'Picture books read aloud by actors.'],
      ['NASA Space Place', 'https://spaceplace.nasa.gov/', 'Space and Earth science for upper elementary.'],
      ['PhET Interactive Simulations', 'https://phet.colorado.edu/', 'Free science and math simulations from the University of Colorado.'],
      ['iCivics', 'https://ed.icivics.org/students', 'Free civics games for grades 3–12.'],
      ["Ben's Guide to the U.S. Government", 'https://bensguide.gpo.gov/', 'Government basics by age group, from the U.S. Government Publishing Office.'],
      ['Purdue OWL', 'https://owl.purdue.edu/owl/index.html', 'Writing, grammar and citation guides.']
    ].map((r) => h('li', null, extLink(r), h('span', { class: 'muted small' }, r[2]))))));
    return wrap;
  }
  function pSettings() {
    const f = fam(); const st = settings();
    const wrap = h('section', null, h('h1', { class: 'p-title' }, 'Settings'));
    wrap.appendChild(h('form', { class: 'card form', onsubmit: (e) => {
      e.preventDefault(); const name = $('#s-name').value.trim(); if (!name) return;
      f.name = name; f.settings = { ...(f.settings || {}), passMark: Number($('#s-pass').value), freeRoam: $('#s-roam').checked, yearStart: $('#s-year').value || defaultYearStart(), goalAuto: $('#s-goalmode').value === 'auto', advance: $('#s-adv').checked, weeklyGoal: Math.max(1, Math.min(60, Number($('#s-goal').value) || 20)) };
      saveFamily(); toast('Settings saved.'); render();
    } }, h('h3', null, 'School'),
      h('div', { class: 'row2' }, h('div', null, h('label', { for: 's-name' }, 'School name'), h('input', { id: 's-name', value: f.name, maxlength: 48 })), h('div', null, h('label', { for: 's-year' }, 'School year starts'), h('input', { id: 's-year', type: 'date', value: st.yearStart }))),
      h('div', { class: 'row2' },
        h('div', null, h('label', { for: 's-pass' }, 'Score needed to master a unit'), h('select', { id: 's-pass' }, [70, 80, 90].map((p) => h('option', { value: p, selected: st.passMark === p ? true : null }, p + '%')))),
        h('div', null, h('label', { for: 's-goalmode' }, 'Weekly hours goal'), h('select', { id: 's-goalmode', onchange: (e) => { $('#s-goal-row').hidden = e.target.value === 'auto'; } }, h('option', { value: 'auto', selected: st.goalAuto !== false ? true : null }, 'By grade (recommended)'), h('option', { value: 'same', selected: st.goalAuto === false ? true : null }, 'Same goal for everyone')))),
      h('div', { id: 's-goal-row', class: 'row2', hidden: st.goalAuto !== false ? true : null }, h('div', null, h('label', { for: 's-goal' }, 'Hours per week, every learner'), h('input', { id: 's-goal', type: 'number', min: 1, max: 60, value: st.weeklyGoal }))),
      h('p', { class: 'hint' }, 'By grade: grades 1–2 · 8 h, 3–5 · 10 h, 6–8 · 12 h, 9–12 · 15 h a week (about 1½–3 focused hours a day). One-on-one learning covers more ground per hour than a classroom, so Lantern aims for mastery, not minutes. Check your state\'s rules, which may ask for a minimum number of hours or days.'),
      h('label', { class: 'check' }, h('input', { id: 's-roam', type: 'checkbox', checked: st.freeRoam ? true : null }), ' Let learners open other grades (review or work ahead)'),
      h('label', { class: 'check' }, h('input', { id: 's-adv', type: 'checkbox', checked: st.advance !== false ? true : null }), ' When every lesson in a subject is mastered, continue Today\'s plan with the next grade in that subject'),
      h('button', { class: 'btn primary sm', type: 'submit' }, 'Save settings')));
    wrap.appendChild(h('h2', { class: 'sec' }, 'Learners'));
    kids().forEach((k) => {
      wrap.appendChild(h('div', { class: 'kid-edit' }, kidForm(k, () => render()),
        S.confirmKid === k.id ? h('div', { class: 'card danger-zone' }, h('p', null, 'Remove ' + k.name + ' and all of their progress and hours? This cannot be undone.'), h('div', { class: 'actions' }, h('button', { class: 'btn danger sm', onclick: async () => { f.kids = f.kids.filter((x) => x.id !== k.id); saveFamily(); await Store.remove('kid-' + k.id); await Store.remove('log-' + k.id); await Store.remove('lit-' + k.id); await Store.remove('lang-' + k.id); await Store.remove('day-' + k.id); S.confirmKid = null; toast(k.name + ' was removed.'); render(); } }, 'Remove ' + k.name), h('button', { class: 'btn ghost sm', onclick: () => { S.confirmKid = null; render(); } }, 'Cancel')))
          : h('button', { class: 'btn ghost sm remove-kid', onclick: () => { S.confirmKid = k.id; render(); } }, 'Remove ' + k.name)));
    });
    wrap.appendChild(kidForm(null, () => render()));
    wrap.appendChild(h('form', { class: 'card form', onsubmit: async (e) => {
      e.preventDefault(); const a = $('#s-old').value.trim(), b = $('#s-new').value.trim(), err = $('#s-perr');
      if ((await hashPin(a, Store.salt)) !== f.parentPin) return (err.textContent = 'The current PIN is not right.');
      if (!/^\d{4,6}$/.test(b)) return (err.textContent = 'The new PIN must be 4 to 6 digits.');
      f.parentPin = await hashPin(b, Store.salt); f.parentPinLen = b.length; saveFamily(); toast('Parent PIN changed.'); render();
    } }, h('h3', null, 'Change parent PIN'),
      h('div', { class: 'row2' }, h('div', null, h('label', { for: 's-old' }, 'Current PIN'), h('input', { id: 's-old', type: 'password', inputmode: 'numeric', maxlength: 6, autocomplete: 'current-password' })), h('div', null, h('label', { for: 's-new' }, 'New PIN'), h('input', { id: 's-new', type: 'password', inputmode: 'numeric', maxlength: 6, autocomplete: 'new-password' }))),
      h('p', { id: 's-perr', class: 'err', role: 'alert' }), h('button', { class: 'btn primary sm', type: 'submit' }, 'Change PIN')));
    wrap.appendChild(backupCard());
    wrap.appendChild(h('article', { class: 'card note' }, h('h3', null, 'About logins and privacy'),
      h('p', null, Store.provider === 'firebase' ? 'Your school is saved privately to your family account (' + ((window.firebase.auth().currentUser || {}).email || 'your email') + '). It syncs on any device where you sign in. Other families have their own accounts and can never see yours.'
        : Store.mode === 'cloud' ? 'Your school is saved privately to the Claude account that opened this page, so it syncs on any device signed in to that account. Other people who open the link see their own empty school, never yours.'
        : 'Your school is saved in this browser on this device. Clearing browser data erases it.'),
      h('p', null, 'PINs keep learners in their own dashboards and out of the parent portal. They are a family convenience, not bank-grade security.')));
    return wrap;
  }

  /* ─────────────── narrated video lessons ─────────────── */
  const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUBS = '₀₁₂₃₄₅₆₇₈₉';
  const MOD = [['⁻ⁿ', ' to the negative n'], ['ᵐ⁺ⁿ', ' to the m plus n'], ['ᵐ⁻ⁿ', ' to the m minus n'], ['ᵐⁿ', ' to the m times n'], ['ⁿ⁻¹', ' to the n minus 1'], ['ᵐ', ' to the m'], ['ⁿ', ' to the n'], ['ˣ', ' to the x'], ['ᵗ', ' to the t']];
  // Turn math symbols into words so the voice reads them correctly (e.g. 3/4 is "3 over 4", not "March 4th").
  function speakable(t) {
    let s = String(t);
    MOD.forEach(([a, b]) => { s = s.split(a).join(b); });
    return s
      .replace(/(\d)\s*R(\d)/g, '$1 remainder $2')
      .replace(/(\d+)\/(\d+)/g, '$1 over $2')
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) => (m === '²' ? ' squared' : m === '³' ? ' cubed' : ' to the power of ' + m.split('').map((c) => (c === '⁻' ? 'negative ' : SUPS.indexOf(c))).join('')))
      .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (c) => ' ' + SUBS.indexOf(c) + ' ')
      .replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ').replace(/≈/g, ' about ')
      .replace(/≥/g, ' at least ').replace(/≤/g, ' at most ').replace(/\?\/(\d)/g, 'what over $1').replace(/=\s*\?/g, ' equals what?').replace(/∘/g, ' of ').replace(/θ/g, ' theta ').replace(/ₙ/g, ' n ').replace(/Ω/g, ' ohms').replace(/ > /g, ' is greater than ').replace(/ < /g, ' is less than ').replace(/=/g, ' equals ').replace(/→/g, ', then ')
      .replace(/√/g, 'the square root of ').replace(/π/g, 'pi').replace(/°/g, ' degrees').replace(/±/g, ' plus or minus ')
      .replace(/½/g, ' one half').replace(/¢/g, ' cents').replace(/·/g, ', ')
      .replace(/\s+/g, ' ').trim();
  }
  const Pref = {
    get(k, d) { try { const v = localStorage.getItem('lantern-pref:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('lantern-pref:' + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  };
  const Player = {
    key: null, idx: 0, playing: false, started: false, gen: 0, timers: [], example: null, mount: null,
    voiceOn: Pref.get('voice', true), rate: Pref.get('rate', 1), voice: null,
    synth: (typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined') ? window.speechSynthesis : null,
    clear() { this.timers.forEach(clearTimeout); this.timers = []; this.gen++; if (this.synth) { try { this.synth.cancel(); } catch (e) { /* ignore */ } } },
    stop() { const was = this.playing; this.clear(); this.playing = false; if (was && S.dirty) { S.dirty = false; scheduleRender(); } },
    pickVoice() {
      if (!this.synth) return;
      const vs = this.synth.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
      for (const p of [/Samantha/, /Google US English/, /Natural/i, /Aria|Jenny|Ava|Allison/, /en[-_]US/i]) { const v = vs.find((x) => p.test(x.name) || p.test(x.lang)); if (v) { this.voice = v; return; } }
      this.voice = vs[0] || null;
    },
    // Each learner can pick a voice and speed. Voices differ by device, so an unknown name falls back to the automatic pick.
    englishVoices() { return this.synth ? this.synth.getVoices().filter((v) => /^en[-_]/i.test(v.lang)) : []; },
    applyKid(kidId) {
      if (!this.synth) return;
      if (!this.autoVoice) { this.pickVoice(); this.autoVoice = this.voice; }
      const pv = (kidId && kidDoc(kidId).voice) || {};
      this.voice = (pv.name && this.englishVoices().find((x) => x.name === pv.name)) || this.autoVoice;
      this.rate = pv.rate || Pref.get('rate', 1);
    }
  };
  if (Player.synth) { Player.pickVoice(); try { Player.synth.addEventListener('voiceschanged', () => { Player.autoVoice = null; Player.applyKid(S.who); if (S.screen === 'home') scheduleRender(); }); } catch (e) { /* older browsers */ } }
  const ICONS = {
    play: '<path d="M8 5v14l11-7z"/>', pause: '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>',
    prev: '<path d="M6 5h2v14H6zM20 5v14L9 12z"/>', next: '<path d="M16 5h2v14h-2zM4 5l11 7-11 7z"/>',
    voice: '<path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4z"/>',
    mute: '<path d="M4 9v6h4l5 4V5L8 9H4zm13.6 3 2.7-2.7-1.4-1.4-2.7 2.7-2.7-2.7-1.4 1.4 2.7 2.7-2.7 2.7 1.4 1.4 2.7-2.7 2.7 2.7 1.4-1.4z"/>',
    full: '<path d="M4 4h6v2H6v4H4zm10 0h6v6h-2V6h-4zM4 14h2v4h4v2H4zm14 0h2v6h-6v-2h4z"/>'
  };
  function icon(n) { const s = h('span', { class: 'ico', 'aria-hidden': 'true' }); s.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">' + ICONS[n] + '</svg>'; return s; }

  function lessonScenes(g, s, i) {
    const c = course(g, s), u = c.u[i], sm = SUBJ.find((x) => x.k === s), key = g + '-' + s + '-' + i;
    const sc = [{ t: 'title', say: GRADE_NAME(g) + ' ' + sm.n + '. Unit ' + (coursePath(course(g, s)).indexOf(i) + 1) + ': ' + u.t + ". Let's learn!" }];
    u.l.forEach((p, n) => sc.push({ t: 'point', n, of: u.l.length, text: p, say: p }));
    if (u.g && GEN[u.g]) {
      if (!Player.example || Player.example.key !== key) Player.example = { key, p: GEN[u.g]() };
      const p = Player.example.p;
      sc.push({ t: 'exq', text: p.q, v: p.v, say: "Let's try one together. " + p.q + ' Take a moment to think.' });
      sc.push({ t: 'exa', text: p.q, v: p.v, ans: p.a, say: 'The answer is ' + p.a + '.' });
    }
    if (u.try) sc.push({ t: 'try', text: u.try, say: 'Try it at home. ' + u.try });
    sc.push({ t: 'end', say: "Great job watching! When you're ready, take the quiz to show what you know." });
    sc.forEach((x) => { x.spoken = speakable(x.say); x.ms = Math.max(2200, (x.spoken.split(' ').length / 2.5) * 1000 + 700); });
    return sc;
  }
  function markWatched(key) {
    const kidId = S.who; if (!kidId) return; const kd = kidDoc(kidId); kd.watched = kd.watched || {};
    if (!kd.watched[key]) { kd.watched[key] = Date.now(); saveKid(kidId); checkBadges(kidId); }
  }
  function videoPlayer(g, s, i, onQuiz) {
    const key = g + '-' + s + '-' + i; const sm = SUBJ.find((x) => x.k === s); const c = course(g, s); const u = c.u[i];
    if (Player.key !== key) { Player.clear(); Player.key = key; Player.idx = 0; Player.playing = false; Player.started = false; }
    const scenes = lessonScenes(g, s, i);
    if (Player.idx >= scenes.length) Player.idx = 0;
    const totalMin = Math.max(1, Math.round(scenes.reduce((a, x) => a + x.ms, 0) / 60000));
    const stage = h('div', { class: 'stage' });
    const segs = h('div', { class: 'vsegs' });
    const counter = h('span', { class: 'vcount', 'aria-live': 'polite' });
    const playBtn = h('button', { class: 'vbtn play', type: 'button', onclick: () => (Player.playing ? pause() : play()) });
    const prevBtn = h('button', { class: 'vbtn', type: 'button', 'aria-label': 'Previous part', onclick: () => jump(Player.idx - 1) }, icon('prev'));
    const nextBtn = h('button', { class: 'vbtn', type: 'button', 'aria-label': 'Next part', onclick: () => jump(Player.idx + 1) }, icon('next'));
    const voiceBtn = h('button', { class: 'vtoggle', type: 'button', onclick: () => { Player.voiceOn = !Player.voiceOn; Pref.set('voice', Player.voiceOn); if (Player.playing) speakScene(); else draw(); } });
    const rateSel = h('select', { class: 'vrate', id: 'v-rate', 'aria-label': 'Reading speed', onchange: (e) => { Player.rate = Number(e.target.value); Pref.set('rate', Player.rate); if (S.who) { const kd = kidDoc(S.who); kd.voice = Object.assign({}, kd.voice, { rate: Player.rate }); saveKid(S.who); } if (Player.playing) speakScene(); } }, [0.8, 1, 1.2, 1.4].map((r) => h('option', { value: r, selected: Player.rate === r ? true : null }, r + '×')));
    const fsBtn = document.fullscreenEnabled ? h('button', { class: 'vbtn', type: 'button', 'aria-label': 'Full screen', onclick: () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); else if (wrap.requestFullscreen) wrap.requestFullscreen().catch(() => {}); } }, icon('full')) : null;
    const wrap = h('section', { class: 'vplayer ' + sm.c, tabindex: '0', 'aria-label': 'Video lesson: ' + u.t, onkeydown: (e) => {
      if (e.target !== wrap) return;
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); Player.playing ? pause() : play(); }
      else if (e.key === 'ArrowRight') jump(Player.idx + 1); else if (e.key === 'ArrowLeft') jump(Player.idx - 1);
    } },
      stage,
      h('div', { class: 'vctrl' }, prevBtn, playBtn, nextBtn, segs, counter, voiceBtn, rateSel, fsBtn),
      Player.synth ? null : h('p', { class: 'vnote' }, 'Read-aloud is not available in this browser, so the video plays with on-screen text only.'));

    function words(text) { const p = h('p', { class: 'vtext' }); String(text).split(/(\s+)/).forEach((w) => p.appendChild(/^\s+$/.test(w) ? document.createTextNode(w) : h('span', { class: 'w' }, w))); return p; }
    function highlight(frac) { const ws = stage.querySelectorAll('.w'); if (!ws.length) return; const k = frac < 0 ? -1 : Math.min(ws.length - 1, Math.floor(frac * ws.length)); ws.forEach((w, n) => w.classList.toggle('on', n === k)); }
    function draw() {
      const sc = scenes[Player.idx]; stage.innerHTML = ''; stage.className = 'stage scene-' + sc.t;
      stage.appendChild(h('div', { class: 'chalk-deco', 'aria-hidden': 'true' }, h('i'), h('i'), h('i')));
      let body;
      if (sc.t === 'title') body = h('div', { class: 'vcenter' }, h('p', { class: 'veyebrow' }, c.t + ' · Unit ' + (coursePath(c).indexOf(i) + 1) + ' of ' + c.u.length), h('h2', { class: 'vtitle' }, u.t), h('p', { class: 'vsub' }, 'Video lesson · about ' + totalMin + ' min'));
      else if (sc.t === 'point') body = h('div', { class: 'vpoint' }, h('span', { class: 'vnum', 'aria-hidden': 'true' }, String(sc.n + 1)), h('div', null, h('p', { class: 'veyebrow' }, 'Key idea ' + (sc.n + 1) + ' of ' + sc.of), words(sc.text)));
      else if (sc.t === 'exq') body = h('div', { class: 'vcenter' }, h('p', { class: 'veyebrow' }, "Let's solve one together"), pic(sc.v, 'v-pic'), words(sc.text), h('p', { class: 'think' }, 'Think about it', h('span', { class: 'dots3', 'aria-hidden': 'true' }, h('i'), h('i'), h('i'))));
      else if (sc.t === 'exa') body = h('div', { class: 'vcenter' }, h('p', { class: 'veyebrow' }, 'Answer'), pic(sc.v, 'v-pic sm'), h('p', { class: 'vq-small' }, sc.text), h('p', { class: 'vanswer' }, sc.ans));
      else if (sc.t === 'try') body = h('div', { class: 'vpoint' }, h('span', { class: 'vlamp', 'aria-hidden': 'true' }), h('div', null, h('p', { class: 'veyebrow' }, 'Try it at home'), words(sc.text)));
      else body = h('div', { class: 'vcenter' }, h('span', { class: 'vcheck', 'aria-hidden': 'true' }), h('h2', { class: 'vtitle' }, 'Lesson complete'), h('p', { class: 'vsub' }, 'Now show what you know.'),
        h('div', { class: 'vend-actions' }, h('button', { class: 'btn primary', type: 'button', onclick: () => { Player.stop(); onQuiz(); } }, 'Take the quiz'), h('button', { class: 'btn vghost', type: 'button', onclick: () => { Player.idx = 0; play(); } }, 'Watch again')));
      stage.appendChild(body);
      if (!Player.started) stage.appendChild(h('button', { class: 'vbig', type: 'button', onclick: play }, icon('play'), h('span', null, 'Watch the lesson · ' + totalMin + ' min')));
      segs.innerHTML = '';
      scenes.forEach((x, n) => segs.appendChild(h('button', { type: 'button', class: 'vseg' + (n < Player.idx ? ' done' : n === Player.idx ? ' on' : ''), 'aria-label': 'Go to part ' + (n + 1) + ' of ' + scenes.length, onclick: () => jump(n) })));
      playBtn.innerHTML = ''; playBtn.appendChild(icon(Player.playing ? 'pause' : 'play')); playBtn.setAttribute('aria-label', Player.playing ? 'Pause' : 'Play');
      prevBtn.disabled = Player.idx === 0; nextBtn.disabled = Player.idx === scenes.length - 1;
      counter.textContent = (Player.idx + 1) + ' / ' + scenes.length;
      voiceBtn.innerHTML = ''; voiceBtn.appendChild(icon(Player.voiceOn ? 'voice' : 'mute')); voiceBtn.appendChild(h('span', { class: 'vlbl' }, Player.voiceOn ? 'Voice on' : 'Voice off'));
      voiceBtn.setAttribute('aria-pressed', Player.voiceOn ? 'true' : 'false'); voiceBtn.hidden = !Player.synth;
    }
    function speakScene() {
      Player.clear(); const my = Player.gen; const sc = scenes[Player.idx]; draw();
      if (sc.t === 'end') markWatched(key);
      const hold = sc.t === 'exq' ? 2600 : 700;
      const after = (ms) => Player.timers.push(setTimeout(() => { if (Player.gen === my && Player.playing) advance(); }, ms));
      if (!(Player.voiceOn && Player.synth)) return after(sc.ms / Player.rate + hold);
      Player.timers.push(setTimeout(() => {
        if (Player.gen !== my) return;
        let ended = false;
        const done = () => { if (ended) return; ended = true; if (Player.gen === my) { highlight(-1); after(hold); } };
        const ut = new SpeechSynthesisUtterance(sc.spoken);
        ut.rate = Player.rate; ut.lang = 'en-US'; if (Player.voice) ut.voice = Player.voice;
        ut.onboundary = (e) => { if (Player.gen === my && e.name !== 'sentence') highlight(e.charIndex / sc.spoken.length); };
        ut.onend = done; ut.onerror = done;
        try { Player.synth.speak(ut); } catch (e) { done(); }
        // Some browsers never fire "end"; move on anyway after a generous wait.
        Player.timers.push(setTimeout(() => { if (!ended && Player.gen === my) { ended = true; try { Player.synth.cancel(); } catch (e) { /* ignore */ } advance(); } }, (sc.ms / Player.rate) * 2 + 4000));
      }, 60));
    }
    function advance() { if (Player.idx < scenes.length - 1) { Player.idx++; speakScene(); } else pause(); }
    function play() { if (Player.started && Player.idx === scenes.length - 1) Player.idx = 0; Player.started = true; Player.playing = true; speakScene(); }
    function pause() { Player.playing = false; Player.clear(); draw(); if (S.dirty) { S.dirty = false; scheduleRender(); } }
    function jump(n) { n = Math.max(0, Math.min(scenes.length - 1, n)); Player.idx = n; Player.started = true; if (Player.playing) speakScene(); else draw(); }
    if (Player.playing) setTimeout(speakScene, 0); else draw();
    return wrap;
  }

  /* ─────────────── downloads ─────────────── */
  async function offer(filename, data) {
    const dl = Store.downloads;
    if (!dl && !window.claude) return blobDownload(filename, data);
    if (!dl) { copyFallback(data); return; }
    try { await dl.save({ filename, data }); toast('Saved ' + filename + '.'); }
    catch (e) { if (e && e.code === 'declined') return; if (e && e.code === 'rate_limited') return toast('A save is already waiting for your answer.'); copyFallback(data); }
  }
  function blobDownload(filename, data) {
    try {
      const blob = new Blob([data], { type: /\.csv$/.test(filename) ? 'text/csv' : 'text/html' });
      const a = h('a', { href: URL.createObjectURL(blob), download: filename }); document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); toast('Downloaded ' + filename + '.');
    } catch (e) { copyFallback(data); }
  }
  async function copyFallback(text) {
    try { await navigator.clipboard.writeText(text); toast('Downloads are not available here, so the file was copied to your clipboard.'); }
    catch (e) { toast('Downloads are not available in this view.'); }
  }
  const docStyle = 'body{font:14px/1.5 Georgia,serif;color:#1b2420;max-width:760px;margin:40px auto;padding:0 24px}h1{font:600 26px/1.2 Helvetica,Arial,sans-serif;margin:0}h2{font:600 16px Helvetica,Arial,sans-serif;margin:28px 0 8px}p.m{color:#5a655f;margin:4px 0 0}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #d6dbd7}th{font:600 12px Helvetica,Arial,sans-serif;text-transform:uppercase;letter-spacing:.05em;color:#5a655f}td.n,th.n{text-align:right;font-variant-numeric:tabular-nums}tfoot td{font-weight:700;border-top:2px solid #1b2420}.sig{margin-top:56px;display:flex;gap:48px}.sig div{flex:1;border-top:1px solid #1b2420;padding-top:6px;font-size:12px;color:#5a655f}';
  function downloadReport(k, g) {
    const rows = reportRows(k, g); const gs = gradeStats(k.id, g); const f = fam();
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(k.name)} · ${GRADE_NAME(g)} report card</title><style>${docStyle}</style></head><body><h1>${esc(f.name)}</h1><p class="m">Report card · ${esc(k.name)} · ${GRADE_NAME(g)} · issued ${new Date().toLocaleDateString()}</p><table><thead><tr><th>Subject</th><th>Course</th><th class="n">Mastered</th><th class="n">Complete</th><th class="n">Avg score</th><th class="n">Grade</th><th class="n">Hours</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.subj.n}${r.bonus ? ' (bonus)' : ''}</td><td>${esc(r.title)}</td><td class="n">${r.mastered}/${r.total}${r.bonusT ? ' (+' + r.bonusM + '/' + r.bonusT + ' bonus)' : ''}</td><td class="n">${r.pct}%</td><td class="n">${r.avg != null ? r.avg + '%' : '—'}</td><td class="n">${r.letter}</td><td class="n">${r.hours}</td></tr>`).join('')}</tbody><tfoot><tr><td colspan="2">Overall (required work)</td><td class="n">${gs.mastered}/${gs.total}</td><td class="n">${gs.pct}%</td><td class="n">${gs.avg != null ? gs.avg + '%' : '—'}</td><td class="n">${LETTER(gs.avg)}</td><td class="n">${fmtHours(minutes(k.id))}</td></tr></tfoot></table><p class="m">Grading: A ≥ 90 · B ≥ 80 · C ≥ 70 · D ≥ 60, based on the best quiz score in each unit. A unit is mastered at ${settings().passMark}% or higher. Bonus work is listed but not counted in the overall.</p><div class="sig"><div>Parent / teacher signature</div><div>Date</div></div></body></html>`;
    offer(k.name.replace(/\W+/g, '-') + '-grade-' + g + '-report-card.html', html);
  }
  function downloadTranscript(k) {
    const tr = transcript(k); const f = fam();
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(k.name)} transcript</title><style>${docStyle}</style></head><body><h1>${esc(f.name)}</h1><p class="m">Official homeschool transcript · ${esc(k.name)} · issued ${new Date().toLocaleDateString()}</p><table><thead><tr><th class="n">Grade</th><th>Course</th><th>Status</th><th class="n">Letter</th><th class="n">Credit</th></tr></thead><tbody>${tr.rows.map((r) => `<tr><td class="n">${r.g}</td><td>${esc(r.title)}</td><td>${r.done ? 'Completed' : 'In progress (' + r.pct + '%)'}</td><td class="n">${r.letter}</td><td class="n">${r.credit.toFixed(1)}</td></tr>`).join('')}</tbody><tfoot><tr><td colspan="3">Cumulative</td><td class="n">${tr.gpa ? 'GPA ' + tr.gpa : '—'}</td><td class="n">${tr.credits.toFixed(1)}</td></tr></tfoot></table><p class="m">GPA is unweighted on a 4.0 scale and includes completed courses only. Core courses earn 1.0 credit; AI & Me and Money Smart courses earn 0.5 credit when completed.</p><div class="sig"><div>Parent / administrator signature</div><div>Date</div></div></body></html>`;
    offer(k.name.replace(/\W+/g, '-') + '-transcript.html', html);
  }
  function downloadCSV(k) {
    const q = (s) => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
    const lines = [['Date', 'Subject', 'Minutes', 'Hours', 'Note', 'Source'].join(',')].concat(logDoc(k.id).e.slice().sort((a, b) => (a.d < b.d ? -1 : 1)).map((e) => [e.d, q(SUBJ_NAME[e.s] || e.s), e.m, (e.m / 60).toFixed(2), q(e.n), e.auto ? 'Automatic' : e.kid ? 'Learner' : 'Parent'].join(',')));
    offer(k.name.replace(/\W+/g, '-') + '-hours.csv', lines.join('\n'));
  }

  /* ─────────────── Teach the Machine (in-browser machine-learning lab) ─────────────── */
  const GRID = 16;
  function labState(key) { S.labs = S.labs || {}; return S.labs[key] || (S.labs[key] = { ex: { a: [], b: [] }, mode: 'a', right: 0, tested: 0, last: null }); }
  // Turn a drawing into 256 numbers: crop to the ink, scale to a 16×16 grid, soften, normalize.
  function vectorize(cv) {
    const W = cv.width, H = cv.height, d = cv.getContext('2d').getImageData(0, 0, W, H).data;
    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (d[(y * W + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return null;
    const side = Math.max(x1 - x0, y1 - y0) + 1, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, v = new Array(GRID * GRID).fill(0);
    for (let y = y0; y <= y1; y += 2) for (let x = x0; x <= x1; x += 2) if (d[(y * W + x) * 4 + 3] > 40) {
      const gx = Math.max(0, Math.min(GRID - 1, Math.floor(((x - cx) / side + 0.5) * GRID))), gy = Math.max(0, Math.min(GRID - 1, Math.floor(((y - cy) / side + 0.5) * GRID)));
      v[gy * GRID + gx] += 1;
    }
    const b = v.map((_, i) => { const x = i % GRID, y = Math.floor(i / GRID); let s = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < GRID && Y < GRID) s += v[Y * GRID + X] * (dx || dy ? 0.5 : 1); } return s; });
    const m = Math.sqrt(b.reduce((a, x) => a + x * x, 0)) || 1; return b.map((x) => Math.round((x / m) * 1000) / 1000);
  }
  // k-nearest neighbours: find the 3 most similar examples and let them vote (closer ones count more).
  function knn(st, v) {
    const all = []; ['a', 'b'].forEach((c) => st.ex[c].forEach((e) => all.push({ c, d: Math.sqrt(e.reduce((s, x, i) => s + (x - v[i]) * (x - v[i]), 0)) })));
    all.sort((p, q) => p.d - q.d); const k = Math.min(3, all.length), w = { a: 0, b: 0 };
    for (let i = 0; i < k; i++) w[all[i].c] += 1 / (all[i].d + 0.05);
    const c = w.a >= w.b ? 'a' : 'b'; return { c, conf: Math.round((w[c] / (w.a + w.b)) * 100) };
  }
  function thumb(v) {
    const cv = h('canvas', { width: GRID, height: GRID, class: 'lab-thumb', 'aria-hidden': 'true' }); const x = cv.getContext && cv.getContext('2d'); if (!x) return cv;
    const mx = Math.max(...v) || 1; v.forEach((val, i) => { if (val > 0) { x.fillStyle = 'rgba(30,77,59,' + Math.min(1, (val / mx) * 1.4).toFixed(2) + ')'; x.fillRect(i % GRID, Math.floor(i / GRID), 1, 1); } }); return cv;
  }
  function teachLab(u, key) {
    const L = u.lab, st = labState(key), box = h('section', { class: 'lab card', 'aria-label': 'Teach the Machine activity' });
    const name = (c) => (c === 'a' ? L.a : L.b);
    function paint() {
      box.innerHTML = '';
      const ready = st.ex.a.length > 0 && st.ex.b.length > 0;
      if (st.mode === 'test' && !ready) st.mode = 'a';
      box.appendChild(h('div', { class: 'lab-head' }, h('div', null, h('p', { class: 'eyebrow ai' }, 'Hands-on lab'), h('h3', null, 'Teach the Machine')), h('button', { class: 'btn ghost sm', type: 'button', onclick: () => { Object.assign(st, { ex: { a: [], b: [] }, mode: 'a', right: 0, tested: 0, last: null }); paint(); } }, 'Start over')));
      box.appendChild(h('p', { class: 'muted small' }, L.tip));
      box.appendChild(h('div', { class: 'lab-modes', role: 'group', 'aria-label': 'Lab step' },
        h('button', { type: 'button', class: 'lab-mode' + (st.mode === 'a' ? ' on' : ''), 'aria-pressed': st.mode === 'a' ? 'true' : 'false', onclick: () => { st.mode = 'a'; st.last = null; paint(); } }, '1 · Teach "' + L.a + '"'),
        h('button', { type: 'button', class: 'lab-mode' + (st.mode === 'b' ? ' on' : ''), 'aria-pressed': st.mode === 'b' ? 'true' : 'false', onclick: () => { st.mode = 'b'; st.last = null; paint(); } }, '2 · Teach "' + L.b + '"'),
        h('button', { type: 'button', class: 'lab-mode' + (st.mode === 'test' ? ' on' : ''), disabled: ready ? null : true, 'aria-pressed': st.mode === 'test' ? 'true' : 'false', onclick: () => { st.mode = 'test'; st.last = null; paint(); } }, '3 · Test it')));
      const pad = h('canvas', { class: 'lab-pad', width: 240, height: 240, 'aria-label': 'Drawing pad. Draw with your finger or mouse.' });
      const ctx = pad.getContext && pad.getContext('2d');
      let drawing = false, inked = false, lx = 0, ly = 0;
      const pos = (e) => { const r = pad.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * pad.width, ((e.clientY - r.top) / r.height) * pad.height]; };
      if (ctx) {
        ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 14; ctx.strokeStyle = '#1E4D3B';
        pad.addEventListener('pointerdown', (e) => { e.preventDefault(); drawing = true; inked = true; [lx, ly] = pos(e); ctx.beginPath(); ctx.arc(lx, ly, 7, 0, Math.PI * 2); ctx.fillStyle = '#1E4D3B'; ctx.fill(); try { pad.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } });
        pad.addEventListener('pointermove', (e) => { if (!drawing) return; const [x, y] = pos(e); ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(x, y); ctx.stroke(); lx = x; ly = y; });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => pad.addEventListener(ev, () => { drawing = false; }));
      }
      if (ctx && st.mode === 'test' && st.last && st.img) { const im = new Image(); im.onload = () => ctx.drawImage(im, 0, 0); im.src = st.img; }
      const clear = () => { if (ctx) ctx.clearRect(0, 0, pad.width, pad.height); inked = false; };
      const actions = h('div', { class: 'lab-actions' });
      const result = h('div', { class: 'lab-result', role: 'status', 'aria-live': 'polite' });
      if (st.mode === 'test') {
        actions.appendChild(h('button', { type: 'button', class: 'btn primary sm', onclick: () => {
          const v = inked ? vectorize(pad) : null; if (!v) { toast('Draw something first!'); return; }
          st.last = knn(st, v); st.img = pad.toDataURL(); paint();
        } }, 'Guess!'));
      } else {
        actions.appendChild(h('button', { type: 'button', class: 'btn primary sm', onclick: () => {
          const v = inked ? vectorize(pad) : null; if (!v) { toast('Draw something first!'); return; }
          st.ex[st.mode].push(v); if (st.ex[st.mode].length > 30) st.ex[st.mode].shift(); paint();
        } }, 'Add as "' + name(st.mode) + '"'));
      }
      actions.appendChild(h('button', { type: 'button', class: 'btn ghost sm', onclick: clear }, 'Clear'));
      if (st.mode === 'test' && st.last) {
        const g = st.last; const unsure = g.conf < 65;
        result.appendChild(lumi(unsure ? 'think' : 'cheer', (unsure ? 'Hmm… maybe "' : 'I think it\'s "') + name(g.c) + '"! I\'m ' + g.conf + '% sure.'));
        result.appendChild(h('div', { class: 'lab-check' }, h('span', null, 'Was the machine right?'),
          h('button', { type: 'button', class: 'btn ghost sm', onclick: () => { st.tested++; st.right++; st.last = null; paint(); } }, 'Yes'),
          h('button', { type: 'button', class: 'btn ghost sm', onclick: () => { st.tested++; st.last = null; paint(); } }, 'No')));
      } else if (st.mode !== 'test') {
        const n = st.ex[st.mode].length;
        result.appendChild(h('p', { class: 'small muted' }, n === 0 ? 'Draw a "' + name(st.mode) + '" in the box, then press Add.' : n < 4 ? 'Nice! Machines learn better with more examples. Try ' + (4 - n) + ' more.' : 'Great teaching! ' + (ready ? 'Ready to test.' : 'Now teach the other one.')));
      } else result.appendChild(h('p', { class: 'small muted' }, 'Draw a brand-new picture the machine has never seen, then press Guess.'));
      box.appendChild(h('div', { class: 'lab-body' }, h('div', { class: 'lab-padwrap' }, pad, actions), h('div', { class: 'lab-side' }, result,
        st.tested ? h('p', { class: 'lab-acc' }, 'Accuracy: ', h('b', null, st.right + ' of ' + st.tested + ' (' + Math.round((st.right / st.tested) * 100) + '%)')) : null,
        ['a', 'b'].map((c) => h('div', { class: 'lab-set' }, h('p', { class: 'small' }, h('b', null, name(c)), ' · ' + st.ex[c].length + ' example' + (st.ex[c].length === 1 ? '' : 's')), h('div', { class: 'lab-thumbs' }, st.ex[c].slice(-12).map(thumb)))))));
      box.appendChild(h('p', { class: 'hint' }, 'How it works: your drawing becomes 256 numbers. The machine compares a new drawing with the examples you taught it and picks the closest ones. This is called "nearest neighbors."'));
    }
    paint();
    return box;
  }

  /* ─────────────── Reading, spelling & writing ─────────────── */
  // One document per learner: lit-{kidId} = { spell: {listId: {best,last,tries,at}}, tricky: {word: {id,box,due,miss}}, sg: grade, books: [...], jr: [...] }
  const SPELL = window.LH_SPELL || {};
  const litDoc = (id) => Store.cache['lit-' + id] || (Store.cache['lit-' + id] = { spell: {}, tricky: {}, books: [], jr: [] });
  function saveLit(id) { const d = litDoc(id); d.books = (d.books || []).slice(-500); d.jr = (d.jr || []).slice(0, 200); Store.set('lit-' + id, d); }
  const spellList = (id) => { const g = parseInt(id, 10); return (SPELL[g] || []).find((l) => l.id === id); };
  const band = (g) => (g <= 3 ? 0 : g <= 6 ? 1 : g <= 8 ? 2 : 3);
  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return todayStr(d); };
  const BOX_DAYS = [1, 3, 7, 14];
  function booksFinished(kidId) { const t = {}; (litDoc(kidId).books || []).forEach((b) => { if (b.fin) t[b.t.trim().toLowerCase()] = 1; }); return Object.keys(t).length; }
  const readingMinutes = (kidId, from) => minutes(kidId, (e) => e.s === 'read' && (!from || e.d >= from));
  function trickyDue(kidId) { const tr = litDoc(kidId).tricky || {}; const t = todayStr(); return Object.keys(tr).filter((w) => tr[w].due <= t); }
  const wordCount = (t) => (String(t || '').trim().match(/[A-Za-z0-9'’-]+/g) || []).length;
  const JOURNAL_GOAL = [20, 60, 120, 200];
  const PROMPTS = [
    ['Write about your favorite animal. What does it look like and what does it do?', 'Tell about the best day you ever had.', 'If you could have any pet, what would it be? Why?', 'Write about something that makes you laugh.', 'What do you like to do when it rains?', 'Write a story about a talking tree.', 'Tell how to make your favorite snack, step by step.', 'Who is someone you love? What do you like to do together?', 'If you were a superhero, what would your power be?', 'Write about a place you like to go.', 'What did you learn this week?', 'Describe your bedroom so someone could picture it.', 'Write a story that starts: "I opened the door and saw…"', 'What is something you are good at?', 'If you could fly, where would you go?'],
    ['Write about a time you were proud of yourself. What happened?', 'If you could invent something, what would it be and how would it help people?', 'Describe a place using all five senses.', 'Write a letter to your future self ten years from now.', 'What is the most interesting thing you learned this week? Explain it.', 'Write a story about a kid who finds a mysterious map.', 'Should kids get paid for chores? Give reasons.', 'Tell about a challenge you faced and how you handled it.', 'If you could visit any time in history, when would you go and why?', 'Describe your perfect weekend.', 'Write about a book or movie character you would like to meet.', 'What makes a good friend? Use examples.', 'Write a story told by a lost sock.', 'What rule would you add to your home? Convince your family.', 'Write about something you want to get better at, and your plan.'],
    ['What is one thing you would change about your town? Explain how and why.', 'Write about a mistake that taught you something.', 'Describe a goal you have for this year and the steps to reach it.', 'Is it better to be a leader or a team player? Defend your answer.', 'Write a short story where the main character has to make a hard choice.', 'Which invention has changed the world the most? Explain.', 'Write about a song, book or game that means a lot to you.', 'Should phones be allowed at the dinner table? Argue one side.', 'Describe a person you admire and what makes them admirable.', 'What would you do with one day of complete freedom?', 'Write a news story about something that happened at home this week.', 'If you could solve one world problem, which would it be and how?', 'Explain how to do something you are good at, so a beginner could do it.', 'Write about a time you changed your mind about something.', 'Write a dialogue between two characters who disagree.'],
    ['What does success mean to you? How might your answer change in ten years?', 'Argue for or against a four-day school week, using evidence.', 'Write about a belief you hold and where it came from.', 'Should artificial intelligence be used to grade essays? Make your case.', 'Reflect on a book that changed how you see the world.', 'Write a personal narrative about a turning point in your life.', 'What is one skill every adult should have? Persuade the reader.', 'Analyze a news headline: what does it want you to feel, and how?', 'Describe the career you might want and what draws you to it.', 'Is it more important to be kind or to be honest? Explore both sides.', 'Write a short story that ends with a surprising twist.', 'What would you tell your younger self? Be specific.', 'Should social media have age limits? Take a position.', 'Write about a problem in your community and a realistic solution.', 'What does it mean to be a good citizen?']
  ];
  const READ_PROMPT = ['Who was in the story? What happened?', 'What was the most important thing that happened? Why?', 'What problem did a character face, and how was it solved?', 'What is the author saying? Describe one part that stood out to you.'];
  const RATINGS = [['4', 'Loved it'], ['3', 'Liked it'], ['2', 'It was okay'], ['1', 'Didn\'t like it']];

  function say(text, rate) {
    const sy = Player.synth; if (!sy) return false;
    try { sy.cancel(); const u = new SpeechSynthesisUtterance(text); if (Player.voice) { u.voice = Player.voice; u.lang = Player.voice.lang; } else u.lang = 'en-US'; u.rate = Math.max(0.4, Math.min(2, (rate || 0.9) * (Player.rate || 1))); sy.speak(u); return true; } catch (e) { return false; }
  }
  const blankOut = (sentence, w) => sentence.replace(new RegExp('(^|[^A-Za-z])(' + w + ')(?=[^A-Za-z]|$)', 'gi'), (m, a) => a + '_____');

  /* ── home cards ── */
  function litCards(k) {
    const L = litDoc(k.id), g = L.sg || k.grade, lists = SPELL[g] || [], pass = settings().passMark;
    const mastered = lists.filter((l) => (L.spell[l.id] || {}).best >= pass).length, due = trickyDue(k.id).length;
    const jr = L.jr || [], unseen = jr.some((e) => e.pn && !e.seen);
    return h('div', { class: 'lit-cards' },
      h('article', { class: 'lit-card spell' }, h('div', { class: 'lit-ico', 'aria-hidden': 'true' }, 'Aa'), h('h3', null, 'Spelling'),
        h('p', { class: 'muted small' }, mastered + ' of ' + lists.length + ' ' + GRADE_NAME(g) + ' lists mastered' + (due ? ' · ' + due + ' tricky word' + (due === 1 ? '' : 's') + ' to review' : '')),
        bar(lists.length ? Math.round((mastered / lists.length) * 100) : 0, 'ela'),
        h('button', { class: 'btn primary sm', onclick: () => { S.sp = null; go('spell'); } }, due ? 'Review tricky words' : 'Practice spelling')),
      h('article', { class: 'lit-card read' }, h('div', { class: 'lit-ico', 'aria-hidden': 'true' }, h('span', { class: 'book-ico' })), h('h3', null, 'Reading log'),
        h('p', { class: 'muted small' }, fmtHours(readingMinutes(k.id, weekStart())) + ' h read this week · ' + booksFinished(k.id) + ' book' + (booksFinished(k.id) === 1 ? '' : 's') + ' finished'),
        h('button', { class: 'btn primary sm', onclick: () => go('reading') }, 'Log my reading')),
      h('article', { class: 'lit-card write' }, h('div', { class: 'lit-ico', 'aria-hidden': 'true' }, '✎'), h('h3', null, 'My journal'),
        h('p', { class: 'muted small' }, unseen ? 'You have a new note from your grown-up!' : jr.length + ' entr' + (jr.length === 1 ? 'y' : 'ies') + ' written'),
        h('button', { class: 'btn primary sm', onclick: () => go('journal') }, 'Write today')),
      esCard(k));
  }
  function litBack() { return h('button', { class: 'btn ghost sm back', onclick: () => { S.sp = null; go('home'); } }, '← Dashboard'); }

  /* ── spelling ── */
  function startSpell(kidId, list, review) {
    let words;
    if (review) {
      const tr = litDoc(kidId).tricky; words = trickyDue(kidId).slice(0, 10).map((w) => { const l = spellList(tr[w].id); const row = l && l.w.find((x) => x[0] === w); return row || [w, '']; });
    } else words = shuffle(list.w);
    S.sp = { id: review ? null : list.id, title: review ? 'Tricky words review' : list.t, tip: review ? 'These are words you missed before. Get each one right a few times and it leaves the list.' : list.tip, words, at: 0, right: 0, missed: [], helped: [], phase: 'ask', review: !!review, spoken: -1, hint: false };
    go('spell', { play: 1 });
  }
  function spellAnswer(val) {
    const sp = S.sp, w = sp.words[sp.at][0]; val = String(val || '').trim();
    if (!val) return;
    if (sp.phase === 'fix') { if (val.toLowerCase() === w.toLowerCase()) spellNext(); else { sp.fixErr = true; render(); } return; }
    sp.last = val;
    if (val.toLowerCase() === w.toLowerCase()) { sp.right++; if (sp.hint) sp.helped.push(w); sp.phase = 'right'; render(); setTimeout(() => { if (S.sp === sp && sp.phase === 'right') spellNext(); }, 900); }
    else { sp.missed.push(w); sp.phase = 'fix'; render(); }
  }
  function spellNext() {
    const sp = S.sp; sp.at++; sp.phase = 'ask'; sp.hint = false; sp.fixErr = false; sp.last = '';
    if (sp.at >= sp.words.length) return spellFinish();
    render();
  }
  function spellFinish() {
    const sp = S.sp, kidId = S.who, L = litDoc(kidId); L.tricky = L.tricky || {}; L.spell = L.spell || {};
    const score = Math.round((sp.right / sp.words.length) * 100), pass = settings().passMark;
    const findList = (w) => (sp.id ? sp.id : (L.tricky[w] || {}).id);
    sp.words.forEach(([w]) => {
      const missed = sp.missed.includes(w), helped = sp.helped.includes(w), t = L.tricky[w];
      if (missed || helped) L.tricky[w] = { id: findList(w), box: 0, due: addDays(1), miss: ((t && t.miss) || 0) + (missed ? 1 : 0) };
      else if (t && sp.review) { const box = t.box + 1; if (box >= BOX_DAYS.length) delete L.tricky[w]; else L.tricky[w] = Object.assign(t, { box, due: addDays(BOX_DAYS[box]) }); }
    });
    if (sp.id) { const prev = L.spell[sp.id]; L.spell[sp.id] = { best: Math.max(score, prev ? prev.best : 0), last: score, tries: (prev ? prev.tries : 0) + 1, at: Date.now() }; }
    saveLit(kidId); markAct(kidId, 'spell'); Timer.accrue(); Timer.flush(); checkBadges(kidId);
    sp.phase = 'done'; sp.score = score; sp.pass = score >= pass; if (sp.pass) setTimeout(confetti, 50); render();
  }
  function viewSpell() {
    const k = kidById(S.who); if (!k) return viewPicker();
    if (!Timer.on || Timer.on.kidId !== k.id || Timer.on.subj !== 'ela') Timer.start(k.id, 'ela');
    const L = litDoc(k.id), sp = S.sp; const main = h('main', { class: 'wrap spell' });
    if (sp && S.view.play) { main.appendChild(spellPlay(k, sp)); return h('div', null, kidBar(), main); }
    const g = S.view.study ? parseInt(S.view.study, 10) : (L.sg || k.grade), pass = settings().passMark;
    main.appendChild(litBack());
    if (S.view.study) {
      const l = spellList(S.view.study);
      main.appendChild(h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, GRADE_NAME(g) + ' spelling'), h('h1', null, l.t), h('p', { class: 'lede' }, l.tip)));
      main.appendChild(h('p', { class: 'hint' }, 'Study the words: look, say it out loud, cover it, write it on paper, then check. Tap a word to hear it.'));
      main.appendChild(h('ul', { class: 'study-words' }, l.w.map(([w, s]) => h('li', null, h('button', { type: 'button', class: 'sw-btn', onclick: () => say(w + '. ' + s, 0.85) }, h('b', null, w), h('span', { class: 'muted small' }, s))))));
      main.appendChild(h('div', { class: 'actions' }, h('button', { class: 'btn primary', onclick: () => startSpell(k.id, l) }, 'Test me on these'), h('button', { class: 'btn ghost', onclick: () => go('spell') }, 'All lists')));
      return h('div', null, kidBar(), main);
    }
    const maxG = settings().freeRoam ? 12 : k.grade;
    main.appendChild(h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, 'Spelling'), h('h1', null, 'Spelling practice'),
      h('p', { class: 'lede' }, 'Listen to each word in a sentence, then type it. Words you miss come back for review a few days later until you\'ve got them.'),
      h('div', { class: 'grade-switch' }, h('label', { for: 'sp-g' }, 'Word lists for'), h('select', { id: 'sp-g', onchange: (e) => { L.sg = Number(e.target.value); saveLit(k.id); render(); } }, Array.from({ length: maxG }, (_, i) => h('option', { value: i + 1, selected: g === i + 1 ? true : null }, GRADE_NAME(i + 1) + (i + 1 === k.grade ? ' (my grade)' : '')))))));
    if (!Player.synth) main.appendChild(h('div', { class: 'banner' }, 'This browser can\'t read words aloud, so each word will flash for a few seconds instead. Look at it, then type it from memory.'));
    const due = trickyDue(k.id), allT = Object.keys(L.tricky || {});
    if (allT.length) main.appendChild(h('article', { class: 'card tricky-card' }, h('div', null, h('h3', null, 'My tricky words'), h('p', { class: 'muted small' }, due.length ? due.length + ' ready to review today · ' + allT.length + ' on your list' : 'Nothing due today. ' + allT.length + ' word' + (allT.length === 1 ? '' : 's') + ' will come back soon.')),
      due.length ? h('button', { class: 'btn primary sm', onclick: () => startSpell(k.id, null, true) }, 'Review ' + Math.min(10, due.length) + ' words') : null));
    main.appendChild(h('div', { class: 'spell-lists' }, (SPELL[g] || []).map((l, i) => {
      const r = L.spell[l.id]; const st = !r ? ['new', 'New'] : r.best >= pass ? ['mastered', 'Mastered · ' + r.best + '%'] : ['trying', 'Best ' + r.best + '%'];
      return h('article', { class: 'card spell-list' }, h('div', { class: 'sl-top' }, h('span', { class: 'unit-n' }, 'List ' + (i + 1)), h('span', { class: 'pill ' + st[0] }, st[1])), h('h3', null, l.t), h('p', { class: 'muted small' }, l.tip),
        h('div', { class: 'actions' }, h('button', { class: 'btn primary sm', onclick: () => startSpell(k.id, l) }, r ? 'Test again' : 'Test me'), h('button', { class: 'btn ghost sm', onclick: () => go('spell', { study: l.id }) }, 'Study words')));
    })));
    return h('div', null, kidBar(), main);
  }
  function spellPlay(k, sp) {
    const wrap = h('section', { class: 'spell-play' });
    wrap.appendChild(h('button', { class: 'btn ghost sm back', onclick: () => { S.sp = null; go('spell'); } }, '← Word lists'));
    if (sp.phase === 'done') {
      const st = h('div', { class: 'result-stars' }); st.innerHTML = window.LH_STARS ? window.LH_STARS(sp.score >= 100 ? 3 : sp.pass ? 2 : sp.score >= 40 ? 1 : 0) : '';
      wrap.appendChild(h('div', { class: 'result-card ' + (sp.pass ? 'pass' : 'retry') }, st, ring(sp.score, sp.right + ' of ' + sp.words.length, 'lg'),
        lumi(sp.pass ? 'cheer' : 'think', sp.pass ? (sp.score === 100 ? 'Every word right! Amazing spelling!' : 'Great spelling! Keep it up.') : 'Good practice! Study the words and try again.'),
        h('h1', null, sp.review ? 'Review done!' : sp.pass ? 'List mastered!' : 'Keep practicing'),
        sp.missed.length ? h('div', { class: 'missed' }, h('p', null, 'Words to practice (they\'ll come back for review):'), h('ul', { class: 'chips' }, sp.missed.map((w) => h('li', null, h('button', { type: 'button', class: 'chip-btn', onclick: () => say(w, 0.8) }, w))))) : null,
        h('div', { class: 'actions' },
          !sp.review ? h('button', { class: 'btn primary', onclick: () => startSpell(k.id, spellList(sp.id)) }, 'Try this list again') : null,
          trickyDue(k.id).length && sp.review ? h('button', { class: 'btn primary', onclick: () => startSpell(k.id, null, true) }, 'Review more') : null,
          h('button', { class: 'btn ghost', onclick: () => { S.sp = null; go('spell'); } }, 'All word lists'))));
      return wrap;
    }
    const [w, sentence] = sp.words[sp.at];
    const hear = () => say(w + '. ' + (sentence ? sentence + ' ' : '') + w + '.', 0.9);
    if (sp.spoken !== sp.at && sp.phase === 'ask') { sp.spoken = sp.at; if (Player.synth) setTimeout(hear, 250); else { sp.flash = true; setTimeout(() => { if (S.sp === sp) { sp.flash = false; render(); } }, 3000); } }
    wrap.appendChild(h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, sp.title + ' · word ' + (sp.at + 1) + ' of ' + sp.words.length), bar(Math.round((sp.at / sp.words.length) * 100), 'ela')));
    const card = h('div', { class: 'spell-card card' });
    card.appendChild(h('div', { class: 'sp-audio' },
      Player.synth ? h('button', { type: 'button', class: 'btn primary', onclick: hear }, icon('voice'), ' Hear the word') : h('button', { type: 'button', class: 'btn primary', onclick: () => { sp.flash = true; render(); setTimeout(() => { if (S.sp === sp) { sp.flash = false; render(); } }, 3000); } }, 'Show the word again'),
      Player.synth ? h('button', { type: 'button', class: 'btn ghost', onclick: () => say(w, 0.55) }, 'Say it slowly') : null,
      sp.phase === 'ask' && !sp.hint ? h('button', { type: 'button', class: 'btn ghost', onclick: () => { sp.hint = true; render(); } }, 'Hint') : null));
    if (sp.flash && sp.phase === 'ask') card.appendChild(h('p', { class: 'sp-flash' }, w));
    if (sentence) card.appendChild(h('p', { class: 'sp-sentence' }, blankOut(sentence, w)));
    if (sp.hint && sp.phase === 'ask') card.appendChild(h('p', { class: 'sp-hint', 'aria-label': 'Starts with ' + w[0] + ', ' + w.length + ' letters' }, w[0] + ' ' + Array(w.length).join('_ ').trim() + '  (' + w.length + ' letters)'));
    if (sp.phase === 'right') card.appendChild(h('p', { class: 'sp-ok', role: 'status' }, '✓ Correct: ' + w));
    if (sp.phase === 'fix') {
      const lw = sp.last.toLowerCase(), cw = w.toLowerCase();
      card.appendChild(h('div', { class: 'sp-wrong', role: 'status' },
        h('p', null, 'You wrote: ', h('span', { class: 'sp-try' }, Array.from(sp.last).map((c, i) => h('span', { class: lw[i] === cw[i] ? '' : 'bad' }, c)))),
        h('p', null, 'It\'s spelled: ', h('b', { class: 'sp-right' }, w)),
        h('p', { class: 'small' }, sp.fixErr ? 'Not quite. Look carefully and type it once more.' : 'Type it correctly once to lock it in.')));
    }
    if (sp.phase !== 'right') {
      const inp = h('input', { id: 'sp-in', class: 'sp-input', autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': sp.phase === 'fix' ? 'Type the word correctly' : 'Type the word you hear', maxlength: 40 });
      card.appendChild(h('form', { class: 'sp-form', onsubmit: (e) => { e.preventDefault(); spellAnswer(inp.value); } }, inp, h('button', { class: 'btn primary', type: 'submit' }, sp.phase === 'fix' ? 'Next word' : 'Check')));
      setTimeout(() => { const x = $('#sp-in'); if (x) x.focus(); }, 30);
    }
    wrap.appendChild(card);
    wrap.appendChild(h('p', { class: 'muted small' }, sp.tip));
    return wrap;
  }

  /* ── book picks: free curated books + the family bookshelf (e.g. Kindle titles the parent adds) ── */
  const BOOKS = window.LH_BOOKS || [];
  const WHERE = { kindle: 'Kindle', hoopla: 'Hoopla', home: 'Book at home', library: 'Library book', online: 'Online' };
  const HOOPLA_URL = 'https://www.hoopladigital.com/';
  const hooplaSearch = (t) => HOOPLA_URL + 'search?q=' + encodeURIComponent(t) + '&scope=everything';
  async function hooplaOpen(b) { try { await navigator.clipboard.writeText(b.t); toast('Opening Hoopla. "' + b.t + '" is copied, so you can paste it into Hoopla\'s search if it doesn\'t show up.'); } catch (e) { toast('Opening Hoopla. Search for "' + b.t + '".'); } }
  const KINDLE_URL = 'https://read.amazon.com/kindle-library';
  const shelfFor = (kidId) => ((fam() && fam().shelf) || []).filter((b) => !b.kids || !b.kids.length || b.kids.includes(kidId));
  function pickBook(b) {
    const t = $('#rd-title'), a = $('#rd-auth'); if (!t) return;
    t.value = b.t; a.value = b.a || ''; const f = t.closest('form'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { const m = $('#rd-min'); if (m) m.focus(); }, 350); toast('Great pick! Log your minutes when you finish reading.');
  }
  const KINDLE_PLAY = 'https://play.google.com/store/apps/details?id=com.amazon.kindle';
  const KINDLE_INTENT = 'intent://#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;package=com.amazon.kindle;S.browser_fallback_url=' + encodeURIComponent(KINDLE_PLAY) + ';end';
  async function kindleApp(b) {
    if (/CrOS|Android/.test(navigator.userAgent)) { try { window.open(KINDLE_INTENT, '_blank', 'noopener'); } catch (e) { /* not supported: the steps below still help */ } }
    S.kindleCopied = false;
    try { await navigator.clipboard.writeText(b.t); S.kindleCopied = true; } catch (e) { /* clipboard blocked */ }
    S.kindleTip = b.t; render(); const el = $('.kindle-tip'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function booksForMe(k, books) {
    const g = k.grade, mode = S.bf || 'mine', done = {};
    books.forEach((b) => { if (b.fin) done[b.t.trim().toLowerCase()] = 1; });
    const shelf = shelfFor(k.id).map((b) => ({ t: b.t, a: b.a, k: b.w, u: b.u || (b.w === 'kindle' && settings().kindleWeb ? KINDLE_URL : ''), d: WHERE[b.w] ? 'From our family bookshelf · ' + WHERE[b.w] : 'From our family bookshelf', mine: true }));
    const lists = {
      mine: shelf.concat(BOOKS.filter((b) => b.g[0] <= g && g <= b.g[1])),
      easier: BOOKS.filter((b) => b.g[1] < g && b.g[1] >= g - 3),
      harder: BOOKS.filter((b) => b.g[0] > g && b.g[0] <= g + 2),
      shelf
    };
    const list = lists[mode] || lists.mine;
    const tabs = [['mine', 'For my grade'], ['easier', 'Easier'], ['harder', 'A challenge'], ['shelf', 'Our bookshelf' + (shelf.length ? ' (' + shelf.length + ')' : '')]].filter(([key]) => key !== 'easier' || lists.easier.length).filter(([key]) => key !== 'harder' || lists.harder.length);
    const tag = (b) => b.k === 'video' ? 'Read-aloud video' : b.k === 'ebook' ? 'Free e-book' : WHERE[b.k] || 'Our book';
    return h('section', { class: 'card books-for-me' },
      h('div', { class: 'card-head' }, h('h3', null, 'Books for me'), h('span', { class: 'small muted' }, 'Pick a book, then tap "I\'m reading this" to log it')),
      S.kindleTip ? h('div', { class: 'kindle-tip', role: 'status' },
        h('p', null, h('b', null, 'Open the Kindle app'), ' — if it didn\'t open by itself, find Kindle in your app launcher (or tap Open on the Play Store page). Then find "' + S.kindleTip + '" in your library.' + (S.kindleCopied ? ' The title is copied, so you can paste it into Kindle\'s search.' : '')),
        h('p', { class: 'small' }, 'Come back here when you finish reading to log your minutes. Never sign in to Amazon yourself — ask your grown-up.'),
        h('button', { type: 'button', class: 'btn ghost xs', onclick: () => { S.kindleTip = null; render(); } }, 'Got it')) : null,
      settings().hoopla ? h('div', { class: 'hoopla-bar' }, h('span', null, '📚 ', h('b', null, 'Hoopla'), ' · free e-books, read-alongs, comics and audiobooks from your library'), h('a', { class: 'btn ghost xs', href: HOOPLA_URL, target: '_blank', rel: 'noopener noreferrer' }, 'Browse Hoopla', h('span', { class: 'sr-only' }, ' (opens in a new tab)')), h('span', { class: 'small muted' }, 'Tip: tap KIDS at the top of Hoopla to see only kids\' books. Ask your grown-up before you borrow — your library allows a few borrows each month.')) : null,
      h('div', { class: 'bf-tabs', role: 'tablist' }, tabs.map(([key, n]) => h('button', { type: 'button', role: 'tab', 'aria-selected': mode === key ? 'true' : 'false', class: 'gchip' + (mode === key ? ' on' : ''), onclick: () => { S.bf = key; render(); } }, n))),
      list.length ? h('ul', { class: 'bf-grid' }, list.map((b) => { const fin = done[b.t.trim().toLowerCase()];
        return h('li', { class: 'bf-card ' + (b.k || 'other') + (fin ? ' read' : '') },
          h('span', { class: 'bf-tag' }, fin ? '✓ Finished' : tag(b)), h('b', { class: 'bf-t' }, b.t), b.a ? h('span', { class: 'small muted' }, b.a) : null,
          b.mine ? null : h('span', { class: 'small' }, b.d), b.note ? h('span', { class: 'small bf-note' }, b.note) : null,
          h('div', { class: 'bf-actions' },
            b.k === 'kindle' && !b.u ? h('button', { type: 'button', class: 'btn ghost xs', onclick: () => kindleApp(b) }, 'Read in Kindle app') : null,
            b.k === 'hoopla' ? h('a', { class: 'btn ghost xs', href: b.u || hooplaSearch(b.t), target: '_blank', rel: 'noopener noreferrer', onclick: () => { if (!b.u) hooplaOpen(b); } }, b.u ? 'Open in Hoopla' : 'Find on Hoopla', h('span', { class: 'sr-only' }, ' (opens in a new tab)')) : null,
            b.k === 'video' ? h('a', { class: 'btn ghost xs', href: 'https://www.youtubekids.com/search?q=' + encodeURIComponent('Storyline Online ' + b.t), target: '_blank', rel: 'noopener noreferrer' }, 'YouTube Kids', h('span', { class: 'sr-only' }, ' (opens in a new tab)')) : null,
            b.u && b.k !== 'hoopla' ? h('a', { class: 'btn ghost xs', href: b.u, target: '_blank', rel: 'noopener noreferrer' }, b.k === 'video' ? 'Watch & read' : b.k === 'kindle' ? 'Open Kindle' : 'Open book', h('span', { class: 'sr-only' }, ' (opens in a new tab)')) : null,
            h('button', { type: 'button', class: 'btn primary xs', onclick: () => pickBook(b) }, 'I\'m reading this'))); }))
        : h('p', { class: 'muted small' }, mode === 'shelf' ? 'No books here yet. Ask your grown-up to add books from home, Kindle or Hoopla.' : 'No books in this list.'),
      list.some((b) => b.k === 'video') ? h('p', { class: 'small muted' }, 'Video says "try watching in YouTube Kids"? Tap the YouTube Kids button on that book instead.') : null);
  }

  /* ── reading log ── */
  function viewReading() {
    const k = kidById(S.who); if (!k) return viewPicker();
    const L = litDoc(k.id), books = L.books || [], g = k.grade;
    const main = h('main', { class: 'wrap reading' }, litBack());
    main.appendChild(h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, 'Reading'), h('h1', null, 'My reading log'),
      h('div', { class: 'stat-row' }, stat(fmtHours(readingMinutes(k.id, weekStart())) + ' h', 'this week'), stat(fmtHours(readingMinutes(k.id, settings().yearStart)) + ' h', 'this school year'), stat(String(booksFinished(k.id)), 'books finished'))));
    const reading = []; books.slice().reverse().forEach((b) => { const key = b.t.trim().toLowerCase(); if (!reading.some((x) => x.t.trim().toLowerCase() === key)) reading.push(b); });
    const open = reading.filter((b) => !books.some((x) => x.fin && x.t.trim().toLowerCase() === b.t.trim().toLowerCase())).slice(0, 6);
    const ratingSel = h('select', { id: 'rd-rate' }, h('option', { value: '' }, 'Choose…'), RATINGS.map(([v, n]) => h('option', { value: v }, n)));
    const form = h('form', { class: 'card form', onsubmit: (e) => {
      e.preventDefault(); const t = $('#rd-title').value.trim(), a = $('#rd-auth').value.trim(), m = Math.round(Number($('#rd-min').value)), p = Math.round(Number($('#rd-pages').value) || 0), fin = $('#rd-fin').checked, note = $('#rd-note').value.trim(), err = $('#rd-err');
      if (!t) return (err.textContent = 'Write the name of the book.');
      if (!(m >= 1 && m <= 300)) return (err.textContent = 'How many minutes did you read? (1 to 300)');
      const d = todayStr();
      books.push({ id: uid(), d, t: t.slice(0, 80), a: a.slice(0, 60), m, p, fin, r: ratingSel.value || null, note: note.slice(0, 1000) }); L.books = books; saveLit(k.id);
      const log = logDoc(k.id); log.e.push({ id: uid(), d, s: 'read', m, n: 'Reading: ' + t.slice(0, 60), auto: false, kid: true }); saveLog(k.id); markAct(k.id, 'read');
      markActive(k.id); checkBadges(k.id); toast(fin ? 'You finished a book! Great reading!' : 'Reading logged: ' + m + ' minutes.'); if (fin) confetti(); render();
    } }, h('h3', null, 'What did you read today?'),
      open.length ? h('div', { class: 'chips-row' }, h('span', { class: 'small muted' }, 'Still reading: '), open.map((b) => h('button', { type: 'button', class: 'chip-btn', onclick: () => { $('#rd-title').value = b.t; $('#rd-auth').value = b.a || ''; $('#rd-min').focus(); } }, b.t))) : null,
      h('div', { class: 'row2' }, h('div', null, h('label', { for: 'rd-title' }, 'Book title'), h('input', { id: 'rd-title', maxlength: 80, autocomplete: 'off' })), h('div', null, h('label', { for: 'rd-auth' }, 'Author (if you know it)'), h('input', { id: 'rd-auth', maxlength: 60, autocomplete: 'off' }))),
      h('div', { class: 'row4' }, h('div', null, h('label', { for: 'rd-min' }, 'Minutes'), h('input', { id: 'rd-min', type: 'number', min: 1, max: 300, step: 1, value: g <= 3 ? 15 : 20 })), h('div', null, h('label', { for: 'rd-pages' }, 'Pages (optional)'), h('input', { id: 'rd-pages', type: 'number', min: 0, max: 2000 })), h('div', null, h('label', { for: 'rd-rate' }, 'How was it?'), ratingSel), h('div', { class: 'fin-box' }, h('label', { class: 'check' }, h('input', { id: 'rd-fin', type: 'checkbox' }), ' I finished the book!'))),
      h('label', { for: 'rd-note' }, READ_PROMPT[band(g)] + ' (optional)'), h('textarea', { id: 'rd-note', rows: 3, maxlength: 1000 }),
      h('p', { id: 'rd-err', class: 'err', role: 'alert' }), h('button', { class: 'btn primary', type: 'submit' }, 'Save reading'));
    main.appendChild(booksForMe(k, books));
    main.appendChild(form);
    const fin = []; books.forEach((b) => { if (b.fin && !fin.some((x) => x.t.trim().toLowerCase() === b.t.trim().toLowerCase())) fin.push(b); });
    if (fin.length) main.appendChild(h('article', { class: 'card' }, h('h3', null, 'My bookshelf'), h('ul', { class: 'shelf' }, fin.map((b, i) => h('li', { class: 'spine', style: '--sp:' + COLORS[i % COLORS.length] }, h('b', null, b.t), b.a ? h('small', null, b.a) : null)))));
    if (books.length) main.appendChild(h('article', { class: 'card' }, h('h3', null, 'Recent reading'), h('ul', { class: 'read-list' }, books.slice().reverse().slice(0, 15).map((b) => h('li', null, h('span', { class: 'small muted' }, fmtDate(b.d)), h('b', null, b.t), h('span', { class: 'small' }, b.m + ' min' + (b.p ? ' · ' + b.p + ' pages' : '') + (b.fin ? ' · finished' : '') + (b.r ? ' · ' + RATINGS.find((x) => x[0] === b.r)[1] : '')), b.note ? h('p', { class: 'small read-note' }, b.note) : null)))));
    main.appendChild(h('article', { class: 'card' }, h('h3', null, 'Free books to read'), h('ul', { class: 'res-list' },
      (g <= 4 ? [['Storyline Online — picture books read aloud', 'https://storylineonline.net/library'], ['Starfall — learn to read', 'https://www.starfall.com/h/learn-to-read/']] : []).concat(g >= 3 ? [['CommonLit — free reading passages', 'https://www.commonlit.org/texts']] : [], [['Project Gutenberg — free classic books', 'https://www.gutenberg.org/ebooks/bookshelf/20']]).map((r) => h('li', null, extLink(r)))),
      h('p', { class: 'small muted' }, 'Your local library is great too — many have free e-books you can borrow.')));
    return h('div', null, kidBar(), main);
  }

  /* ── writing journal ── */
  function viewJournal() {
    const k = kidById(S.who); if (!k) return viewPicker();
    if (!Timer.on || Timer.on.kidId !== k.id || Timer.on.subj !== 'ela') Timer.start(k.id, 'ela');
    const L = litDoc(k.id); L.jr = L.jr || []; const b = band(k.grade), list = PROMPTS[b], goal = JOURNAL_GOAL[b];
    if (L.jr.some((e) => e.pn && !e.seen)) { L.jr.forEach((e) => { if (e.pn) e.seen = true; }); saveLit(k.id); }
    if (S.jp == null) { const d = new Date(); S.jp = (d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate()) % list.length; }
    const prompt = S.jp === -1 ? 'Write about anything you like.' : list[S.jp % list.length];
    const main = h('main', { class: 'wrap journal' }, litBack());
    main.appendChild(h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, 'Writing'), h('h1', null, 'My journal')));
    const count = h('span', { class: 'wc' }); const upd = (t) => { const n = wordCount(t); count.textContent = n + ' word' + (n === 1 ? '' : 's') + ' · goal ' + goal; count.classList.toggle('good', n >= goal); };
    const ta = h('textarea', { id: 'jr-text', rows: 9, maxlength: 3000, placeholder: 'Start writing here…', 'aria-label': 'Your writing' });
    ta.value = S.jdraft || ''; upd(ta.value); ta.addEventListener('input', () => { S.jdraft = ta.value; upd(ta.value); });
    main.appendChild(h('form', { class: 'card form journal-form', onsubmit: (e) => {
      e.preventDefault(); const t = ta.value.trim(); const err = $('#jr-err');
      if (wordCount(t) < 3) return (err.textContent = 'Write a little more first.');
      L.jr.unshift({ id: uid(), d: todayStr(), at: Date.now(), p: prompt, t }); S.jdraft = ''; saveLit(k.id); markAct(k.id, 'write'); markActive(k.id); checkBadges(k.id);
      toast(wordCount(t) >= goal ? 'Saved! You reached your word goal!' : 'Saved to your journal.'); if (wordCount(t) >= goal) confetti(); render();
    } },
      h('div', { class: 'prompt-box' }, h('p', { class: 'eyebrow' }, 'Today\'s prompt'), h('p', { class: 'prompt' }, prompt),
        h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn ghost xs', onclick: () => { S.jp = S.jp === -1 ? 0 : (S.jp + 1) % list.length; render(); } }, 'Different prompt'), h('button', { type: 'button', class: 'btn ghost xs', onclick: () => { S.jp = -1; render(); } }, 'Free write'))),
      ta, h('div', { class: 'jr-foot' }, count, h('span', { class: 'small muted' }, 'Tip: read it out loud when you finish. Fix anything that sounds wrong.')),
      h('p', { id: 'jr-err', class: 'err', role: 'alert' }), h('button', { class: 'btn primary', type: 'submit' }, 'Save my writing')));
    if (L.jr.length) {
      main.appendChild(h('h2', { class: 'sec' }, 'My entries'));
      main.appendChild(h('ol', { class: 'jr-list' }, L.jr.slice(0, 20).map((e) => h('li', { class: 'card jr-entry' },
        h('p', { class: 'small muted' }, fmtDate(e.d) + ' · ' + wordCount(e.t) + ' words'), h('p', { class: 'jr-prompt' }, e.p), h('p', { class: 'jr-text' }, e.t),
        e.fb ? h('div', { class: 'jr-fb' }, h('b', null, 'Lumi says: '), e.fb) : null,
        e.pn ? h('div', { class: 'jr-pn' }, h('b', null, 'Note from your grown-up: '), e.pn) : null,
        !e.fb && lumiReady(k.id) && wordCount(e.t) >= 10 ? h('button', { class: 'btn ghost xs', disabled: S.jbusy ? true : null, onclick: () => lumiWriting(k, e) }, S.jbusy === e.id ? 'Lumi is reading…' : 'Ask Lumi for feedback') : null))));
    }
    return h('div', null, kidBar(), main);
  }
  async function lumiWriting(k, e) {
    if (S.jbusy) return;
    if (lumiToday(k.id) >= lumiCfg().perDay) return toast('Lumi has answered all your questions for today. Try tomorrow!');
    S.jbusy = e.id; render();
    try {
      const u = window.firebase.auth().currentUser; if (!u) throw new Error('Please sign in again to talk with Lumi.');
      const r = await fetch(LUMI_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (await u.getIdToken()) },
        body: JSON.stringify({ grade: k.grade, subject: 'English', unit: 'Writing journal', mode: 'writing', prompt: e.p, writing: e.t }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.reply) throw new Error(j.error || 'Lumi is resting right now. Try again in a little while.');
      e.fb = j.reply; saveLit(k.id);
      const d = lumiDoc(k.id); d.e.push({ at: Date.now(), d: todayStr(), g: k.grade, s: 'ela', u: 'Writing journal', m: 'writing', q: e.t.slice(0, 300), a: j.reply }); if (d.e.length > 150) d.e = d.e.slice(-150); Store.set('lumi-' + k.id, d);
    } catch (err) { toast((err && err.message) || 'Something went wrong.'); }
    S.jbusy = null; render();
  }

  /* ── parent: family bookshelf ── */
  function parseBookLine(line) {
    let s = line.replace(/\s+/g, ' ').trim(); if (!s) return null;
    let u = ''; const m = s.match(/https?:\/\/\S+/); if (m) { u = m[0]; s = s.replace(m[0], '').trim(); }
    let t = s, a = '';
    const sep = s.match(/^(.*?)\s+(?:—|–|-|\|)\s+(.*)$/) || s.match(/^(.*)\s+by\s+(.+)$/i) || s.match(/^(.*?)\t(.*)$/);
    if (sep) { t = sep[1].trim(); a = sep[2].trim(); }
    t = t.replace(/^["“]|["”]$/g, '').slice(0, 100); a = a.slice(0, 60);
    return t ? { t, a, u: /^https:\/\//.test(u) ? u.slice(0, 300) : '' } : null;
  }
  function familyShelf() {
    const f = fam(); f.shelf = f.shelf || []; const shelf = f.shelf;
    const box = h('article', { class: 'card family-shelf' }, h('h3', null, 'Family bookshelf'),
      h('p', { class: 'hint' }, 'Add books your children can choose from — Kindle or Hoopla books, books at home or library books. They appear under "Our bookshelf" on the learner\'s reading page.'),
      h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: settings().hoopla ? true : null, onchange: (e) => { f.settings = Object.assign({}, f.settings, { hoopla: e.target.checked }); saveFamily(); toast(e.target.checked ? 'Hoopla is now on your children\'s reading page.' : 'Hoopla link hidden.'); render(); } }), ' We have Hoopla (show a "Browse Hoopla" button on my children\'s reading page)'),
      h('details', { class: 'kindle-help' }, h('summary', null, 'How to use Hoopla with Lantern'),
        h('ol', { class: 'small' },
          h('li', null, 'Sign in at ', h('a', { href: HOOPLA_URL, target: '_blank', rel: 'noopener noreferrer' }, 'hoopladigital.com'), ' with your library card on the computer your children use (or install the Hoopla app from the Play Store on a Chromebook). Sign in once yourself; children shouldn\'t handle the library card.'),
          h('li', null, 'Turn on Kids Mode (tap KIDS at the top, or in Settings) so only children\'s titles show.'),
          h('li', null, 'Add titles below with "Where is it?" set to Hoopla. Lantern gives each one a "Find on Hoopla" button. To open a book directly, paste its Hoopla page address after the title.'),
          h('li', null, 'Your library sets a monthly borrowing limit (often about 8 titles), and books usually return themselves after about 3 weeks. Picking books together helps the borrows last the month. Read-along books are great for young readers, and audiobooks count as reading time too.'))),
      h('details', { class: 'kindle-help' }, h('summary', null, 'How to add your Kindle books'),
        h('ol', { class: 'small' },
          h('li', null, 'On a computer, sign in at ', h('a', { href: KINDLE_URL, target: '_blank', rel: 'noopener noreferrer' }, 'read.amazon.com'), ' (Kindle for Web), or open the Kindle app, and go to your Library.'),
          h('li', null, 'Copy the titles you want your children to read, or type them.'),
          h('li', null, 'Paste them below, one book per line. You can add the author after a dash: "Charlotte\'s Web — E. B. White".'),
          h('li', null, 'Choose "Kindle" and which learners should see them, then press Add books.')),
        h('p', { class: 'small muted' }, 'Amazon doesn\'t let other apps read your Kindle library, so titles are added by hand. Your children open the books in your Kindle app or on read.amazon.com. To put your Kindle books on a child\'s own Kindle or tablet, use Amazon\'s family sharing (Amazon Household or the Amazon Parent Dashboard).')));
    box.appendChild(h('div', { class: 'row2' }, h('div', null, h('label', { for: 'sh-kweb' }, 'Kindle books open in'),
      h('select', { id: 'sh-kweb', onchange: (e) => { f.settings = Object.assign({}, f.settings, { kindleWeb: e.target.value === 'web' }); saveFamily(); toast(e.target.value === 'web' ? 'Kindle books will open on read.amazon.com.' : 'Kindle books will tell your children to open the Kindle app.'); } },
        h('option', { value: 'app', selected: settings().kindleWeb ? null : true }, 'The Kindle app (recommended)'),
        h('option', { value: 'web', selected: settings().kindleWeb ? true : null }, 'Kindle on the web (read.amazon.com)'))),
      h('p', { class: 'small muted' }, 'With the app, children never see an Amazon sign-in page. Sign in to the Kindle app once yourself.')));
    const where = h('select', { id: 'sh-where' }, Object.entries(WHERE).map(([v, n]) => h('option', { value: v }, n)));
    box.appendChild(h('form', { class: 'form', onsubmit: (e) => {
      e.preventDefault(); const lines = $('#sh-lines').value.split(/\r?\n/).map(parseBookLine).filter(Boolean); const err = $('#sh-err');
      if (!lines.length) return (err.textContent = 'Paste or type at least one book title.');
      const ks = kids().filter((k) => { const c = $('#sh-k-' + k.id); return c && c.checked; }).map((k) => k.id);
      if (!ks.length) return (err.textContent = 'Choose at least one learner.');
      let added = 0;
      lines.forEach((b) => { const ex = shelf.find((x) => x.t.toLowerCase() === b.t.toLowerCase()); if (ex) { ex.kids = ks.length === kids().length ? null : ks; return; } shelf.push({ id: uid(), t: b.t, a: b.a, u: b.u, w: where.value, kids: ks.length === kids().length ? null : ks, at: Date.now() }); added++; });
      f.shelf = shelf.slice(-400); saveFamily(); toast(added ? 'Added ' + added + ' book' + (added === 1 ? '' : 's') + '.' : 'Those books were already on the shelf.'); render();
    } },
      h('label', { for: 'sh-lines' }, 'Books (one per line)'), h('textarea', { id: 'sh-lines', rows: 4, placeholder: 'Charlotte\'s Web — E. B. White\nMagic Tree House: Dinosaurs Before Dark — Mary Pope Osborne' }),
      h('div', { class: 'row2' }, h('div', null, h('label', { for: 'sh-where' }, 'Where is it?'), where),
        h('fieldset', { class: 'lt-kids' }, h('legend', { class: 'label' }, 'Who can see these'), kids().map((k) => h('label', { class: 'check' }, h('input', { id: 'sh-k-' + k.id, type: 'checkbox', checked: true }), ' ' + k.name)))),
      h('p', { id: 'sh-err', class: 'err', role: 'alert' }), h('button', { class: 'btn primary sm', type: 'submit' }, 'Add books')));
    if (shelf.length) box.appendChild(h('ul', { class: 'shelf-list' }, shelf.slice().reverse().map((b) => h('li', null,
      h('span', null, h('b', null, b.t), b.a ? ' — ' + b.a : '', h('span', { class: 'small muted' }, ' · ' + (WHERE[b.w] || '') + ' · ' + (b.kids ? b.kids.map((id) => (kidById(id) || {}).name).filter(Boolean).join(', ') : 'everyone'))),
      h('button', { type: 'button', class: 'btn ghost xs', 'aria-label': 'Remove ' + b.t, onclick: () => { f.shelf = shelf.filter((x) => x.id !== b.id); saveFamily(); render(); } }, 'Remove')))));
    return box;
  }

  /* ── parent: reading & writing ── */
  function pLiteracy() {
    const wrap = h('section', null, h('h1', { class: 'p-title' }, 'Reading, writing & languages'));
    if (!kids().length) { wrap.appendChild(h('p', { class: 'muted' }, 'Add a learner first.')); return wrap; }
    const k = kidById(S.pkid) || kids()[0]; S.pkid = k.id; const L = litDoc(k.id), pass = settings().passMark;
    wrap.appendChild(h('div', { class: 'filters' }, h('label', { for: 'p-kid' }, 'Learner'), kidSelect()));
    const g = L.sg || k.grade, lists = SPELL[g] || [], tr = L.tricky || {};
    const trW = Object.keys(tr).sort((a, b) => (tr[b].miss || 0) - (tr[a].miss || 0));
    wrap.appendChild(h('div', { class: 'hours-top' },
      h('article', { class: 'card' }, h('h3', null, 'Reading'), h('p', { class: 'big-num' }, fmtHours(readingMinutes(k.id, weekStart())), h('small', null, ' h this week')),
        h('p', { class: 'muted small' }, fmtHours(readingMinutes(k.id, settings().yearStart)) + ' h this school year · ' + booksFinished(k.id) + (booksFinished(k.id) === 1 ? ' book' : ' books') + ' finished · ' + (L.jr || []).length + ((L.jr || []).length === 1 ? ' journal entry' : ' journal entries'))),
      h('article', { class: 'card' }, h('h3', null, 'Spelling · ' + GRADE_NAME(g) + ' lists'),
        h('ul', { class: 'hbars' }, lists.map((l) => { const r = L.spell[l.id]; return h('li', null, h('span', null, l.t), bar(r ? r.best : 0, r && r.best >= pass ? 'sci' : 'ela'), h('span', { class: 'num' }, r ? r.best + '%' : '—')); })),
        h('p', { class: 'small muted' }, 'Learners can switch to an easier or harder grade\'s lists on their spelling page.'))));
    wrap.appendChild(pSpanish(k));
    wrap.appendChild(familyShelf());
    wrap.appendChild(h('article', { class: 'card' }, h('h3', null, 'Tricky words'),
      trW.length ? [h('p', { class: 'small muted' }, 'Words missed in tests. Each comes back for review after 1, 3, 7 and 14 days and leaves the list once it\'s spelled right every time.'),
        h('ul', { class: 'chips' }, trW.slice(0, 60).map((w) => h('li', { class: 'chip-word' }, w, tr[w].miss > 1 ? h('small', null, ' ×' + tr[w].miss) : null)))]
        : h('p', { class: 'muted small' }, 'No missed words yet.')));
    const books = (L.books || []).slice().reverse();
    wrap.appendChild(h('article', { class: 'card' }, h('h3', null, 'Reading log'), books.length ? h('div', { class: 'table-wrap' }, h('table', { class: 'report' },
      h('thead', null, h('tr', null, ['Date', 'Book', 'Minutes', 'Pages', 'Finished', 'Rating', 'What they wrote'].map((t) => h('th', { scope: 'col' }, t)))),
      h('tbody', null, books.slice(0, 100).map((b) => h('tr', null, h('td', null, fmtDate(b.d)), h('td', null, b.t + (b.a ? ' — ' + b.a : '')), h('td', { class: 'num' }, b.m), h('td', { class: 'num' }, b.p || ''), h('td', null, b.fin ? 'Yes' : ''), h('td', null, b.r ? RATINGS.find((x) => x[0] === b.r)[1] : ''), h('td', { class: 'small' }, b.note || '')))))) : h('p', { class: 'muted small' }, 'No reading logged yet. Reading minutes also appear in the Hours log as Independent reading.')));
    const jr = L.jr || [];
    wrap.appendChild(h('h2', { class: 'sec' }, 'Journal'));
    if (!jr.length) wrap.appendChild(h('p', { class: 'muted small' }, 'No journal entries yet.'));
    else wrap.appendChild(h('ol', { class: 'jr-list' }, jr.slice(0, 40).map((e) => h('li', { class: 'card jr-entry' },
      h('p', { class: 'small muted' }, fmtDate(e.d) + ' · ' + wordCount(e.t) + ' words'), h('p', { class: 'jr-prompt' }, e.p), h('p', { class: 'jr-text' }, e.t),
      e.fb ? h('div', { class: 'jr-fb' }, h('b', null, 'Lumi\'s feedback: '), e.fb) : null,
      h('form', { class: 'jr-note-form', onsubmit: (ev) => { ev.preventDefault(); const v = ev.target.querySelector('textarea').value.trim(); e.pn = v.slice(0, 600) || null; e.seen = false; saveLit(k.id); toast(v ? 'Note saved. ' + k.name + ' will see it in their journal.' : 'Note removed.'); render(); } },
        h('label', { class: 'small', for: 'pn-' + e.id }, 'Note to ' + k.name), h('textarea', { id: 'pn-' + e.id, rows: 2, maxlength: 600 }, e.pn || ''), h('button', { class: 'btn ghost xs', type: 'submit' }, e.pn ? 'Update note' : 'Save note'))))));
    return wrap;
  }

  /* ─────────────── Language Lab: Spanish (immersion-style practice) ─────────────── */
  // lang-{kidId} = { units: {unitId: {best,last,tries,at}}, review: {es: {box,due,miss}}, eng: bool, doneAt, doneGrade }
  const ES = window.LH_SPANISH || { units: [] };
  const ES2 = window.LH_SPANISH2 || { units: [] };
  const ESALL = () => ES.units.concat(ES2.units);
  const esLevelOf = (uid) => (ES2.units.some((u) => u.id === uid) ? ES2 : ES);
  const langDoc = (id) => Store.cache['lang-' + id] || (Store.cache['lang-' + id] = { units: {}, review: {} });
  function saveLang(id) { Store.set('lang-' + id, langDoc(id)); }
  const fold = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,;:"'’]/g, ' ').replace(/\s+/g, ' ').trim();
  const stripArt = (s) => s.replace(/^(el|la|los|las|un|una) /, '');
  const esFind = (es) => { for (const u of ESALL()) { const it = u.items.find((x) => x.es === es); if (it) return { u, it }; } return null; };
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  function esVoice() {
    const vs = Player.synth ? Player.synth.getVoices().filter((v) => /^es[-_]/i.test(v.lang)) : [];
    for (const p of [/^es[-_](US|MX|419)/i, /español de Estados Unidos/i, /Google español/i]) { const v = vs.find((x) => p.test(x.lang) || p.test(x.name)); if (v) return v; }
    return vs[0] || null;
  }
  function sayEs(text, rate) {
    const sy = Player.synth; if (!sy) return false;
    try { sy.cancel(); const u = new SpeechSynthesisUtterance(text); const v = esVoice(); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'es-US'; u.rate = Math.max(0.4, Math.min(1.6, (rate || 0.85) * (Player.rate || 1))); sy.speak(u); return true; } catch (e) { return false; }
  }
  function esPic(it, big) {
    const cls = 'es-pic' + (big ? ' big' : '');
    if (it.c) return h('span', { class: cls + ' swatch', style: '--sw:' + it.c, 'aria-hidden': 'true' });
    if (it.n) return h('span', { class: cls + ' dots', 'aria-hidden': 'true' }, Array.from({ length: it.n }, () => h('i')));
    return h('span', { class: cls + ' emoji', 'aria-hidden': 'true' }, it.p);
  }
  const esHint = (k, it) => (langDoc(k.id).eng ? h('small', { class: 'es-en' }, it.en) : null);
  function langDue(kidId) { const r = langDoc(kidId).review || {}, t = todayStr(); return Object.keys(r).filter((w) => r[w].due <= t && esFind(w)); }
  const esMastered = (kidId) => ES.units.filter((u) => ((langDoc(kidId).units || {})[u.id] || {}).best >= settings().passMark).length;
  const es2Mastered = (kidId) => ES2.units.filter((u) => ((langDoc(kidId).units || {})[u.id] || {}).best >= settings().passMark).length;
  const es2Open = (kidId) => ES2.units.length > 0 && (esMastered(kidId) >= ES.units.length || !!langDoc(kidId).open2);
  const esLv = (kidId) => (S.esLv === 1 || !es2Open(kidId) ? ES : S.esLv === 2 ? ES2 : (es2Mastered(kidId) < ES2.units.length || esMastered(kidId) >= ES.units.length ? ES2 : ES));
  // Similarity for speaking checks (speech recognizers often drop or change articles and accents).
  function lev(a, b) { const m = a.length, n = b.length; const d = Array.from({ length: m + 1 }, (_, i) => [i]); for (let j = 1; j <= n; j++) d[0][j] = j; for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
  function saidRight(heard, target) {
    const t = stripArt(fold(target)); return heard.some((x) => { const f = stripArt(fold(x)); return f === t || f.includes(t) || (t.length >= 4 && 1 - lev(f, t) / Math.max(f.length, t.length) >= 0.75); });
  }

  function esQuestions(items, pool) {
    const types = ['listen', 'pic', 'read', 'speak', 'type', 'listen', 'pic', 'speak', 'read', 'type', 'listen', 'pic'];
    const order = shuffle(items), qs = [], n = Math.min(12, Math.max(items.length, Math.round(items.length * 1.5)));
    for (let i = 0; qs.length < n; i++) {
      const it = order[i % order.length]; let t = types[qs.length % types.length];
      if (t === 'speak' && !SpeechRec) t = 'pic';
      if (t === 'listen' && !Player.synth) t = 'read';
      const others = shuffle(pool.filter((x) => x.es !== it.es)).slice(0, 3);
      qs.push({ t, it, opts: shuffle([it].concat(others)) });
    }
    return qs;
  }
  function startEs(unit, review) {
    const kidId = S.who; let items, pool;
    if (review) { items = langDue(kidId).slice(0, 10).map((w) => esFind(w).it); pool = ESALL().reduce((a, u) => a.concat(u.items), []); }
    else { items = unit.items; pool = unit.items; }
    S.es = { uid: review ? null : unit.id, title: review ? 'Repaso' : unit.t, qs: esQuestions(items, pool), at: 0, right: 0, skipped: 0, missed: [], phase: 'ask', tries: 0, heard: null, review: !!review, spoken: -1 };
    go('spanish', { play: 1 });
  }
  function esAnswer(ok) {
    const s = S.es, q = s.qs[s.at];
    if (ok) { s.right++; s.phase = 'right'; sayEs(q.it.es); render(); setTimeout(() => { if (S.es === s && s.phase === 'right') esNext(); }, 1100); }
    else { if (!s.missed.includes(q.it.es)) s.missed.push(q.it.es); s.phase = 'wrong'; sayEs(q.it.es); render(); }
  }
  function esNext() { const s = S.es; s.at++; s.phase = 'ask'; s.tries = 0; s.heard = null; s.pick = null; if (s.at >= s.qs.length) return esFinish(); render(); }
  function esFinish() {
    const s = S.es, kidId = S.who, L = langDoc(kidId), k = kidById(kidId); L.units = L.units || {}; L.review = L.review || {};
    const counted = Math.max(1, s.qs.length - s.skipped), score = Math.round((s.right / counted) * 100);
    const asked = Array.from(new Set(s.qs.map((q) => q.it.es)));
    asked.forEach((w) => {
      const r = L.review[w];
      if (s.missed.includes(w)) L.review[w] = { box: 0, due: addDays(1), miss: ((r && r.miss) || 0) + 1 };
      else if (r && s.review) { const box = r.box + 1; if (box >= BOX_DAYS.length) delete L.review[w]; else L.review[w] = Object.assign(r, { box, due: addDays(BOX_DAYS[box]) }); }
    });
    if (s.uid) { const p = L.units[s.uid]; L.units[s.uid] = { best: Math.max(score, p ? p.best : 0), last: score, tries: (p ? p.tries : 0) + 1, at: Date.now() }; }
    if (!L.doneAt && esMastered(kidId) === ES.units.length) { L.doneAt = Date.now(); L.doneGrade = k ? k.grade : null; }
    if (!L.done2At && ES2.units.length && es2Mastered(kidId) === ES2.units.length) { L.done2At = Date.now(); L.done2Grade = k ? k.grade : null; }
    saveLang(kidId); markAct(kidId, 'span'); Timer.accrue(); Timer.flush(); checkBadges(kidId);
    s.phase = 'done'; s.score = score; s.pass = score >= settings().passMark; if (s.pass) setTimeout(confetti, 50); render();
  }
  function esListen(s) {
    if (!SpeechRec) return;
    const q = s.qs[s.at];
    try {
      const rec = new SpeechRec(); rec.lang = (esVoice() && esVoice().lang) || 'es-US'; rec.interimResults = false; rec.maxAlternatives = 5;
      s.listening = true; s.heard = null; render();
      rec.onresult = (e) => { const alts = []; for (let i = 0; i < e.results.length; i++) for (let j = 0; j < e.results[i].length; j++) alts.push(e.results[i][j].transcript); s.heard = alts[0] || ''; s.listening = false; if (saidRight(alts, q.it.es)) esAnswer(true); else { s.tries++; render(); } };
      rec.onerror = (e) => { s.listening = false; s.micErr = e && e.error === 'not-allowed' ? 'The microphone is blocked. Ask your grown-up to allow it in the browser, or skip.' : 'I didn\'t catch that. Try again.'; render(); };
      rec.onend = () => { if (s.listening) { s.listening = false; render(); } };
      s.micErr = null; rec.start();
    } catch (e) { s.listening = false; s.micErr = 'The microphone isn\'t available here.'; render(); }
  }

  function viewSpanish() {
    const k = kidById(S.who); if (!k) return viewPicker();
    if (!Timer.on || Timer.on.kidId !== k.id || Timer.on.subj !== 'span') Timer.start(k.id, 'span');
    const L = langDoc(k.id), main = h('main', { class: 'wrap spanish' });
    if (S.es && S.view.play) { main.appendChild(esPlay(k, S.es)); return h('div', null, kidBar(), main); }
    main.appendChild(h('button', { class: 'btn ghost sm back', onclick: () => { S.es = null; go('home'); } }, '← Dashboard'));
    if (S.view.learn) {
      const u = ESALL().find((x) => x.id === S.view.learn);
      main.appendChild(h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, esLevelOf(u.id).name + ' · Aprende'), h('h1', null, u.t), L.eng ? h('p', { class: 'muted' }, u.en) : null,
        h('p', { class: 'lede' }, 'Mira, escucha y repite. (Look, listen and repeat.)')));
      main.appendChild(h('div', { class: 'actions' }, h('button', { class: 'btn ghost sm', onclick: () => { let i = 0; const next = () => { if (S.screen !== 'spanish' || i >= u.items.length) return; const el = document.querySelectorAll('.es-card')[i]; document.querySelectorAll('.es-card').forEach((c) => c.classList.remove('on')); if (el) el.classList.add('on'); sayEs(u.items[i].es, 0.8); i++; setTimeout(next, 2200); }; next(); } }, icon('voice'), ' Escuchar todo')));
      main.appendChild(h('ul', { class: 'es-grid learn' }, u.items.map((it) => h('li', null, h('button', { type: 'button', class: 'es-card', onclick: (e) => { document.querySelectorAll('.es-card').forEach((c) => c.classList.remove('on')); e.currentTarget.classList.add('on'); sayEs(it.es, 0.8); } }, esPic(it), h('b', null, it.es), esHint(k, it))))));
      if (u.story) main.appendChild(esStory(k, u));
      if (u.mission) main.appendChild(esMission(k, u));
      main.appendChild(h('div', { class: 'actions' }, h('button', { class: 'btn primary', onclick: () => startEs(u) }, '¡A practicar! (Practice)'), h('button', { class: 'btn ghost', onclick: () => go('spanish') }, 'Todas las lecciones')));
      return h('div', null, kidBar(), main);
    }
    const pass = settings().passMark, due = langDue(k.id), CUR = esLv(k.id), m = CUR === ES ? esMastered(k.id) : es2Mastered(k.id);
    if (ES2.units.length) main.appendChild(h('div', { class: 'tabs es-levels', role: 'tablist' }, [[1, ES], [2, ES2]].map(([n, C]) => { const open = n === 1 || es2Open(k.id); return h('button', { role: 'tab', class: 'tab' + (CUR === C ? ' on' : ''), 'aria-selected': CUR === C ? 'true' : 'false', disabled: open ? null : true, onclick: () => { S.esLv = n; render(); } }, C.name + (open ? '' : ' 🔒')); })));
    main.appendChild(h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, 'Language Lab'), h('h1', null, '¡Hola, ' + k.name + '! · ' + CUR.name),
      h('p', { class: 'lede' }, 'Learn Spanish the way you learned English: by matching words to pictures, listening and speaking. No translating needed.'),
      h('div', { class: 'stat-row' }, stat(m + '/' + CUR.units.length, 'lessons mastered'), stat(String(Object.keys(L.review || {}).length), 'words to review')),
      h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: L.eng ? true : null, onchange: (e) => { L.eng = e.target.checked; saveLang(k.id); render(); } }), ' Show English hints')));
    if (!Player.synth || !esVoice()) main.appendChild(h('div', { class: 'banner' }, Player.synth ? 'This device has no Spanish voice installed, so words may be read with an English accent. On a Chromebook, the Google español voice is usually built in — try restarting Chrome.' : 'This browser can\'t read aloud, so listening practice is turned off.'));
    if (!SpeechRec) main.appendChild(h('p', { class: 'small muted' }, 'Speaking practice needs the Chrome browser with a microphone, so it is skipped on this device.'));
    if (due.length) main.appendChild(h('article', { class: 'card tricky-card' }, h('div', null, h('h3', null, 'Repaso (review)'), h('p', { class: 'muted small' }, due.length + ' word' + (due.length === 1 ? '' : 's') + ' ready to review today')), h('button', { class: 'btn primary sm', onclick: () => startEs(null, true) }, 'Review ' + Math.min(10, due.length) + ' words')));
    if (CUR === ES2 && esMastered(k.id) < ES.units.length) main.appendChild(h('p', { class: 'small muted' }, 'Your grown-up opened Spanish 2 early. You can still finish Spanish 1 too.'));
    main.appendChild(h('div', { class: 'spell-lists' }, CUR.units.map((u, i) => {
      const r = (L.units || {})[u.id]; const mi = (L.mis || {})[u.id]; const st = !r ? ['new', 'Nuevo'] : r.best >= pass ? ['mastered', '¡Excelente! · ' + r.best + '%' + (mi ? ' · misión ✓' : '')] : ['trying', 'Best ' + r.best + '%'];
      return h('article', { class: 'card spell-list es-unit' }, h('div', { class: 'sl-top' }, h('span', { class: 'unit-n' }, 'Lección ' + (i + 1)), h('span', { class: 'pill ' + st[0] }, st[1])),
        h('h3', null, u.t), h('p', { class: 'muted small' }, u.en), h('div', { class: 'es-peek' }, u.items.slice(0, 4).map((it) => esPic(it))),
        h('div', { class: 'actions' }, h('button', { class: 'btn ghost sm', onclick: () => go('spanish', { learn: u.id }) }, 'Aprender (learn)'), h('button', { class: 'btn primary sm', onclick: () => startEs(u) }, r ? 'Practice again' : 'Practice')));
    })));
    return h('div', null, kidBar(), main);
  }
  function esPlay(k, s) {
    const wrap = h('section', { class: 'spell-play es-play' });
    wrap.appendChild(h('button', { class: 'btn ghost sm back', onclick: () => { S.es = null; go('spanish'); } }, '← Lecciones'));
    if (s.phase === 'done') {
      const st = h('div', { class: 'result-stars' }); st.innerHTML = window.LH_STARS ? window.LH_STARS(s.score >= 100 ? 3 : s.pass ? 2 : s.score >= 40 ? 1 : 0) : '';
      wrap.appendChild(h('div', { class: 'result-card ' + (s.pass ? 'pass' : 'retry') }, st, ring(s.score, s.right + ' of ' + (s.qs.length - s.skipped), 'lg'),
        lumi(s.pass ? 'cheer' : 'think', s.pass ? '¡Muy bien! Great job!' : '¡Buen intento! Good try — practice and try again.'),
        h('h1', null, s.review ? '¡Repaso terminado!' : s.pass ? '¡Lección dominada!' : 'Sigue practicando'),
        s.missed.length ? h('div', { class: 'missed' }, h('p', null, 'Practice these (they\'ll come back for review):'), h('ul', { class: 'chips' }, s.missed.map((w) => h('li', null, h('button', { type: 'button', class: 'chip-btn', onclick: () => sayEs(w, 0.8) }, w))))) : null,
        h('div', { class: 'actions' },
          !s.review ? h('button', { class: 'btn primary', onclick: () => startEs(ESALL().find((u) => u.id === s.uid)) }, 'Practice again') : null,
          s.review && langDue(k.id).length ? h('button', { class: 'btn primary', onclick: () => startEs(null, true) }, 'Review more') : null,
          h('button', { class: 'btn ghost', onclick: () => { S.es = null; go('spanish'); } }, 'Todas las lecciones'))));
      return wrap;
    }
    const q = s.qs[s.at], it = q.it, hear = () => sayEs(it.es, 0.85);
    if (s.spoken !== s.at && s.phase === 'ask' && (q.t === 'listen' || q.t === 'type' || q.t === 'speak')) { s.spoken = s.at; setTimeout(hear, 300); }
    const PROMPT = { listen: 'Escucha y toca la imagen. (Listen and tap the picture.)', read: 'Lee y toca la imagen. (Read and tap the picture.)', pic: '¿Qué es? Toca la palabra. (What is it? Tap the word.)', type: 'Escucha y escribe. (Listen and type.)', speak: 'Escucha y repite. (Listen and say it.)' };
    wrap.appendChild(h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, s.title + ' · ' + (s.at + 1) + ' / ' + s.qs.length), bar(Math.round((s.at / s.qs.length) * 100), 'soc')));
    const card = h('div', { class: 'spell-card card es-q' }, h('p', { class: 'es-prompt' }, PROMPT[q.t]));
    const done = s.phase !== 'ask';
    const audioBtn = Player.synth ? h('button', { type: 'button', class: 'btn ghost sm', onclick: hear }, icon('voice'), ' Escuchar') : null;
    if (q.t === 'listen' || q.t === 'read') {
      card.appendChild(h('div', { class: 'es-stem' }, q.t === 'read' || done ? h('b', { class: 'es-word' }, it.es) : null, audioBtn));
      card.appendChild(h('ul', { class: 'es-grid opts' }, q.opts.map((o) => h('li', null, h('button', { type: 'button', class: 'es-card' + (done && o.es === it.es ? ' good' : '') + (done && s.pick === o.es && o.es !== it.es ? ' bad' : ''), disabled: done ? true : null, 'aria-label': o.en ? 'Picture ' + (q.opts.indexOf(o) + 1) : '', onclick: () => { s.pick = o.es; esAnswer(o.es === it.es); } }, esPic(o), done ? h('small', null, o.es) : null)))));
    } else if (q.t === 'pic') {
      card.appendChild(h('div', { class: 'es-stem' }, esPic(it, true), esHint(k, it)));
      card.appendChild(h('div', { class: 'es-words' }, q.opts.map((o) => h('button', { type: 'button', class: 'choice' + (done && o.es === it.es ? ' good' : '') + (done && s.pick === o.es && o.es !== it.es ? ' bad' : ''), disabled: done ? true : null, onclick: () => { s.pick = o.es; esAnswer(o.es === it.es); } }, o.es))));
    } else if (q.t === 'type') {
      card.appendChild(h('div', { class: 'es-stem' }, esPic(it, true), audioBtn, esHint(k, it)));
      if (s.phase === 'ask') {
        const inp = h('input', { id: 'es-in', class: 'sp-input', autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false', lang: 'es', 'aria-label': 'Type the Spanish words', maxlength: 60 });
        card.appendChild(h('div', { class: 'accents' }, ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'].map((c) => h('button', { type: 'button', class: 'chip-btn', onclick: () => { const p = inp.selectionStart || inp.value.length; inp.value = inp.value.slice(0, p) + c + inp.value.slice(p); inp.focus(); inp.setSelectionRange(p + 1, p + 1); } }, c))));
        card.appendChild(h('form', { class: 'sp-form', onsubmit: (e) => { e.preventDefault(); const v = fold(inp.value); if (!v) return; s.typed = inp.value.trim(); const t = fold(it.es); s.accentNote = v === t && inp.value.trim().toLowerCase() !== it.es.toLowerCase(); esAnswer(v === t || stripArt(v) === stripArt(t)); } }, inp, h('button', { class: 'btn primary', type: 'submit' }, 'Comprobar (check)')));
        setTimeout(() => { const x = $('#es-in'); if (x) x.focus(); }, 30);
      } else card.appendChild(h('p', { class: s.phase === 'right' ? 'sp-ok' : 'sp-wrong' }, s.phase === 'right' ? '✓ ' + it.es + (s.accentNote ? ' — watch the accents!' : '') : 'You wrote "' + (s.typed || '') + '". It\'s spelled: ', s.phase === 'right' ? null : h('b', { class: 'sp-right' }, it.es)));
    } else if (q.t === 'speak') {
      card.appendChild(h('div', { class: 'es-stem' }, esPic(it, true), h('b', { class: 'es-word' }, it.es), audioBtn, esHint(k, it)));
      if (s.phase === 'ask') {
        card.appendChild(h('div', { class: 'actions mic-row' },
          h('button', { type: 'button', class: 'btn primary mic' + (s.listening ? ' on' : ''), disabled: s.listening ? true : null, onclick: () => esListen(s) }, s.listening ? 'Escuchando… (listening)' : '🎤 Hablar (speak)'),
          h('button', { type: 'button', class: 'btn ghost sm', onclick: () => { s.skipped++; esNext(); } }, s.tries >= 2 ? 'Next' : 'Skip')));
        if (s.heard != null && !s.listening) card.appendChild(h('p', { class: 'small' }, 'Te oí (I heard): "' + s.heard + '". ' + (s.tries >= 2 ? 'Good effort! Listen once more, then move on.' : 'Listen and try again!')));
        if (s.micErr) card.appendChild(h('p', { class: 'small err' }, s.micErr));
      } else card.appendChild(h('p', { class: 'sp-ok' }, '✓ ¡Perfecto! ' + it.es));
    }
    if (s.phase === 'wrong') card.appendChild(h('div', { class: 'actions' }, h('button', { class: 'btn primary', onclick: esNext }, 'Siguiente (next)')));
    if (s.phase === 'right' && q.t !== 'type' && q.t !== 'speak') card.appendChild(h('p', { class: 'sp-ok', role: 'status' }, '✓ ¡Muy bien!'));
    wrap.appendChild(card);
    return wrap;
  }
  // Spanish 2: a short story with comprehension questions, and a real-life mission
  function esStory(k, u) {
    const L = langDoc(k.id), st = u.story; S.esSt = S.esSt || {}; const A = S.esSt[u.id] || (S.esSt[u.id] = { picks: {}, order: st.q.map((r) => shuffle(r.slice(1, 5))) });
    const card = h('article', { class: 'card es-story' }, h('div', { class: 'card-head' }, h('h3', null, '📖 Cuento (story)'), Player.synth ? h('button', { type: 'button', class: 'btn ghost sm', onclick: () => sayEs(st.es, 0.8) }, icon('voice'), ' Escuchar') : null),
      h('p', { class: 'es-story-text', lang: 'es' }, st.es), L.eng ? h('p', { class: 'small muted' }, st.en) : null);
    st.q.forEach((r, qi) => { const pick = A.picks[qi];
      card.appendChild(h('div', { class: 'es-sq' }, h('p', null, h('b', null, (qi + 1) + '. ' + r[0])), h('div', { class: 'es-words' }, A.order[qi].map((o) => h('button', { type: 'button', class: 'choice' + (pick != null && o === r[1] ? ' good' : '') + (pick === o && o !== r[1] ? ' bad' : ''), disabled: pick != null ? true : null, onclick: () => {
        A.picks[qi] = o; if (Object.keys(A.picks).length === st.q.length) { const right = st.q.filter((x, i) => A.picks[i] === x[1]).length; L.read = L.read || {}; L.read[u.id] = Math.max(right, L.read[u.id] || 0); saveLang(k.id); markAct(k.id, 'span'); if (right === st.q.length) confetti(); } render(); } }, o)))));
    });
    if (Object.keys(A.picks).length === st.q.length) { const right = st.q.filter((x, i) => A.picks[i] === x[1]).length; card.appendChild(h('p', { class: right === st.q.length ? 'sp-ok' : 'small' }, right + ' de ' + st.q.length + ' — ' + (right === st.q.length ? '¡Excelente!' : '¡Buen trabajo! Read it again and try.'), right < st.q.length ? h('button', { type: 'button', class: 'btn ghost xs', onclick: () => { S.esSt[u.id] = null; render(); } }, 'Otra vez') : null)); }
    return card;
  }
  function esMission(k, u) {
    const L = langDoc(k.id); L.mis = L.mis || {}; const done = L.mis[u.id];
    const note = h('input', { id: 'mis-note', maxlength: 200, placeholder: 'What happened? (optional)', 'aria-label': 'What happened on your mission' });
    return h('article', { class: 'card es-mission' }, h('h3', null, '🗺️ Misión (real-life mission)'), h('p', { lang: 'es' }, h('b', null, u.mission.es)), h('p', { class: 'small muted' }, u.mission.en),
      done ? h('p', { class: 'sp-ok' }, '✓ ¡Misión cumplida!' + (done.note ? ' “' + done.note + '”' : '')) : h('form', { class: 'goal-form', onsubmit: (e) => { e.preventDefault(); L.mis[u.id] = { at: Date.now(), note: note.value.trim() }; saveLang(k.id); markAct(k.id, 'span'); confetti(); render(); } }, note, h('button', { class: 'btn primary sm', type: 'submit' }, '¡Lo hice! (I did it)')));
  }
  function esCard(k) {
    const two = es2Open(k.id) && esMastered(k.id) >= ES.units.length, C = two ? ES2 : ES, m = two ? es2Mastered(k.id) : esMastered(k.id), due = langDue(k.id).length;
    return h('article', { class: 'lit-card spanish' }, h('div', { class: 'lit-ico', 'aria-hidden': 'true' }, '¡H!'), h('h3', null, C.name),
      h('p', { class: 'muted small' }, m + ' of ' + C.units.length + ' lessons mastered' + (due ? ' · ' + due + ' to review' : '')),
      bar(Math.round((m / C.units.length) * 100), 'soc'),
      h('button', { class: 'btn primary sm', onclick: () => { S.es = null; go('spanish'); } }, due ? 'Review Spanish' : '¡Vamos! (Let\'s go)'));
  }
  function pSpanish(k) {
    const L = langDoc(k.id), pass = settings().passMark, rv = L.review || {};
    return h('article', { class: 'card' }, h('h3', null, 'Spanish (Language Lab)'),
      h('ul', { class: 'hbars' }, ES.units.map((u) => { const r = (L.units || {})[u.id]; return h('li', null, h('span', null, u.t + ' · ' + u.en), bar(r ? r.best : 0, r && r.best >= pass ? 'sci' : 'soc'), h('span', { class: 'num' }, r ? r.best + '%' : '—')); })),
      ES2.units.length ? h('h4', null, 'Spanish 2' + (es2Open(k.id) ? '' : ' (opens when Spanish 1 is mastered)')) : null,
      ES2.units.length ? h('ul', { class: 'hbars' }, ES2.units.map((u) => { const r = (L.units || {})[u.id], st = (L.read || {})[u.id], mi = (L.mis || {})[u.id]; return h('li', null, h('span', null, u.t + ' · ' + u.en + (st != null ? ' · story ' + st + '/3' : '') + (mi ? ' · mission ✓' : '')), bar(r ? r.best : 0, r && r.best >= pass ? 'sci' : 'soc'), h('span', { class: 'num' }, r ? r.best + '%' : '—')); })) : null,
      Object.values(L.mis || {}).some((x) => x.note) ? h('p', { class: 'small' }, h('b', null, 'Mission notes: '), ES2.units.filter((u) => ((L.mis || {})[u.id] || {}).note).map((u) => u.t + ': “' + L.mis[u.id].note + '”').join(' · ')) : null,
      ES2.units.length && !es2Open(k.id) ? h('label', { class: 'check small' }, h('input', { type: 'checkbox', onchange: (e) => { L.open2 = e.target.checked; saveLang(k.id); render(); } }), ' Open Spanish 2 now') : null,
      Object.keys(rv).length ? h('p', { class: 'small' }, 'Words to review: ' + Object.keys(rv).join(', ')) : null,
      h('p', { class: 'small muted' }, 'Time in Spanish is logged in the Hours log. High school learners get Spanish 1: Beginner and Spanish 2 (0.5 credit each) on their transcript when they master every lesson. Speaking practice uses Chrome\'s built-in speech recognition, which may send the audio to Google to turn it into text; learners can skip it.'));
  }

  /* ─────────────── Today's plan · check-backs · daily challenge · focus sessions · weekly goals · conundrums ───────────────
     Ideas drawn from modern schools: daily goals by mastery, not minutes (Alpha); mastery shown more than once and
     "teach it back" (Khan Lab School); focus blocks with brain breaks; goal setting and weekly reflection (Acton, Khan advisory);
     open-ended conundrums (Ad Astra / Astra Nova). All content and code here are original. */
  // day-{kidId} = { days: {date: {plan, acts, ch, focus, celebrated}}, checks: {unitKey: {due, n, strong, weak}}, weeks: {weekStart: {goals, reflect, pnote}}, con: {id: {choice, why, at, talked}}, explain: {unitKey: text}, taught: {unitKey: ts} }
  const CON = window.LH_CONUNDRUMS || [];
  const dayDoc = (id) => Store.cache['day-' + id] || (Store.cache['day-' + id] = { days: {}, checks: {}, weeks: {}, con: {}, explain: {}, taught: {} });
  function saveDay(id) { const d = dayDoc(id); d.days = d.days || {}; const ks = Object.keys(d.days).sort(); ks.slice(0, Math.max(0, ks.length - 60)).forEach((x) => delete d.days[x]); Store.set('day-' + id, d); }
  const dayRec = (id, date) => { const d = dayDoc(id); d.days = d.days || {}; const t = date || todayStr(); return d.days[t] || (d.days[t] = { acts: {} }); };
  function markAct(kidId, kind) { if (!kidId) return; const r = dayRec(kidId); r.acts = r.acts || {}; if (!r.acts[kind]) { r.acts[kind] = Date.now(); saveDay(kidId); } }
  const planBand = (g) => (g <= 2 ? 0 : g <= 5 ? 1 : g <= 8 ? 2 : 3);
  const FOCUS_MIN = [[15, 5], [20, 5], [25, 5], [25, 5]];
  const unitOf = (key) => { const [g, s, i] = key.split('-'); const c = course(Number(g), s); return c ? { g: Number(g), s, i: Number(i), u: c.u[Number(i)] } : null; };

  /* check-backs: a mastered unit comes back a week later for a quick 3-question check */
  function scheduleCheck(kidId, key) { const d = dayDoc(kidId); d.checks = d.checks || {}; if (!d.checks[key]) { d.checks[key] = { due: addDays(7), n: 0 }; saveDay(kidId); } }
  function dueChecks(kidId) {
    const d = dayDoc(kidId); d.checks = d.checks || {}; const t = todayStr(), prog = kidDoc(kidId).prog, pass = settings().passMark;
    // units mastered before check-backs existed get scheduled gradually (2 a day)
    let added = 0; Object.keys(prog).forEach((key) => { if (added < 2 && !d.checks[key] && prog[key].best >= pass && Date.now() - (prog[key].at || 0) > 6 * 864e5 && unitOf(key)) { d.checks[key] = { due: t, n: 0 }; added++; } });
    return Object.keys(d.checks).filter((key) => !d.checks[key].strong && d.checks[key].due <= t && unitOf(key));
  }
  const checkState = (kidId, key) => ((dayDoc(kidId).checks || {})[key]) || null;

  /* today's plan: built once per day from where the learner is, sized to the grade band */
  function buildPlan(k) {
    const r = dayRec(k.id); if (r.plan) return r.plan;
    const g = k.grade, pb = planBand(g), dow = new Date().getDay(), doy = Math.floor(Date.now() / 864e5);
    const items = [];
    if (dueChecks(k.id).length) items.push({ id: 'warm', kind: 'warm', t: 'Warm-up: quick check on past lessons', min: 5 });
    const order = ['math', 'ela'].concat(doy % 2 ? ['sci', 'soc'] : ['soc', 'sci'], ['ai', 'fin']);
    const want = [2, 2, 3, 3][pb]; let n = 0;
    for (const s of order) {
      if (n >= want) break; const nx = nextUnitFor(k, s); if (!nx) continue;
      items.push({ id: 'u:' + nx.key, kind: 'unit', key: nx.key, t: nx.t, min: [20, 25, 25, 30][pb] }); n++;
    }
    if (dow === 2 || dow === 4) { const qp = questProgress(k.id);
      if (qp && qp.next >= 0) items.push({ id: 'quest', kind: 'quest', t: 'Quest: ' + qp.q.steps[qp.next].t, min: [15, 20, 25, 30][pb] });
      else if (!qp && !(questDoc(k.id).hist || []).length) items.push({ id: 'quest', kind: 'quest', t: 'Choose your first Quest', min: 10 }); }
    if ((dow === 1 || dow === 3) && carOn(k)) { const cn = carNext(k); if (cn) items.push({ id: 'trade', kind: 'trade', t: 'Trades: ' + cn.m.t, min: [15, 20, 20, 25][pb] }); }
    items.push({ id: 'read', kind: 'read', t: 'Read a book', min: [15, 20, 25, 30][pb] });
    if (pb < 3 || trickyDue(k.id).length) items.push({ id: 'spell', kind: 'spell', t: trickyDue(k.id).length ? 'Spelling: review tricky words' : 'Spelling practice', min: 10 });
    const wk = weekStart(), cu = conundrumFor(k);
    if (dow === 3 && cu && !(dayDoc(k.id).con || {})[cu.id]) items.push({ id: 'con', kind: 'con', t: 'Conundrum of the week: ' + cu.t, min: 15 });
    else if (pb > 0 || [1, 3, 5].includes(dow)) items.push({ id: 'write', kind: 'write', t: 'Journal: write about today\'s prompt', min: [10, 10, 15, 15][pb] });
    items.push({ id: 'span', kind: 'span', t: langDue(k.id).length ? 'Spanish: review words' : 'Spanish practice', min: 10 });
    if (pb > 0) items.push({ id: 'fun', kind: 'fun', t: 'Fun pick: you choose!', min: [0, 10, 10, 20][pb] });
    if (dow === WQ_DAY) items.push({ id: 'wq', kind: 'wq', t: 'Weekly quiz: everything you learned this week', min: [10, 10, 15, 15][pb] });
    else items.push({ id: 'chal', kind: 'chal', t: 'Daily challenge (5 questions)', min: 5 });
    r.plan = items; r.wk = wk; saveDay(k.id);
    return items;
  }
  // The next lesson in a subject follows the difficulty path. A lesson only comes back on purpose:
  // after a failed quiz ("Try again"), or through warm-ups and review. When every lesson in the grade's
  // course is mastered, the plan moves on to the next grade's course (parent setting, on by default).
  function nextUnitFor(k, s) {
    const top = settings().advance === false ? k.grade : 12, kd = kidDoc(k.id);
    for (let g = k.grade; g <= top; g++) {
      const c = course(g, s); if (!c) continue; const cs = courseStats(k.id, g, s); if (cs.next < 0) continue;
      const key = g + '-' + s + '-' + cs.next, pre = kd.prog[key] ? 'Try again: ' : kd.viewed[key] ? 'Continue: ' : '';
      return { key, g, ahead: g > k.grade, t: pre + SUBJ_NAME[s] + (g > k.grade ? ' (' + GRADE_NAME(g) + ')' : '') + ': ' + c.u[cs.next].t };
    }
    return null;
  }
  function itemDone(k, it) {
    const r = dayRec(k.id), a = r.acts || {};
    if (it.kind === 'unit') return unitMastered(k.id, it.key);
    if (it.kind === 'chal') return !!r.ch;
    if (it.kind === 'wq') return !!weekRec(k.id).quiz;
    if (it.kind === 'con') { const c = conundrumFor(k); return !!(c && (dayDoc(k.id).con || {})[c.id]); }
    return !!a[it.kind];
  }
  function startItem(k, it) {
    if (it.kind === 'unit') { const x = unitOf(it.key); return go('lesson', { g: x.g, s: x.s, i: x.i }); }
    if (it.kind === 'warm') return startMQ(k, 'warm');
    if (it.kind === 'chal') return startMQ(k, 'chal');
    if (it.kind === 'wq') return startWQ(k);
    if (it.kind === 'read') return go('reading');
    if (it.kind === 'spell') { S.sp = null; return go('spell'); }
    if (it.kind === 'write') return go('journal');
    if (it.kind === 'span') { S.es = null; return go('spanish'); }
    if (it.kind === 'con') return go('conundrum');
    if (it.kind === 'quest') return go('quest');
    if (it.kind === 'trade') { const cn = carNext(k); S.carT = cn ? CAR.tracks.indexOf(cn.tr) : 0; S.carM = cn ? cn.i : null; return go('career'); }
  }
  function todayCard(k) {
    const items = buildPlan(k), r = dayRec(k.id); const done = items.filter((it) => itemDone(k, it));
    const left = items.filter((it) => !itemDone(k, it)).reduce((a, it) => a + it.min, 0);
    const all = done.length === items.length;
    if (all && !r.celebrated) { r.celebrated = Date.now(); saveDay(k.id); checkBadges(k.id); setTimeout(confetti, 200); }
    const pct = Math.round((done.length / items.length) * 100);
    const card = h('section', { class: 'card plan-today' + (all ? ' all-done' : '') },
      h('div', { class: 'card-head' }, h('div', null, h('p', { class: 'eyebrow' }, new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })), h('h2', null, all ? 'You\'re done for today! 🎉' : 'Today\'s plan')),
        h('div', { class: 'plan-meta' }, h('b', null, done.length + '/' + items.length), h('small', null, all ? 'Great work. Go play, read for fun or build something!' : 'about ' + (left >= 60 ? Math.floor(left / 60) + ' h ' : '') + (left % 60) + ' min left'))),
      bar(pct, 'sci'),
      all ? null : h('p', { class: 'small muted' }, 'Do them in any order. Each lesson counts when you master it — not when the clock says so.'));
    const ul = h('ul', { class: 'plan-list' });
    items.forEach((it) => {
      const ok = itemDone(k, it);
      const li = h('li', { class: 'plan-item' + (ok ? ' done' : '') }, h('span', { class: 'tick', 'aria-hidden': 'true' }, ok ? '✓' : ''), h('span', { class: 'pi-t' }, it.t, h('small', null, ' · ' + it.min + ' min')));
      if (it.kind === 'fun') {
        li.appendChild(ok ? h('span', { class: 'small muted' }, 'Done') : h('span', { class: 'fun-picks' },
          [['Code Lab', () => { S.codeL = null; go('code'); }], ['AI & Me', () => go('course', { g: k.grade, s: 'ai' })], ['Money Smart', () => go('course', { g: k.grade, s: 'fin' })], ['A book', () => go('reading')], ['More Spanish', () => { S.es = null; go('spanish'); }]].map(([n, f]) => h('button', { type: 'button', class: 'chip-btn', onclick: f }, n)),
          h('button', { type: 'button', class: 'btn ghost xs', onclick: () => { markAct(k.id, 'fun'); render(); } }, 'I did it ✓')));
      } else if (!ok) li.appendChild(h('button', { type: 'button', class: 'btn primary xs', onclick: () => startItem(k, it) }, 'Start'));
      ul.appendChild(li);
    });
    card.appendChild(ul);
    const fm = FOCUS_MIN[planBand(k.grade)];
    card.appendChild(h('div', { class: 'actions plan-foot' },
      h('button', { type: 'button', class: 'btn ghost sm', onclick: () => Focus.start(k, fm[0], fm[1]) }, '⏱ Start a ' + fm[0] + '-minute focus session'),
      h('span', { class: 'small muted' }, 'Then a ' + fm[1] + '-minute brain break. Focus first, then move!')));
    return card;
  }

  /* focus sessions with brain breaks (a floating timer that survives screen changes) */
  const BREAKS = ['Do 10 jumping jacks', 'Get a glass of water', 'Stretch up high, then touch your toes', 'Look out a window and find 3 different colors', 'Walk around the room twice', 'Take 5 slow, deep breaths', 'Dance to one song'];
  const Focus = {
    el: null, tick: null, end: 0, mode: null, kidId: null, mins: [20, 5],
    start(k, f, b) { this.stop(); this.kidId = k.id; this.mins = [f, b]; this.mode = 'focus'; this.end = Date.now() + f * 60e3; this.idea = pick(BREAKS); this.mount(); this.tick = setInterval(() => this.update(), 1000); this.update(); },
    stop() { clearInterval(this.tick); this.tick = null; this.mode = null; if (this.el) { this.el.remove(); this.el = null; } },
    mount() { if (this.el) this.el.remove(); this.el = h('div', { class: 'focus-chip', role: 'timer', 'aria-live': 'off' }); document.body.appendChild(this.el); },
    update() {
      if (!this.el) return; const ms = Math.max(0, this.end - Date.now()), m = Math.floor(ms / 60e3), s = Math.floor((ms % 60e3) / 1000);
      if (ms <= 0) {
        if (this.mode === 'focus') { const r = dayRec(this.kidId); r.focus = (r.focus || 0) + 1; saveDay(this.kidId); this.mode = 'break'; this.end = Date.now() + this.mins[1] * 60e3; say('Great focus! Time for a brain break.', 1); }
        else { this.mode = 'done'; clearInterval(this.tick); say('Break is over. Ready for another focus session?', 1); }
      }
      this.el.className = 'focus-chip ' + this.mode; this.el.innerHTML = '';
      if (this.mode === 'done') { this.el.appendChild(h('b', null, 'Break over!')); this.el.appendChild(h('button', { type: 'button', class: 'btn primary xs', onclick: () => { const k = kidById(this.kidId); if (k) this.start(k, this.mins[0], this.mins[1]); } }, 'Focus again')); this.el.appendChild(h('button', { type: 'button', class: 'btn ghost xs', onclick: () => this.stop() }, 'Close')); return; }
      this.el.appendChild(h('span', { class: 'fc-label' }, this.mode === 'focus' ? 'Focus' : 'Brain break: ' + this.idea));
      this.el.appendChild(h('b', { class: 'fc-time' }, m + ':' + String(s).padStart(2, '0')));
      this.el.appendChild(h('button', { type: 'button', class: 'btn ghost xs', 'aria-label': 'Stop timer', onclick: () => this.stop() }, '✕'));
    }
  };

  /* mini quiz engine for warm-ups and the daily challenge */
  function startMQ(k, kind) {
    const qs = [];
    if (kind === 'warm') {
      dueChecks(k.id).slice(0, 2).forEach((key) => { const x = unitOf(key); buildQuestions(x.u).slice(0, 3).forEach((q) => qs.push(Object.assign(q, { key, from: SUBJ_NAME[x.s] + ' · ' + x.u.t }))); });
    } else {
      const prog = kidDoc(k.id).prog; let keys = Object.keys(prog).filter((key) => unitOf(key));
      if (keys.length < 5) SUBJ.forEach((s) => { const c = course(k.grade, s.k); if (c) for (let i = 0; i <= Math.max(0, courseStats(k.id, k.grade, s.k).next); i++) keys.push(k.grade + '-' + s.k + '-' + i); });
      keys = shuffle(Array.from(new Set(keys)));
      for (const key of keys) { if (qs.length >= 5) break; const x = unitOf(key); if (!x || !x.u) continue; const q = buildQuestions(x.u)[0]; if (q) qs.push(Object.assign(q, { key, from: SUBJ_NAME[x.s] + ' · ' + x.u.t })); }
    }
    if (!qs.length) { toast('Nothing to review yet — great job!'); markAct(k.id, kind); return render(); }
    S.mq = { kind, qs, at: 0, right: 0, picked: null, per: {} }; go('mq');
  }
  function challengeStreak(kidId) { const d = dayDoc(kidId).days || {}; let n = 0; const dt = new Date(); if (!(d[todayStr(dt)] || {}).ch) dt.setDate(dt.getDate() - 1); while ((d[todayStr(dt)] || {}).ch) { n++; dt.setDate(dt.getDate() - 1); } return n; }
  function finishMQ(k) {
    const M = S.mq, d = dayDoc(k.id); d.checks = d.checks || {};
    if (M.kind === 'warm') {
      Object.entries(M.per).forEach(([key, [r, t]]) => { const c = d.checks[key] || { n: 0 }; d.checks[key] = r >= Math.ceil(t * 0.67) ? { strong: true, at: Date.now(), n: c.n + 1 } : { due: addDays(3), n: c.n + 1, weak: true }; });
      markAct(k.id, 'warm');
    } else { dayRec(k.id).ch = { right: M.right, n: M.qs.length, at: Date.now() }; }
    saveDay(k.id); checkBadges(k.id); M.done = true; if (M.right === M.qs.length) setTimeout(confetti, 50); render();
  }
  function viewMQ() {
    const k = kidById(S.who), M = S.mq; if (!k || !M) return viewKidHome();
    const main = h('main', { class: 'wrap quiz' });
    if (M.done && M.kind === 'wq') { main.appendChild(wqResult(k, M)); return h('div', null, kidBar(), main); }
    if (M.done && M.kind === 'code') { main.appendChild(codeResult(k, M)); return h('div', null, kidBar(), main); }
    if (M.done && M.kind === 'car') { main.appendChild(carResult(k, M)); return h('div', null, kidBar(), main); }
    if (M.done) {
      const weak = Object.entries(M.per).filter(([key, [r, t]]) => r < Math.ceil(t * 0.67)).map(([key]) => unitOf(key));
      main.appendChild(h('section', { class: 'result-card ' + (M.right >= M.qs.length * 0.67 ? 'pass' : 'retry') }, ring(Math.round((M.right / M.qs.length) * 100), M.right + ' of ' + M.qs.length, 'lg'),
        lumi(M.right === M.qs.length ? 'cheer' : 'happy', M.kind === 'chal' ? (challengeStreak(k.id) > 1 ? challengeStreak(k.id) + '-day challenge streak! 🔥' : 'Challenge done! Come back tomorrow to start a streak.') : 'Warm-up done. Your brain is ready!'),
        h('h1', null, M.kind === 'chal' ? 'Daily challenge complete' : 'Warm-up complete'),
        weak.length ? h('div', { class: 'missed' }, h('p', null, M.kind === 'chal' ? 'Lessons worth another look:' : 'These need a little more practice — try the lesson again:'), h('div', { class: 'actions' }, weak.map((x) => h('button', { class: 'btn ghost sm', onclick: () => go('lesson', { g: x.g, s: x.s, i: x.i }) }, x.u.t)))) : null,
        h('div', { class: 'actions' }, h('button', { class: 'btn primary', onclick: () => { S.mq = null; go('home'); } }, 'Back to today\'s plan'))));
      return h('div', null, kidBar(), main);
    }
    const item = M.qs[M.at], answered = M.picked != null;
    const choices = h('div', { class: 'choices', role: 'group', 'aria-label': 'Answer choices' }, item.choices.map((ch, n) => {
      let cls = 'choice'; if (answered) { if (ch === item.a) cls += ' right'; else if (n === M.picked) cls += ' wrong'; }
      return h('button', { class: cls, disabled: answered ? true : null, onclick: () => { M.picked = n; markSeen(S.who, item); const ok = ch === item.a; item.ok = ok; if (ok) M.right++; const p = M.per[item.key] || (M.per[item.key] = [0, 0]); p[1]++; if (ok) p[0]++; render(); } }, h('span', { class: 'letter' }, 'ABCD'[n]), h('span', null, ch));
    }));
    const ok = answered && item.choices[M.picked] === item.a;
    main.appendChild(h('div', { class: 'quiz-head' }, h('p', { class: 'eyebrow' }, (M.kind === 'wq' ? 'Weekly quiz' : M.kind === 'car' ? 'Career Paths' : M.kind === 'code' ? 'Code Lab' : M.kind === 'chal' ? 'Daily challenge' : 'Warm-up') + ' · ' + item.from), h('div', { class: 'q-progress' }, 'Question ' + (M.at + 1) + ' of ' + M.qs.length), bar(Math.round((M.at / M.qs.length) * 100), 'sci')));
    const hear = (item.sayText || item.esSay) && Player.synth ? h('button', { type: 'button', class: 'btn ghost sm', onclick: () => (item.esSay ? sayEs(item.esSay) : say(item.sayText, 0.85)) }, icon('voice'), item.esSay ? ' Escuchar' : ' Hear the sentence') : null;
    main.appendChild(h('section', { class: 'q-card' }, h('h1', { class: 'q-text' }, item.q), pic(item.v), item.esIt ? h('div', { class: 'wq-es' }, esPic(item.esIt, true)) : null, hear, choices,
      answered ? h('div', { class: 'feedback ' + (ok ? 'ok' : 'no'), role: 'status' }, lumi(ok ? 'cheer' : 'oops', ok ? pick(CHEER) : 'Not quite. The answer is ' + item.a + '.')) : null,
      h('div', { class: 'q-actions' }, h('button', { class: 'btn ghost sm', onclick: () => { S.mq = null; go('home'); } }, 'Leave'), answered ? h('button', { class: 'btn primary', onclick: () => { if (M.at < M.qs.length - 1) { M.at++; M.picked = null; render(); } else if (M.kind === 'wq') finishWQ(k); else if (M.kind === 'car') finishCar(k); else if (M.kind === 'code') finishCode(k); else finishMQ(k); } }, M.at < M.qs.length - 1 ? 'Next question' : 'See my score') : null)));
    return h('div', null, kidBar(), main);
  }

  /* ── Friday weekly quiz: a mixed review of everything the learner worked on this week (Mon–Fri).
     Lessons opened or quizzed this week, spelling lists practiced, and Spanish lessons practiced all feed it.
     Misses flow back into the existing review systems (check-backs, tricky words, Spanish review). ── */
  const WQ_N = [10, 12, 15, 15];
  const WQ_DAY = 5; // Friday
  function misspell(w) {
    const out = new Set(), lw = w.toLowerCase(), V = 'aeiou';
    const add = (x) => { if (x && x !== lw && x.length >= 2 && /^[a-z' -]+$/.test(x)) out.add(x); };
    const subs = [['ie', 'ei'], ['ei', 'ie'], ['tion', 'sion'], ['sion', 'tion'], ['ible', 'able'], ['able', 'ible'], ['ph', 'f'], ['ck', 'k'], ['ee', 'ea'], ['ea', 'ee'], ['ai', 'ay'], ['ay', 'ai'], ['ou', 'ow'], ['ow', 'ou'], ['c', 'k'], ['k', 'c'], ['ance', 'ence'], ['ence', 'ance'], ['er', 'ur'], ['ir', 'er']];
    subs.forEach(([a, b]) => { const i = lw.indexOf(a); if (i >= 0) add(lw.slice(0, i) + b + lw.slice(i + a.length)); });
    for (let i = 1; i < lw.length; i++) { // doubled / undoubled letters
      if (lw[i] === lw[i - 1]) add(lw.slice(0, i) + lw.slice(i + 1));
      else if (/[b-df-hj-np-tv-z]/.test(lw[i]) && (i === lw.length - 1 || (V.includes(lw[i - 1]) && V.includes(lw[i + 1])))) add(lw.slice(0, i) + lw[i] + lw.slice(i));
    }
    if (lw.endsWith('e') && lw.length > 3) add(lw.slice(0, -1)); else if (lw.length > 2 && !V.includes(lw.slice(-1))) add(lw + 'e');
    for (let i = 1; i < lw.length - 1; i++) if (lw[i] !== lw[i + 1]) add(lw.slice(0, i) + lw[i + 1] + lw[i] + lw.slice(i + 2)); // swapped letters
    for (let i = 1; i < lw.length; i++) { const vi = V.indexOf(lw[i]); if (vi >= 0) add(lw.slice(0, i) + V[(vi + 1) % 5] + lw.slice(i + 1)); }
    const m = shuffle(Array.from(out)).slice(0, 3);
    return /^[A-Z]/.test(w) ? m.map((x) => x[0].toUpperCase() + x.slice(1)) : m;
  }
  function wqSources(kidId, ws) {
    const kd = kidDoc(kidId), from = parseDay(ws).getTime(), src = {};
    const put = (bucket, key) => { (src[bucket] = src[bucket] || []).includes(key) || src[bucket].push(key); };
    Object.entries(kd.prog || {}).forEach(([key, p]) => { if ((p.at || 0) >= from && unitOf(key) && unitOf(key).u) put(key.split('-')[1], key); });
    Object.entries(kd.viewed || {}).forEach(([key, t]) => { if (t >= from && unitOf(key) && unitOf(key).u) put(key.split('-')[1], key); });
    const L = litDoc(kidId); Object.entries(L.spell || {}).forEach(([id, r]) => { if ((r.at || 0) >= from && spellList(id)) put('spell', 'sp:' + id); });
    const G = langDoc(kidId); Object.entries(G.units || {}).forEach(([id, r]) => { if ((r.at || 0) >= from && ESALL().some((u) => u.id === id)) put('span', 'es:' + id); });
    return src;
  }
  const wqLabel = (bucket) => (bucket === 'spell' ? 'Spelling' : bucket === 'span' ? 'Spanish' : SUBJ_NAME[bucket] || bucket);
  function wqQuestion(key, used) {
    if (key.startsWith('sp:')) {
      const l = spellList(key.slice(3)); const rows = shuffle(l.w.filter((r) => !used.has('sp ' + r[0])));
      for (const [w, sen] of rows) { const wrong = misspell(w); if (wrong.length < 3) continue; used.add('sp ' + w);
        return { q: sen ? 'Which spelling fits?  ' + blankOut(sen, w) : 'Which word is spelled correctly?', a: w, choices: shuffle([w].concat(wrong)), sayText: sen || w, word: w, key, from: 'Spelling · ' + l.t }; }
      return null;
    }
    if (key.startsWith('es:')) {
      const u = ESALL().find((x) => x.id === key.slice(3)); const it = shuffle(u.items.filter((x) => !used.has('es ' + x.es)))[0]; if (!it) return null; used.add('es ' + it.es);
      const others = shuffle(u.items.filter((x) => x.es !== it.es)).slice(0, 3);
      if (Math.random() < 0.5) return { q: '¿Qué es? Pick the Spanish word.', a: it.es, choices: shuffle([it].concat(others).map((x) => x.es)), esIt: it, key, from: 'Spanish · ' + u.t };
      return { q: 'What does "' + it.es + '" mean?', a: it.en, choices: shuffle([it].concat(others).map((x) => x.en)), esSay: it.es, key, from: 'Spanish · ' + u.t };
    }
    const x = unitOf(key); const q = buildQuestions(x.u).find((y) => !used.has(y.q)); if (!q) return null; used.add(q.q);
    return Object.assign(q, { key, from: SUBJ_NAME[x.s] + ' · ' + x.u.t });
  }
  function buildWeeklyQuiz(k) {
    const ws = weekStart(); let src = wqSources(k.id, ws), fallback = false;
    if (!Object.keys(src).length) { src = wqSources(k.id, todayStr(new Date(parseDay(ws).getTime() - 7 * 864e5))); fallback = true; }
    const buckets = shuffle(Object.keys(src)); if (!buckets.length) return null;
    const want = WQ_N[planBand(k.grade)], used = new Set(), perKey = {}, qs = [], ptr = {};
    buckets.forEach((b) => { src[b] = shuffle(src[b]); ptr[b] = 0; });
    let stall = 0;
    while (qs.length < want && stall < buckets.length * 4) {
      const b = buckets[(qs.length + stall) % buckets.length], keys = src[b];
      let got = null;
      for (let t = 0; t < keys.length && !got; t++) { const key = keys[ptr[b]++ % keys.length]; if ((perKey[key] || 0) >= 3) continue; got = wqQuestion(key, used); if (got) perKey[key] = (perKey[key] || 0) + 1; }
      if (got) { got.bucket = b; qs.push(got); stall = 0; } else stall++;
    }
    return qs.length ? { qs: shuffle(qs), fallback } : null;
  }
  function startWQ(k) {
    const W = buildWeeklyQuiz(k);
    if (!W) { toast('Nothing to quiz yet this week. Finish a lesson first, then come back!'); return render(); }
    S.mq = { kind: 'wq', qs: W.qs, at: 0, right: 0, picked: null, per: {}, fallback: W.fallback }; go('mq');
  }
  function finishWQ(k) {
    const M = S.mq, w = weekRec(k.id), d = dayDoc(k.id); d.checks = d.checks || {};
    const bySubj = {}; M.qs.forEach((q, i) => { const b = bySubj[q.bucket] || (bySubj[q.bucket] = [0, 0]); b[1]++; if (q.ok) b[0]++; });
    const missed = []; const L = litDoc(k.id), G = langDoc(k.id); L.tricky = L.tricky || {}; G.review = G.review || {};
    M.qs.forEach((q) => {
      if (q.ok) return;
      if (q.key.startsWith('sp:')) { const t = L.tricky[q.word]; L.tricky[q.word] = { id: q.key.slice(3), box: 0, due: addDays(1), miss: ((t && t.miss) || 0) + 1 }; }
      else if (q.key.startsWith('es:')) { const es = q.esIt ? q.esIt.es : q.esSay, r = G.review[es]; G.review[es] = { box: 0, due: addDays(1), miss: ((r && r.miss) || 0) + 1 }; }
      if (!missed.includes(q.key)) missed.push(q.key);
    });
    // a unit with 2+ misses comes back in Monday's warm-up
    Object.entries(M.per).forEach(([key, [r, t]]) => { if (!key.includes(':') && t - r >= 2) { const c = d.checks[key] || { n: 0 }; d.checks[key] = Object.assign(c, { due: addDays(1), weak: true, strong: false }); } });
    const score = Math.round((M.right / M.qs.length) * 100), res = { right: M.right, n: M.qs.length, score, at: Date.now(), subj: bySubj, missed };
    const prev = w.quiz; w.quiz = prev ? Object.assign(prev, { best: Math.max(prev.best || prev.first.score, score), tries: (prev.tries || 1) + 1, last: res }) : { first: res, best: score, tries: 1, last: res };
    const r = dayRec(k.id); if (!r.ch) r.ch = { right: M.right, n: M.qs.length, at: Date.now(), wq: 1 };
    saveLit(k.id); saveLang(k.id); saveDay(k.id); markAct(k.id, 'wq'); Timer.accrue(); Timer.flush(); checkBadges(k.id);
    M.done = true; M.res = res; M.retake = !!prev; if (score >= 80) setTimeout(confetti, 50); render();
  }
  function wqResult(k, M) {
    const res = M.res, pass = res.score >= 70;
    const rows = Object.entries(res.subj).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]);
    const weakUnits = res.missed.filter((key) => !key.includes(':')).map(unitOf).filter(Boolean);
    return h('section', { class: 'result-card ' + (pass ? 'pass' : 'retry') }, ring(res.score, res.right + ' of ' + res.n, 'lg'),
      lumi(res.score >= 90 ? 'cheer' : pass ? 'happy' : 'think', res.score >= 90 ? 'Wow! You really learned this week\'s work!' : pass ? 'Nice work! A few things are worth one more look.' : 'Good effort. The things you missed will come back for practice next week.'),
      h('h1', null, M.retake ? 'Practice round done' : 'Weekly quiz complete'),
      M.retake ? h('p', { class: 'small muted' }, 'Your first score this week stays on your report. Practice rounds help you learn.') : null,
      h('ul', { class: 'hbars wq-subj' }, rows.map(([b, [r, t]]) => h('li', null, h('span', null, wqLabel(b)), bar(Math.round((r / t) * 100), r / t >= 0.7 ? 'sci' : 'soc'), h('span', { class: 'num' }, r + '/' + t)))),
      weakUnits.length ? h('div', { class: 'missed' }, h('p', null, 'Lessons worth another look:'), h('div', { class: 'actions' }, weakUnits.map((x) => h('button', { class: 'btn ghost sm', onclick: () => { S.mq = null; go('lesson', { g: x.g, s: x.s, i: x.i }); } }, x.u.t)))) : null,
      res.missed.some((key) => key.includes(':')) ? h('p', { class: 'small muted' }, 'Missed spelling and Spanish words were added to your review lists.') : null,
      h('div', { class: 'actions' }, h('button', { class: 'btn primary', onclick: () => { S.mq = null; go('home'); } }, 'Back to my dashboard')));
  }
  function wqCard(k) {
    const dow = new Date().getDay(), q = weekRec(k.id).quiz;
    if (!q && !(dow === WQ_DAY || dow === 6 || dow === 0)) return h('p', { class: 'small muted' }, '📝 Weekly quiz opens on Friday: a short mix of everything you learned this week.');
    if (!q) return h('div', { class: 'wq-cta' }, h('span', null, '📝 ', h('b', null, 'Weekly quiz is ready'), ' · about ' + WQ_N[planBand(k.grade)] + ' questions from this week'), h('button', { type: 'button', class: 'btn primary sm', onclick: () => startWQ(k) }, 'Take the weekly quiz'));
    return h('div', { class: 'wq-cta done' }, h('span', null, '✓ Weekly quiz: ', h('b', null, q.first.score + '%'), ' (' + q.first.right + ' of ' + q.first.n + ')'), h('button', { type: 'button', class: 'btn ghost xs', onclick: () => startWQ(k) }, 'Practice again'));
  }
  // parent view: this week's quiz and the trend over recent weeks
  function wqParent(k) {
    const d = dayDoc(k.id), q = weekRec(k.id).quiz;
    const hist = Object.entries(d.weeks || {}).filter(([, w]) => w.quiz).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 8);
    const card = h('article', { class: 'card' }, h('h3', null, 'Friday weekly quiz'));
    if (!q) card.appendChild(h('p', { class: 'small muted' }, new Date().getDay() === WQ_DAY ? 'Ready today and not taken yet.' : 'Opens Friday (it can be taken through Sunday). It mixes questions from every lesson, spelling list and Spanish lesson ' + k.name + ' worked on this week.'));
    else {
      const f = q.first;
      card.appendChild(h('p', null, h('b', null, f.score + '%'), ' · ' + f.right + ' of ' + f.n + ' correct on the first try' + (q.tries > 1 ? ' · best ' + q.best + '% after ' + q.tries + ' tries' : '')));
      card.appendChild(h('ul', { class: 'hbars' }, Object.entries(f.subj).map(([b, [r, t]]) => h('li', null, h('span', null, wqLabel(b)), bar(Math.round((r / t) * 100), r / t >= 0.7 ? 'sci' : 'soc'), h('span', { class: 'num' }, r + '/' + t)))));
      const wu = f.missed.filter((key) => !key.includes(':')).map(unitOf).filter(Boolean);
      if (wu.length) card.appendChild(h('p', { class: 'small' }, 'Missed questions from: ' + wu.map((x) => SUBJ_NAME[x.s] + ': ' + x.u.t).join('; ') + '. Lessons with 2 or more misses come back in next week\'s warm-up.'));
    }
    if (hist.length > 1) card.appendChild(h('p', { class: 'small muted' }, 'Recent weeks (first try): ' + hist.map(([ws, w]) => parseDay(ws).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + w.quiz.first.score + '%').join(' · ')));
    return card;
  }

  /* weekly goals and reflection (the learner's side of a weekly check-in) */
  const weekRec = (kidId, ws) => { const d = dayDoc(kidId); d.weeks = d.weeks || {}; const w = ws || weekStart(); return d.weeks[w] || (d.weeks[w] = { goals: [] }); };
  const GOAL_IDEAS = ['Master 3 math lessons', 'Read for 20 minutes every day', 'Get 100% on a spelling list', 'Finish a Spanish lesson', 'Write 5 journal entries', 'Do the daily challenge every day'];
  function weekCard(k) {
    const w = weekRec(k.id), dow = new Date().getDay(), showReflect = S.reflect || dow === 0 || dow >= 4 || (w.reflect && w.reflect.at);
    const box = h('section', { class: 'card week-card' }, h('div', { class: 'card-head' }, h('h3', null, 'My week'), h('span', { class: 'small muted' }, 'Set up to 3 goals. Check them off when you reach them.')));
    if (w.pnote) box.appendChild(h('div', { class: 'jr-pn' }, h('b', null, 'Note from your grown-up: '), w.pnote));
    box.appendChild(h('ul', { class: 'goal-list' }, w.goals.map((gl, i) => h('li', { class: gl.done ? 'done' : '' }, h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: gl.done ? true : null, onchange: (e) => { gl.done = e.target.checked; saveDay(k.id); if (gl.done) confetti(); render(); } }), ' ' + gl.t),
      h('button', { type: 'button', class: 'btn ghost xs', 'aria-label': 'Remove goal', onclick: () => { w.goals.splice(i, 1); saveDay(k.id); render(); } }, '✕')))));
    if (w.goals.length < 3) {
      const inp = h('input', { id: 'goal-in', maxlength: 80, placeholder: 'My goal this week…', list: 'goal-ideas', autocomplete: 'off' });
      box.appendChild(h('form', { class: 'goal-form', onsubmit: (e) => { e.preventDefault(); const t = inp.value.trim(); if (!t) return; w.goals.push({ t, done: false }); saveDay(k.id); render(); } }, inp, h('datalist', { id: 'goal-ideas' }, GOAL_IDEAS.map((x) => h('option', { value: x }))), h('button', { class: 'btn primary sm', type: 'submit' }, 'Add goal')));
    }
    box.appendChild(wqCard(k));
    const cu = conundrumFor(k); if (cu) box.appendChild(h('p', { class: 'small' }, h('button', { type: 'button', class: 'btn ghost xs', onclick: () => go('conundrum') }, (dayDoc(k.id).con || {})[cu.id] ? '✓ ' : '🤔 ', 'Conundrum of the week: ' + cu.t)));
    if (showReflect) {
      const r = w.reflect || {};
      box.appendChild(h('form', { class: 'form reflect-form', onsubmit: (e) => { e.preventDefault(); w.reflect = { good: $('#rf-good').value.trim(), hard: $('#rf-hard').value.trim(), next: $('#rf-next').value.trim(), at: Date.now() }; saveDay(k.id); toast('Reflection saved. Nice thinking!'); S.reflect = false; render(); } },
        h('h4', null, 'Look back on my week'),
        h('label', { for: 'rf-good' }, 'What went well?'), h('textarea', { id: 'rf-good', rows: 2, maxlength: 400 }, r.good || ''),
        h('label', { for: 'rf-hard' }, 'What was hard?'), h('textarea', { id: 'rf-hard', rows: 2, maxlength: 400 }, r.hard || ''),
        h('label', { for: 'rf-next' }, 'What will I try next week?'), h('textarea', { id: 'rf-next', rows: 2, maxlength: 400 }, r.next || ''),
        h('button', { class: 'btn primary sm', type: 'submit' }, r.at ? 'Update reflection' : 'Save reflection')));
    } else box.appendChild(h('button', { type: 'button', class: 'btn ghost sm', onclick: () => { S.reflect = true; render(); } }, 'Reflect on my week'));
    return box;
  }

  /* conundrums */
  const conBand = (g) => (g <= 4 ? 0 : g <= 8 ? 1 : 2);
  function conundrumFor(k) { const list = CON.filter((c) => c.band === conBand(k.grade)); if (!list.length) return null; const wkN = Math.floor((parseDay(weekStart()).getTime() / 864e5 + 3) / 7); return list[wkN % list.length]; }
  function viewConundrum() {
    const k = kidById(S.who); if (!k) return viewPicker();
    const c = conundrumFor(k); const d = dayDoc(k.id); d.con = d.con || {}; const ans = d.con[c.id];
    const main = h('main', { class: 'wrap conundrum' }, h('button', { class: 'btn ghost sm back', onclick: () => go('home') }, '← Dashboard'),
      h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, 'Conundrum of the week'), h('h1', null, c.t), h('p', { class: 'lede' }, 'There\'s no single right answer. What matters is how well you think it through.')));
    main.appendChild(h('article', { class: 'card con-story' }, h('p', { class: 'con-text' }, c.story), h('h3', null, c.q), Player.synth ? h('button', { type: 'button', class: 'btn ghost sm', onclick: () => say(c.story + ' ' + c.q, 1) }, icon('voice'), ' Read it to me') : null));
    if (!ans || S.conEdit) {
      let choice = ans ? ans.choice : null;
      const opts = h('div', { class: 'con-opts', role: 'radiogroup' }, c.opts.map((o) => h('button', { type: 'button', role: 'radio', 'aria-checked': choice === o ? 'true' : 'false', class: 'choice' + (choice === o ? ' right' : ''), onclick: (e) => { choice = o; opts.querySelectorAll('.choice').forEach((b) => { b.classList.remove('right'); b.setAttribute('aria-checked', 'false'); }); e.currentTarget.classList.add('right'); e.currentTarget.setAttribute('aria-checked', 'true'); $('#con-own').hidden = o !== 'Something else'; } }, o)));
      main.appendChild(h('form', { class: 'card form', onsubmit: (e) => {
        e.preventDefault(); const err = $('#con-err'), why = $('#con-why').value.trim(), own = $('#con-own-in').value.trim();
        if (!choice) return (err.textContent = 'Pick an answer first.');
        if (choice === 'Something else' && !own) return (err.textContent = 'Tell us your own idea.');
        if (wordCount(why) < (k.grade <= 3 ? 4 : 10)) return (err.textContent = 'Explain your thinking a little more — why did you choose it?');
        d.con[c.id] = { choice: choice === 'Something else' ? 'My idea: ' + own : choice, why, at: Date.now(), talked: ans ? ans.talked : false }; S.conEdit = false;
        saveDay(k.id); markAct(k.id, 'con'); checkBadges(k.id); confetti(); render();
      } }, h('h3', null, 'What do you think?'), opts,
        h('div', { id: 'con-own', hidden: choice === 'Something else' ? null : true }, h('label', { for: 'con-own-in' }, 'My own idea'), h('input', { id: 'con-own-in', maxlength: 160 })),
        h('label', { for: 'con-why' }, 'Why? Give your best reasons.'), h('textarea', { id: 'con-why', rows: 4, maxlength: 1200 }, ans ? ans.why : ''),
        h('p', { id: 'con-err', class: 'err', role: 'alert' }), h('button', { class: 'btn primary', type: 'submit' }, 'Share my thinking')));
    } else {
      main.appendChild(h('article', { class: 'card' }, h('p', { class: 'eyebrow' }, 'Your answer'), h('h3', null, ans.choice), h('p', { class: 'jr-text' }, ans.why),
        h('h4', null, 'Now think about the other side'), h('ul', { class: 'points' }, c.think.map((t) => h('li', null, t))),
        h('h4', null, 'Talk about it with your family'), h('ul', { class: 'points' }, c.talk.map((t) => h('li', null, t))),
        h('div', { class: 'actions' }, h('button', { class: 'btn ghost sm', onclick: () => { S.conEdit = true; render(); } }, 'Change my mind'), h('button', { class: 'btn primary sm', onclick: () => go('home') }, 'Done'))));
    }
    return h('div', null, kidBar(), main);
  }

  /* parent: weekly check-in (like an advisor meeting) */
  function pWeek() {
    const wrap = h('section', null, h('h1', { class: 'p-title' }, 'Weekly check-in'),
      h('p', { class: 'lede' }, 'A 10–15 minute talk each week: celebrate what was mastered, look at what needs review, and agree on next week\'s goals.'));
    if (!kids().length) { wrap.appendChild(h('p', { class: 'muted' }, 'Add a learner first.')); return wrap; }
    const k = kidById(S.pkid) || kids()[0]; S.pkid = k.id;
    wrap.appendChild(h('div', { class: 'filters' }, h('label', { for: 'p-kid' }, 'Learner'), kidSelect()));
    const ws = weekStart(), d = dayDoc(k.id), w = weekRec(k.id, ws), pass = settings().passMark, prog = kidDoc(k.id).prog;
    const days = Object.entries(d.days || {}).filter(([dt]) => dt >= ws);
    const planDays = days.filter(([, r]) => r.celebrated).length, chDays = days.filter(([, r]) => r.ch).length, focus = days.reduce((a, [, r]) => a + (r.focus || 0), 0);
    const mastered = Object.entries(prog).filter(([key, p]) => p.best >= pass && p.at && todayStr(new Date(p.at)) >= ws && unitOf(key)).map(([key]) => unitOf(key));
    const checks = d.checks || {}, strong = Object.keys(checks).filter((x) => checks[x].strong && checks[x].at && todayStr(new Date(checks[x].at)) >= ws).length;
    const weak = Object.keys(checks).filter((x) => checks[x].weak && unitOf(x)).map((x) => unitOf(x));
    wrap.appendChild(h('div', { class: 'hours-top' },
      h('article', { class: 'card' }, h('h3', null, 'This week'), h('dl', { class: 'facts' },
        h('div', null, h('dt', null, 'Daily plans finished'), h('dd', null, String(planDays))),
        h('div', null, h('dt', null, 'Lessons mastered'), h('dd', null, String(mastered.length))),
        h('div', null, h('dt', null, 'Check-backs passed'), h('dd', null, String(strong))),
        h('div', null, h('dt', null, 'Challenge days · streak'), h('dd', null, chDays + ' · ' + challengeStreak(k.id) + ' 🔥')),
        h('div', null, h('dt', null, 'Focus sessions'), h('dd', null, String(focus))),
        h('div', null, h('dt', null, 'Time logged'), h('dd', null, fmtHours(minutesWeek(k.id)) + ' / ' + goalFor(k.id) + ' h')))),
      h('article', { class: 'card' }, h('h3', null, 'Needs review'), weak.length ? h('ul', { class: 'points' }, weak.map((x) => h('li', null, SUBJ_NAME[x.s] + ': ' + x.u.t + ' (grade ' + x.g + ')'))) : h('p', { class: 'small muted' }, 'Nothing flagged — every check-back so far was passed.'),
        h('p', { class: 'small muted' }, 'A week after a lesson is mastered, it comes back as a 3-question check. Lessons that slip show up here and in the warm-up.'))));
    wrap.appendChild(wqParent(k));
    if (mastered.length) wrap.appendChild(h('article', { class: 'card' }, h('h3', null, 'Mastered this week'), h('ul', { class: 'points' }, mastered.map((x) => h('li', null, SUBJ_NAME[x.s] + ': ' + x.u.t + ((d.explain || {})[x.g + '-' + x.s + '-' + x.i] ? ' — in their words: "' + d.explain[x.g + '-' + x.s + '-' + x.i] + '"' : ''))))));
    wrap.appendChild(h('article', { class: 'card' }, h('h3', null, k.name + '\'s goals and reflection'),
      w.goals.length ? h('ul', { class: 'points' }, w.goals.map((gl) => h('li', null, (gl.done ? '✓ ' : '○ ') + gl.t))) : h('p', { class: 'small muted' }, 'No goals set yet this week. Set them together on Monday.'),
      w.reflect ? h('div', { class: 'reflect-view' }, h('p', null, h('b', null, 'Went well: '), w.reflect.good || '—'), h('p', null, h('b', null, 'Was hard: '), w.reflect.hard || '—'), h('p', null, h('b', null, 'Will try: '), w.reflect.next || '—')) : h('p', { class: 'small muted' }, 'Reflection not written yet (it appears on their dashboard from Thursday).'),
      h('form', { class: 'jr-note-form', onsubmit: (e) => { e.preventDefault(); w.pnote = $('#wk-note').value.trim().slice(0, 600) || null; saveDay(k.id); toast('Note saved. ' + k.name + ' will see it on their dashboard.'); render(); } },
        h('label', { class: 'small', for: 'wk-note' }, 'Note to ' + k.name), h('textarea', { id: 'wk-note', rows: 2, maxlength: 600 }, w.pnote || ''), h('button', { class: 'btn ghost xs', type: 'submit' }, 'Save note'))));
    wrap.appendChild(pQuest(k));
    const c = conundrumFor(k), ca = c && (d.con || {})[c.id];
    if (c) wrap.appendChild(h('article', { class: 'card' }, h('h3', null, 'Conundrum of the week: ' + c.t), h('p', { class: 'small' }, c.story + ' ' + c.q),
      ca ? [h('p', null, h('b', null, k.name + ' chose: '), ca.choice), h('p', { class: 'jr-text' }, ca.why)] : h('p', { class: 'small muted' }, 'Not answered yet — it shows up in Wednesday\'s plan.'),
      h('h4', null, 'Questions for your family talk'), h('ul', { class: 'points' }, c.talk.concat(c.think).map((t) => h('li', null, t))),
      ca ? h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: ca.talked ? true : null, onchange: (e) => { ca.talked = e.target.checked; saveDay(k.id); } }), ' We talked about it together') : null));
    return wrap;
  }

  /* ─────────────── Quests: multi-week projects with a family Show Day ─────────────── */
  // dayDoc.q = { active: {id, start, steps: {i: {note, m, at}}, ready, showDate}, hist: [{id, start, end, steps, fb: {loved, grow}}] }
  const QUESTS = window.LH_QUESTS || [];
  const questDoc = (kidId) => { const d = dayDoc(kidId); return d.q || (d.q = { active: null, hist: [] }); };
  const questById = (id) => QUESTS.find((x) => x.id === id);
  /* ─────────────── Career Paths: Skilled Trades ───────────────
     Each module pairs with a Home Depot Skills Explorers lesson (opened from the parent's educator account).
     Lantern adds key words, a safe home activity, a quiz and teach-back; hands-on activities need a grown-up's sign-off.
     Progress lives in day-{kidId}.car = { trackId: { m: { modId: { w, act, sign, best, last, tries, at, xp, done } }, done } }. */
  const CAR = window.LH_CAREERS || { tracks: [], parentItems: [] };
  const carOn = (k) => !!(k && CAR.tracks.length && (kidPlan(k.id).careers === true || (kidPlan(k.id).careers !== false && k.grade >= (CAR.minGrade || 6))));
  const carDoc = (kidId) => { const d = dayDoc(kidId); return d.car || (d.car = {}); };
  const carRec = (kidId, tr, m) => { const c = carDoc(kidId); c[tr.id] = c[tr.id] || { m: {} }; c[tr.id].m = c[tr.id].m || {}; return c[tr.id].m[m.id] || (c[tr.id].m[m.id] = {}); };
  const carPeek = (kidId, tr, m) => (((carDoc(kidId)[tr.id] || {}).m || {})[m.id]) || {};
  const carPassed = (r) => !!r && (r.best || 0) >= settings().passMark;
  const carKidDone = (r) => !!(r.w && carPassed(r) && r.act); // everything the learner does
  const carModDone = (kidId, tr, m) => { const r = carPeek(kidId, tr, m); return carKidDone(r) && (!m.act.hands || !!r.sign); };
  const carUnlocked = (kidId, tr, i) => i === 0 || carPassed(carPeek(kidId, tr, tr.mods[i - 1]));
  function carProgress(kidId, tr) { const done = tr.mods.filter((m) => carModDone(kidId, tr, m)).length; return { done, total: tr.mods.length, complete: done === tr.mods.length, waiting: tr.mods.filter((m) => m.act.hands && carKidDone(carPeek(kidId, tr, m)) && !carPeek(kidId, tr, m).sign).length }; }
  function carNext(k) { for (const tr of CAR.tracks) { const i = tr.mods.findIndex((m, j) => carUnlocked(k.id, tr, j) && !carKidDone(carPeek(k.id, tr, m))); if (i >= 0) return { tr, i, m: tr.mods[i] }; } return null; }
  function carUpdate(k, tr) {
    const c = carDoc(k.id)[tr.id]; tr.mods.forEach((m) => { const r = carPeek(k.id, tr, m); if (!r.done && carModDone(k.id, tr, m)) r.done = Date.now(); });
    if (c && !c.done && carProgress(k.id, tr).complete) { c.done = Date.now(); saveDay(k.id); checkBadges(k.id); setTimeout(confetti, 100); toast('You finished the ' + tr.t + ' pathway! ' + tr.e); }
  }
  function carCard(k) {
    const box = h('section', { class: 'card car-card' }, h('div', { class: 'card-head' }, h('h3', null, 'Career Paths: Trades'), h('span', { class: 'small muted' }, 'with Home Depot Skills Explorers')));
    CAR.tracks.forEach((tr) => { const p = carProgress(k.id, tr); box.appendChild(h('div', { class: 'quest-row' }, h('span', { class: 'quest-e', 'aria-hidden': 'true' }, tr.e), h('div', null, h('b', null, tr.t), h('div', { class: 'small muted' }, p.complete ? 'Pathway complete! 🏅' : p.done + ' of ' + p.total + ' modules done' + (p.waiting ? ' · ' + p.waiting + ' waiting for sign-off' : ''))))); box.appendChild(bar(Math.round((p.done / p.total) * 100), 'sci')); });
    box.appendChild(h('button', { class: 'btn primary sm', onclick: () => { S.carM = null; go('career'); } }, 'Open Career Paths'));
    return box;
  }
  function viewCareer() {
    const k = kidById(S.who); if (!k) return viewPicker();
    if (!Timer.on || Timer.on.kidId !== k.id || Timer.on.subj !== 'cte') Timer.start(k.id, 'cte');
    const tr = CAR.tracks[S.carT || 0]; const main = h('main', { class: 'wrap career' });
    if (S.carM == null) {
      main.appendChild(h('button', { class: 'btn ghost sm back', onclick: () => go('home') }, '← Dashboard'));
      main.appendChild(h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, 'Career Paths · Skilled Trades'), h('h1', null, tr.e + ' ' + tr.t), h('p', { class: 'lede' }, tr.blurb), h('p', { class: 'small muted' }, 'Each module goes with a lesson in ' + CAR.program + '. Watch it with your grown-up, try the activity, then pass the quick check to unlock the next module.')));
      const p = carProgress(k.id, tr); main.appendChild(h('div', { class: 'car-prog' }, bar(Math.round((p.done / p.total) * 100), 'sci'), h('span', { class: 'small' }, p.done + ' of ' + p.total + ' modules complete')));
      main.appendChild(h('ol', { class: 'units' }, tr.mods.map((m, i) => { const r = carPeek(k.id, tr, m), open = carUnlocked(k.id, tr, i), done = carModDone(k.id, tr, m), wait = !done && carKidDone(r);
        const st = done ? ['mastered', 'Complete'] : wait ? ['open', 'Waiting for grown-up sign-off'] : !open ? ['new', '🔒 Pass the previous module first'] : r.best != null ? ['trying', 'Best ' + r.best + '% · keep going'] : r.w ? ['open', 'Started'] : ['new', 'Not started'];
        return h('li', { class: 'unit ' + st[0] }, h('button', { class: 'unit-btn', disabled: open ? null : true, onclick: () => { S.carM = i; render(); } }, h('span', { class: 'unit-n' }, 'Module ' + (i + 1) + ' · ' + m.min + ' min video'), h('span', { class: 'unit-t' }, m.t), h('span', { class: 'watched-tag' }, m.act.hands ? 'Hands-on' : ''), h('span', { class: 'pill ' + st[0] }, st[1]))); })));
      return h('div', null, kidBar(), main);
    }
    const i = S.carM, m = tr.mods[i], r = carRec(k.id, tr, m), passed = carPassed(r);
    const step = (n, title, ...kids) => h('section', { class: 'card car-step' }, h('h2', { class: 'mini' }, n + '. ' + title), ...kids);
    main.appendChild(h('button', { class: 'btn ghost sm back', onclick: () => { S.carM = null; render(); } }, '← ' + tr.t + ' modules'));
    main.appendChild(h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, tr.e + ' ' + tr.t + ' · Module ' + (i + 1) + ' of ' + tr.mods.length), h('h1', null, m.t), h('p', { class: 'small muted' }, 'Goes with Skills Explorers: "' + m.hd + '" (' + m.min + ' min)')));
    main.appendChild(step(1, 'Key words', h('dl', { class: 'car-kw' }, m.kw.map(([w, d]) => h('div', null, h('dt', null, w), h('dd', null, d))))));
    main.appendChild(step(2, 'Watch together', h('p', { class: 'small' }, 'Your grown-up opens "' + m.hd + '" in Skills Explorers (it uses their account). Watch it together.'),
      h('div', { class: 'actions' }, h('a', { class: 'btn ghost sm', href: CAR.url, target: '_blank', rel: 'noopener noreferrer' }, 'Open Skills Explorers ↗'),
        r.w ? h('span', { class: 'done-pill' }, '✓ Watched') : h('button', { class: 'btn primary sm', onclick: () => { r.w = Date.now(); markAct(k.id, 'trade'); saveDay(k.id); render(); } }, 'We watched it ✓'))));
    main.appendChild(step(3, 'Big ideas', h('ul', { class: 'points' }, m.l.map((x) => h('li', null, x))), Player.synth ? h('button', { type: 'button', class: 'btn ghost sm', onclick: () => say(m.l.join(' '), 0.95) }, icon('voice'), ' Read it to me') : null));
    const actBox = step(4, 'Try it: ' + m.act.t, m.act.safety ? h('div', { class: 'car-safety', role: 'note' }, h('b', null, '⚠️ Safety first: '), m.act.safety) : null, h('ol', { class: 'points' }, m.act.steps.map((x) => h('li', null, x))));
    actBox.appendChild(r.act ? h('p', { class: 'small' }, '✓ Done' + (m.act.hands ? (r.sign ? ' · signed off by your grown-up' : ' · waiting for your grown-up to sign off in the Parent portal') : '')) : h('button', { class: 'btn primary sm', onclick: () => { r.act = Date.now(); markAct(k.id, 'trade'); saveDay(k.id); carUpdate(k, tr); render(); } }, m.act.hands ? 'I did it with my grown-up' : 'I did it'));
    main.appendChild(actBox);
    if (m.career) { const c = m.career; main.appendChild(h('section', { class: 'card car-career' }, h('p', { class: 'eyebrow' }, 'Career card'), h('h2', null, '🛠️ ' + c.title), h('dl', { class: 'facts' }, c.stats.map(([a, b]) => h('div', null, h('dt', null, a), h('dd', null, b)))), h('p', { class: 'small' }, h('b', null, 'Important qualities: '), c.qualities.join(' · ')), h('p', { class: 'small muted' }, 'Source: ', extLink(c.src)))); }
    main.appendChild(step(5, 'Quick check', h('p', { class: 'small' }, (passed ? '✓ Passed with ' + r.best + '%. ' : r.best != null ? 'Best so far: ' + r.best + '%. ' : '') + 'Score ' + settings().passMark + '% or higher to unlock the next module. You get different questions each try.'),
      r.w ? h('button', { class: 'btn primary sm', onclick: () => startCarQuiz(k, tr, i) }, passed ? 'Practice again' : 'Start the quick check') : h('p', { class: 'small muted' }, 'Watch the lesson first, then the quick check opens.')));
    if (passed) { const ta = h('textarea', { id: 'car-xp', rows: 2, maxlength: 400, placeholder: 'In my own words…' }, r.xp || '');
      main.appendChild(step(6, 'Explain it back', h('form', { class: 'explain-box', onsubmit: (e) => { e.preventDefault(); const t = ta.value.trim(); if (!t) return; r.xp = t; saveDay(k.id); toast('Saved!'); render(); } }, h('label', { for: 'car-xp' }, 'What is the most important thing you learned in this module?'), ta, h('button', { class: 'btn ghost sm', type: 'submit' }, r.xp ? 'Update' : 'Save')))); }
    const nxt = i + 1 < tr.mods.length && carUnlocked(k.id, tr, i + 1) ? i + 1 : null;
    main.appendChild(h('nav', { class: 'lesson-nav' }, i > 0 ? h('button', { class: 'btn ghost sm', onclick: () => { S.carM = i - 1; render(); } }, '← Previous module') : h('span'), nxt != null ? h('button', { class: 'btn primary sm', onclick: () => { S.carM = nxt; render(); } }, 'Next module →') : h('span')));
    return h('div', null, kidBar(), main);
  }
  function startCarQuiz(k, tr, i) {
    const m = tr.mods[i]; const qs = buildQuestions({ q: m.q }, k.id, 5).map((q) => Object.assign(q, { key: 'car:' + tr.id + ':' + m.id, from: tr.t + ' · ' + m.t }));
    S.mq = { kind: 'car', qs, at: 0, right: 0, picked: null, per: {}, tr: CAR.tracks.indexOf(tr), mi: i }; go('mq');
  }
  function finishCar(k) {
    const M = S.mq, tr = CAR.tracks[M.tr], m = tr.mods[M.mi], r = carRec(k.id, tr, m), score = Math.round((M.right / M.qs.length) * 100), was = carPassed(r);
    Object.assign(r, { best: Math.max(score, r.best || 0), last: score, tries: (r.tries || 0) + 1, at: Date.now() });
    markAct(k.id, 'trade'); saveDay(k.id); carUpdate(k, tr); Timer.accrue(); Timer.flush(); checkBadges(k.id);
    M.done = true; M.res = { score, pass: score >= settings().passMark, newly: !was && score >= settings().passMark }; if (M.res.pass) setTimeout(confetti, 50); render();
  }
  function carResult(k, M) {
    const tr = CAR.tracks[M.tr], i = M.mi, res = M.res, nxt = i + 1 < tr.mods.length ? i + 1 : null;
    return h('section', { class: 'result-card ' + (res.pass ? 'pass' : 'retry') }, ring(res.score, M.right + ' of ' + M.qs.length, 'lg'),
      lumi(res.pass ? 'cheer' : 'think', res.pass ? (res.newly && nxt != null ? 'Module passed! The next one is unlocked.' : 'Great job!') : 'Review the big ideas and try again. You\'ll get different questions.'),
      h('h1', null, res.pass ? 'Quick check passed' : 'Almost there'),
      h('div', { class: 'actions' }, h('button', { class: 'btn primary', onclick: () => { S.mq = null; S.carM = i; go('career'); } }, res.pass ? 'Back to the module' : 'Review the module'),
        res.pass && nxt != null ? h('button', { class: 'btn ghost', onclick: () => { S.mq = null; S.carM = nxt; go('career'); } }, 'Next: ' + tr.mods[nxt].t) : null));
  }
  function pCareers() {
    const wrap = h('section', { class: 'car-parent' }, h('h1', { class: 'p-title' }, 'Career paths'),
      h('p', { class: 'lede' }, 'Lantern pairs each module with a lesson in ' + CAR.program + ' (your free educator account). Your learners watch with you, do a safe home activity, and pass a quick check. You sign off on hands-on activities.'),
      h('p', null, h('a', { class: 'btn ghost sm', href: CAR.url, target: '_blank', rel: 'noopener noreferrer' }, 'Open Skills Explorers ↗')));
    const f = fam(); f.car = f.car || { checks: {} }; const ck = f.car.checks || (f.car.checks = {});
    const trackDone = (tid) => kids().filter((k) => { const c = carDoc(k.id)[tid]; return c && c.done; });
    wrap.appendChild(h('article', { class: 'card' }, h('h3', null, 'Your Skills Explorers checklist'),
      h('p', { class: 'small muted' }, 'These steps are done in your Skills Explorers account, not in Lantern. Opening each module there while you watch with your kids is what counts it. Check items off here so you don\'t miss entries, the survey or the report.'),
      h('ul', { class: 'car-checks' }, CAR.parentItems.map((it) => { const ready = it.track && trackDone(it.track).length; return h('li', null, h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: ck[it.id] ? true : null, onchange: (e) => { if (e.target.checked) ck[it.id] = Date.now(); else delete ck[it.id]; saveFamily(); render(); } }), ' ', h('b', null, it.t)), h('div', { class: 'small muted' }, it.d), !ck[it.id] && ready ? h('div', { class: 'small ready-tag' }, '✓ Ready: ' + trackDone(it.track).map((k) => k.name).join(' and ') + ' finished this pathway in Lantern') : null); }))));
    kids().forEach((k) => {
      const on = carOn(k), box = h('article', { class: 'card' }, h('div', { class: 'card-head' }, h('h3', null, k.name + ' · ' + GRADE_NAME(k.grade)),
        h('label', { class: 'check small' }, h('input', { type: 'checkbox', checked: on ? true : null, onchange: (e) => { k.plan = Object.assign(kidPlan(k.id), { careers: e.target.checked }); saveFamily(); render(); } }), ' Show Career Paths')));
      if (!on) { box.appendChild(h('p', { class: 'small muted' }, 'Skills Explorers is designed for ages 11–17 (grades 6–12). Turn it on if ' + k.name + ' is ready.')); wrap.appendChild(box); return; }
      CAR.tracks.forEach((tr) => {
        const p = carProgress(k.id, tr); box.appendChild(h('p', null, h('b', null, tr.e + ' ' + tr.t), ' · ' + p.done + ' of ' + p.total + ' modules complete' + (p.complete ? ' · finished ' + fmtDate(todayStr(new Date(carDoc(k.id)[tr.id].done))) : '')));
        box.appendChild(h('div', { class: 'table-wrap' }, h('table', { class: 'report' }, h('thead', null, h('tr', null, ['Module', 'Watched', 'Activity', 'Quick check', 'In their words'].map((t) => h('th', { scope: 'col' }, t)))),
          h('tbody', null, tr.mods.map((m) => { const r = carPeek(k.id, tr, m);
            const act = !r.act ? '—' : !m.act.hands ? '✓' : r.sign ? '✓ signed' : h('button', { class: 'btn primary xs', onclick: () => { const rr = carRec(k.id, tr, m); rr.sign = Date.now(); saveDay(k.id); carUpdate(k, tr); render(); } }, 'Sign off');
            return h('tr', null, h('td', null, m.t, m.act.hands ? h('span', { class: 'bonus-tag' }, 'Hands-on') : null), h('td', null, r.w ? '✓' : '—'), h('td', null, act), h('td', { class: 'num' }, r.best != null ? r.best + '%' + (carPassed(r) ? ' ✓' : '') : '—'), h('td', { class: 'small' }, r.xp ? '“' + r.xp + '”' : '')); })))));
      });
      box.appendChild(h('p', { class: 'small muted' }, 'Sign off only after you saw the hands-on activity done safely. On Mondays and Wednesdays, the next module appears in ' + k.name + '\'s plan.'));
      wrap.appendChild(box);
    });
    wrap.appendChild(pCode());
    return wrap;
  }

  /* ─────────────── Code Lab (bonus): Blocks with Code.org for younger learners, real Python for older ───────────────
     day-{kidId}.code = { b: { lessonId: { un, cdo, best, last, tries, at, done } }, p: { lessonId: { exId: { ok, code } } } }
     Python runs in a Web Worker (Pyodide from jsDelivr) so an endless loop can be stopped without freezing the page. */
  const CODE = window.LH_CODE || { blocks: [], python: [] };
  const codeDoc = (kidId) => { const d = dayDoc(kidId); const c = d.code || (d.code = {}); c.b = c.b || {}; c.p = c.p || {}; return c; };
  const codeTrack = (k) => { const v = kidPlan(k.id).code; return v === false || v === 'off' ? null : v === 'blocks' || v === 'python' ? v : k.grade <= 5 ? 'blocks' : 'python'; };
  const bDone = (r) => !!(r && (r.best || 0) >= settings().passMark && (r.un || r.cdo));
  const pDone = (kidId, L) => L.ex.every((x) => ((codeDoc(kidId).p[L.id] || {})[x.id] || {}).ok);
  function codeProgress(k) {
    const t = codeTrack(k); if (!t) return null; const list = t === 'blocks' ? CODE.blocks : CODE.python;
    const done = list.filter((L) => (t === 'blocks' ? bDone(codeDoc(k.id).b[L.id]) : pDone(k.id, L))).length;
    return { t, list, done, total: list.length, complete: done === list.length };
  }
  const codeUnlocked = (k, t, i) => { if (i === 0) return true; const prev = (t === 'blocks' ? CODE.blocks : CODE.python)[i - 1]; return t === 'blocks' ? (codeDoc(k.id).b[prev.id] || {}).best >= settings().passMark : pDone(k.id, prev); };
  function codeCard(k) {
    const p = codeProgress(k); if (!p) return null;
    return h('section', { class: 'card car-card' }, h('div', { class: 'card-head' }, h('h3', null, 'Code Lab'), h('span', { class: 'bonus-tag' }, 'Bonus')),
      h('div', { class: 'quest-row' }, h('span', { class: 'quest-e', 'aria-hidden': 'true' }, p.t === 'blocks' ? '🧩' : '🐍'), h('div', null, h('b', null, p.t === 'blocks' ? 'Coding with blocks' : 'Python'), h('div', { class: 'small muted' }, p.complete ? 'Track complete! 🏅' : p.done + ' of ' + p.total + ' lessons done'))),
      bar(Math.round((p.done / p.total) * 100), 'ai'), h('button', { class: 'btn primary sm', onclick: () => { S.codeL = null; go('code'); } }, 'Open Code Lab'));
  }

  /* Python engine */
  const PY_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
  const PY_HARNESS = [
    'import sys, json, math, traceback',
    'def _run(code, inputs, calls):',
    '    disp = []; clean = []; q = list(inputs)',
    '    class _O:',
    '        def write(self, s):',
    '            disp.append(s); clean.append(s); return len(s)',
    '        def flush(self): pass',
    '    def _input(prompt=""):',
    '        disp.append(str(prompt))',
    '        if not q: raise EOFError("The program asked for more input than it was given.")',
    '        v = str(q.pop(0)); disp.append(v + "\\n"); return v',
    '    ns = {"__name__": "__main__", "input": _input}',
    '    old = sys.stdout; sys.stdout = _O(); err = None; res = []',
    '    try:',
    '        exec(compile(code, "<your code>", "exec"), ns)',
    '        for expr, eq in calls:',
    '            try:',
    '                r = eval(expr, ns); x = eval(eq, {})',
    '                num = isinstance(r, (int, float)) and isinstance(x, (int, float)) and not isinstance(r, bool) and not isinstance(x, bool)',
    '                res.append([bool(math.isclose(r, x, rel_tol=1e-9, abs_tol=1e-9) if num else (r == x and type(r) == type(x) or (isinstance(r, bool) and r == x))), repr(r)])',
    '            except BaseException as e:',
    '                res.append([False, type(e).__name__ + ": " + str(e)])',
    '    except BaseException as e:',
    '        ln = getattr(e, "lineno", None) if isinstance(e, SyntaxError) else None',
    '        if ln is None:',
    '            fr = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == "<your code>"]',
    '            ln = fr[-1].lineno if fr else None',
    '        err = ("Line " + str(ln) + ": " if ln else "") + type(e).__name__ + ": " + str(getattr(e, "msg", None) or e)',
    '    finally:',
    '        sys.stdout = old',
    '    return json.dumps({"out": "".join(disp), "clean": "".join(clean), "err": err, "calls": res})'
  ].join('\n');
  const Py = {
    w: null, ready: false, fail: null, pend: {}, n: 0, readyP: null,
    start() {
      if (this.w || this.fail) return this.readyP;
      const src = 'importScripts(' + JSON.stringify(PY_URL + 'pyodide.js') + ');\nconst H = ' + JSON.stringify(PY_HARNESS) + ';\n' +
        'const ready = loadPyodide({ indexURL: ' + JSON.stringify(PY_URL) + ' }).then((py) => { py.runPython(H); return py; });\n' +
        'ready.then(() => postMessage({ ready: 1 }), (e) => postMessage({ loadFail: String((e && e.message) || e) }));\n' +
        'onmessage = async (e) => { const d = e.data; try { const py = await ready; const r = py.globals.get("_run")(d.code, py.toPy(d.inputs), py.toPy(d.calls)); postMessage({ id: d.id, r: JSON.parse(r) }); } catch (err) { postMessage({ id: d.id, r: { out: "", clean: "", err: String((err && err.message) || err), calls: [] } }); } };';
      let res; this.readyP = new Promise((r) => { res = r; });
      try { this.w = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' }))); }
      catch (e) { this.fail = 'Python can\'t start in this window. Open Lantern at lantern-homeschool.netlify.app to code.'; res(false); return this.readyP; }
      this.w.onmessage = (e) => { const d = e.data;
        if (d.ready) { this.ready = true; res(true); if (S.screen === 'code') render(); }
        if (d.loadFail) { this.fail = 'Python couldn\'t load (' + d.loadFail.slice(0, 80) + '). Check the internet connection and reload.'; this.w.terminate(); this.w = null; res(false); if (S.screen === 'code') render(); }
        if (d.id && this.pend[d.id]) { const p = this.pend[d.id]; delete this.pend[d.id]; clearTimeout(p.t); p.res(d.r); } };
      this.w.onerror = (e) => { if (!this.ready) { this.fail = 'Python couldn\'t start here. Open Lantern at lantern-homeschool.netlify.app to code.'; this.w = null; res(false); if (S.screen === 'code') render(); } };
      return this.readyP;
    },
    async run(code, inputs, calls) {
      const ok = await this.start(); if (!ok) return { out: '', clean: '', err: this.fail, calls: [] };
      const id = ++this.n;
      return new Promise((res) => {
        const t = setTimeout(() => { delete this.pend[id]; if (this.w) this.w.terminate(); this.w = null; this.ready = false; this.readyP = null; this.start(); res({ out: '', clean: '', err: 'Your program ran for more than 5 seconds and was stopped. Is there a loop that never ends?', calls: [], timeout: true }); }, 5000);
        this.pend[id] = { res, t }; this.w.postMessage({ id, code, inputs: inputs || [], calls: calls || [] });
      });
    }
  };
  const norm = (s) => String(s || '').replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
  async function pyCheck(ex, code) {
    const fails = [], calls = ex.tests.filter((t) => t.call);
    for (const t of ex.tests) {
      if (t.has && !code.includes(t.has)) { fails.push('Your code should use ' + JSON.stringify(t.has.trim()) + ' for this exercise.'); continue; }
      if (t.hasNot && code.includes(t.hasNot)) { fails.push('Try it without using ' + t.hasNot.replace('(', '') + '.'); continue; }
      if (t.out == null && t.outHas == null && t.outLines == null) continue;
      const r = await Py.run(code, t.in, []); if (r.err) return { ok: false, msg: r.err, out: r.out };
      const got = norm(r.clean), w = t.in && t.in.length ? ' with input ' + t.in.join(', ') : '';
      if (t.out != null && got !== norm(t.out)) fails.push('Expected' + w + ':\n' + norm(t.out) + '\nYour program printed:\n' + (got || '(nothing)'));
      else if (t.outHas != null && !got.includes(t.outHas)) fails.push('Expected' + w + ' the output to include: ' + t.outHas + '\nYour program printed:\n' + (got || '(nothing)'));
      else if (t.outLines != null && got.split('\n').filter((l) => l.trim()).length !== t.outLines) fails.push('Expected ' + t.outLines + ' lines of output, but got ' + got.split('\n').filter((l) => l.trim()).length + '.');
    }
    if (calls.length && !fails.length) {
      const r = await Py.run(code, [], calls.map((t) => [t.call, t.eq])); if (r.err) return { ok: false, msg: r.err, out: r.out };
      r.calls.forEach((c, i) => { if (!c[0]) fails.push(calls[i].call.replace(/ == .*$/, '') + ' should give ' + (calls[i].call.includes(' == ') ? calls[i].call.split(' == ')[1] : calls[i].eq) + ', but gave ' + c[1]); });
    }
    return fails.length ? { ok: false, msg: fails[0] } : { ok: true };
  }
  function codeEditor(id, val, onInput) {
    const ta = h('textarea', { id, class: 'code-ed', rows: Math.max(6, Math.min(16, String(val).split('\n').length + 2)), spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': 'Python code' }, val);
    ta.addEventListener('input', () => onInput(ta.value));
    ta.addEventListener('keydown', (e) => {
      const s = ta.selectionStart, en = ta.selectionEnd, v = ta.value;
      if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); ta.value = v.slice(0, s) + '    ' + v.slice(en); ta.selectionStart = ta.selectionEnd = s + 4; onInput(ta.value); }
      else if (e.key === 'Enter') { const line = v.slice(v.lastIndexOf('\n', s - 1) + 1, s); let ind = (line.match(/^ */) || [''])[0]; if (/:\s*$/.test(line)) ind += '    '; if (ind) { e.preventDefault(); const ins = '\n' + ind; ta.value = v.slice(0, s) + ins + v.slice(en); ta.selectionStart = ta.selectionEnd = s + ins.length; onInput(ta.value); } }
    });
    return ta;
  }
  function viewCode() {
    const k = kidById(S.who); if (!k) return viewPicker();
    if (!Timer.on || Timer.on.kidId !== k.id || Timer.on.subj !== 'code') Timer.start(k.id, 'code');
    const p = codeProgress(k), main = h('main', { class: 'wrap career code-lab' });
    if (!p) { main.appendChild(h('p', null, 'Code Lab is turned off. Ask your grown-up.')); return h('div', null, kidBar(), main); }
    const blocks = p.t === 'blocks';
    if (S.codeL == null) {
      main.appendChild(h('button', { class: 'btn ghost sm back', onclick: () => go('home') }, '← Dashboard'));
      main.appendChild(h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, 'Code Lab · Bonus'), h('h1', null, blocks ? '🧩 Coding with blocks' : '🐍 Python'),
        h('p', { class: 'lede' }, blocks ? 'Learn to think like a coder with games at home and puzzles on Code.org.' : 'Write real Python code right here. Run it, check it, and build your own programs.')));
      main.appendChild(h('div', { class: 'car-prog' }, bar(Math.round((p.done / p.total) * 100), 'ai'), h('span', { class: 'small' }, p.done + ' of ' + p.total + ' lessons complete')));
      main.appendChild(h('ol', { class: 'units' }, p.list.map((L, i) => { const open = codeUnlocked(k, p.t, i), done = blocks ? bDone(codeDoc(k.id).b[L.id]) : pDone(k.id, L);
        const nOk = blocks ? 0 : L.ex.filter((x) => ((codeDoc(k.id).p[L.id] || {})[x.id] || {}).ok).length;
        const st = done ? ['mastered', 'Complete'] : !open ? ['new', '🔒 Finish the previous lesson first'] : blocks ? ((codeDoc(k.id).b[L.id] || {}).best != null ? ['trying', 'Best ' + codeDoc(k.id).b[L.id].best + '%'] : ['new', 'Not started']) : nOk ? ['trying', nOk + ' of ' + L.ex.length + ' exercises'] : ['new', 'Not started'];
        return h('li', { class: 'unit ' + st[0] }, h('button', { class: 'unit-btn', disabled: open ? null : true, onclick: () => { S.codeL = i; render(); } }, h('span', { class: 'unit-n' }, 'Lesson ' + (i + 1) + (blocks ? '' : ' · ' + L.ex.length + ' exercises')), h('span', { class: 'unit-t' }, L.t), h('span', { class: 'watched-tag' }), h('span', { class: 'pill ' + st[0] }, st[1]))); })));
      return h('div', null, kidBar(), main);
    }
    const i = S.codeL, L = p.list[i];
    main.appendChild(h('button', { class: 'btn ghost sm back', onclick: () => { S.codeL = null; render(); } }, '← Code Lab'));
    main.appendChild(h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, (blocks ? '🧩 Blocks' : '🐍 Python') + ' · Lesson ' + (i + 1) + ' of ' + p.total), h('h1', null, L.t)));
    main.appendChild(h('section', { class: 'card car-step' }, h('h2', { class: 'mini' }, 'Big ideas'), h('ul', { class: 'points' }, L.l.map((x) => h('li', null, x))), Player.synth ? h('button', { type: 'button', class: 'btn ghost sm', onclick: () => say(L.l.join(' '), 0.95) }, icon('voice'), ' Read it to me') : null));
    if (blocks) {
      const r = codeDoc(k.id).b[L.id] || (codeDoc(k.id).b[L.id] = {});
      main.appendChild(h('section', { class: 'card car-step' }, h('h2', { class: 'mini' }, 'Play it at home: ' + L.un.t), h('ol', { class: 'points' }, L.un.steps.map((x) => h('li', null, x))),
        r.un ? h('p', { class: 'small' }, '✓ Done') : h('button', { class: 'btn primary sm', onclick: () => { r.un = Date.now(); markAct(k.id, 'fun'); saveDay(k.id); render(); } }, 'We played it ✓')));
      main.appendChild(h('section', { class: 'card car-step' }, h('h2', { class: 'mini' }, 'Code it on Code.org'), h('p', { class: 'small' }, 'With your grown-up, open Code.org, choose Course B (Computer Science Fundamentals), and do the lesson: ' + L.cdo + '.'),
        h('div', { class: 'actions' }, h('a', { class: 'btn ghost sm', href: CODE.csf, target: '_blank', rel: 'noopener noreferrer' }, 'Open Code.org ↗'), r.cdo ? h('span', { class: 'done-pill' }, '✓ Done') : h('button', { class: 'btn primary sm', onclick: () => { r.cdo = Date.now(); saveDay(k.id); render(); } }, 'I did it on Code.org ✓'))));
      main.appendChild(h('section', { class: 'card car-step' }, h('h2', { class: 'mini' }, 'Quick check'), h('p', { class: 'small' }, (r.best != null ? 'Best so far: ' + r.best + '%. ' : '') + 'Score ' + settings().passMark + '% to unlock the next lesson.'),
        h('button', { class: 'btn primary sm', onclick: () => { const qs = buildQuestions({ q: L.q }, k.id, 5).map((q) => Object.assign(q, { key: 'code:' + L.id, from: 'Code Lab · ' + L.t })); S.mq = { kind: 'code', qs, at: 0, right: 0, picked: null, per: {}, li: i }; go('mq'); } }, r.best != null ? 'Try again' : 'Start the quick check')));
    } else {
      Py.start();
      main.appendChild(h('p', { class: 'small py-status' + (Py.fail ? ' err' : '') }, Py.fail ? Py.fail : Py.ready ? '🐍 Python is ready.' : '⏳ Starting Python… (the first time takes about 10 seconds)'));
      const rec = codeDoc(k.id).p[L.id] || (codeDoc(k.id).p[L.id] = {}); S.pyCode = S.pyCode || {}; S.pyRes = S.pyRes || {};
      L.ex.forEach((x, n) => {
        const key = L.id + '/' + x.id, er = rec[x.id] || {}; if (S.pyCode[key] == null) S.pyCode[key] = er.code != null ? er.code : x.start;
        const res = S.pyRes[key] || {}, needsIn = x.tests.some((t) => t.in && t.in.length) || /input\s*\(/.test(S.pyCode[key]);
        const ed = codeEditor('ed-' + key.replace(/\W/g, '_'), S.pyCode[key], (v) => { S.pyCode[key] = v; });
        const inBox = h('textarea', { class: 'code-in', rows: 2, placeholder: 'Type what the user would enter, one answer per line', 'aria-label': 'Program input' }, res.inputs || '');
        const save = (ok) => { rec[x.id] = { ok: ok ? Date.now() : er.ok || 0, code: S.pyCode[key].slice(0, 3000) }; saveDay(k.id); };
        const card = h('section', { class: 'card car-step py-ex' + (er.ok ? ' ok' : '') },
          h('h2', { class: 'mini' }, 'Exercise ' + (n + 1) + (er.ok ? ' ✓' : '')), h('p', { class: 'py-task' }, x.t), ed,
          needsIn ? h('div', null, h('label', { class: 'small' }, 'Input for Run'), inBox) : null,
          h('div', { class: 'actions' },
            h('button', { class: 'btn ghost sm', disabled: res.busy ? true : null, onclick: async () => { res.busy = true; res.inputs = inBox.value; S.pyRes[key] = res; render(); const r = await Py.run(S.pyCode[key], inBox.value ? inBox.value.split('\n') : [], []); Object.assign(res, { busy: false, out: r.out, err: r.err, msg: null }); save(false); render(); } }, '▶ Run'),
            h('button', { class: 'btn primary sm', disabled: res.busy ? true : null, onclick: async () => { res.busy = true; S.pyRes[key] = res; render(); const c = await pyCheck(x, S.pyCode[key]); Object.assign(res, { busy: false, ok: c.ok, msg: c.ok ? null : c.msg, out: c.out != null ? c.out : res.out, err: null }); save(c.ok); markAct(k.id, 'fun'); if (c.ok) { confetti(); const was = pDone(k.id, L); if (was) { toast('Lesson complete! 🐍'); checkBadges(k.id); } } render(); } }, '✓ Check'),
            h('button', { class: 'btn ghost sm', onclick: () => { res.hint = !res.hint; S.pyRes[key] = res; render(); } }, res.hint ? 'Hide hint' : 'Hint'),
            lumiReady(k.id) ? h('button', { class: 'btn ghost sm', onclick: () => { lumiContext({ kidId: k.id, g: k.grade, s: 'code', unit: 'Python: ' + L.t, points: L.l, mode: 'code', question: x.t, getCode: () => S.pyCode[key], getOut: () => (S.pyRes[key] || {}).err || (S.pyRes[key] || {}).msg || (S.pyRes[key] || {}).out || '' }); LP.open = true; drawLumi(); } }, 'Ask Lumi') : null,
            h('button', { class: 'btn ghost sm', onclick: () => { if (confirm('Start this exercise over?')) { S.pyCode[key] = x.start; S.pyRes[key] = {}; render(); } } }, 'Reset')),
          res.busy ? h('p', { class: 'small muted' }, Py.ready ? 'Running…' : 'Starting Python…') : null,
          res.hint ? h('p', { class: 'small py-hint' }, '💡 ' + x.hint) : null,
          res.ok ? h('p', { class: 'py-pass', role: 'status' }, '✓ All checks passed. Great coding!') : null,
          res.msg ? h('pre', { class: 'py-out fail', role: 'status' }, res.msg) : null,
          res.err ? h('pre', { class: 'py-out fail', role: 'status' }, res.err) : null,
          res.out && !res.msg ? h('pre', { class: 'py-out' }, res.out) : null);
        main.appendChild(card);
      });
    }
    const nxt = i + 1 < p.total && codeUnlocked(k, p.t, i + 1) ? i + 1 : null;
    main.appendChild(h('nav', { class: 'lesson-nav' }, i > 0 ? h('button', { class: 'btn ghost sm', onclick: () => { S.codeL = i - 1; render(); } }, '← Previous lesson') : h('span'), nxt != null ? h('button', { class: 'btn primary sm', onclick: () => { S.codeL = nxt; render(); } }, 'Next lesson →') : h('span')));
    return h('div', null, kidBar(), main);
  }
  function finishCode(k) {
    const M = S.mq, L = CODE.blocks[M.li], r = codeDoc(k.id).b[L.id] || (codeDoc(k.id).b[L.id] = {}), score = Math.round((M.right / M.qs.length) * 100);
    Object.assign(r, { best: Math.max(score, r.best || 0), last: score, tries: (r.tries || 0) + 1, at: Date.now() }); if (!r.done && bDone(r)) r.done = Date.now();
    markAct(k.id, 'fun'); saveDay(k.id); Timer.accrue(); Timer.flush(); checkBadges(k.id);
    M.done = true; M.res = { score, pass: score >= settings().passMark }; if (M.res.pass) setTimeout(confetti, 50); render();
  }
  function codeResult(k, M) {
    const res = M.res, nxt = M.li + 1 < CODE.blocks.length ? M.li + 1 : null;
    return h('section', { class: 'result-card ' + (res.pass ? 'pass' : 'retry') }, ring(res.score, M.right + ' of ' + M.qs.length, 'lg'),
      lumi(res.pass ? 'cheer' : 'think', res.pass ? 'You think like a coder!' : 'Let\'s look at the big ideas and try again.'), h('h1', null, res.pass ? 'Quick check passed' : 'Almost there'),
      h('div', { class: 'actions' }, h('button', { class: 'btn primary', onclick: () => { S.mq = null; S.codeL = M.li; go('code'); } }, 'Back to the lesson'),
        res.pass && nxt != null ? h('button', { class: 'btn ghost', onclick: () => { S.mq = null; S.codeL = nxt; go('code'); } }, 'Next: ' + CODE.blocks[nxt].t) : null));
  }
  function pCode() {
    const box = h('article', { class: 'card' }, h('h2', null, 'Code Lab (bonus)'),
      h('p', { class: 'small' }, 'Blocks (grades 1–5): coding games at home plus Code.org\'s free Course B. Python (grades 6–12): real code that runs inside Lantern with automatic checking; Lumi can give hints without writing the answer. A Chromebook works for both; a physical keyboard helps for Python.'),
      h('p', { class: 'small muted' }, 'It is bonus work: it adds badges and hours but never lowers grade completion. A high school learner who finishes the Python track gets "Introduction to Programming (Python)" on the transcript for 0.5 credit.'));
    kids().forEach((k) => {
      const p = codeProgress(k), cur = kidPlan(k.id).code || 'auto';
      const sel = h('select', { 'aria-label': 'Code Lab track for ' + k.name, onchange: (e) => { k.plan = Object.assign(kidPlan(k.id), { code: e.target.value === 'auto' ? undefined : e.target.value }); saveFamily(); render(); } },
        [['auto', 'By grade (' + (k.grade <= 5 ? 'Blocks' : 'Python') + ')'], ['blocks', 'Blocks'], ['python', 'Python'], ['off', 'Off']].map(([v, n]) => h('option', { value: v, selected: cur === v ? true : null }, n)));
      box.appendChild(h('div', { class: 'code-kid' }, h('div', { class: 'card-head' }, h('h3', null, k.name), sel),
        !p ? h('p', { class: 'small muted' }, 'Off') : h('p', { class: 'small' }, (p.t === 'blocks' ? '🧩 Blocks' : '🐍 Python') + ' · ' + p.done + ' of ' + p.total + ' lessons complete' + (p.done < p.total ? ' · next: ' + (p.list.find((L) => !(p.t === 'blocks' ? bDone(codeDoc(k.id).b[L.id]) : pDone(k.id, L))) || {}).t : ''))));
    });
    return box;
  }

  function questProgress(kidId) { const a = questDoc(kidId).active; if (!a) return null; const q = questById(a.id); if (!q) return null; const done = q.steps.filter((s, i) => a.steps[i]).length; return { q, a, done, total: q.steps.length, next: q.steps.findIndex((s, i) => !a.steps[i]) }; }
  function questCard(k) {
    const p = questProgress(k.id), hist = questDoc(k.id).hist || [];
    const box = h('section', { class: 'card quest-card' }, h('div', { class: 'card-head' }, h('h3', null, 'My Quest'), hist.length ? h('span', { class: 'small muted' }, hist.length + ' finished') : null));
    if (!p) {
      box.appendChild(h('p', { class: 'small' }, 'A Quest is a 2–5 week project you build with your hands and your brain, then show to your family on Show Day.'));
      box.appendChild(h('button', { class: 'btn primary sm', onclick: () => go('quest') }, 'Choose a Quest'));
    } else {
      box.appendChild(h('div', { class: 'quest-row' }, h('span', { class: 'quest-e', 'aria-hidden': 'true' }, p.q.e), h('div', null, h('b', null, p.q.t), h('div', { class: 'small muted' }, p.a.ready ? 'Ready for Show Day!' : p.next >= 0 ? 'Next: ' + p.q.steps[p.next].t : 'All steps done — plan your Show Day'))));
      box.appendChild(bar(Math.round((p.done / p.total) * 100), 'soc'));
      box.appendChild(h('button', { class: 'btn primary sm', onclick: () => go('quest') }, 'Open my Quest'));
    }
    return box;
  }
  function viewQuest() {
    const k = kidById(S.who); if (!k) return viewPicker();
    const qd = questDoc(k.id), p = questProgress(k.id);
    const main = h('main', { class: 'wrap quest' }, h('button', { class: 'btn ghost sm back', onclick: () => go('home') }, '← Dashboard'));
    if (!p) {
      const band = S.qband != null ? S.qband : conBand(k.grade);
      main.appendChild(h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, 'Quests'), h('h1', null, 'Choose your Quest'),
        h('p', { class: 'lede' }, 'Pick a project that sounds fun. You\'ll work on it a little each week, then present it to your family on Show Day.'),
        h('div', { class: 'bf-tabs' }, [['Grades 1–4', 0], ['Grades 5–8', 1], ['Grades 9–12', 2]].map(([n, b]) => h('button', { type: 'button', class: 'gchip' + (band === b ? ' on' : ''), onclick: () => { S.qband = b; render(); } }, n + (b === conBand(k.grade) ? ' (mine)' : ''))))));
      main.appendChild(h('div', { class: 'quest-grid' }, QUESTS.filter((q) => q.band === band).map((q) => {
        const did = (qd.hist || []).some((x) => x.id === q.id);
        return h('article', { class: 'card quest-pick' }, h('span', { class: 'quest-e big', 'aria-hidden': 'true' }, q.e), h('h3', null, q.t + (did ? ' ✓' : '')), h('p', { class: 'small' }, q.drive),
          h('p', { class: 'small muted' }, q.weeks + ' weeks · ' + q.subj.join(', ') + ' · ' + q.steps.length + ' steps'),
          h('button', { class: 'btn primary sm', onclick: () => { qd.active = { id: q.id, start: todayStr(), steps: {} }; saveDay(k.id); markAct(k.id, 'quest'); confetti(); render(); } }, 'Start this Quest'));
      })));
      if ((qd.hist || []).length) main.appendChild(questPortfolio(k));
      return h('div', null, kidBar(), main);
    }
    const { q, a } = p;
    main.appendChild(h('header', { class: 'lit-head' }, h('p', { class: 'eyebrow' }, 'My Quest · started ' + fmtDate(a.start)), h('h1', null, q.e + ' ' + q.t),
      h('p', { class: 'lede' }, h('b', null, 'Big question: '), q.drive), bar(Math.round((p.done / p.total) * 100), 'soc'),
      h('p', { class: 'small muted' }, p.done + ' of ' + p.total + ' steps done · plan for about ' + q.weeks + ' weeks')));
    main.appendChild(h('div', { class: 'quest-info' },
      h('article', { class: 'card' }, h('h4', null, 'You\'ll need'), h('ul', { class: 'points' }, q.need.map((x) => h('li', null, x)))),
      h('article', { class: 'card' }, h('h4', null, 'Show Day'), h('p', { class: 'small' }, q.show), q.safe ? h('p', { class: 'small safe-note' }, '⚠️ ' + q.safe) : null)));
    main.appendChild(h('ol', { class: 'quest-steps' }, q.steps.map((st, i) => {
      const s = a.steps[i], isNext = i === p.next;
      const li = h('li', { class: 'card qstep' + (s ? ' done' : '') + (isNext ? ' next' : '') }, h('div', { class: 'qs-head' }, h('span', { class: 'tick', 'aria-hidden': 'true' }, s ? '✓' : String(i + 1)), h('div', null, h('b', null, st.t), h('p', { class: 'small' }, st.d))));
      if (s) li.appendChild(h('p', { class: 'small qs-note' }, '“' + s.note + '”' + (s.m ? ' · ' + s.m + ' min' : '')));
      else if (isNext || S.qopen === i) {
        const ta = h('textarea', { rows: 2, maxlength: 600, placeholder: 'What did you do? What did you learn or notice?' }), mi = h('input', { type: 'number', min: 0, max: 300, step: 1, placeholder: 'Minutes' }), err = h('p', { class: 'err', role: 'alert' });
        li.appendChild(h('form', { class: 'qs-form', onsubmit: (e) => {
          e.preventDefault(); const note = ta.value.trim(), m = Math.round(Number(mi.value) || 0);
          if (wordCount(note) < (k.grade <= 3 ? 3 : 8)) return (err.textContent = 'Tell a little more about what you did.');
          a.steps[i] = { note: note.slice(0, 600), m, at: Date.now() }; S.qopen = null;
          if (m > 0) { logDoc(k.id).e.push({ id: uid(), d: todayStr(), s: 'quest', m, n: 'Quest: ' + q.t + ' — ' + st.t, auto: false, kid: true }); saveLog(k.id); }
          saveDay(k.id); markAct(k.id, 'quest'); markActive(k.id); confetti(); render();
        } }, h('label', { class: 'small' }, 'My notes for this step'), ta, h('div', { class: 'qs-row' }, h('label', { class: 'small' }, 'Time spent (optional)'), mi, h('button', { class: 'btn primary sm', type: 'submit' }, 'Step done ✓')), err));
      } else li.appendChild(h('button', { type: 'button', class: 'btn ghost xs', onclick: () => { S.qopen = i; render(); } }, 'Do this step now'));
      return li;
    })));
    if (p.next < 0) {
      main.appendChild(a.ready
        ? h('article', { class: 'card show-ready' }, h('h3', null, '🎤 Ready for Show Day' + (a.showDate ? ' — ' + fmtDate(a.showDate) : '')), h('p', null, 'After your show, your grown-up will finish the Quest and write you feedback in their portal.'))
        : h('form', { class: 'card form show-ready', onsubmit: (e) => { e.preventDefault(); a.ready = true; a.showDate = $('#show-date').value || todayStr(); saveDay(k.id); confetti(); render(); } },
          h('h3', null, '🎉 All steps done! Plan your Show Day'), h('p', { class: 'small' }, q.show),
          h('ul', { class: 'points small' }, h('li', null, 'Practice out loud at least once.'), h('li', null, 'Have your work ready to show.'), h('li', null, 'Think of one thing you would do differently next time.')),
          h('label', { for: 'show-date' }, 'Show Day date'), h('input', { id: 'show-date', type: 'date', min: todayStr(), value: todayStr() }),
          h('button', { class: 'btn primary', type: 'submit' }, 'I\'m ready for Show Day')));
    }
    main.appendChild(h('div', { class: 'actions' }, h('button', { class: 'btn ghost sm', onclick: () => { if (confirm('Stop this Quest? Your notes so far will be deleted.')) { qd.active = null; saveDay(k.id); render(); } } }, 'Switch Quest')));
    add(main, lumiFab({ kidId: k.id, g: k.grade, s: 'sci', unit: 'Quest: ' + q.t, points: [q.drive].concat(q.steps.map((x) => x.t + ': ' + x.d)), mode: 'lesson' }));
    return h('div', null, kidBar(), main);
  }
  function questPortfolio(k) {
    const hist = (questDoc(k.id).hist || []).slice().reverse();
    return h('section', { class: 'card' }, h('h3', null, 'My Quest portfolio'), h('ul', { class: 'portfolio' }, hist.map((x) => { const q = questById(x.id) || { e: '⭐', t: x.id };
      return h('li', null, h('span', { class: 'quest-e', 'aria-hidden': 'true' }, q.e), h('div', null, h('b', null, q.t), h('div', { class: 'small muted' }, fmtDate(x.start) + ' – ' + fmtDate(x.end)),
        x.fb && x.fb.loved ? h('p', { class: 'small' }, h('b', null, 'What we loved: '), x.fb.loved) : null, x.fb && x.fb.grow ? h('p', { class: 'small' }, h('b', null, 'Idea to grow: '), x.fb.grow) : null)); })));
  }
  function pQuest(k) {
    const qd = questDoc(k.id), p = questProgress(k.id);
    const box = h('article', { class: 'card' }, h('h3', null, 'Quest'));
    if (!p) box.appendChild(h('p', { class: 'small muted' }, (qd.hist || []).length ? 'No Quest in progress — ' + k.name + ' can choose a new one from their dashboard.' : k.name + ' hasn\'t started a Quest yet. It shows up in their plan on Tuesdays and Thursdays.'));
    else {
      box.appendChild(h('p', null, h('b', null, p.q.e + ' ' + p.q.t), ' · ' + p.done + ' of ' + p.total + ' steps · started ' + fmtDate(p.a.start)));
      box.appendChild(h('ol', { class: 'small qnotes' }, p.q.steps.map((st, i) => h('li', null, h('b', null, st.t + ': '), p.a.steps[i] ? '“' + p.a.steps[i].note + '”' + (p.a.steps[i].m ? ' (' + p.a.steps[i].m + ' min)' : '') : h('span', { class: 'muted' }, 'not yet')))));
      if (p.q.safe) box.appendChild(h('p', { class: 'small safe-note' }, '⚠️ ' + p.q.safe));
      if (p.next < 0) box.appendChild(h('form', { class: 'form show-fb', onsubmit: (e) => {
        e.preventDefault(); const loved = $('#fb-loved').value.trim(), grow = $('#fb-grow').value.trim(); if (!loved) return ($('#fb-err').textContent = 'Tell them one thing you loved about their show.');
        qd.hist = qd.hist || []; qd.hist.push({ id: p.a.id, start: p.a.start, end: todayStr(), steps: p.a.steps, fb: { loved, grow } }); qd.active = null;
        saveDay(k.id); checkBadges(k.id); toast('Quest complete! ' + k.name + ' will see your feedback in their portfolio.'); render();
      } }, h('h4', null, p.a.ready ? '🎤 Show Day' + (p.a.showDate ? ' — ' + fmtDate(p.a.showDate) : '') + ': after the show, give feedback' : 'All steps are done — Show Day is next'),
        h('p', { class: 'small' }, p.q.show),
        h('label', { for: 'fb-loved' }, 'What I loved'), h('textarea', { id: 'fb-loved', rows: 2, maxlength: 400 }),
        h('label', { for: 'fb-grow' }, 'One idea to grow'), h('textarea', { id: 'fb-grow', rows: 2, maxlength: 400 }),
        h('p', { id: 'fb-err', class: 'err', role: 'alert' }), h('button', { class: 'btn primary sm', type: 'submit' }, 'We watched the show — complete the Quest 🎉')));
    }
    if ((qd.hist || []).length) box.appendChild(h('p', { class: 'small muted' }, 'Finished Quests: ' + qd.hist.map((x) => (questById(x.id) || { t: x.id }).t).join(', ')));
    return box;
  }

  /* ─────────────── Lumi, the AI tutor (Claude API through a secure Netlify function) ─────────────── */
  const LUMI_URL = /(\.web\.app|\.firebaseapp\.com)$/.test(location.hostname) ? 'https://lantern-homeschool.netlify.app/api/lumi' : '/api/lumi';
  const lumiCfg = () => Object.assign({ on: false, perDay: 15, kids: {} }, settings().lumi || {});
  const lumiDoc = (id) => Store.cache['lumi-' + id] || (Store.cache['lumi-' + id] = { e: [] });
  const lumiToday = (id) => lumiDoc(id).e.filter((x) => x.d === todayStr()).length;
  const lumiReady = (kidId) => Store.provider === 'firebase' && lumiCfg().on && lumiCfg().kids[kidId] !== false;
  const LP = { open: false, ctx: null, msgs: [], key: null, busy: false, el: null };
  function lumiContext(ctx) {
    const key = [ctx.mode, ctx.g, ctx.s, ctx.i, ctx.question || ''].join('|');
    if (LP.key !== key) { LP.key = key; LP.msgs = []; }
    LP.ctx = ctx; if (LP.open) drawLumi();
  }
  function lumiFab(ctx) {
    if (!lumiReady(ctx.kidId)) return null;
    lumiContext(ctx);
    const b = h('button', { class: 'lumi-fab', type: 'button', 'aria-label': 'Ask Lumi, your AI learning helper', onclick: () => { LP.open = true; drawLumi(); setTimeout(() => { const t = $('#lumi-in'); t && t.focus(); }, 30); } });
    const m = h('span', { class: 'lumi-wrap sm' }); m.innerHTML = window.LH_MASCOT ? window.LH_MASCOT('happy') : ''; b.appendChild(m); b.appendChild(h('span', null, ctx.mode === 'quiz' ? 'Need a hint?' : 'Ask Lumi'));
    return b;
  }
  function lumiClose() { LP.open = false; if (LP.el) { LP.el.remove(); LP.el = null; } }
  function drawLumi() {
    if (!LP.open || !LP.ctx) return lumiClose();
    const c = LP.ctx, left = Math.max(0, lumiCfg().perDay - lumiToday(c.kidId));
    if (!LP.el) { LP.el = h('div', { class: 'lumi-panel', role: 'dialog', 'aria-modal': 'false', 'aria-label': 'Lumi, AI learning helper' }); document.body.appendChild(LP.el); }
    const el = LP.el; el.innerHTML = '';
    const head = h('div', { class: 'lp-head' }); const m = h('span', { class: 'lumi-wrap sm' }); m.innerHTML = window.LH_MASCOT ? window.LH_MASCOT(LP.busy ? 'think' : 'happy') : '';
    head.appendChild(m); head.appendChild(h('div', null, h('b', null, 'Lumi'), h('div', { class: 'small muted' }, 'AI learning helper · ' + c.unit)));
    head.appendChild(h('button', { class: 'btn ghost sm', type: 'button', 'aria-label': 'Close Lumi', onclick: lumiClose }, '✕'));
    el.appendChild(head);
    const log = h('div', { class: 'lp-log', 'aria-live': 'polite' });
    if (!LP.msgs.length) log.appendChild(h('p', { class: 'lp-msg bot' }, c.mode === 'quiz' ? 'Stuck? Tell me what you\'re thinking and I\'ll give you a hint. I won\'t give away the answer — you\'ve got this!' : 'Hi! I\'m Lumi. Ask me anything about "' + c.unit + '" and we\'ll figure it out together.'));
    LP.msgs.forEach((x) => log.appendChild(h('p', { class: 'lp-msg ' + (x.role === 'user' ? 'me' : 'bot') + (x.err ? ' err' : '') }, x.content)));
    if (LP.busy) log.appendChild(h('p', { class: 'lp-msg bot think' }, 'Lumi is thinking', h('span', { class: 'dots3', 'aria-hidden': 'true' }, h('i'), h('i'), h('i'))));
    el.appendChild(log);
    const chips = c.mode === 'code' ? ['Why doesn\'t my code work?', 'Give me a hint', 'Explain this error'] : c.mode === 'quiz' ? ['Give me a hint', 'Explain the idea behind this question', 'What does this word mean?'] : ['Explain it another way', 'Give me an example', 'Quiz me with one question', 'Why does this matter?'];
    el.appendChild(h('div', { class: 'lp-chips' }, chips.map((t) => h('button', { type: 'button', class: 'chip-btn', disabled: LP.busy || !left ? true : null, onclick: () => lumiSend(t) }, t))));
    const ta = h('textarea', { id: 'lumi-in', rows: 2, maxlength: 400, placeholder: left ? 'Type your question…' : 'No more questions today', disabled: left ? null : true, 'aria-label': 'Your question for Lumi' });
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); lumiSend(ta.value); } });
    el.appendChild(h('form', { class: 'lp-form', onsubmit: (e) => { e.preventDefault(); lumiSend(ta.value); } }, ta, h('button', { class: 'btn primary sm', type: 'submit', disabled: LP.busy || !left ? true : null }, 'Send')));
    el.appendChild(h('p', { class: 'lp-foot' }, left + ' question' + (left === 1 ? '' : 's') + ' left today · Lumi can make mistakes · Your grown-up can read these chats.'));
    log.scrollTop = log.scrollHeight;
  }
  async function lumiSend(text) {
    text = String(text || '').trim().slice(0, 400); const c = LP.ctx; if (!text || LP.busy || !c) return;
    if (lumiToday(c.kidId) >= lumiCfg().perDay) { LP.msgs.push({ role: 'assistant', content: 'That\'s all my questions for today. Let\'s keep learning tomorrow!', err: true }); return drawLumi(); }
    const mine = { role: 'user', content: text }; LP.msgs.push(mine); LP.busy = true; drawLumi();
    try {
      const u = window.firebase.auth().currentUser; if (!u) throw new Error('Please sign in again to talk with Lumi.');
      const tok = await u.getIdToken();
      const hist = LP.msgs.filter((x) => !x.err).slice(-10).map((x) => ({ role: x.role, content: x.content }));
      const r = await fetch(LUMI_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok },
        body: JSON.stringify({ grade: c.g, subject: SUBJ_NAME[c.s] || c.s, unit: c.unit, points: c.points, mode: c.mode, question: c.question || '', choices: c.choices || [], code: c.getCode ? String(c.getCode() || '').slice(0, 3000) : undefined, output: c.getOut ? String(c.getOut() || '').slice(0, 800) : undefined, messages: hist }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.reply) throw new Error(j.error || (r.status === 404 ? 'Lumi isn\'t available on this site yet.' : 'Lumi is resting right now. Try again in a little while.'));
      LP.msgs.push({ role: 'assistant', content: j.reply });
      const d = lumiDoc(c.kidId); d.e.push({ at: Date.now(), d: todayStr(), g: c.g, s: c.s, u: c.unit, m: c.mode, q: text, a: j.reply }); if (d.e.length > 150) d.e = d.e.slice(-150); Store.set('lumi-' + c.kidId, d);
    } catch (e) { mine.err = true; LP.msgs.push({ role: 'assistant', content: (e && e.message) || 'Something went wrong.', err: true }); }
    LP.busy = false; drawLumi(); const t = $('#lumi-in'); if (t) { t.value = ''; t.focus(); }
  }
  function pTutor() {
    const cfg = lumiCfg(), f = fam();
    const wrap = h('section', null, h('h1', { class: 'p-title' }, 'Lumi, the AI tutor'));
    wrap.appendChild(h('article', { class: 'card note' }, h('h3', null, 'What Lumi does'),
      h('ul', { class: 'points' },
        h('li', null, 'Answers your learner\'s questions about the lesson they are on, at their grade level, using Claude by Anthropic.'),
        h('li', null, 'Gives hints during quizzes but is told never to reveal answers.'),
        h('li', null, 'Stays on school topics, won\'t ask for personal information, and tells children to talk to a trusted adult if they say they are hurt or unsafe.'),
        h('li', null, 'Only the grade, lesson topic and the question typed are sent. Names, emails and progress are never sent.'),
        h('li', null, 'Every question and answer is saved here for you to read.')),
      h('p', { class: 'small muted' }, 'AI can make mistakes. Lumi is a study helper, not a replacement for you. Talk with your children about using it kindly and honestly.')));
    if (Store.provider !== 'firebase') {
      wrap.appendChild(h('div', { class: 'banner' }, 'Lumi works on the hosted site with a family account (sign in with email). This copy saves on ' + (Store.mode === 'cloud' ? 'your Claude account' : 'this device') + ', so the tutor is not available here.'));
      return wrap;
    }
    wrap.appendChild(h('form', { class: 'card form', onsubmit: (e) => {
      e.preventDefault();
      const kidsOn = {}; kids().forEach((k) => { kidsOn[k.id] = $('#lt-k-' + k.id).checked; });
      f.settings = Object.assign({}, f.settings, { lumi: { on: $('#lt-on').checked, perDay: Number($('#lt-day').value), kids: kidsOn } });
      saveFamily(); toast($('#lt-on').checked ? 'Lumi is on.' : 'Lumi is off.'); render();
    } }, h('h3', null, 'Settings'),
      h('label', { class: 'check' }, h('input', { id: 'lt-on', type: 'checkbox', checked: cfg.on ? true : null }), ' Turn on Lumi for my family (I am the parent or guardian and I agree to my children using an AI tutor)'),
      h('div', { class: 'row2' }, h('div', null, h('label', { for: 'lt-day' }, 'Questions per learner per day'), h('select', { id: 'lt-day' }, [5, 10, 15, 25, 40].map((n) => h('option', { value: n, selected: cfg.perDay === n ? true : null }, n))))),
      kids().length ? h('fieldset', { class: 'lt-kids' }, h('legend', { class: 'label' }, 'Which learners can use Lumi'), kids().map((k) => h('label', { class: 'check' }, h('input', { id: 'lt-k-' + k.id, type: 'checkbox', checked: cfg.kids[k.id] !== false ? true : null }), ' ' + k.name + ' · ' + GRADE_NAME(k.grade)))) : null,
      h('button', { class: 'btn primary sm', type: 'submit' }, 'Save')));
    wrap.appendChild(h('h2', { class: 'sec' }, 'Conversations'));
    if (!kids().length) { wrap.appendChild(h('p', { class: 'muted' }, 'No learners yet.')); return wrap; }
    const kid = kidById(S.lkid) || kids()[0]; S.lkid = kid.id;
    wrap.appendChild(h('div', { class: 'row2' }, h('div', null, h('label', { for: 'lt-who' }, 'Learner'), h('select', { id: 'lt-who', onchange: (e) => { S.lkid = e.target.value; render(); } }, kids().map((k) => h('option', { value: k.id, selected: k.id === kid.id ? true : null }, k.name))))));
    const es = lumiDoc(kid.id).e.slice().reverse().slice(0, 60);
    if (!es.length) wrap.appendChild(h('p', { class: 'muted small' }, 'No questions yet.'));
    else {
      wrap.appendChild(h('ol', { class: 'lt-log' }, es.map((x) => h('li', { class: 'card' }, h('p', { class: 'small muted' }, fmtDate(x.d) + ' · ' + GRADE_NAME(x.g) + ' ' + (SUBJ_NAME[x.s] || '') + ' · ' + x.u + (x.m === 'quiz' ? ' (during quiz)' : '')), h('p', null, h('b', null, kid.name + ': '), x.q), h('p', null, h('b', null, 'Lumi: '), x.a)))));
      wrap.appendChild(h('button', { class: 'btn ghost sm', onclick: () => { if (confirm('Delete all of ' + kid.name + '\'s Lumi conversations?')) { Store.set('lumi-' + kid.id, { e: [] }); render(); } } }, 'Clear ' + kid.name + '\'s history'));
    }
    return wrap;
  }

  /* ─────────────── boot ─────────────── */
  async function boot() {
    render();
    await Store.init();
    if (Store.mode === 'auth') {
      let loadedFor = null;
      window.firebase.auth().onAuthStateChanged(async (u) => {
        if (u && loadedFor !== u.uid) { loadedFor = u.uid; Store.useFirebase(u); S.screen = 'loading'; render(); await loadSchool(); }
        else if (!u) { loadedFor = null; S.screen = 'auth'; S.view = { mode: 'in' }; render(); }
      });
      return;
    }
    await loadSchool();
  }
  async function loadSchool() {
    try { await Store.get('family'); } catch (e) { if (Store.provider === 'firebase') { S.screen = 'auth'; S.view = { mode: 'in' }; render(); toast('Could not load your school: ' + ((e && e.code) || 'error') + '. Check the Firestore rules, then sign in again.'); return; } Store.mode = 'local'; await Store.get('family'); }
    if (!fam()) { S.screen = 'setup'; S.view = { step: 1 }; render(); return; }
    await Promise.all(kids().map((k) => Promise.all([Store.get('kid-' + k.id), Store.get('log-' + k.id), Store.get('lit-' + k.id).catch(() => null), Store.get('lang-' + k.id).catch(() => null), Store.get('day-' + k.id).catch(() => null), Store.provider === 'firebase' ? Store.get('lumi-' + k.id).catch(() => null) : null])));
    Store.watch('family'); kids().forEach((k) => { Store.watch('kid-' + k.id); Store.watch('log-' + k.id); Store.watch('lit-' + k.id); Store.watch('lang-' + k.id); Store.watch('day-' + k.id); });
    S.screen = kids().length ? 'picker' : 'setup'; S.view = kids().length ? {} : { step: 2 }; render();
  }
  window.addEventListener('pagehide', () => { Player.stop(); Timer.stop(); });
  boot();
})();
