/* Lantern Homeschool — kid-friendly pictures for questions and video lessons.
   LH_VIS(spec) returns an SVG string. Specs are plain objects, e.g. {t:'clock', h:3, m:30}.
   Colors come from CSS classes (.va .vb .vc .vd .vk .vt .vm .vq) so pictures follow the light/dark theme. */
(function () {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const svg = (w, h, body, label) => `<svg class="vis-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label || 'Picture')}">${body}</svg>`;
  const T = (x, y, s, size, cls, anchor) => `<text x="${x}" y="${y}" class="${cls || 'vt'}" font-size="${size || 14}" text-anchor="${anchor || 'middle'}" dominant-baseline="middle">${esc(s)}</text>`;
  const Q = (x, y, s) => `<g><circle cx="${x}" cy="${y}" r="15" class="vq"/>${T(x, y + 1, s == null ? '?' : s, 17, 'vqt')}</g>`;
  const R = (n) => Math.round(n * 10) / 10;

  /* ── little icons for counting ── */
  const ICON = {
    apple: (x, y, s) => `<circle cx="${x}" cy="${y + s * 0.06}" r="${s * 0.42}" class="va"/><path d="M${x} ${y - s * 0.32}q${s * 0.04} ${-s * 0.16} ${s * 0.12} ${-s * 0.2}" class="vk" fill="none" stroke-width="2"/><ellipse cx="${x + s * 0.17}" cy="${y - s * 0.38}" rx="${s * 0.13}" ry="${s * 0.07}" class="vc"/>`,
    star: (x, y, s) => { let p = ''; for (let i = 0; i < 10; i++) { const r = i % 2 ? s * 0.2 : s * 0.46, a = -Math.PI / 2 + (i * Math.PI) / 5; p += R(x + r * Math.cos(a)) + ',' + R(y + r * Math.sin(a)) + ' '; } return `<polygon points="${p}" class="vb"/>`; },
    ball: (x, y, s) => `<circle cx="${x}" cy="${y}" r="${s * 0.42}" class="vd"/><path d="M${x - s * 0.42} ${y}q${s * 0.42} ${-s * 0.3} ${s * 0.84} 0" class="vw" fill="none" stroke-width="2"/>`,
    fish: (x, y, s) => `<ellipse cx="${x - s * 0.05}" cy="${y}" rx="${s * 0.34}" ry="${s * 0.22}" class="vc"/><polygon points="${x + s * 0.25},${y} ${x + s * 0.48},${y - s * 0.2} ${x + s * 0.48},${y + s * 0.2}" class="vc"/><circle cx="${x - s * 0.2}" cy="${y - s * 0.05}" r="${s * 0.05}" class="vk"/>`,
    heart: (x, y, s) => `<path d="M${x} ${y + s * 0.38}C${x - s * 0.6} ${y - s * 0.05} ${x - s * 0.3} ${y - s * 0.55} ${x} ${y - s * 0.18}C${x + s * 0.3} ${y - s * 0.55} ${x + s * 0.6} ${y - s * 0.05} ${x} ${y + s * 0.38}z" class="va"/>`
  };
  const icon = (name, x, y, s) => (ICON[name] || ICON.apple)(x, y, s);
  function iconGrid(n, x0, y0, cols, s, name, crossFrom) {
    let o = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + (i % cols) * s + s / 2, y = y0 + Math.floor(i / cols) * s + s / 2;
      o += icon(name, x, y, s * 0.92);
      if (crossFrom != null && i >= crossFrom) o += `<path d="M${x - s * 0.35} ${y - s * 0.35}L${x + s * 0.35} ${y + s * 0.35}" class="vx" stroke-width="3"/>`;
    }
    return o;
  }

  const DRAW = {
    /* {groups:[a,b], icon, op:'+'|'−'} — two groups to add, or one group with some crossed out */
    count(v) {
      const s = 28, ic = v.icon || 'apple';
      if (v.op === '−') {
        const n = v.groups[0], take = v.groups[1], cols = Math.min(10, n), rows = Math.ceil(n / cols);
        const w = cols * s + 20, h = rows * s + 20;
        return svg(w, h, iconGrid(n, 10, 10, cols, s, ic, n - take), `${n} take away ${take}`);
      }
      const [a, b] = v.groups, ca = Math.min(5, a), cb = Math.min(5, b);
      const ha = Math.ceil(a / ca) * s, hb = Math.ceil(b / cb) * s, h = Math.max(ha, hb) + 20;
      const wa = ca * s, w = wa + 50 + cb * s + 20;
      return svg(w, h, `<rect x="4" y="4" width="${wa + 12}" height="${h - 8}" rx="10" class="vbox"/>` + iconGrid(a, 10, 10, ca, s, ic) +
        T(wa + 34, h / 2, '+', 28, 'vt') + `<rect x="${wa + 52}" y="4" width="${cb * s + 12}" height="${h - 8}" rx="10" class="vbox"/>` + iconGrid(b, wa + 58, 10, cb, s, ic), `${a} plus ${b}`);
    },
    /* {n} — pairs of socks to show odd/even */
    pairs(v) {
      const s = 26, cols = Math.min(10, v.n), rows = Math.ceil(v.n / cols);
      let o = '';
      for (let i = 0; i < v.n; i++) { const x = 12 + (i % cols) * s, y = 12 + Math.floor(i / cols) * (s + 8); o += `<path d="M${x} ${y}h10v12l6 6-5 5-11-9z" class="${i % 2 ? 'vb' : 'va'}"/>`; }
      return svg(cols * s + 20, rows * (s + 8) + 16, o, `${v.n} socks`);
    },
    /* {h, tens, ones} — base-ten blocks */
    base10(v) {
      let x = 10, o = ''; const u = 9;
      for (let i = 0; i < (v.h || 0); i++) { o += `<rect x="${x}" y="10" width="${u * 10}" height="${u * 10}" class="vb vk2"/>`; for (let k = 1; k < 10; k++) o += `<path d="M${x + k * u} 10v${u * 10}M${x} ${10 + k * u}h${u * 10}" class="vgrid"/>`; x += u * 10 + 10; }
      for (let i = 0; i < (v.tens || 0); i++) { o += `<rect x="${x}" y="10" width="${u}" height="${u * 10}" class="vc vk2"/>`; for (let k = 1; k < 10; k++) o += `<path d="M${x} ${10 + k * u}h${u}" class="vgrid"/>`; x += u + 6; }
      x += 6;
      for (let i = 0; i < (v.ones || 0); i++) { const cx = x + (i % 3) * (u + 4), cy = 10 + Math.floor(i / 3) * (u + 4); o += `<rect x="${cx}" y="${cy}" width="${u}" height="${u}" class="va vk2"/>`; }
      if (v.ones) x += 3 * (u + 4);
      return svg(Math.max(x + 10, 120), u * 10 + 20, o, `${v.h || 0} hundreds, ${v.tens || 0} tens, ${v.ones || 0} ones`);
    },
    /* {h, m} — analog clock */
    clock(v) {
      const c = 90, r = 78; let o = `<circle cx="${c}" cy="${c}" r="${r}" class="vface"/><circle cx="${c}" cy="${c}" r="${r}" class="vk2" fill="none" stroke-width="4"/>`;
      for (let i = 1; i <= 12; i++) { const a = (i * Math.PI) / 6 - Math.PI / 2; o += T(R(c + 62 * Math.cos(a)), R(c + 62 * Math.sin(a)), i, 15, 'vt'); }
      for (let i = 0; i < 60; i++) { const a = (i * Math.PI) / 30, l = i % 5 ? 4 : 8; o += `<path d="M${R(c + (r - 2) * Math.sin(a))} ${R(c - (r - 2) * Math.cos(a))}L${R(c + (r - 2 - l) * Math.sin(a))} ${R(c - (r - 2 - l) * Math.cos(a))}" class="vk" stroke-width="${i % 5 ? 1 : 2}"/>`; }
      const ma = (v.m / 60) * 2 * Math.PI, ha = (((v.h % 12) + v.m / 60) / 12) * 2 * Math.PI;
      o += `<path d="M${c} ${c}L${R(c + 40 * Math.sin(ha))} ${R(c - 40 * Math.cos(ha))}" class="vhand" stroke-width="7" stroke-linecap="round"/>`;
      o += `<path d="M${c} ${c}L${R(c + 60 * Math.sin(ma))} ${R(c - 60 * Math.cos(ma))}" class="vhand2" stroke-width="4" stroke-linecap="round"/><circle cx="${c}" cy="${c}" r="5" class="vk"/>`;
      return svg(180, 180, o, 'A clock');
    },
    /* {coins:[25,10,5,1,...]} */
    coins(v) {
      const size = { 1: 15, 5: 18, 10: 14, 25: 21, 100: 24 }, name = { 1: '1¢', 5: '5¢', 10: '10¢', 25: '25¢', 100: '$1' };
      let x = 8, o = '';
      v.coins.forEach((c) => { const r = size[c] || 16; x += r; o += `<circle cx="${x}" cy="30" r="${r}" class="${c === 1 ? 'vcopper' : 'vsilver'}"/><circle cx="${x}" cy="30" r="${r - 3}" fill="none" class="vk3"/>` + T(x, 31, name[c], c === 10 ? 10 : 12, 'vcoin'); x += r + 8; });
      return svg(x + 4, 60, o, 'Coins');
    },
    /* {min,max,step, marks:[values], labels:{value:text}, hops:[[from,to]], q:value} */
    nline(v) {
      const W = 340, x0 = 20, x1 = W - 20, step = v.step || 1, n = Math.round((v.max - v.min) / step);
      const X = (val) => R(x0 + ((val - v.min) / (v.max - v.min)) * (x1 - x0));
      let o = `<path d="M${x0 - 10} 60H${x1 + 10}" class="vk" stroke-width="2.5"/><path d="M${x1 + 10} 60l-8 -5v10z M${x0 - 10} 60l8 -5v10z" class="vkf"/>`;
      const every = n > 20 ? Math.ceil(n / 10) : 1;
      for (let i = 0; i <= n; i++) { const val = v.min + i * step, x = X(val); o += `<path d="M${x} 53V67" class="vk" stroke-width="1.5"/>`; if (i % every === 0 && val !== v.q) o += T(x, 82, (v.labels && v.labels[val]) || +val.toFixed(2), 12, 'vt'); }
      (v.hops || []).forEach(([a, b]) => { const xa = X(a), xb = X(b), mid = (xa + xb) / 2; o += `<path d="M${xa} 52Q${mid} ${52 - Math.min(40, Math.abs(xb - xa))} ${xb} 52" class="vhop" fill="none" stroke-width="2.5"/>`; });
      (v.marks || []).forEach((m) => { o += `<circle cx="${X(m)}" cy="60" r="7" class="va"/>`; });
      if (v.q != null) o += Q(X(v.q), 88);
      return svg(W, 110, o, 'Number line');
    },
    /* {r, c, icon?} — an array of rows and columns */
    array(v) {
      const s = Math.min(30, Math.floor(300 / Math.max(v.c, 1))), w = v.c * s + 20, h = v.r * s + 20; let o = '';
      for (let i = 0; i < v.r; i++) for (let j = 0; j < v.c; j++) o += v.icon ? icon(v.icon, 10 + j * s + s / 2, 10 + i * s + s / 2, s * 0.9) : `<circle cx="${10 + j * s + s / 2}" cy="${10 + i * s + s / 2}" r="${s * 0.32}" class="${i % 2 ? 'vb' : 'va'}"/>`;
      return svg(w, h, o, `${v.r} rows of ${v.c}`);
    },
    /* {parts:[[n,d],...], shape:'pie'|'bar', labels:true} */
    frac(v) {
      let o = '', x = 10; const shape = v.shape || 'pie';
      v.parts.forEach(([n, d], k) => {
        if (shape === 'pie') {
          const cx = x + 55, cy = 60, r = 50;
          for (let i = 0; i < d; i++) {
            const a0 = (i / d) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
            const large = a1 - a0 > Math.PI ? 1 : 0;
            o += d === 1 ? `<circle cx="${cx}" cy="${cy}" r="${r}" class="${i < n ? 'va' : 'vempty'} vk2"/>` : `<path d="M${cx} ${cy}L${R(cx + r * Math.cos(a0))} ${R(cy + r * Math.sin(a0))}A${r} ${r} 0 ${large} 1 ${R(cx + r * Math.cos(a1))} ${R(cy + r * Math.sin(a1))}Z" class="${i < n ? (k ? 'vb' : 'va') : 'vempty'} vk2"/>`;
          }
          if (v.labels !== false) o += T(cx, 128, `${n}/${d}`, 16, 'vt');
          x += 130;
        } else {
          const w = 220, y = 14 + k * 50;
          for (let i = 0; i < d; i++) o += `<rect x="${10 + (i * w) / d}" y="${y}" width="${R(w / d)}" height="32" class="${i < n ? (k ? 'vb' : 'va') : 'vempty'} vk2"/>`;
          if (v.labels !== false) o += T(w + 34, y + 16, `${n}/${d}`, 16, 'vt');
        }
      });
      return shape === 'pie' ? svg(x, 142, o, 'Fraction picture') : svg(280, v.parts.length * 50 + 14, o, 'Fraction bars');
    },
    /* {w,h,unit, grid, lw?, lh?} rectangle with side labels ('?' allowed) */
    rect(v) {
      const sc = Math.min(22, 220 / Math.max(v.w, v.h)), W = v.w * sc, H = v.h * sc, x0 = 46, y0 = 24;
      let o = `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" class="vc2 vk2"/>`;
      if (v.grid) { for (let i = 1; i < v.w; i++) o += `<path d="M${x0 + i * sc} ${y0}v${H}" class="vgrid"/>`; for (let j = 1; j < v.h; j++) o += `<path d="M${x0} ${y0 + j * sc}h${W}" class="vgrid"/>`; }
      o += T(x0 + W / 2, y0 + H + 18, v.lw != null ? v.lw : `${v.w} ${v.unit || ''}`, 14) + T(x0 - 8, y0 + H / 2, v.lh != null ? v.lh : `${v.h} ${v.unit || ''}`, 14, 'vt', 'end');
      return svg(x0 + W + 24, y0 + H + 34, o, `Rectangle ${v.w} by ${v.h}`);
    },
    /* {l,w,h,unit} box drawn at an angle */
    box(v) {
      const sc = Math.min(18, 150 / Math.max(v.l, v.w, v.h)), L = v.l * sc, Hh = v.h * sc, D = v.w * sc * 0.5, x = 40, y = 20 + D;
      const o = `<path d="M${x} ${y}h${L}v${Hh}h${-L}z" class="vc2 vk2"/><path d="M${x} ${y}l${D} ${-D}h${L}l${-D} ${D}z" class="vb2 vk2"/><path d="M${x + L} ${y}l${D} ${-D}v${Hh}l${-D} ${D}z" class="va2 vk2"/>` +
        T(x + L / 2, y + Hh + 16, `${v.l} ${v.unit || ''}`) + T(x - 6, y + Hh / 2, `${v.h} ${v.unit || ''}`, 14, 'vt', 'end') + T(x + L + D / 2 + 14, y - D / 2 + Hh / 2 + 4, `${v.w} ${v.unit || ''}`, 14, 'vt', 'start');
      return svg(x + L + D + 70, y + Hh + 30, o, 'A box');
    },
    /* {a,b,c} right triangle legs a (vertical), b (horizontal), hypotenuse c; any may be '?' */
    rtri(v) {
      const x0 = 50, y0 = 150, W = 190, H = 110;
      const o = `<path d="M${x0} ${y0}h${W}L${x0} ${y0 - H}z" class="vc2 vk2"/><path d="M${x0} ${y0 - 14}h14v14" class="vk" fill="none"/>` +
        (v.a === '?' ? Q(x0 - 22, y0 - H / 2) : T(x0 - 10, y0 - H / 2, v.a, 15, 'vt', 'end')) +
        (v.b === '?' ? Q(x0 + W / 2, y0 + 20) : T(x0 + W / 2, y0 + 18, v.b, 15)) +
        (v.c === '?' ? Q(x0 + W / 2 + 16, y0 - H / 2 - 16) : T(x0 + W / 2 + 18, y0 - H / 2 - 12, v.c, 15, 'vt', 'start')) +
        (v.angle ? T(x0 + W - 34, y0 - 10, v.angle, 13, 'vm') : '');
      return svg(290, 180, o, 'Right triangle');
    },
    /* {angles:[a,b,c]} triangle with angle labels ('?' allowed) */
    tri(v) {
      const P = [[30, 150], [270, 150], [120, 25]];
      let o = `<path d="M${P[0]}L${P[1]}L${P[2]}Z" class="vc2 vk2"/>`;
      const off = [[34, -14], [-38, -14], [0, 30]];
      v.angles.forEach((a, i) => { if (a === '') return; o += a === '?' ? Q(P[i][0] + off[i][0], P[i][1] + off[i][1]) : T(P[i][0] + off[i][0], P[i][1] + off[i][1], a + '°', 14); });
      if (v.base) o += T(150, 168, v.base, 14) + `<path d="M120 25V150" class="vdash" stroke-width="1.5"/>` + T(130, 92, v.height, 14, 'vt', 'start');
      return svg(300, 180, o, 'Triangle');
    },
    /* {r, unit} circle with radius */
    circ(v) {
      const o = `<circle cx="100" cy="90" r="74" class="vc2 vk2"/><path d="M100 90H174" class="vk" stroke-width="2.5"/><circle cx="100" cy="90" r="4" class="vkf"/>` + T(137, 78, `r = ${v.r} ${v.unit || ''}`, 14);
      return svg(200, 180, o, `Circle with radius ${v.r}`);
    },
    /* {colors:{red:3, blue:2,...}} a bag of marbles */
    marbles(v) {
      const cls = { red: 'va', blue: 'vd', green: 'vc', yellow: 'vb' }; let o = `<path d="M40 40Q20 150 150 150Q280 150 260 40Z" class="vbag vk2"/><path d="M40 40Q150 20 260 40" class="vk" fill="none" stroke-width="2"/>`;
      let i = 0; for (const c in v.colors) for (let k = 0; k < v.colors[c]; k++, i++) o += `<circle cx="${70 + (i % 8) * 22}" cy="${70 + Math.floor(i / 8) * 22}" r="9" class="${cls[c] || 'vm'} vk2"/>`;
      return svg(300, 165, o, 'A bag of marbles');
    },
    /* {pts:[[x,y,label]], line:bool, range:n, seg:[[x1,y1],[x2,y2]]} coordinate grid */
    coord(v) {
      const rg = v.range || 6, neg = v.neg !== false, min = neg ? -rg : 0, s = Math.floor(200 / (rg - min)), W = (rg - min) * s;
      const X = (x) => 20 + (x - min) * s, Y = (y) => 20 + (rg - y) * s;
      let o = '';
      for (let i = min; i <= rg; i++) { o += `<path d="M${X(i)} ${Y(min)}V${Y(rg)}M${X(min)} ${Y(i)}H${X(rg)}" class="vgrid"/>`; if (i && i % (rg > 8 ? 2 : 1) === 0) o += T(X(i), Y(0) + 11, i, 9, 'vm') + T(X(0) - 8, Y(i), i, 9, 'vm'); }
      o += `<path d="M${X(min)} ${Y(0)}H${X(rg)}M${X(0)} ${Y(min)}V${Y(rg)}" class="vk" stroke-width="2"/>`;
      if (v.line && v.pts.length > 1) o += `<path d="M${X(v.pts[0][0])} ${Y(v.pts[0][1])}L${X(v.pts[1][0])} ${Y(v.pts[1][1])}" class="vline" stroke-width="3"/>`;
      if (v.poly) o += `<path d="M${v.poly.map((p) => X(p[0]) + ' ' + Y(p[1])).join('L')}Z" class="vc2 vk2" opacity=".85"/>`;
      if (v.poly2) o += `<path d="M${v.poly2.map((p) => X(p[0]) + ' ' + Y(p[1])).join('L')}Z" class="vb2 vk2" opacity=".85"/>`;
      (v.pts || []).forEach((p) => { o += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="6" class="va vk2"/>` + (p[2] ? T(X(p[0]) + 10, Y(p[1]) - 10, p[2], 12, 'vt', 'start') : ''); });
      return svg(W + 40, W + 40, o, 'Coordinate grid');
    },
    /* {labels:[], values:[], title, q:index} bar graph */
    bars(v) {
      const n = v.labels.length, max = Math.max(...v.values), top = Math.ceil(max / (max > 20 ? 5 : 1)) * (max > 20 ? 5 : 1) || 1;
      const H = 140, bw = Math.min(54, 260 / n), x0 = 40, step = top > 12 ? Math.ceil(top / 6 / 5) * 5 || 1 : top > 6 ? 2 : 1;
      let o = '';
      for (let t = 0; t <= top; t += step) { const y = 20 + H - (t / top) * H; o += `<path d="M${x0} ${y}H${x0 + n * (bw + 12) + 6}" class="vgrid"/>` + T(x0 - 8, y, t, 11, 'vm', 'end'); }
      v.labels.forEach((l, i) => {
        const h = (v.values[i] / top) * H, x = x0 + 10 + i * (bw + 12);
        o += `<rect x="${x}" y="${20 + H - h}" width="${bw}" height="${h}" rx="4" class="${['va', 'vb', 'vc', 'vd'][i % 4]}"/>` + T(x + bw / 2, H + 34, l, 11, 'vt');
        if (v.q === i) o += Q(x + bw / 2, 20 + H - h - 18);
      });
      o += `<path d="M${x0} 20V${20 + H}H${x0 + n * (bw + 12) + 6}" class="vk" fill="none" stroke-width="2"/>` + (v.title ? T(x0 + (n * (bw + 12)) / 2, 8, v.title, 12, 'vm') : '');
      return svg(x0 + n * (bw + 12) + 20, H + 50, o, v.title || 'Bar graph');
    },
    /* {deg, known} angle; straight:true shows two angles on a line with known one labeled */
    angle(v) {
      const c = [150, 140], L = 120, a = (v.deg * Math.PI) / 180;
      let o;
      if (v.straight) {
        o = `<path d="M30 140H270" class="vk" stroke-width="3"/><path d="M150 140L${R(150 + L * Math.cos(Math.PI - a))} ${R(140 - L * Math.sin(Math.PI - a))}" class="vk" stroke-width="3"/>` +
          `<path d="M${150 + 34} 140A34 34 0 0 0 ${R(150 + 34 * Math.cos(Math.PI - a))} ${R(140 - 34 * Math.sin(Math.PI - a))}" class="vhop" fill="none" stroke-width="2.5"/>` +
          Q(R(150 + 58 * Math.cos((Math.PI - a) / 2)), R(140 - 58 * Math.sin((Math.PI - a) / 2))) + T(R(150 + 52 * Math.cos(Math.PI - a / 2)), R(140 - 52 * Math.sin(Math.PI - a / 2)), v.deg + '°', 14);
        return svg(300, 160, o, 'Angles on a straight line');
      }
      o = `<path d="M${c[0]} ${c[1]}H${c[0] + L}M${c[0]} ${c[1]}L${R(c[0] + L * Math.cos(a))} ${R(c[1] - L * Math.sin(a))}" class="vk" stroke-width="3"/>` +
        `<path d="M${c[0] + 34} ${c[1]}A34 34 0 0 0 ${R(c[0] + 34 * Math.cos(a))} ${R(c[1] - 34 * Math.sin(a))}" class="vhop" fill="none" stroke-width="2.5"/>` + (v.label ? T(R(c[0] + 56 * Math.cos(a / 2)), R(c[1] - 56 * Math.sin(a / 2)), v.label, 14) : '');
      return svg(300, 160, o, 'An angle');
    },
    /* {name} plane and solid shapes */
    shape(v) {
      const n = v.name, c = 'vc2 vk2';
      const poly = (k, r) => { let p = ''; for (let i = 0; i < k; i++) { const a = -Math.PI / 2 + (i * 2 * Math.PI) / k + (k === 4 ? Math.PI / 4 : 0); p += R(100 + r * Math.cos(a)) + ',' + R(80 + r * Math.sin(a)) + ' '; } return `<polygon points="${p}" class="${c}"/>`; };
      const S = {
        triangle: poly(3, 66), square: poly(4, 70), pentagon: poly(5, 64), hexagon: poly(6, 64), octagon: poly(8, 64),
        rectangle: `<rect x="30" y="40" width="140" height="80" class="${c}"/>`, circle: `<circle cx="100" cy="80" r="62" class="${c}"/>`,
        rhombus: `<polygon points="100,18 160,80 100,142 40,80" class="${c}"/>`, trapezoid: `<polygon points="60,40 140,40 175,125 25,125" class="${c}"/>`,
        cube: `<path d="M50 60h80v80h-80z" class="${c}"/><path d="M50 60l30-30h80l-30 30z" class="vb2 vk2"/><path d="M130 60l30-30v80l-30 30z" class="va2 vk2"/>`,
        sphere: `<circle cx="100" cy="80" r="62" class="${c}"/><ellipse cx="100" cy="80" rx="62" ry="18" fill="none" class="vk3"/>`,
        cylinder: `<path d="M50 40v80a50 16 0 0 0 100 0v-80" class="${c}"/><ellipse cx="100" cy="40" rx="50" ry="16" class="vb2 vk2"/>`,
        cone: `<path d="M100 14L46 124a54 16 0 0 0 108 0Z" class="${c}"/><ellipse cx="100" cy="124" rx="54" ry="16" class="vb2 vk2" opacity=".6"/>`
      };
      return svg(200, 160, S[n] || S.square, 'A shape');
    },
    /* {len, unit, obj} object above a ruler */
    ruler(v) {
      const s = v.unit === 'cm' ? 22 : 40, n = v.max || (v.unit === 'cm' ? 12 : 7), W = n * s + 40;
      let o = `<rect x="20" y="70" width="${n * s}" height="40" rx="4" class="vruler vk2"/>`;
      for (let i = 0; i <= n; i++) { o += `<path d="M${20 + i * s} 70v14" class="vk" stroke-width="2"/>` + T(20 + i * s, 96, i, 12); if (v.unit !== 'cm' && i < n) o += `<path d="M${20 + i * s + s / 2} 70v8" class="vk"/>`; }
      const L = v.len * s, colors = { pencil: 'vb', crayon: 'va', leaf: 'vc', worm: 'vd' };
      o += v.obj === 'leaf' ? `<path d="M20 45Q${20 + L / 2} 10 ${20 + L} 45Q${20 + L / 2} 70 20 45z" class="vc vk2"/>`
        : `<rect x="20" y="36" width="${L - 16}" height="18" rx="5" class="${colors[v.obj] || 'vb'} vk2"/><polygon points="${20 + L - 16},36 ${20 + L},45 ${20 + L - 16},54" class="vwood vk2"/>`;
      o += T(16, 96, v.unit, 10, 'vm', 'end');
      return svg(W, 120, o, 'An object next to a ruler');
    },
    /* {cols, rows, items:[[col,row,label,kind]]} a map grid with places */
    mapgrid(v) {
      const s = 46, x0 = 30, y0 = 26, letters = 'ABCDEFGH'; let o = '';
      for (let i = 0; i < v.cols; i++) o += T(x0 + i * s + s / 2, 12, letters[i], 13, 'vm');
      for (let j = 0; j < v.rows; j++) o += T(14, y0 + j * s + s / 2, j + 1, 13, 'vm');
      for (let i = 0; i < v.cols; i++) for (let j = 0; j < v.rows; j++) o += `<rect x="${x0 + i * s}" y="${y0 + j * s}" width="${s}" height="${s}" class="vmap vgridline"/>`;
      v.items.forEach(([c, r, label, kind]) => {
        const cx = x0 + c * s + s / 2, cy = y0 + r * s + s / 2;
        o += kind === 'tree' ? `<circle cx="${cx}" cy="${cy - 6}" r="12" class="vc"/><rect x="${cx - 3}" y="${cy + 4}" width="6" height="10" class="vwood"/>`
          : kind === 'water' ? `<ellipse cx="${cx}" cy="${cy}" rx="18" ry="12" class="vd"/>`
          : kind === 'school' ? `<path d="M${cx - 14} ${cy + 12}v-14l14-10 14 10v14z" class="va vk2"/><path d="M${cx} ${cy - 22}v-8h8" class="vk" fill="none"/>`
          : `<path d="M${cx - 13} ${cy + 12}v-13l13-10 13 10v13z" class="vb vk2"/>`;
        if (label) o += T(cx, cy + 20, label, 9, 'vt');
      });
      return svg(x0 + v.cols * s + 10, y0 + v.rows * s + 10, o, 'A map grid');
    },
    /* {ev:[[year,label]], q:index} timeline */
    timeline(v) {
      const n = v.ev.length, W = 340, x0 = 30, x1 = W - 30; let o = `<path d="M${x0 - 10} 60H${x1 + 10}" class="vk" stroke-width="3"/>`;
      v.ev.forEach(([yr, lab], i) => {
        const x = n === 1 ? (x0 + x1) / 2 : x0 + (i * (x1 - x0)) / (n - 1), up = i % 2 === 0;
        o += `<circle cx="${x}" cy="60" r="7" class="${['va', 'vb', 'vc', 'vd'][i % 4]} vk2"/>`;
        o += v.q === i ? Q(x, up ? 30 : 92) : T(x, up ? 36 : 86, yr, 13, 'vt');
        o += T(x, up ? 18 : 104, lab, 10, 'vm');
      });
      return svg(W, 118, o, 'A timeline');
    },
    /* {d:'name', mark:'part'} labeled diagrams — the marked part shows a ? */
    d(v) { return (DIAG[v.d] || DIAG.plant)(v.mark); }
  };

  /* ── labeled science & social studies diagrams ── */
  function lab(x, y, text, key, mark, anchor) { return key === mark ? Q(x, y) : T(x, y, text, 12, 'vt', anchor); }
  function cycle(names, keys, mark, art) {
    const cx = 160, cy = 100, r = 70; let o = '';
    names.forEach((nm, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / names.length, a2 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / names.length;
      const x = R(cx + r * Math.cos(a)), y = R(cy + r * Math.sin(a));
      const mx = R(cx + (r - 6) * Math.cos((a + a2) / 2)), my = R(cy + (r - 6) * Math.sin((a + a2) / 2));
      o += `<path d="M${R(cx + r * Math.cos(a + 0.42))} ${R(cy + r * Math.sin(a + 0.42))}Q${R(cx + (r + 22) * Math.cos((a + a2) / 2))} ${R(cy + (r + 22) * Math.sin((a + a2) / 2))} ${R(cx + r * Math.cos(a2 - 0.42))} ${R(cy + r * Math.sin(a2 - 0.42))}" class="vhop" fill="none" stroke-width="2.5" marker-end="url(#arr)"/>`;
      o += `<circle cx="${x}" cy="${y}" r="24" class="vface vk2"/>` + (art[i] ? art[i](x, y) : '');
      const lx = R(cx + (r + 50) * Math.cos(a)), ly = R(cy + (r + 40) * Math.sin(a));
      o += lab(lx, ly, nm, keys[i], mark);
      void mx; void my;
    });
    return svg(380, 252, ARROW + '<g transform="translate(30 26)">' + o + '</g>', 'Life cycle');
  }
  const ARROW = '<defs><marker id="arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" class="vhopf"/></marker></defs>';
  const DIAG = {
    plant(mark) {
      const o = `<path d="M150 170V70" class="vstem" stroke-width="6"/><ellipse cx="122" cy="120" rx="26" ry="11" class="vc" transform="rotate(-25 122 120)"/><ellipse cx="178" cy="105" rx="26" ry="11" class="vc" transform="rotate(25 178 105)"/>` +
        [0, 1, 2, 3, 4, 5].map((i) => `<ellipse cx="${R(150 + 20 * Math.cos(i * 1.047))}" cy="${R(55 + 20 * Math.sin(i * 1.047))}" rx="14" ry="9" class="va" transform="rotate(${i * 60} ${R(150 + 20 * Math.cos(i * 1.047))} ${R(55 + 20 * Math.sin(i * 1.047))})"/>`).join('') + `<circle cx="150" cy="55" r="11" class="vb"/>` +
        `<rect x="40" y="170" width="220" height="45" class="vsoil"/><path d="M150 170q-10 20-30 32M150 170q2 22-4 38M150 170q12 18 32 28M150 185q-14 6-24 6" class="vroot" fill="none" stroke-width="3"/>` +
        lab(250, 50, 'flower', 'flower', mark, 'start') + `<path d="M246 50H172" class="vdash"/>` + lab(250, 105, 'leaf', 'leaf', mark, 'start') + `<path d="M246 105H200" class="vdash"/>` +
        lab(60, 140, 'stem', 'stem', mark, 'end') + `<path d="M64 140H146" class="vdash"/>` + lab(250, 200, 'roots', 'roots', mark, 'start') + `<path d="M246 200H184" class="vdash"/>`;
      return svg(320, 220, o, 'Parts of a plant');
    },
    butterfly(mark) {
      return cycle(['egg', 'caterpillar', 'chrysalis', 'butterfly'], ['egg', 'caterpillar', 'chrysalis', 'butterfly'], mark, [
        (x, y) => `<circle cx="${x - 5}" cy="${y}" r="5" class="vb"/><circle cx="${x + 5}" cy="${y + 2}" r="5" class="vb"/>`,
        (x, y) => [0, 1, 2, 3].map((i) => `<circle cx="${x - 12 + i * 8}" cy="${y + (i % 2 ? 2 : -2)}" r="5" class="vc"/>`).join(''),
        (x, y) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="14" class="vwood"/>`,
        (x, y) => `<ellipse cx="${x - 9}" cy="${y - 4}" rx="9" ry="11" class="va"/><ellipse cx="${x + 9}" cy="${y - 4}" rx="9" ry="11" class="va"/><ellipse cx="${x - 7}" cy="${y + 8}" rx="6" ry="7" class="vb"/><ellipse cx="${x + 7}" cy="${y + 8}" rx="6" ry="7" class="vb"/><rect x="${x - 2}" y="${y - 12}" width="4" height="24" rx="2" class="vkf"/>`
      ]);
    },
    frog(mark) {
      return cycle(['eggs', 'tadpole', 'froglet', 'frog'], ['eggs', 'tadpole', 'froglet', 'frog'], mark, [
        (x, y) => [0, 1, 2, 3, 4].map((i) => `<circle cx="${x - 10 + (i % 3) * 10}" cy="${y - 5 + Math.floor(i / 3) * 10}" r="5" class="vd"/>`).join(''),
        (x, y) => `<circle cx="${x - 6}" cy="${y}" r="7" class="vkf"/><path d="M${x} ${y}q10 -6 16 4" class="vk" stroke-width="3" fill="none"/>`,
        (x, y) => `<ellipse cx="${x - 2}" cy="${y}" rx="11" ry="8" class="vc"/><path d="M${x + 8} ${y}q8 0 10 6" class="vc vstemc" stroke-width="3" fill="none"/>`,
        (x, y) => `<ellipse cx="${x}" cy="${y + 3}" rx="14" ry="10" class="vc"/><circle cx="${x - 6}" cy="${y - 7}" r="4" class="vface vk2"/><circle cx="${x + 6}" cy="${y - 7}" r="4" class="vface vk2"/>`
      ]);
    },
    plantcycle(mark) {
      return cycle(['seed', 'sprout', 'seedling', 'adult plant'], ['seed', 'sprout', 'seedling', 'adult'], mark, [
        (x, y) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" class="vwood"/>`,
        (x, y) => `<path d="M${x} ${y + 10}V${y - 2}" class="vstem" stroke-width="3"/><ellipse cx="${x + 5}" cy="${y - 4}" rx="6" ry="3" class="vc"/>`,
        (x, y) => `<path d="M${x} ${y + 12}V${y - 8}" class="vstem" stroke-width="3"/><ellipse cx="${x - 7}" cy="${y - 2}" rx="7" ry="3" class="vc"/><ellipse cx="${x + 7}" cy="${y - 6}" rx="7" ry="3" class="vc"/>`,
        (x, y) => `<path d="M${x} ${y + 14}V${y - 6}" class="vstem" stroke-width="3"/><circle cx="${x}" cy="${y - 9}" r="6" class="va"/><ellipse cx="${x - 8}" cy="${y + 2}" rx="7" ry="3" class="vc"/><ellipse cx="${x + 8}" cy="${y + 4}" rx="7" ry="3" class="vc"/>`
      ]);
    },
    water(mark) {
      const o = ARROW + `<circle cx="50" cy="40" r="22" class="vb"/><path d="M190 30a18 18 0 0 1 34 -6a16 16 0 0 1 26 18h-62a14 14 0 0 1 2 -12z" class="vcloud vk2"/>` +
        `<path d="M0 170Q80 150 160 172T320 170V220H0z" class="vd"/><path d="M200 172L240 120L280 172z" class="vc2 vk2"/>` +
        `<path d="M80 160C80 110 140 70 180 50" class="vhop" fill="none" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#arr)"/>` +
        [0, 1, 2].map((i) => `<path d="M${226 + i * 12} 62v10" class="vrain" stroke-width="3" stroke-linecap="round"/><path d="M${232 + i * 12} 80v10" class="vrain" stroke-width="3" stroke-linecap="round"/>`).join('') +
        `<path d="M270 175Q200 205 110 185" class="vhop" fill="none" stroke-width="2.5" marker-end="url(#arr)"/>` +
        lab(60, 115, 'evaporation', 'evaporation', mark) + lab(222, 12, 'condensation', 'condensation', mark) + lab(290, 100, 'precipitation', 'precipitation', mark) + lab(160, 208, 'collection', 'collection', mark);
      return svg(320, 220, o, 'The water cycle');
    },
    compass(mark) {
      const o = `<circle cx="110" cy="100" r="80" class="vface vk2"/><polygon points="110,30 124,100 110,170 96,100" class="va2 vk2"/><polygon points="40,100 110,86 180,100 110,114" class="vc2 vk2"/>` +
        lab(110, 12, 'N', 'north', mark) + lab(110, 190, 'S', 'south', mark) + lab(200, 100, 'E', 'east', mark) + lab(20, 100, 'W', 'west', mark);
      return svg(220, 205, o, 'A compass rose');
    },
    foodchain(mark) {
      const xs = [40, 120, 200, 280], names = ['sun', 'grass', 'rabbit', 'fox'];
      const art = [(x) => `<circle cx="${x}" cy="70" r="22" class="vb"/>`, (x) => [0, 1, 2, 3].map((i) => `<path d="M${x - 15 + i * 10} 92q2 -20 6 -28" class="vstemc" stroke-width="4" fill="none"/>`).join(''),
        (x) => `<ellipse cx="${x}" cy="78" rx="18" ry="13" class="vm2"/><ellipse cx="${x - 6}" cy="56" rx="4" ry="12" class="vm2"/><ellipse cx="${x + 4}" cy="56" rx="4" ry="12" class="vm2"/>`,
        (x) => `<ellipse cx="${x}" cy="78" rx="20" ry="12" class="va2"/><polygon points="${x + 14},66 ${x + 30},72 ${x + 16},82" class="va2"/><path d="M${x - 20} 78q-14 -4 -18 6" class="va2s" stroke-width="7" fill="none"/>`];
      let o = ARROW; xs.forEach((x, i) => { o += art[i](x) + lab(x, 120, names[i], names[i], mark); if (i < 3) o += `<path d="M${x + 26} 74H${xs[i + 1] - 28}" class="vhop" stroke-width="2.5" marker-end="url(#arr)"/>`; });
      return svg(320, 140, o, 'A food chain');
    },
    earth(mark) {
      const o = `<circle cx="120" cy="110" r="96" class="vcrust vk2"/><circle cx="120" cy="110" r="86" class="vmantle"/><circle cx="120" cy="110" r="52" class="vouter"/><circle cx="120" cy="110" r="26" class="vinner"/>` +
        lab(270, 22, 'crust', 'crust', mark, 'start') + `<path d="M266 22L190 40" class="vdash"/>` + lab(270, 72, 'mantle', 'mantle', mark, 'start') + `<path d="M266 72L196 84" class="vdash"/>` +
        lab(270, 122, 'outer core', 'outer', mark, 'start') + `<path d="M266 122L160 118" class="vdash"/>` + lab(270, 172, 'inner core', 'inner', mark, 'start') + `<path d="M266 172L134 118" class="vdash"/>`;
      return svg(360, 220, o, "Earth's layers");
    },
    solar(mark) {
      const P = [['Mercury', 5], ['Venus', 8], ['Earth', 8], ['Mars', 6], ['Jupiter', 17], ['Saturn', 14], ['Uranus', 11], ['Neptune', 11]];
      const cls = ['vm2', 'vb', 'vd', 'va', 'vwood', 'vb', 'vd', 'vd'];
      let o = `<circle cx="0" cy="80" r="46" class="vb"/>`, x = 58;
      P.forEach(([nm, r], i) => { x += r + 9; o += `<circle cx="${x}" cy="80" r="${r}" class="${cls[i]} vk2"/>` + (nm === 'Saturn' ? `<ellipse cx="${x}" cy="80" rx="${r + 8}" ry="4" fill="none" class="vk3"/>` : '') + lab(x, i % 2 ? 124 : 40, nm, nm.toLowerCase(), mark); x += r + 5; });
      return svg(x + 20, 150, o, 'The solar system');
    },
    moon(mark) {
      const names = ['new moon', 'crescent', 'first quarter', 'full moon'], keys = ['new', 'crescent', 'quarter', 'full']; let o = '';
      names.forEach((nm, i) => {
        const x = 45 + i * 78; o += `<circle cx="${x}" cy="55" r="28" class="vnight"/>`;
        if (i === 1) o += `<path d="M${x} 27A28 28 0 0 1 ${x} 83A18 28 0 0 0 ${x} 27z" class="vmoon"/>`;
        if (i === 2) o += `<path d="M${x} 27A28 28 0 0 1 ${x} 83z" class="vmoon"/>`;
        if (i === 3) o += `<circle cx="${x}" cy="55" r="28" class="vmoon"/>`;
        o += lab(x, 102, nm, keys[i], mark);
      });
      return svg(320, 120, o, 'Phases of the moon');
    },
    atom(mark) {
      const o = `<ellipse cx="150" cy="100" rx="110" ry="42" fill="none" class="vk3"/><ellipse cx="150" cy="100" rx="110" ry="42" fill="none" class="vk3" transform="rotate(60 150 100)"/><ellipse cx="150" cy="100" rx="110" ry="42" fill="none" class="vk3" transform="rotate(-60 150 100)"/>` +
        `<circle cx="144" cy="96" r="10" class="va"/><circle cx="157" cy="98" r="10" class="vm2"/><circle cx="148" cy="108" r="10" class="vm2"/><circle cx="158" cy="110" r="10" class="va"/>` +
        `<circle cx="260" cy="100" r="7" class="vd"/><circle cx="95" cy="5" r="7" class="vd"/>` +
        lab(290, 30, 'electron', 'electron', mark, 'start') + `<path d="M286 34L264 94" class="vdash"/>` + lab(24, 170, 'nucleus', 'nucleus', mark, 'start') + `<path d="M70 166L140 112" class="vdash"/>` +
        T(150, 196, 'red = proton · gray = neutron', 11, 'vm');
      return svg(340, 205, o, 'An atom');
    },
    circuit(mark) {
      const closed = mark !== 'open';
      const o = `<path d="M60 60H150M190 60H260V160H60V60" class="vwire" fill="none" stroke-width="4"/>` +
        (closed ? `<path d="M150 60H190" class="vwire" stroke-width="4"/>` : `<path d="M150 60L184 38" class="vwire" stroke-width="4"/>`) + `<circle cx="150" cy="60" r="5" class="vkf"/><circle cx="190" cy="60" r="5" class="vkf"/>` +
        `<rect x="40" y="90" width="40" height="44" rx="4" class="vb vk2"/>${T(60, 112, '+ −', 13, 'vt')}` +
        `<circle cx="260" cy="110" r="20" class="${closed ? 'vglow' : 'vface'} vk2"/><path d="M252 112q8 -12 16 0" class="vk" fill="none" stroke-width="2"/>` +
        lab(30, 112, 'battery', 'battery', mark === 'open' ? null : mark, 'end') + lab(170, 22, 'switch', 'switch', mark === 'open' ? null : mark) + lab(300, 110, 'bulb', 'bulb', mark === 'open' ? null : mark, 'start') + lab(160, 182, 'wire', 'wire', mark === 'open' ? null : mark);
      return svg(340, 195, o, closed ? 'A closed circuit' : 'An open circuit');
    },
    wave(mark) {
      let p = 'M20 100'; for (let i = 0; i <= 280; i += 4) p += `L${20 + i} ${R(100 - 50 * Math.sin((i / 140) * 2 * Math.PI))}`;
      const o = `<path d="M20 100H300" class="vdash"/><path d="${p}" class="vline" fill="none" stroke-width="3"/>` +
        `<path d="M55 40H195" class="vk" stroke-width="1.5"/><path d="M55 34v12M195 34v12" class="vk"/>` + lab(125, 24, 'wavelength', 'wavelength', mark) +
        `<path d="M250 100V150" class="vk" stroke-width="1.5"/>` + lab(300, 128, 'amplitude', 'amplitude', mark, 'end') +
        lab(55, 66, 'crest', 'crest', mark) + lab(125, 168, 'trough', 'trough', mark);
      return svg(320, 185, o, 'A wave');
    },
    lever(mark) {
      const o = `<path d="M30 110L290 70" class="vwood" stroke-width="10" stroke-linecap="round"/><polygon points="160,92 136,140 184,140" class="vb vk2"/>` +
        `<rect x="40" y="70" width="40" height="34" rx="4" class="va vk2" transform="rotate(-9 60 87)"/><path d="M270 20V58" class="vhop" stroke-width="3" marker-end="url(#arr)"/>` + ARROW +
        lab(60, 50, 'load', 'load', mark) + lab(160, 158, 'fulcrum', 'fulcrum', mark) + lab(270, 10, 'effort', 'effort', mark);
      return svg(320, 175, o, 'A lever');
    },
    magnet(mark) {
      const pull = mark !== 'repel';
      const o = `<rect x="20" y="50" width="60" height="40" class="va vk2"/><rect x="80" y="50" width="60" height="40" class="vd vk2"/>${T(50, 70, 'N', 18, 'vqt')}${T(110, 70, 'S', 18, 'vqt')}` +
        (pull ? `<rect x="170" y="50" width="60" height="40" class="va vk2"/><rect x="230" y="50" width="60" height="40" class="vd vk2"/>${T(200, 70, 'N', 18, 'vqt')}${T(260, 70, 'S', 18, 'vqt')}`
          : `<rect x="170" y="50" width="60" height="40" class="vd vk2"/><rect x="230" y="50" width="60" height="40" class="va vk2"/>${T(200, 70, 'S', 18, 'vqt')}${T(260, 70, 'N', 18, 'vqt')}`) +
        T(155, 118, '?', 22, 'vt');
      return svg(310, 135, o, 'Two magnets');
    },
    rocks(mark) {
      const pts = [[160, 30, 'igneous', 'igneous'], [270, 150, 'sedimentary', 'sedimentary'], [50, 150, 'metamorphic', 'metamorphic']];
      let o = ARROW;
      pts.forEach(([x, y, nm, key], i) => { const [nx, ny] = pts[(i + 1) % 3]; o += `<path d="M${x + (nx - x) * 0.22} ${y + (ny - y) * 0.22}L${x + (nx - x) * 0.72} ${y + (ny - y) * 0.72}" class="vhop" stroke-width="2.5" marker-end="url(#arr)"/>` + `<ellipse cx="${x}" cy="${y}" rx="44" ry="22" class="${['va2', 'vb2', 'vc2'][i]} vk2"/>` + lab(x, y, nm, key, mark); });
      o += T(240, 80, 'weathering', 10, 'vm') + T(160, 172, 'heat & pressure', 10, 'vm') + T(76, 80, 'melting', 10, 'vm');
      return svg(320, 190, o, 'The rock cycle');
    },
    ph(mark) {
      let o = ''; const cls = ['va', 'va', 'va', 'vb', 'vb', 'vb', 'vc', 'vc', 'vc', 'vd', 'vd', 'vd', 'vm2', 'vm2', 'vm2'];
      for (let i = 0; i <= 14; i++) o += `<rect x="${10 + i * 20}" y="40" width="20" height="34" class="${cls[i]} vk2"/>` + T(20 + i * 20, 88, i, 11);
      o += lab(60, 20, 'acid', 'acid', mark) + lab(160, 20, 'neutral', 'neutral', mark) + lab(270, 20, 'base', 'base', mark);
      if (typeof mark === 'number') o += Q(20 + mark * 20, 112);
      return svg(320, 130, o, 'The pH scale');
    },
    atmosphere(mark) {
      const L = [['thermosphere', 'thermo', 'vd'], ['mesosphere', 'meso', 'vc2'], ['stratosphere', 'strato', 'vb2'], ['troposphere', 'tropo', 'va2']];
      let o = ''; L.forEach(([nm, key, c], i) => { o += `<rect x="20" y="${10 + i * 44}" width="280" height="44" class="${c}"/>` + lab(160, 32 + i * 44, nm, key, mark); });
      o += `<path d="M20 186H300" class="vk" stroke-width="3"/><path d="M40 186l14-20 14 20M240 186l20-26 20 26" class="vc"/>`;
      return svg(320, 196, o, 'Layers of the atmosphere');
    },
    cell(mark) {
      const o = `<ellipse cx="150" cy="100" rx="120" ry="80" class="vcell vk2"/><circle cx="150" cy="95" r="30" class="vd2 vk2"/><circle cx="150" cy="95" r="10" class="vd"/>` +
        `<ellipse cx="80" cy="120" rx="20" ry="9" class="va2 vk2"/><path d="M64 120q8-6 16 0t16 0" class="vk" fill="none"/><ellipse cx="215" cy="70" rx="20" ry="9" class="va2 vk2"/>` +
        lab(300, 30, 'membrane', 'membrane', mark, 'end') + `<path d="M246 36L232 46" class="vdash"/>` + lab(150, 145, 'nucleus', 'nucleus', mark) + lab(60, 168, 'mitochondria', 'mitochondria', mark, 'start') + `<path d="M74 158L80 130" class="vdash"/>` + lab(230, 145, 'cytoplasm', 'cytoplasm', mark);
      return svg(310, 190, o, 'An animal cell');
    },
    branches(mark) {
      const B = [['Legislative', 'Congress', 'legislative', 'va2'], ['Executive', 'President', 'executive', 'vb2'], ['Judicial', 'Courts', 'judicial', 'vc2']];
      let o = `<polygon points="160,8 300,46 20,46" class="vm2 vk2"/>` + T(160, 34, 'U.S. Government', 13, 'vt');
      B.forEach(([n, who, key, c], i) => { const x = 20 + i * 96; o += `<rect x="${x}" y="54" width="88" height="22" class="vm2 vk2"/><rect x="${x + 30}" y="76" width="28" height="70" class="vface vk2"/><rect x="${x}" y="146" width="88" height="40" rx="6" class="${c} vk2"/>` + (key === mark ? Q(x + 44, 166) : T(x + 44, 160, n, 12, 'vt') + T(x + 44, 176, who, 10, 'vm')); });
      return svg(320, 194, o, 'Three branches of government');
    },
    nn(mark) {
      const L = [[60, [40, 90, 140]], [160, [30, 75, 120, 165]], [260, [65, 115]]]; let o = '';
      for (let i = 0; i < 2; i++) L[i][1].forEach((y1) => L[i + 1][1].forEach((y2) => { o += `<path d="M${L[i][0]} ${y1}L${L[i + 1][0]} ${y2}" class="vgrid" stroke-width="1.5"/>`; }));
      const cls = ['vd', 'vb', 'vc'];
      L.forEach(([x, ys], i) => ys.forEach((y) => { o += `<circle cx="${x}" cy="${y}" r="13" class="${cls[i]} vk2"/>`; }));
      o += lab(60, 190, 'input', 'input', mark) + lab(160, 196, 'hidden', 'hidden', mark) + lab(260, 160, 'output', 'output', mark);
      return svg(320, 210, o, 'A neural network');
    },
    mlflow(mark) {
      const S = [['data', 'vd2'], ['training', 'vb2'], ['model', 'vc2'], ['prediction', 'va2']]; let o = ARROW;
      S.forEach(([nm, c], i) => { const x = 14 + i * 98; o += `<rect x="${x}" y="40" width="80" height="56" rx="12" class="${c} vk2"/>` + lab(x + 40, 68, nm, nm, mark); if (i < 3) o += `<path d="M${x + 82} 68H${x + 96}" class="vhop" stroke-width="2.5" marker-end="url(#arr)"/>`; });
      o += T(54, 118, 'labeled examples', 10, 'vm') + T(250, 118, 'what it learned', 10, 'vm') + T(348, 118, 'its guess', 10, 'vm');
      return svg(408, 132, o, 'How machine learning works');
    },
    supply(mark) {
      const o = `<path d="M40 20V180H300" class="vk" fill="none" stroke-width="2"/><path d="M60 170L280 40" class="vline" stroke-width="3"/><path d="M60 40L280 170" class="vline2" stroke-width="3"/><circle cx="170" cy="105" r="7" class="vb vk2"/>` +
        T(14, 100, 'price', 12, 'vm') + T(170, 196, 'quantity', 12, 'vm') + lab(286, 30, 'supply', 'supply', mark, 'end') + lab(286, 160, 'demand', 'demand', mark, 'end') + lab(200, 105, 'equilibrium', 'equilibrium', mark, 'start');
      return svg(320, 205, o, 'Supply and demand');
    }
  };

  /* ── Lumi, the lantern helper ── */
  function mascot(mood) {
    const mouth = { happy: 'M-9 8q9 9 18 0', cheer: 'M-11 6q11 14 22 0z', think: 'M-6 10h12', oops: '' }[mood || 'happy'];
    const eyes = mood === 'think' ? '<circle cx="-8" cy="-4" r="3.2" class="lk"/><circle cx="8" cy="-4" r="3.2" class="lk"/>' : mood === 'cheer' ? '<path d="M-12 -2q4-6 8 0M4 -2q4-6 8 0" class="lks" fill="none" stroke-width="3" stroke-linecap="round"/>' : '<circle cx="-8" cy="-1" r="3.6" class="lk"/><circle cx="8" cy="-1" r="3.6" class="lk"/>';
    return `<svg class="lumi lumi-${mood || 'happy'}" viewBox="-40 -52 80 100" aria-hidden="true"><path d="M-12 -40a12 12 0 0 1 24 0" fill="none" class="lks" stroke-width="3"/><rect x="-24" y="-40" width="48" height="10" rx="4" class="lcap"/>` +
      `<rect x="-26" y="-30" width="52" height="58" rx="18" class="lbody"/><circle cx="0" cy="2" r="22" class="lglow"/>${eyes}` +
      (mood === 'oops' ? '<circle cx="0" cy="11" r="4" class="lk"/>' : `<path d="${mouth}" class="${mood === 'cheer' ? 'lk' : 'lks'}" fill="${mood === 'cheer' ? '' : 'none'}" stroke-width="3" stroke-linecap="round"/>`) +
      `<circle cx="-15" cy="8" r="4" class="lcheek"/><circle cx="15" cy="8" r="4" class="lcheek"/><rect x="-20" y="28" width="40" height="9" rx="4" class="lcap"/></svg>`;
  }
  function stars(n) {
    let o = '';
    for (let i = 0; i < 3; i++) { let p = ''; for (let k = 0; k < 10; k++) { const r = k % 2 ? 9 : 22, a = -Math.PI / 2 + (k * Math.PI) / 5; p += R(30 + i * 54 + r * Math.cos(a)) + ',' + R(30 + r * Math.sin(a)) + ' '; } o += `<polygon points="${p}" class="${i < n ? 'sfull' : 'sempty'}" style="animation-delay:${i * 0.18}s"/>`; }
    return `<svg class="stars" viewBox="0 0 168 60" role="img" aria-label="${n} of 3 stars">${o}</svg>`;
  }

  window.LH_VIS = function (spec) { if (!spec) return ''; try { return (DRAW[spec.t] || (() => ''))(spec); } catch (e) { console.warn('visual failed', spec, e); return ''; } };
  window.LH_MASCOT = mascot;
  window.LH_STARS = stars;
})();
