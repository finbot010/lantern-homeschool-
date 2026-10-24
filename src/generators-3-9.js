/* Lantern Homeschool — problem generators for the expanded 3rd grade math and Algebra 1 (9th grade) courses.
   Each returns { q, a, w: [three wrong answers] }. Every call makes a new problem. */
(function () {
  const G = window.LH_GEN;
  const R = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const neg = (x) => (x < 0 ? '−' + Math.abs(x) : String(x));
  const r2 = (x) => Math.round(x * 100) / 100;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const co = (c, v) => (c === 1 ? v : c === -1 ? '−' + v : neg(c) + v); // coefficient
  const tail = (c) => (c < 0 ? ' − ' + Math.abs(c) : ' + ' + c);
  function mk(q, a, wrongs, fmt) {
    fmt = fmt || ((x) => String(x)); const A = typeof a === 'string' ? a : fmt(a), out = [];
    for (const w of wrongs) { const s = typeof w === 'string' ? w : fmt(w); if (s !== A && !out.includes(s) && !/NaN|Infinity|undefined/.test(s)) out.push(s); if (out.length === 3) break; }
    if (typeof a === 'number') for (const d of [1, -1, 2, -2, 3, 5, 10, -10]) { if (out.length >= 3) break; const s = fmt(a + d); if (s !== A && !out.includes(s)) out.push(s); }
    else { const m = A.match(/(\d+)(?!.*\d)/); if (m) for (const d of [1, 2, -1, 5, 10, 3]) { if (out.length >= 3) break; const v = Number(m[1]) + d; if (v < 0) continue; const s = A.slice(0, m.index) + v + A.slice(m.index + m[1].length); if (s !== A && !out.includes(s)) out.push(s); } }
    return { q, a: A, w: out.slice(0, 3) };
  }
  const names = ['Mia', 'Leo', 'Ana', 'Sam', 'Luis', 'Zoe', 'Eli', 'Rosa', 'Ben', 'Ivy'];
  const tstr = (h, m) => h + ':' + String(m).padStart(2, '0');

  Object.assign(G, {
    /* ───── Grade 3 ───── */
    multProps3() {
      const a = R(2, 9), b = R(2, 9), c = R(2, 5);
      return pick([
        () => mk(`${a} × ${b} = ${b} × ?`, a, [b, a * b, a + b]),
        () => mk(`${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ?`, c, [b, a, b + c]),
        () => mk(`(${a} × ${b}) × ${c} = ${a} × (${b} × ?)`, c, [a, b, a * b]),
        () => mk(`${a} × 1 = ?`, a, [1, a + 1, 0]),
        () => mk(`${a} × 0 = ?`, 0, [a, 1, 10]),
        () => { const t = R(6, 9), s = R(2, 5); return mk(`Break apart to multiply: ${t} × ${s} = (5 × ${s}) + (${t - 5} × ${s}). What is the product?`, t * s, [t + s, 5 * s, t * s + s]); }
      ])();
    },
    mult10s3() {
      const a = R(2, 9), t = pick([10, 20, 30, 40, 50, 60, 70, 80, 90]);
      return Math.random() < 0.7 ? mk(`${a} × ${t} = ?`, a * t, [a * t / 10, a * t + 10, a * (t + 10), a * t * 10]) : mk(`What is ${t / 10} tens × ${a}?`, a * t, [a * t / 10, a + t, a * t + t]);
    },
    twoStep3() {
      const n = pick(names);
      return pick([
        () => { const p = R(3, 6), c = R(2, 5), x = R(2, 9); return mk(`${n} buys ${p} packs of ${c} pencils and already had ${x}. How many pencils now?`, p * c + x, [p + c + x, p * c, p * (c + x)]); },
        () => { const b = R(3, 6), e = R(4, 8), ate = R(2, 6); return mk(`There are ${b} bags with ${e} apples each. The family eats ${ate}. How many apples are left?`, b * e - ate, [b * e + ate, b + e - ate, b * e]); },
        () => { const g = R(3, 6), k = R(2, 5), tot = g * k * R(2, 3); const each = tot / g; return mk(`${tot} stickers are shared equally by ${g} kids. Each kid then gives away 1. How many stickers does each kid have?`, each - 1, [each, each + 1, tot - g]); },
        () => { const c = R(4, 9), q = R(3, 6), m = c * q + R(1, 20); return mk(`Toys cost $${c} each. ${n} buys ${q} toys and pays with $${m}. How much change?`, m - c * q, [c * q, m - c - q, m + c * q], (v) => '$' + v); }
      ])();
    },
    fracLine3() {
      const d = pick([2, 3, 4, 6, 8]), n = R(1, d - 1);
      return pick([
        () => mk(`A number line from 0 to 1 is split into ${d} equal parts. A point is ${n} part${n === 1 ? '' : 's'} from 0. What fraction is it?`, `${n}/${d}`, [`${d}/${n}`, `${n}/${d + 1}`, `1/${d}`, `${n + 1}/${d}`]),
        () => mk(`How many ${d === 2 ? 'halves' : d === 3 ? 'thirds' : d === 4 ? 'fourths' : d === 6 ? 'sixths' : 'eighths'} make 1 whole?`, d, [d - 1, d + 1, 1]),
        () => mk(`Which fraction is the same as 1 whole?`, `${d}/${d}`, [`1/${d}`, `${d}/${d + 1}`, `0/${d}`])
      ])();
    },
    equivFrac3() {
      return pick([
        () => { const [a, b] = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]); const k = pick([2, 3, 4].filter((x) => b * x <= 12)); return mk(`${a}/${b} = ?/${b * k}`, a * k, [a + k, a * k + 1, b * k - a]); },
        () => { const d = pick([2, 3, 4, 6, 8]); return mk(`Which fraction is equal to 1/2?`, pick(['2/4', '3/6', '4/8']), ['1/4', '2/3', '3/4', '2/6']); },
        () => { const d = pick([3, 4, 6, 8]); const a = R(1, d - 1); let b = R(1, d - 1); while (b === a) b = R(1, d - 1); return mk(`Which is greater: ${a}/${d} or ${b}/${d}?`, `${Math.max(a, b)}/${d}`, [`${Math.min(a, b)}/${d}`, 'They are equal', `${a + b}/${d}`]); },
        () => { const n = R(1, 3); let a = pick([2, 3, 4, 6, 8]), b = pick([2, 3, 4, 6, 8]); while (a === b) b = pick([2, 3, 4, 6, 8]); return mk(`Which is greater: ${n}/${a} or ${n}/${b}?`, `${n}/${Math.min(a, b)}`, [`${n}/${Math.max(a, b)}`, 'They are equal', `${n}/${a + b}`]); }
      ])();
    },
    timeMin3() {
      const h = R(1, 11), m = R(1, 59);
      return pick([
        () => { const add = pick([15, 25, 35, 45, 50]); const tm = h * 60 + m + add; return mk(`It is ${tstr(h, m)}. What time will it be in ${add} minutes?`, tstr(Math.floor(tm / 60) > 12 ? Math.floor(tm / 60) - 12 : Math.floor(tm / 60), tm % 60), [tstr(h, (m + add) % 60), tstr(h + 1, m), tstr(Math.floor(tm / 60) > 12 ? Math.floor(tm / 60) - 12 : Math.floor(tm / 60), (tm + 10) % 60)]); },
        () => { const s = R(1, 4), dur = pick([20, 35, 45, 55, 70, 85]); const st = 60 * (h) + pick([0, 10, 15, 30]); const en = st + dur; return mk(`A movie starts at ${tstr(h, st % 60)} and ends at ${tstr(Math.floor(en / 60) > 12 ? Math.floor(en / 60) - 12 : Math.floor(en / 60), en % 60)}. How long is it?`, dur, [dur + 10, dur - 5, dur + 60], (v) => v + ' min'); },
        () => mk(`How many minutes are in 1 hour?`, 60, [100, 30, 24])
      ])();
    },
    measure3() {
      return pick([
        () => { const [o, a, w] = pick([['a paper clip', '1 gram', ['1 kilogram', '10 kilograms', '100 kilograms']], ['a bike', '15 kilograms', ['15 grams', '150 kilograms', '1 gram']], ['a bathtub of water', '300 liters', ['3 liters', '30 milliliters', '3 milliliters']], ['a spoonful of medicine', '5 milliliters', ['5 liters', '50 liters', '500 liters']], ['a watermelon', '5 kilograms', ['5 grams', '500 kilograms', '50 grams']]]); return { q: `Which is the best estimate for ${o}?`, a, w }; },
        () => { const a = R(2, 9), b = R(2, 9); return mk(`A bucket holds ${a} liters. Another holds ${b} liters. How many liters in both?`, a + b, [a * b, Math.abs(a - b), a + b + 10], (v) => v + ' L'); },
        () => { const k = R(2, 6), each = R(3, 9); return mk(`${k} bags of flour each weigh ${each} kilograms. What is the total mass?`, k * each, [k + each, k * each + each, each], (v) => v + ' kg'); },
        () => mk('Which unit measures how much liquid a container holds?', 'Liters', ['Kilograms', 'Centimeters', 'Minutes'])
      ])();
    },
    areaSplit3() {
      return pick([
        () => { const l = R(3, 9), w = R(2, 8); return mk(`A rectangle is ${l} units long and ${w} units wide. How many unit squares cover it?`, l * w, [l + w, 2 * (l + w), l * w + l]); },
        () => { const a = R(2, 6), b = R(2, 6), h = R(2, 5); return mk(`An L-shaped room is made of a ${a} by ${h} rectangle and a ${b} by ${h} rectangle. What is its total area?`, (a + b) * h, [a * b * h, a + b + h, (a + b) * h + h], (v) => v + ' sq ft'); },
        () => { const s = R(3, 9), w = R(2, 9), p = 2 * (s + w); return mk(`A rectangle has a perimeter of ${p} cm. One side is ${s} cm. How long is the other side?`, w, [p - s, p / 2, s], (v) => v + ' cm'); },
        () => { const a = R(12, 48); let pair = []; for (let x = 2; x <= 9; x++) if (a % x === 0 && a / x <= 12 && a / x >= 2) pair.push([x, a / x]); if (!pair.length) return G.areaSplit3(); const [x, y] = pick(pair); return mk(`A rectangle has an area of ${a} square meters and a width of ${x} m. What is its length?`, y, [a - x, x * 2, y + 2], (v) => v + ' m'); }
      ])();
    },
    patterns3() {
      return pick([
        () => { const st = R(2, 9), s = R(2, 9); return mk(`What comes next? ${st}, ${st + s}, ${st + 2 * s}, ${st + 3 * s}, ?`, st + 4 * s, [st + 3 * s + 1, st + 5 * s, st + 4 * s + s - 1]); },
        () => mk('An even number times any whole number is always…', 'Even', ['Odd', 'Zero', 'A multiple of 10']),
        () => mk('An odd number plus an odd number is always…', 'Even', ['Odd', 'Zero', 'Greater than 100']),
        () => { const k = R(2, 9); return mk(`In the ×${k} table, the products go up by…`, k, [k + 1, 10, 2 * k]); },
        () => { const a = R(2, 9); return mk(`In the pattern 0, ${a}, ${2 * a}, ${3 * a}, …, which number will appear?`, a * R(5, 9), [a * 5 + 1, a * 6 - 1, a * 7 + 2]); }
      ])();
    },

    /* ───── Algebra 1 (grade 9) ───── */
    units9() {
      return pick([
        () => { const mph = pick([30, 40, 45, 50, 60]), h = pick([2, 3, 4, 1.5, 2.5]); return mk(`A car travels at ${mph} miles per hour for ${h} hours. How far does it go?`, r2(mph * h), [r2(mph / h), mph + h, r2(mph * h + mph)], (v) => v + ' miles'); },
        () => { const ft = R(2, 9); return mk(`How many inches are in ${ft} feet?`, ft * 12, [ft * 10, ft * 3, ft * 12 + 12]); },
        () => { const mpm = pick([2, 3, 4, 5, 6]); return mk(`A printer prints ${mpm} pages per second. How many pages in 1 minute?`, mpm * 60, [mpm * 100, mpm * 30, 60]); },
        () => { const c = pick([2.5, 3, 4, 1.5]), n = R(3, 8); return mk(`Apples cost $${c.toFixed(2)} per pound. How much do ${n} pounds cost?`, r2(c * n), [r2(c + n), r2(c * n + c), r2(n / c)], (v) => '$' + (Number.isInteger(v) ? v : v.toFixed(2))); },
        () => { const km = R(2, 9); return mk(`How many meters are in ${km} kilometers?`, km * 1000, [km * 100, km * 10, km * 10000]); }
      ])();
    },
    literal9() {
      return pick([
        () => ({ q: 'Solve A = lw for w.', a: 'w = A/l', w: ['w = Al', 'w = l/A', 'w = A − l'] }),
        () => ({ q: 'Solve d = rt for t.', a: 't = d/r', w: ['t = dr', 't = r/d', 't = d − r'] }),
        () => ({ q: 'Solve P = 2l + 2w for l.', a: 'l = (P − 2w)/2', w: ['l = P − 2w', 'l = (P + 2w)/2', 'l = P/2 − w/2'] }),
        () => ({ q: 'Solve y = mx + b for x.', a: 'x = (y − b)/m', w: ['x = y/m − b', 'x = (y + b)/m', 'x = m(y − b)'] }),
        () => ({ q: 'Solve F = 9C/5 + 32 for C.', a: 'C = 5(F − 32)/9', w: ['C = 9(F − 32)/5', 'C = 5F/9 − 32', 'C = (F + 32)/9'] }),
        () => ({ q: 'Solve V = πr²h for h.', a: 'h = V/(πr²)', w: ['h = Vπr²', 'h = πr²/V', 'h = V − πr²'] }),
        () => ({ q: 'Solve 3x + 2y = 12 for y.', a: 'y = 6 − 1.5x', w: ['y = 12 − 3x', 'y = 6 + 1.5x', 'y = 4 − 3x'] })
      ])();
    },
    funcNote9() {
      const m = pick([2, 3, -2, 4, 5]), b = R(-7, 9), x = R(-4, 6);
      return pick([
        () => mk(`If f(x) = ${co(m, 'x')}${tail(b)}, what is f(${neg(x)})?`, neg(m * x + b), [neg(m + x + b), neg(m * x - b), neg(m * (x + 1) + b)]),
        () => { const a = R(1, 3), c = R(-5, 5); return mk(`If g(x) = ${co(a, 'x²')}${tail(c)}, what is g(${neg(x)})?`, neg(a * x * x + c), [neg(a * 2 * x + c), neg(-a * x * x + c), neg(a * x * x - c)]); },
        () => { const y = m * x + b; return mk(`If f(x) = ${co(m, 'x')}${tail(b)}, for what x is f(x) = ${neg(y)}?`, neg(x), [neg(y), neg(x + 1), neg(-x)]); },
        () => ({ q: 'In f(3) = 10, what is the input?', a: '3', w: ['10', 'f', '13'] })
      ])();
    },
    domain9() {
      return pick([
        () => { const a = R(1, 9); return { q: `What is the domain of f(x) = 1/(x − ${a})?`, a: `All real numbers except ${a}`, w: [`All real numbers except −${a}`, 'All real numbers', `x > ${a}`] }; },
        () => { const a = R(1, 9); return { q: `What is the domain of f(x) = √(x − ${a})?`, a: `x ≥ ${a}`, w: [`x > ${a}`, `x ≤ ${a}`, 'All real numbers'] }; },
        () => { const k = R(1, 9); return { q: `What is the range of f(x) = x² + ${k}?`, a: `y ≥ ${k}`, w: [`y ≤ ${k}`, 'All real numbers', `y ≥ 0`] }; },
        () => ({ q: 'A ticket machine prints t tickets, where t is a whole number from 0 to 50. The domain is…', a: 'Whole numbers from 0 to 50', w: ['All real numbers', 'Negative numbers', 'Only 50'] }),
        () => ({ q: 'Which set of points is NOT a function?', a: '(1, 2), (1, 5), (3, 4)', w: ['(1, 2), (2, 2), (3, 2)', '(0, 1), (1, 2), (2, 3)', '(−1, 4), (0, 4), (1, 5)'] })
      ])();
    },
    writeLine9() {
      const m = pick([-3, -2, -1, 2, 3, 4]); let b = R(-6, 6); while (!b || Math.abs(b) === Math.abs(m)) b = R(-6, 6);
      const x1 = R(-3, 3), x2 = x1 + R(1, 3), L = (mm, bb) => `y = ${co(mm, 'x')}${bb ? tail(bb) : ''}`, eq = L(m, b);
      const alts = [L(-m, b), L(m, -b), L(b, m), L(m + 1, b), L(m, b + 1), L(-m, -b)];
      return pick([
        () => mk(`Which line passes through (${neg(x1)}, ${neg(m * x1 + b)}) and (${neg(x2)}, ${neg(m * x2 + b)})?`, eq, alts),
        () => mk(`A line has slope ${neg(m)} and passes through (${neg(x1)}, ${neg(m * x1 + b)}). What is its equation?`, eq, [L(m, m * x1 + b)].concat(alts)),
        () => { const p = R(1, 5); return mk(`Which line is parallel to ${eq}?`, L(m, b + p), [L(-m, b), L(m + 1, b), L(b, m), L(-m, b + p)]); },
        () => { const c = R(5, 20); let r = R(2, 9); if (r === c) r++; return mk(`A gym charges $${c} to join plus $${r} per visit. Which equation gives cost C after v visits?`, `C = ${r}v + ${c}`, [`C = ${c}v + ${r}`, `C = ${r + c}v`, `C = ${r}(v + ${c})`, `C = ${c}v`]); }
      ])();
    },
    absVal9() {
      return pick([
        () => { const a = R(1, 9), b = R(2, 9); return { q: `Solve |x − ${a}| = ${b}.`, a: `x = ${neg(a + b)} or x = ${neg(a - b)}`, w: [`x = ${neg(a + b)} only`, `x = ${neg(b - a)} or x = ${neg(-a - b)}`, `x = ${neg(a * b)}`] }; },
        () => { const b = R(1, 9); return { q: `How many solutions does |x| = −${b} have?`, a: 'No solution', w: ['One solution', 'Two solutions', 'Infinitely many'] }; },
        () => { const x = R(-9, -1); return mk(`What is |${neg(x)}|?`, String(-x), [neg(x), '0', String(-x + 1)]); },
        () => { const b = R(2, 9); return { q: `Solve |x| < ${b}.`, a: `−${b} < x < ${b}`, w: [`x < ${b}`, `x > ${b} or x < −${b}`, `x > −${b}`] }; }
      ])();
    },
    compound9() {
      const a = R(-5, 2), b = a + R(2, 8), k = R(2, 4), c = R(1, 9);
      return pick([
        () => ({ q: `Solve: ${neg(k * a + c)} < ${k}x + ${c} < ${neg(k * b + c)}`, a: `${neg(a)} < x < ${neg(b)}`, w: [`${neg(k * a)} < x < ${neg(k * b)}`, `x < ${neg(a)} or x > ${neg(b)}`, `${neg(a + c)} < x < ${neg(b + c)}`] }),
        () => mk(`Which number is a solution of x < ${neg(a)} or x > ${neg(b)}?`, neg(pick([b + 2, a - 2])), [neg(a), neg(b), neg(a + 1), neg(b - 1)]),
        () => ({ q: `Which number is a solution of ${neg(a)} ≤ x ≤ ${neg(b)}?`, a: neg(a + 1), w: [neg(a - 2), neg(b + 1), neg(b + 5)] })
      ])();
    },
    sysWord9() {
      return pick([
        () => { const ac = pick([8, 10, 12]), cc = pick([4, 5, 6]), A = R(10, 40), K = R(10, 40); return mk(`A show sold ${A + K} tickets for $${ac * A + cc * K}. Adult tickets cost $${ac} and child tickets $${cc}. How many adult tickets were sold?`, A, [K, A + 5, Math.round((A + K) / 2)]); },
        () => { const x = R(5, 30), y = R(5, 30); return mk(`Two numbers add to ${x + y} and their difference is ${Math.abs(x - y) || 2}. What is the larger number?`, x === y ? x + 1 : Math.max(x, y), [Math.min(x, y), x + y, Math.abs(x - y)]); },
        () => { const p = pick([2, 3]), q = pick([5, 6, 7]), a = R(3, 12), b = R(3, 12); return mk(`Pens cost $${p} and notebooks cost $${q}. Ana buys ${a + b} items for $${p * a + q * b}. How many notebooks did she buy?`, b, [a, b + 1, a + b - 1]); }
      ])();
    },
    polyOps9() {
      const a = R(1, 6), b = R(-6, 6), c = R(1, 6), d = R(-6, 6), e = R(-5, 5), f = R(-5, 5);
      const fmtP = (x2, x1, x0) => { const t = [[x2, 'x²'], [x1, 'x'], [x0, '']].filter(([c]) => c); if (!t.length) return '0';
        return t.map(([c, v], i) => { const abs = Math.abs(c), body = (abs === 1 && v ? '' : abs) + v; return i === 0 ? (c < 0 ? '−' : '') + body : (c < 0 ? ' − ' : ' + ') + body; }).join(''); };
      return pick([
        () => mk(`Simplify: (${fmtP(a, b, e)}) + (${fmtP(c, d, f)})`, fmtP(a + c, b + d, e + f), [fmtP(a + c, b - d, e + f), fmtP(a * c, b + d, e + f), fmtP(a + c, b + d, e - f), fmtP(a + c + 1, b + d, e + f), fmtP(a + c, b + d + 1, e + f)]),
        () => mk(`Simplify: (${fmtP(a, b, e)}) − (${fmtP(c, d, f)})`, fmtP(a - c, b - d, e - f), [fmtP(a - c, b + d, e - f), fmtP(a + c, b - d, e - f), fmtP(a - c, b - d, e + f), fmtP(a - c, b + d, e + f), fmtP(a + c, b + d, e + f)]),
        () => { const k = R(2, 5); return mk(`Simplify: ${k}(${fmtP(0, a, e)})`, fmtP(0, k * a, k * e), [fmtP(0, k * a, e), fmtP(0, a, k * e), fmtP(0, k + a, k + e)]); }
      ])();
    },
    binom9() {
      const p = R(-6, 6) || 2, q = R(-6, 6) || 3;
      const P = (x1, x0) => 'x²' + (x1 ? (x1 < 0 ? ' − ' + (x1 === -1 ? '' : -x1) + 'x' : ' + ' + (x1 === 1 ? '' : x1) + 'x') : '') + (x0 ? tail(x0) : '');
      const B = (k) => '(x' + tail(k) + ')';
      return pick([
        () => mk(`Multiply: ${B(p)}${B(q)}`, P(p + q, p * q), [P(p * q, p + q), 'x²' + tail(p * q), P(p + q, p + q)]),
        () => mk(`Multiply: ${B(p)}²`, P(2 * p, p * p), ['x²' + tail(p * p), P(p, p * p), P(2 * p, 2 * p)]),
        () => { const a = Math.abs(p) || 3; return mk(`Multiply: (x + ${a})(x − ${a})`, 'x² − ' + a * a, ['x² + ' + a * a, P(2 * a, -a * a), 'x² − ' + 2 * a]); }
      ])();
    },
    quadSolve9() {
      return pick([
        () => { let r1 = R(-6, 6), r2 = R(-6, 6); if (r1 === r2) r2 = r1 + 2; const b = -(r1 + r2), c = r1 * r2; return mk(`Solve: x²${b ? (b < 0 ? ' − ' + (b === -1 ? '' : -b) + 'x' : ' + ' + (b === 1 ? '' : b) + 'x') : ''}${c ? tail(c) : ''} = 0`, `x = ${neg(Math.min(r1, r2))} or x = ${neg(Math.max(r1, r2))}`, [`x = ${neg(-Math.max(r1, r2))} or x = ${neg(-Math.min(r1, r2))}`, `x = ${neg(Math.min(r1, r2))} only`, `x = ${neg(c)} or x = ${neg(b)}`]); },
        () => { const r = R(2, 12); return mk(`Solve: x² = ${r * r}`, `x = −${r} or x = ${r}`, [`x = ${r} only`, `x = ${r * r / 2}`, `x = −${r} only`]); },
        () => { const r = R(2, 9), k = R(1, 9); return mk(`Solve: x² − ${r * r + k} = −${k}`, `x = −${r} or x = ${r}`, [`x = ${r} only`, `x = −${r + 1} or x = ${r + 1}`, `x = ${r * r}`]); },
        () => { let s1 = R(-5, 5), s2 = R(-5, 5); if (s1 === s2) s2 = s1 + 3; const v = (s1 + s2) / 2, f = (x) => (x < 0 ? '−' : '') + Math.abs(x); return mk(`A parabola crosses the x-axis at x = ${neg(s1)} and x = ${neg(s2)}. What is the x-coordinate of its vertex?`, f(v), [f(s1 + s2), f(s1 * s2), f((s2 - s1) / 2), f(v + 1)]); }
      ])();
    },
    expGD9() {
      return pick([
        () => { const a = pick([100, 200, 500, 1000]), r = pick([2, 3]); const t = R(2, 4); return mk(`A colony starts with ${a} bacteria and multiplies by ${r} every hour. How many after ${t} hours?`, a * r ** t, [a * r * t, a + r * t, a * r ** (t - 1)]); },
        () => { const a = pick([800, 1600, 3200]), t = R(1, 3); return mk(`A ${a} mg dose is halved every 6 hours. How much remains after ${6 * t} hours?`, a / 2 ** t, [a / (2 * t), a - 6 * t, a / 2 ** (t + 1)], (v) => v + ' mg'); },
        () => { const p = pick([3, 5, 8, 10]); const f = (1 + p / 100).toFixed(2); return mk(`In y = 500(${f})ˣ, what is the growth rate per period?`, p + '%', [(p * 10) + '%', f + '%', (100 + p) + '%', '50%']); },
        () => { const p = pick([10, 20, 25]); const f = (1 - p / 100).toFixed(2); return { q: `y = 1,200(${f})ˣ models a car's value. This shows…`, a: `Decay of ${p}% per year`, w: [`Growth of ${p}% per year`, `Decay of ${f}% per year`, `Growth of ${100 - p}% per year`] }; },
        () => ({ q: 'Which equation shows exponential growth?', a: pick(['y = 3(2)ˣ', 'y = 50(1.05)ˣ']), w: ['y = 3(0.5)ˣ', 'y = 3x + 2', 'y = 2x²'] })
      ])();
    },
    stats9() {
      const n = 7, xs = Array.from({ length: n }, () => R(10, 40)).sort((a, b) => a - b);
      return pick([
        () => { const q1 = xs[1], q3 = xs[5]; return mk(`For the data ${xs.join(', ')}, the first quartile is ${q1} and the third quartile is ${q3}. What is the interquartile range?`, q3 - q1, [xs[6] - xs[0], q3 + q1, xs[3]]); },
        () => ({ q: 'Data set A: 10, 10, 10, 10. Data set B: 1, 5, 15, 19. Which has the larger standard deviation?', a: 'Set B', w: ['Set A', 'They are equal', 'You can\'t tell'] }),
        () => ({ q: 'If you add 5 to every value in a data set, the standard deviation…', a: 'Stays the same', w: ['Increases by 5', 'Doubles', 'Decreases by 5'] }),
        () => ({ q: 'A random sample of 400 voters shows 52% support, with a margin of error of 3%. Which is a reasonable conclusion?', a: 'True support is likely between 49% and 55%', w: ['Exactly 52% of all voters support it', 'Support is definitely over 50%', 'The poll is useless'] }),
        () => ({ q: 'A study surveys only people at a gym about exercise habits. The biggest problem is…', a: 'The sample isn\'t representative', w: ['The sample is too random', 'Gyms have too many people', 'Surveys can\'t ask questions'] }),
        () => mk(`In a box plot of ${xs.join(', ')}, what value is the line inside the box (the median)?`, xs[3], [xs[2], xs[4], Math.round(xs.reduce((a, b) => a + b, 0) / n) === xs[3] ? xs[3] + 1 : Math.round(xs.reduce((a, b) => a + b, 0) / n)])
      ])();
    }
  });
})();
