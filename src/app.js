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
    { k: 'soc', n: 'Social Studies', c: 'soc' }
  ];
  const EXTRA = [
    { k: 'read', n: 'Independent reading' }, { k: 'pe', n: 'Physical education' }, { k: 'art', n: 'Art & music' },
    { k: 'field', n: 'Field trip' }, { k: 'life', n: 'Life skills' }, { k: 'other', n: 'Other' }
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
    { id: 'grade', n: 'Grade complete', d: 'Finished all four courses in a grade' },
    { id: 'watch10', n: 'Good listener', d: 'Watched 10 video lessons' }
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
  function courseStats(kidId, g, s) {
    const c = course(g, s); const prog = kidDoc(kidId).prog; const pass = settings().passMark;
    let mastered = 0, sum = 0, tried = 0, next = -1;
    c.u.forEach((u, i) => { const p = prog[g + '-' + s + '-' + i]; if (p) { tried++; sum += p.best; } if (p && p.best >= pass) mastered++; else if (next < 0) next = i; });
    return { total: c.u.length, mastered, pct: Math.round((mastered / c.u.length) * 100), avg: tried ? Math.round(sum / tried) : null, tried, next };
  }
  function gradeStats(kidId, g) {
    const cs = SUBJ.map((s) => courseStats(kidId, g, s.k));
    const pct = Math.round(cs.reduce((a, c) => a + c.pct, 0) / cs.length);
    const tried = cs.reduce((a, c) => a + c.tried, 0);
    const sum = SUBJ.reduce((a, s, i) => a + (cs[i].avg != null ? cs[i].avg * cs[i].tried : 0), 0);
    return { pct, avg: tried ? Math.round(sum / tried) : null, courses: cs, mastered: cs.reduce((a, c) => a + c.mastered, 0), total: cs.reduce((a, c) => a + c.total, 0) };
  }
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
    if (got.length) { saveKid(kidId); got.forEach((id) => toast('Badge earned: ' + BADGES.find((b) => b.id === id).n, 'badge')); }
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

  function go(screen, view) { Player.stop(); if (!['lesson', 'quiz'].includes(screen)) Timer.stop(); S.screen = screen; S.view = view || {}; render(); window.scrollTo(0, 0); }

  function render() {
    const root = $('#app'); root.innerHTML = '';
    const scr = {
      loading: viewLoading, auth: viewAuth, setup: viewSetup, picker: viewPicker, pin: viewPin,
      home: viewKidHome, course: viewCourse, lesson: viewLesson, quiz: viewQuiz, result: viewResult, parent: viewParent
    }[S.screen] || viewPicker;
    root.appendChild(scr());
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
        h('p', { class: 'lede' }, gs.mastered + ' of ' + gs.total + ' units mastered' + (gs.avg != null ? ' · average quiz score ' + gs.avg + '%' : '')),
        h('div', { class: 'stat-row' },
          stat(st + (st === 1 ? ' day' : ' days'), 'streak'), stat(fmtHours(wk) + ' h', 'this week'), stat(Object.keys(kd.badges || {}).length + '/' + BADGES.length, 'badges')),
        settings().freeRoam ? h('div', { class: 'grade-switch' }, h('label', { for: 'gsel' }, 'Grade'), h('select', { id: 'gsel', onchange: (e) => { S.view.grade = Number(e.target.value); render(); } }, Array.from({ length: 12 }, (_, i) => h('option', { value: i + 1, selected: g === i + 1 ? true : null }, GRADE_NAME(i + 1) + (i + 1 === k.grade ? ' (my grade)' : ''))))) : null)));
    main.appendChild(h('h2', { class: 'sec' }, 'Your subjects'));
    main.appendChild(h('div', { class: 'subjects' }, SUBJ.map((s, i) => {
      const c = course(g, s.k), cs = gs.courses[i]; const nextU = cs.next >= 0 ? c.u[cs.next] : null;
      return h('article', { class: 'subj ' + s.c },
        h('div', { class: 'subj-top' }, h('span', { class: 'subj-tag' }, s.n), h('span', { class: 'subj-pct' }, cs.pct + '%')),
        h('h3', null, c.t), bar(cs.pct, s.c),
        h('p', { class: 'muted small' }, cs.mastered + '/' + cs.total + ' units' + (cs.avg != null ? ' · avg ' + cs.avg + '%' : '')),
        h('div', { class: 'subj-actions' },
          nextU ? h('button', { class: 'btn primary sm', onclick: () => go('lesson', { g, s: s.k, i: cs.next }) }, cs.tried ? 'Continue' : 'Start', h('span', { class: 'next-u' }, ': ' + nextU.t)) : h('span', { class: 'done-pill' }, 'Course complete'),
          h('button', { class: 'btn ghost sm', onclick: () => go('course', { g, s: s.k }) }, 'All units')));
    })));
    main.appendChild(h('h2', { class: 'sec' }, 'Badges'));
    main.appendChild(h('ul', { class: 'badges' }, BADGES.map((b) => { const on = kd.badges && kd.badges[b.id]; return h('li', { class: 'badge' + (on ? ' on' : '') }, h('span', { class: 'medal', 'aria-hidden': 'true' }), h('b', null, b.n), h('small', null, on ? 'Earned ' + new Date(on).toLocaleDateString() : b.d)); })));
    return h('div', null, kidBar(), main);
  }
  function stat(v, l) { return h('div', { class: 'stat' }, h('b', null, v), h('small', null, l)); }
  function greeting() { const hr = new Date().getHours(); return hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening'; }

  function unitStatus(kidId, g, s, i) {
    const p = kidDoc(kidId).prog[g + '-' + s + '-' + i]; const pass = settings().passMark;
    if (!p) return kidDoc(kidId).viewed[g + '-' + s + '-' + i] ? { cls: 'open', t: 'Started' } : { cls: 'new', t: 'Not started' };
    return p.best >= pass ? { cls: 'mastered', t: 'Mastered · ' + p.best + '%' } : { cls: 'trying', t: 'Best ' + p.best + '% · keep going' };
  }
  function viewCourse() {
    const { g, s } = S.view; const c = course(g, s); const kidId = S.who; const cs = courseStats(kidId, g, s); const sm = SUBJ.find((x) => x.k === s);
    const main = h('main', { class: 'wrap' },
      h('button', { class: 'btn ghost sm back', onclick: () => go('home', { grade: g }) }, '← Dashboard'),
      h('header', { class: 'course-head ' + sm.c }, h('p', { class: 'eyebrow' }, GRADE_NAME(g) + ' · ' + sm.n), h('h1', null, c.t), h('div', { class: 'course-meta' }, bar(cs.pct, sm.c), h('span', null, cs.pct + '% complete · ' + cs.mastered + ' of ' + cs.total + ' units mastered'))),
      h('ol', { class: 'units' }, c.u.map((u, i) => { const st = unitStatus(kidId, g, s, i); const w = (kidDoc(kidId).watched || {})[g + '-' + s + '-' + i]; return h('li', { class: 'unit ' + st.cls }, h('button', { class: 'unit-btn', onclick: () => go('lesson', { g, s, i }) }, h('span', { class: 'unit-n' }, 'Unit ' + (i + 1)), h('span', { class: 'unit-t' }, u.t), h('span', { class: 'watched-tag' }, w ? 'Video watched' : ''), h('span', { class: 'pill ' + st.cls }, st.t))); })),
      h('section', { class: 'card resources' }, h('h3', null, 'Course resources'), h('ul', null, c.r.map((r) => h('li', null, extLink(r))))));
    return h('div', null, kidBar(), main);
  }
  function extLink(r) { return h('a', { href: r[1], target: '_blank', rel: 'noopener noreferrer', class: 'ext' }, r[0], h('span', { class: 'sr-only' }, ' (opens in a new tab)')); }
  function viewLesson() {
    const { g, s, i } = S.view; const c = course(g, s); const u = c.u[i]; const kidId = S.who; const sm = SUBJ.find((x) => x.k === s);
    const id = g + '-' + s + '-' + i; const kd = kidDoc(kidId);
    if (!kd.viewed[id]) { kd.viewed[id] = Date.now(); saveKid(kidId); checkBadges(kidId); }
    if (!Timer.on || Timer.on.kidId !== kidId || Timer.on.subj !== s) Timer.start(kidId, s);
    const st = unitStatus(kidId, g, s, i); const res = (u.r || []).concat(c.r.filter((r) => !(u.r || []).some((x) => x[1] === r[1]))).slice(0, 3);
    const main = h('main', { class: 'wrap lesson' },
      h('button', { class: 'btn ghost sm back', onclick: () => go('course', { g, s }) }, '← ' + c.t),
      h('article', { class: 'lesson-card' },
        h('p', { class: 'eyebrow ' + sm.c }, sm.n + ' · Unit ' + (i + 1) + ' of ' + c.u.length), h('h1', null, u.t), h('span', { class: 'pill ' + st.cls }, st.t),
        h('h2', { class: 'mini' }, 'Watch'), videoPlayer(g, s, i, () => startQuiz(g, s, i)),
        h('h2', { class: 'mini' }, 'Read'), h('ul', { class: 'points' }, u.l.map((p) => h('li', null, p))),
        u.try ? h('div', { class: 'try' }, h('b', null, 'Try it'), h('p', null, u.try)) : null,
        h('h2', { class: 'mini' }, 'Go deeper'), h('ul', { class: 'res-list' }, res.map((r) => h('li', null, extLink(r)))),
        h('div', { class: 'quiz-cta' }, h('div', null, h('b', null, 'Ready? Take the quiz.'), h('p', { class: 'muted small' }, (u.g ? '5 fresh problems each try' : u.q.length + ' questions') + ' · score ' + settings().passMark + '% or higher to master this unit')), h('button', { class: 'btn primary', onclick: () => startQuiz(g, s, i) }, 'Start quiz'))),
      h('nav', { class: 'lesson-nav' }, i > 0 ? h('button', { class: 'btn ghost sm', onclick: () => go('lesson', { g, s, i: i - 1 }) }, '← Previous unit') : h('span'), i < c.u.length - 1 ? h('button', { class: 'btn ghost sm', onclick: () => go('lesson', { g, s, i: i + 1 }) }, 'Next unit →') : h('span')));
    return h('div', null, kidBar(), main);
  }
  function buildQuestions(u) {
    if (u.g && GEN[u.g]) { const out = []; let guard = 0; while (out.length < 5 && guard++ < 40) { const p = GEN[u.g](); if (p && p.w && p.w.length >= 2 && !out.some((x) => x.q === p.q)) out.push({ q: p.q, a: p.a, choices: shuffle([p.a, ...p.w.slice(0, 3)]) }); } return out; }
    return shuffle(u.q).map((row) => ({ q: row[0], a: row[1], choices: shuffle(row.slice(1)) }));
  }
  function startQuiz(g, s, i) { S.quiz = { g, s, i, qs: buildQuestions(course(g, s).u[i]), at: 0, right: 0, picked: null }; go('quiz', { g, s, i }); }
  function viewQuiz() {
    const Q = S.quiz; const c = course(Q.g, Q.s); const u = c.u[Q.i]; const item = Q.qs[Q.at]; const sm = SUBJ.find((x) => x.k === Q.s);
    const answered = Q.picked != null;
    const choices = h('div', { class: 'choices', role: 'group', 'aria-label': 'Answer choices' }, item.choices.map((ch, n) => {
      let cls = 'choice'; if (answered) { if (ch === item.a) cls += ' right'; else if (n === Q.picked) cls += ' wrong'; }
      return h('button', { class: cls, disabled: answered ? true : null, onclick: () => { Q.picked = n; if (ch === item.a) Q.right++; render(); } }, h('span', { class: 'letter' }, 'ABCD'[n]), h('span', null, ch));
    }));
    const fb = answered ? h('div', { class: 'feedback ' + (item.choices[Q.picked] === item.a ? 'ok' : 'no'), role: 'status' }, item.choices[Q.picked] === item.a ? 'Correct!' : 'Not quite. The answer is ' + item.a + '.') : null;
    const next = answered ? h('button', { class: 'btn primary', onclick: () => { if (Q.at < Q.qs.length - 1) { Q.at++; Q.picked = null; render(); } else finishQuiz(); } }, Q.at < Q.qs.length - 1 ? 'Next question' : 'See my score') : null;
    const main = h('main', { class: 'wrap quiz' },
      h('div', { class: 'quiz-head' }, h('p', { class: 'eyebrow ' + sm.c }, u.t), h('div', { class: 'q-progress' }, 'Question ' + (Q.at + 1) + ' of ' + Q.qs.length), bar(Math.round((Q.at / Q.qs.length) * 100), sm.c)),
      h('section', { class: 'q-card' }, h('h1', { class: 'q-text' }, item.q), choices, fb, h('div', { class: 'q-actions' }, h('button', { class: 'btn ghost sm', onclick: () => { S.quiz = null; go('lesson', { g: Q.g, s: Q.s, i: Q.i }); } }, 'Leave quiz'), next)));
    setTimeout(() => { const b = answered ? $('.q-actions .primary') : $('.choice'); b && b.focus({ preventScroll: true }); }, 0);
    return h('div', null, kidBar(), main);
  }
  function finishQuiz() {
    const Q = S.quiz; const kidId = S.who; const id = Q.g + '-' + Q.s + '-' + Q.i; const score = Math.round((Q.right / Q.qs.length) * 100);
    const kd = kidDoc(kidId); const prev = kd.prog[id]; const pass = settings().passMark;
    const wasMastered = prev && prev.best >= pass;
    kd.prog[id] = { best: Math.max(score, prev ? prev.best : 0), last: score, tries: (prev ? prev.tries : 0) + 1, at: Date.now(), first: prev ? prev.first : Date.now() };
    saveKid(kidId); Timer.accrue(); Timer.flush(); checkBadges(kidId);
    S.quiz.result = { score, pass: score >= pass, newly: !wasMastered && score >= pass };
    go('result', { g: Q.g, s: Q.s, i: Q.i });
  }
  function viewResult() {
    const Q = S.quiz; if (!Q || !Q.result) return viewKidHome();
    const r = Q.result; const c = course(Q.g, Q.s); const sm = SUBJ.find((x) => x.k === Q.s); const nextI = Q.i + 1 < c.u.length ? Q.i + 1 : null;
    const main = h('main', { class: 'wrap result' },
      h('section', { class: 'result-card ' + (r.pass ? 'pass' : 'retry') },
        ring(r.score, Q.right + ' of ' + Q.qs.length, 'lg'),
        h('h1', null, r.pass ? (r.newly ? 'Unit mastered!' : 'Great work!') : 'Almost there'),
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
    const tabs = [['overview', 'Overview'], ['reports', 'Report cards'], ['hours', 'Hours log'], ['curriculum', 'Curriculum'], ['settings', 'Settings']];
    const main = h('main', { class: 'wrap' }, modeBanner(),
      h('nav', { class: 'tabs', role: 'tablist' }, tabs.map(([k, n]) => h('button', { role: 'tab', 'aria-selected': S.ptab === k ? 'true' : 'false', class: 'tab' + (S.ptab === k ? ' on' : ''), onclick: () => { S.ptab = k; render(); } }, n))));
    const body = { overview: pOverview, reports: pReports, hours: pHours, curriculum: pCurriculum, settings: pSettings }[S.ptab]();
    main.appendChild(body);
    return h('div', null, topbar([h('span', { class: 'chip parent-chip' }, 'Parent'), h('button', { class: 'btn ghost sm', onclick: () => go('picker') }, 'Lock portal'), Store.provider === 'firebase' ? h('button', { class: 'btn ghost sm', onclick: signOut }, 'Sign out') : null]), main);
  }
  function pOverview() {
    const wrap = h('section', null, h('h1', { class: 'p-title' }, 'How everyone is doing'));
    if (!kids().length) { wrap.appendChild(h('div', { class: 'empty card' }, h('p', null, 'No learners yet. Add your first learner in Settings.'), h('button', { class: 'btn primary', onclick: () => { S.ptab = 'settings'; render(); } }, 'Add a learner'))); return wrap; }
    const goal = settings().weeklyGoal * 60;
    wrap.appendChild(h('div', { class: 'overview' }, kids().map((k) => {
      const gs = gradeStats(k.id, k.grade); const wk = minutesWeek(k.id), yr = minutesYear(k.id); const la = lastActive(k.id); const kd = kidDoc(k.id);
      return h('article', { class: 'kid-card' },
        h('header', null, avatar(k), h('div', null, h('h2', null, k.name), h('p', { class: 'muted small' }, GRADE_NAME(k.grade) + ' · last active ' + (la ? fmtDate(la) : 'not yet'))), ring(gs.pct, 'grade', 'sm')),
        h('div', { class: 'subj-bars' }, SUBJ.map((s, i) => { const c = gs.courses[i]; return h('div', { class: 'sb' }, h('span', { class: 'sb-n' }, s.n), bar(c.pct, s.c), h('span', { class: 'sb-v' }, c.pct + '%'), h('span', { class: 'sb-g' }, LETTER(c.avg))); })),
        h('dl', { class: 'facts' },
          h('div', null, h('dt', null, 'Average score'), h('dd', null, gs.avg != null ? gs.avg + '% (' + LETTER(gs.avg) + ')' : '—')),
          h('div', null, h('dt', null, 'This week'), h('dd', { class: wk >= goal ? 'good' : '' }, fmtHours(wk) + ' / ' + settings().weeklyGoal + ' h')),
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
    return SUBJ.map((s) => { const c = course(g, s.k), st = courseStats(k.id, g, s.k); const min = minutes(k.id, (e) => e.s === s.k); return { subj: s, title: c.t, pct: st.pct, avg: st.avg, letter: LETTER(st.avg), mastered: st.mastered, total: st.total, hours: fmtHours(min), credit: c.credit }; });
  }
  function transcript(k) {
    const rows = [];
    for (let g = 9; g <= 12; g++) SUBJ.forEach((s) => { const st = courseStats(k.id, g, s.k); if (st.tried || st.mastered) { const c = course(g, s.k); rows.push({ g, title: c.t, pct: st.pct, letter: LETTER(st.avg), done: st.pct === 100, credit: st.pct === 100 ? c.credit || 1 : 0 }); } });
    const done = rows.filter((r) => r.done && r.letter !== '—');
    const gpa = done.length ? (done.reduce((a, r) => a + POINTS[r.letter], 0) / done.length).toFixed(2) : null;
    return { rows, gpa, credits: rows.reduce((a, r) => a + r.credit, 0) };
  }
  function pReports() {
    const wrap = h('section', null, h('h1', { class: 'p-title' }, 'Report cards'));
    if (!kids().length) { wrap.appendChild(h('p', { class: 'muted' }, 'Add a learner first.')); return wrap; }
    const k = kidById(S.pkid) || kids()[0]; S.pkid = k.id; const g = S.rgrade || k.grade;
    wrap.appendChild(h('div', { class: 'filters' },
      h('label', { for: 'p-kid' }, 'Learner'), kidSelect(),
      h('label', { for: 'r-grade' }, 'Grade'), h('select', { id: 'r-grade', onchange: (e) => { S.rgrade = Number(e.target.value); render(); } }, Array.from({ length: 12 }, (_, i) => h('option', { value: i + 1, selected: g === i + 1 ? true : null }, GRADE_NAME(i + 1))))));
    const rows = reportRows(k, g); const gs = gradeStats(k.id, g);
    const tbl = h('div', { class: 'table-wrap' }, h('table', { class: 'report' },
      h('thead', null, h('tr', null, ['Subject', 'Course', 'Units mastered', 'Complete', 'Avg score', 'Grade', 'Hours'].map((t) => h('th', { scope: 'col' }, t)))),
      h('tbody', null, rows.map((r) => h('tr', null, h('td', null, h('span', { class: 'dot ' + r.subj.c }), r.subj.n), h('td', null, r.title), h('td', { class: 'num' }, r.mastered + '/' + r.total), h('td', { class: 'num' }, r.pct + '%'), h('td', { class: 'num' }, r.avg != null ? r.avg + '%' : '—'), h('td', { class: 'num grade-cell' }, r.letter), h('td', { class: 'num' }, r.hours)))),
      h('tfoot', null, h('tr', null, h('td', { colspan: 2 }, 'Overall'), h('td', { class: 'num' }, gs.mastered + '/' + gs.total), h('td', { class: 'num' }, gs.pct + '%'), h('td', { class: 'num' }, gs.avg != null ? gs.avg + '%' : '—'), h('td', { class: 'num grade-cell' }, LETTER(gs.avg)), h('td', { class: 'num' }, fmtHours(minutes(k.id)))))));
    wrap.appendChild(h('article', { class: 'card report-card' }, h('header', { class: 'rc-head' }, avatar(k), h('div', null, h('h2', null, k.name + ' · ' + GRADE_NAME(g)), h('p', { class: 'muted small' }, 'Grades use each unit\'s best quiz score. A ≥ 90 · B ≥ 80 · C ≥ 70 · D ≥ 60. Hours are all logged time per subject.'))), tbl,
      h('div', { class: 'actions' }, h('button', { class: 'btn primary sm', onclick: () => downloadReport(k, g) }, 'Download report card'), h('button', { class: 'btn ghost sm', onclick: () => { S.detail = !S.detail; render(); } }, S.detail ? 'Hide unit detail' : 'Show unit detail'))));
    if (S.detail) {
      wrap.appendChild(h('div', { class: 'detail-grid' }, SUBJ.map((s) => { const c = course(g, s.k); return h('section', { class: 'card detail' }, h('h3', null, h('span', { class: 'dot ' + s.c }), c.t), h('ol', null, c.u.map((u, i) => { const p = kidDoc(k.id).prog[g + '-' + s.k + '-' + i]; const st = unitStatus(k.id, g, s.k, i); const wv = (kidDoc(k.id).watched || {})[g + '-' + s.k + '-' + i]; return h('li', null, h('span', null, u.t), h('span', { class: 'pill ' + st.cls }, p ? (p.best >= settings().passMark ? 'Mastered ' : 'Best ') + p.best + '% · ' + p.tries + (p.tries === 1 ? ' try' : ' tries') : st.t), wv ? h('span', { class: 'watched-tag' }, ' · video watched') : null); }))); })));
    }
    const tr = transcript(k);
    wrap.appendChild(h('article', { class: 'card transcript' },
      h('h2', null, 'High school transcript'),
      tr.rows.length ? [
        h('p', { class: 'muted small' }, 'Each completed course earns 1.0 credit. GPA is unweighted (A = 4.0) and counts completed courses only.'),
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
      h('article', { class: 'card' }, h('h3', null, 'Since ' + fmtDate(ys)), h('p', { class: 'big-num' }, fmtHours(total), h('small', null, ' hours')), h('p', { class: 'muted small' }, 'This week: ' + fmtHours(minutesWeek(k.id)) + ' of ' + settings().weeklyGoal + ' h goal')),
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
        h('div', null, h('label', { for: 'h-min' }, 'Minutes'), h('input', { id: 'h-min', type: 'number', min: 1, max: 720, step: 5, value: 30 })),
        h('div', { class: 'grow' }, h('label', { for: 'h-note' }, 'Note'), h('input', { id: 'h-note', placeholder: 'e.g. Library visit, soccer practice', maxlength: 80 }))),
      h('p', { id: 'h-err', class: 'err', role: 'alert' }), h('button', { class: 'btn primary sm', type: 'submit' }, 'Add entry')));
    const entries = log.e.slice().sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0));
    wrap.appendChild(h('article', { class: 'card' }, h('div', { class: 'card-head' }, h('h3', null, 'Entries'), h('button', { class: 'btn ghost sm', onclick: () => downloadCSV(k) }, 'Download CSV')),
      entries.length ? h('div', { class: 'table-wrap' }, h('table', { class: 'report' }, h('thead', null, h('tr', null, ['Date', 'Subject', 'Minutes', 'Note', 'Source', ''].map((t) => h('th', { scope: 'col' }, t)))),
        h('tbody', null, entries.slice(0, 200).map((e) => h('tr', null, h('td', null, fmtDate(e.d)), h('td', null, SUBJ_NAME[e.s] || e.s), h('td', { class: 'num' }, e.m), h('td', null, e.n || ''), h('td', null, e.auto ? 'Automatic' : 'Parent'),
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
      f.name = name; f.settings = { passMark: Number($('#s-pass').value), freeRoam: $('#s-roam').checked, yearStart: $('#s-year').value || defaultYearStart(), weeklyGoal: Math.max(1, Math.min(60, Number($('#s-goal').value) || 20)) };
      saveFamily(); toast('Settings saved.'); render();
    } }, h('h3', null, 'School'),
      h('div', { class: 'row2' }, h('div', null, h('label', { for: 's-name' }, 'School name'), h('input', { id: 's-name', value: f.name, maxlength: 48 })), h('div', null, h('label', { for: 's-year' }, 'School year starts'), h('input', { id: 's-year', type: 'date', value: st.yearStart }))),
      h('div', { class: 'row2' },
        h('div', null, h('label', { for: 's-pass' }, 'Score needed to master a unit'), h('select', { id: 's-pass' }, [70, 80, 90].map((p) => h('option', { value: p, selected: st.passMark === p ? true : null }, p + '%')))),
        h('div', null, h('label', { for: 's-goal' }, 'Weekly hours goal'), h('input', { id: 's-goal', type: 'number', min: 1, max: 60, value: st.weeklyGoal }))),
      h('label', { class: 'check' }, h('input', { id: 's-roam', type: 'checkbox', checked: st.freeRoam ? true : null }), ' Let learners open other grades (review or work ahead)'),
      h('button', { class: 'btn primary sm', type: 'submit' }, 'Save settings')));
    wrap.appendChild(h('h2', { class: 'sec' }, 'Learners'));
    kids().forEach((k) => {
      wrap.appendChild(h('div', { class: 'kid-edit' }, kidForm(k, () => render()),
        S.confirmKid === k.id ? h('div', { class: 'card danger-zone' }, h('p', null, 'Remove ' + k.name + ' and all of their progress and hours? This cannot be undone.'), h('div', { class: 'actions' }, h('button', { class: 'btn danger sm', onclick: async () => { f.kids = f.kids.filter((x) => x.id !== k.id); saveFamily(); await Store.remove('kid-' + k.id); await Store.remove('log-' + k.id); S.confirmKid = null; toast(k.name + ' was removed.'); render(); } }, 'Remove ' + k.name), h('button', { class: 'btn ghost sm', onclick: () => { S.confirmKid = null; render(); } }, 'Cancel')))
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
    }
  };
  if (Player.synth) { Player.pickVoice(); try { Player.synth.addEventListener('voiceschanged', () => Player.pickVoice()); } catch (e) { /* older browsers */ } }
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
    const sc = [{ t: 'title', say: GRADE_NAME(g) + ' ' + sm.n + '. Unit ' + (i + 1) + ': ' + u.t + ". Let's learn!" }];
    u.l.forEach((p, n) => sc.push({ t: 'point', n, of: u.l.length, text: p, say: p }));
    if (u.g && GEN[u.g]) {
      if (!Player.example || Player.example.key !== key) Player.example = { key, p: GEN[u.g]() };
      const p = Player.example.p;
      sc.push({ t: 'exq', text: p.q, say: "Let's try one together. " + p.q + ' Take a moment to think.' });
      sc.push({ t: 'exa', text: p.q, ans: p.a, say: 'The answer is ' + p.a + '.' });
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
    const rateSel = h('select', { class: 'vrate', id: 'v-rate', 'aria-label': 'Reading speed', onchange: (e) => { Player.rate = Number(e.target.value); Pref.set('rate', Player.rate); if (Player.playing) speakScene(); } }, [0.8, 1, 1.2, 1.4].map((r) => h('option', { value: r, selected: Player.rate === r ? true : null }, r + '×')));
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
      if (sc.t === 'title') body = h('div', { class: 'vcenter' }, h('p', { class: 'veyebrow' }, c.t + ' · Unit ' + (i + 1) + ' of ' + c.u.length), h('h2', { class: 'vtitle' }, u.t), h('p', { class: 'vsub' }, 'Video lesson · about ' + totalMin + ' min'));
      else if (sc.t === 'point') body = h('div', { class: 'vpoint' }, h('span', { class: 'vnum', 'aria-hidden': 'true' }, String(sc.n + 1)), h('div', null, h('p', { class: 'veyebrow' }, 'Key idea ' + (sc.n + 1) + ' of ' + sc.of), words(sc.text)));
      else if (sc.t === 'exq') body = h('div', { class: 'vcenter' }, h('p', { class: 'veyebrow' }, "Let's solve one together"), words(sc.text), h('p', { class: 'think' }, 'Think about it', h('span', { class: 'dots3', 'aria-hidden': 'true' }, h('i'), h('i'), h('i'))));
      else if (sc.t === 'exa') body = h('div', { class: 'vcenter' }, h('p', { class: 'veyebrow' }, 'Answer'), h('p', { class: 'vq-small' }, sc.text), h('p', { class: 'vanswer' }, sc.ans));
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
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(k.name)} · ${GRADE_NAME(g)} report card</title><style>${docStyle}</style></head><body><h1>${esc(f.name)}</h1><p class="m">Report card · ${esc(k.name)} · ${GRADE_NAME(g)} · issued ${new Date().toLocaleDateString()}</p><table><thead><tr><th>Subject</th><th>Course</th><th class="n">Mastered</th><th class="n">Complete</th><th class="n">Avg score</th><th class="n">Grade</th><th class="n">Hours</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.subj.n}</td><td>${esc(r.title)}</td><td class="n">${r.mastered}/${r.total}</td><td class="n">${r.pct}%</td><td class="n">${r.avg != null ? r.avg + '%' : '—'}</td><td class="n">${r.letter}</td><td class="n">${r.hours}</td></tr>`).join('')}</tbody><tfoot><tr><td colspan="2">Overall</td><td class="n">${gs.mastered}/${gs.total}</td><td class="n">${gs.pct}%</td><td class="n">${gs.avg != null ? gs.avg + '%' : '—'}</td><td class="n">${LETTER(gs.avg)}</td><td class="n">${fmtHours(minutes(k.id))}</td></tr></tfoot></table><p class="m">Grading: A ≥ 90 · B ≥ 80 · C ≥ 70 · D ≥ 60, based on the best quiz score in each unit. A unit is mastered at ${settings().passMark}% or higher.</p><div class="sig"><div>Parent / teacher signature</div><div>Date</div></div></body></html>`;
    offer(k.name.replace(/\W+/g, '-') + '-grade-' + g + '-report-card.html', html);
  }
  function downloadTranscript(k) {
    const tr = transcript(k); const f = fam();
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(k.name)} transcript</title><style>${docStyle}</style></head><body><h1>${esc(f.name)}</h1><p class="m">Official homeschool transcript · ${esc(k.name)} · issued ${new Date().toLocaleDateString()}</p><table><thead><tr><th class="n">Grade</th><th>Course</th><th>Status</th><th class="n">Letter</th><th class="n">Credit</th></tr></thead><tbody>${tr.rows.map((r) => `<tr><td class="n">${r.g}</td><td>${esc(r.title)}</td><td>${r.done ? 'Completed' : 'In progress (' + r.pct + '%)'}</td><td class="n">${r.letter}</td><td class="n">${r.credit.toFixed(1)}</td></tr>`).join('')}</tbody><tfoot><tr><td colspan="3">Cumulative</td><td class="n">${tr.gpa ? 'GPA ' + tr.gpa : '—'}</td><td class="n">${tr.credits.toFixed(1)}</td></tr></tfoot></table><p class="m">GPA is unweighted on a 4.0 scale and includes completed courses only. Each completed course is 1.0 credit.</p><div class="sig"><div>Parent / administrator signature</div><div>Date</div></div></body></html>`;
    offer(k.name.replace(/\W+/g, '-') + '-transcript.html', html);
  }
  function downloadCSV(k) {
    const q = (s) => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
    const lines = [['Date', 'Subject', 'Minutes', 'Hours', 'Note', 'Source'].join(',')].concat(logDoc(k.id).e.slice().sort((a, b) => (a.d < b.d ? -1 : 1)).map((e) => [e.d, q(SUBJ_NAME[e.s] || e.s), e.m, (e.m / 60).toFixed(2), q(e.n), e.auto ? 'Automatic' : 'Parent'].join(',')));
    offer(k.name.replace(/\W+/g, '-') + '-hours.csv', lines.join('\n'));
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
    await Promise.all(kids().map((k) => Promise.all([Store.get('kid-' + k.id), Store.get('log-' + k.id)])));
    Store.watch('family'); kids().forEach((k) => { Store.watch('kid-' + k.id); Store.watch('log-' + k.id); });
    S.screen = kids().length ? 'picker' : 'setup'; S.view = kids().length ? {} : { step: 2 }; render();
  }
  window.addEventListener('pagehide', () => { Player.stop(); Timer.stop(); });
  boot();
})();
