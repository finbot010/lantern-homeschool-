/* Lantern Homeschool — quiz problem generators.
   Each generator returns { q: question, a: correct answer (string), w: [three wrong answers] }. */
(function () {
  const R = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : n + '/' + d; };
  const r2 = (x) => Math.round(x * 100) / 100;
  const fmt = (x) => { const v = r2(x); return Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/0$/, ''); };
  const neg = (x) => (x < 0 ? '−' + Math.abs(x) : String(x));
  const sup = (n) => String(n).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'['0123456789'.indexOf(c)] || (c === '-' ? '⁻' : c)).join('');

  // Build three unique numeric distractors near the answer.
  function near(ans, spread, opts) {
    opts = opts || {};
    const out = new Set();
    const offs = opts.offs || [1, -1, 2, -2, spread, -spread, 10, -10, 3, -3, 5, -5];
    let guard = 0;
    while (out.size < 3 && guard++ < 80) {
      let v = ans + pick(offs) * (Math.random() < 0.5 ? 1 : 1);
      if (opts.min !== undefined && v < opts.min) continue;
      if (v === ans) continue;
      out.add(opts.f ? opts.f(v) : fmt(v));
    }
    let k = 4; while (out.size < 3) out.add(opts.f ? opts.f(ans + k) : fmt(ans + k++));
    return [...out];
  }
  const N = (q, ans, spread, o) => ({ q, a: (o && o.f) ? o.f(ans) : fmt(ans), w: near(ans, spread || 2, o) });
  // Nudge the last number in an answer to make an extra plausible wrong choice.
  function bump(a, d) {
    const supD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    if (/\d/.test(a)) { const m = a.match(/(\d+)(?!.*\d)/); const v = Number(m[1]) + d; if (v < 0) return null; return a.slice(0, m.index) + v + a.slice(m.index + m[1].length); }
    const m = a.match(/([⁰¹²³⁴⁵⁶⁷⁸⁹]+)(?!.*[⁰¹²³⁴⁵⁶⁷⁸⁹])/); if (!m) return null;
    const n = Number(m[1].split('').map((c) => supD.indexOf(c)).join('')) + d; if (n < 0) return null;
    return a.slice(0, m.index) + String(n).split('').map((c) => supD[+c]).join('') + a.slice(m.index + m[1].length);
  }
  const S = (q, a, w) => {
    const out = [...new Set(w.filter((x) => x && x !== a))];
    for (const d of [1, 2, -1, 3, -2, 4]) { if (out.length >= 3) break; const b = bump(a, d); if (b && b !== a && !out.includes(b)) out.push(b); }
    return { q, a, w: out.slice(0, 3) };
  };

  const G = {
    /* Grade 1 */
    placeValue1() { const t = R(1, 11), o = R(0, 9), n = t * 10 + o; return Math.random() < 0.5 ? N(`How many tens are in ${n}?`, t, 1, { min: 0 }) : N(`What number has ${t} tens and ${o} ones?`, n, 10, { min: 0, offs: [1, -1, 10, -10, 9] }); },
    add20() { const a = R(2, 12), b = R(1, 20 - a); return N(`${a} + ${b} = ?`, a + b, 1, { min: 0 }); },
    sub20() { const a = R(6, 20), b = R(1, a - 1); return N(`${a} − ${b} = ?`, a - b, 1, { min: 0 }); },
    compare1() { const a = R(10, 99); let b = R(10, 99); while (b === a) b = R(10, 99); const big = Math.max(a, b); return S(`Which number is greater: ${a} or ${b}?`, String(big), [String(Math.min(a, b)), 'They are equal', String(big + 11)]); },
    time1() { const h = R(1, 11), half = Math.random() < 0.5; const t = `${h}:${half ? '30' : '00'}`; const next = `${h + 1}:${half ? '30' : '00'}`; return S(`It is ${t}. What time will it be in 1 hour?`, next, [`${h}:${half ? '00' : '30'}`, `${h + 2}:${half ? '30' : '00'}`, `${h === 1 ? 12 : h - 1}:${half ? '30' : '00'}`]); },
    /* Grade 2 */
    addsub100() { if (Math.random() < 0.5) { const a = R(11, 60), b = R(11, 39); return N(`${a} + ${b} = ?`, a + b, 10, { min: 0 }); } const a = R(30, 99), b = R(11, a - 5); return N(`${a} − ${b} = ?`, a - b, 10, { min: 0 }); },
    placeValue2() { const h = R(1, 9), t = R(0, 9), o = R(0, 9), n = h * 100 + t * 10 + o; return pick([() => N(`What is the value of the digit ${h} in ${n}?`, h * 100, 0, { offs: [h * 10 - h * 100, h - h * 100, 100, -100].filter((x) => h * 100 + x > 0) }), () => S(`What is ${h * 100} + ${t * 10} + ${o}?`, String(n), [String(h * 100 + o * 10 + t), String(h * 10 + t * 100 + o), String(n + 100)])])(); },
    skipCount() { const step = pick([2, 5, 10, 100]); const s = step * R(1, 9); const seq = [s, s + step, s + 2 * step]; return N(`Skip count by ${step}s: ${seq.join(', ')}, ?`, s + 3 * step, step, { offs: [1, -1, step, -step, 2 * step], min: 0 }); },
    money() { const q = R(0, 3), d = R(0, 4), n = R(0, 3), p = R(0, 4); const total = q * 25 + d * 10 + n * 5 + p; if (!total) return G.money(); const parts = []; if (q) parts.push(`${q} quarter${q > 1 ? 's' : ''}`); if (d) parts.push(`${d} dime${d > 1 ? 's' : ''}`); if (n) parts.push(`${n} nickel${n > 1 ? 's' : ''}`); if (p) parts.push(`${p} penn${p > 1 ? 'ies' : 'y'}`); return N(`How many cents is ${parts.join(', ')}?`, total, 5, { min: 1, f: (v) => v + '¢' }); },
    oddEven() { const n = R(10, 999); return S(`Is ${n} odd or even?`, n % 2 ? 'Odd' : 'Even', [n % 2 ? 'Even' : 'Odd', 'Both', 'Neither']); },
    /* Grade 3 */
    mult10() { const a = R(2, 10), b = R(2, 10); return N(`${a} × ${b} = ?`, a * b, a, { min: 0, offs: [a, -a, b, -b, 1, -1] }); },
    div10() { const a = R(2, 10), b = R(2, 10); return N(`${a * b} ÷ ${a} = ?`, b, 1, { min: 1 }); },
    round() { if (Math.random() < 0.5) { const n = R(11, 989); const r = Math.round(n / 10) * 10; return N(`Round ${n} to the nearest ten.`, r, 10, { offs: [10, -10, 100], min: 0 }); } const n = R(101, 989); const r = Math.round(n / 100) * 100; return N(`Round ${n} to the nearest hundred.`, r, 100, { offs: [100, -100, 10], min: 0 }); },
    fracCompare() { let a = R(2, 8), b = R(2, 8); while (b === a) b = R(2, 8); return S(`Which fraction is greater: 1/${a} or 1/${b}?`, `1/${Math.min(a, b)}`, [`1/${Math.max(a, b)}`, 'They are equal', `1/${a + b}`]); },
    areaPerim() { const l = R(2, 12), w = R(2, 9); return Math.random() < 0.5 ? N(`A rectangle is ${l} ft long and ${w} ft wide. What is its area in square feet?`, l * w, l, { offs: [l + w - l * w, 2 * (l + w) - l * w, 1, -1, w] }) : N(`A rectangle is ${l} cm long and ${w} cm wide. What is its perimeter in cm?`, 2 * (l + w), 2, { offs: [l * w - 2 * (l + w), -(l + w), 2, -2] }); },
    /* Grade 4 */
    multMulti() { if (Math.random() < 0.5) { const a = R(12, 99), b = R(3, 9); return N(`${a} × ${b} = ?`, a * b, 10, { offs: [10, -10, b, -b, 100] }); } const a = R(11, 49), b = R(11, 39); return N(`${a} × ${b} = ?`, a * b, 10, { offs: [10, -10, a, -a, 100, -100] }); },
    divRem() { const d = R(3, 9), q = R(4, 12), r = R(1, d - 1), n = d * q + r; return S(`${n} ÷ ${d} = ?`, `${q} R${r}`, [`${q} R${r + 1 < d ? r + 1 : r - 1}`, `${q + 1} R${r}`, `${q - 1} R${r}`]); },
    equivFrac() { const n = R(1, 5), d = R(n + 1, 9), k = R(2, 5); return N(`${n}/${d} = ?/${d * k}`, n * k, 1, { min: 1, offs: [1, -1, k, -k, d] }); },
    decCompare() { const a = R(1, 99) / 100; let b = R(1, 9) / 10; if (a === b) b += 0.1; return S(`Which is greater: ${a.toFixed(2)} or ${b.toFixed(1)}?`, a > b ? a.toFixed(2) : b.toFixed(1), [a > b ? b.toFixed(1) : a.toFixed(2), 'They are equal', (Math.min(a, b) / 10).toFixed(3)]); },
    angles() { const a = R(20, 160); return N(`Two angles form a straight line. One is ${a}°. What is the other?`, 180 - a, 10, { f: (v) => v + '°', offs: [10, -10, 90 - (180 - a), 180 - (180 - a) * 2, 5] }); },
    /* Grade 5 */
    decAdd() { const a = R(100, 999) / 100, b = R(10, 99) / 10; return Math.random() < 0.5 ? N(`${a.toFixed(2)} + ${b.toFixed(1)} = ?`, a + b, 0.1, { offs: [0.1, -0.1, 1, -1, 0.01] }) : N(`${(a + b).toFixed(2)} − ${b.toFixed(1)} = ?`, a, 0.1, { offs: [0.1, -0.1, 1, -1, 0.01] }); },
    fracAdd() { const d1 = pick([2, 3, 4, 5, 6]); let d2 = pick([3, 4, 5, 6, 8]); if (d2 === d1) d2 = d1 * 2; const n1 = R(1, d1 - 1), n2 = R(1, d2 - 1); const a = fr(n1 * d2 + n2 * d1, d1 * d2); return S(`${n1}/${d1} + ${n2}/${d2} = ?`, a, [fr(n1 + n2, d1 + d2), fr(n1 * d2 + n2 * d1 + d1, d1 * d2), fr(n1 + n2, d1 * d2)]); },
    fracMult() { const n1 = R(1, 4), d1 = R(n1 + 1, 6), n2 = R(1, 4), d2 = R(n2 + 1, 8); return S(`${n1}/${d1} × ${n2}/${d2} = ?`, fr(n1 * n2, d1 * d2), [fr(n1 + n2, d1 + d2), fr(n1 * d2, d1 * n2), fr(n1 * n2 + 1, d1 * d2)]); },
    volume() { const l = R(2, 10), w = R(2, 8), h = R(2, 6); return N(`A box is ${l} in × ${w} in × ${h} in. What is its volume in cubic inches?`, l * w * h, l, { offs: [l, -l, w * h, l * w + w * h + l * h - l * w * h] }); },
    orderOps() { const a = R(2, 9), b = R(2, 9), c = R(2, 6); return pick([() => N(`${a} + ${b} × ${c} = ?`, a + b * c, 1, { offs: [(a + b) * c - (a + b * c), 1, -1, c] }), () => N(`(${a} + ${b}) × ${c} = ?`, (a + b) * c, 1, { offs: [a + b * c - (a + b) * c, 1, -1, c] }), () => N(`${a * c} ÷ ${c} + ${b} = ?`, a + b, 1, { offs: [1, -1, 2, b] })])(); },
    /* Grade 6 */
    ratio() { const a = R(2, 7), b = R(2, 9), k = R(2, 6); return N(`The ratio of red to blue marbles is ${a}:${b}. If there are ${a * k} red marbles, how many blue marbles are there?`, b * k, k, { min: 1, offs: [k, -k, a, b - b * k + a * k] }); },
    percentOf() { const p = pick([10, 20, 25, 30, 40, 50, 75]), n = pick([20, 40, 60, 80, 120, 200, 360]); return N(`What is ${p}% of ${n}?`, (p * n) / 100, 5, { offs: [5, -5, 10, -10, n / 10] }); },
    intAdd() { const a = R(-12, 12), b = R(-12, 12); return N(`${neg(a)} + (${neg(b)}) = ?`, a + b, 2, { f: neg, offs: [2, -2, -2 * b, 1, -1, -2 * a] }); },
    oneStep() { const x = R(2, 15), k = R(2, 9); return pick([() => N(`Solve: x + ${k} = ${x + k}`, x, 1, { f: (v) => 'x = ' + v, offs: [2 * k, k, 1, -1] }), () => N(`Solve: ${k}x = ${k * x}`, x, 1, { f: (v) => 'x = ' + v, offs: [k * x - x, 1, -1, k] })])(); },
    triAreaMean() { if (Math.random() < 0.5) { const b = 2 * R(2, 9), h = R(3, 12); return N(`A triangle has base ${b} m and height ${h} m. What is its area in square meters?`, (b * h) / 2, 2, { offs: [(b * h) / 2, 1, -1, h] }); } const n = [R(2, 20), R(2, 20), R(2, 20)]; const s = n[0] + n[1] + n[2]; n[2] += (3 - (s % 3)) % 3; const m = (n[0] + n[1] + n[2]) / 3; return N(`What is the mean of ${n.join(', ')}?`, m, 1, { offs: [1, -1, 2, -2, 3] }); },
    /* Grade 7 */
    unitRate() { const u = pick([1.25, 1.5, 2, 2.5, 3, 3.75, 4.5]), n = R(2, 8); return N(`${n} notebooks cost $${(u * n).toFixed(2)}. What is the cost per notebook?`, u, 0.25, { f: (v) => '$' + v.toFixed(2), offs: [0.25, -0.25, 0.5, 1] }); },
    intMult() { const a = R(-12, 12) || 3, b = R(-9, 9) || -4; return Math.random() < 0.6 ? N(`${neg(a)} × (${neg(b)}) = ?`, a * b, 1, { f: neg, offs: [-2 * a * b, a, -a, 1] }) : N(`${neg(a * b)} ÷ (${neg(b)}) = ?`, a, 1, { f: neg, offs: [-2 * a, 1, -1, 2] }); },
    twoStep() { const x = R(-6, 12), a = R(2, 9), b = R(-15, 15); return N(`Solve: ${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${neg(a * x + b)}`, x, 1, { f: (v) => 'x = ' + neg(v), offs: [1, -1, 2, -2 * x, b] }); },
    circle() { const r = R(2, 12); return Math.random() < 0.5 ? N(`A circle has radius ${r} cm. What is its area? (Use π ≈ 3.14)`, 3.14 * r * r, 1, { f: (v) => fmt(v) + ' cm²', offs: [2 * 3.14 * r - 3.14 * r * r, 3.14 * r - 3.14 * r * r, 3.14 * 4 * r * r - 3.14 * r * r] }) : N(`A circle has radius ${r} in. What is its circumference? (Use π ≈ 3.14)`, 2 * 3.14 * r, 1, { f: (v) => fmt(v) + ' in', offs: [3.14 * r * r - 2 * 3.14 * r, -3.14 * r, 3.14] }); },
    probability() { const red = R(1, 6), blue = R(1, 6), green = R(1, 5), t = red + blue + green; return S(`A bag has ${red} red, ${blue} blue and ${green} green marbles. What is the probability of picking a red marble?`, fr(red, t), [fr(red, t - red), fr(blue, t), fr(1, 3) === fr(red, t) ? fr(green, t) : fr(1, 3)]); },
    /* Grade 8 / Algebra 1 */
    multiStep() { const x = R(-5, 10), a = R(2, 6), b = R(1, 9), c = R(1, a - 1 || 1), d = a * (x + b) - c * x; return N(`Solve: ${a}(x + ${b}) = ${c}x ${d < 0 ? '−' : '+'} ${Math.abs(d)}`, x, 1, { f: (v) => 'x = ' + neg(v), offs: [1, -1, 2, -2, b] }); },
    slope() { const x1 = R(-5, 5), y1 = R(-5, 5); let dx = R(1, 6) * pick([1, -1]); const m = pick([-3, -2, -1, 1, 2, 3, 0.5, -0.5]); if (!Number.isInteger(m * dx)) dx *= 2; const x2 = x1 + dx, y2 = y1 + m * dx; return S(`What is the slope of the line through (${neg(x1)}, ${neg(y1)}) and (${neg(x2)}, ${neg(y2)})?`, Number.isInteger(m) ? neg(m) : (m < 0 ? '−1/2' : '1/2'), [Number.isInteger(m) ? neg(-m) : (m < 0 ? '1/2' : '−1/2'), Number.isInteger(m) ? (Math.abs(m) === 1 ? neg(2 * m) : (m < 0 ? '−1/' : '1/') + Math.abs(m)) : (m < 0 ? '−2' : '2'), neg(Math.round(m * dx) || 3)]); },
    pythag() { const t = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25]]); return Math.random() < 0.6 ? N(`A right triangle has legs ${t[0]} and ${t[1]}. How long is the hypotenuse?`, t[2], 1, { offs: [t[0] + t[1] - t[2], 1, -1, 2] }) : N(`A right triangle has a leg of ${t[0]} and hypotenuse ${t[2]}. How long is the other leg?`, t[1], 1, { offs: [t[2] + t[0] - t[1], 1, -1, 2] }); },
    expSci() { if (Math.random() < 0.5) { const b = R(2, 9), m = R(2, 6), n = R(2, 6); return S(`Simplify: ${b}${sup(m)} × ${b}${sup(n)}`, `${b}${sup(m + n)}`, [`${b}${sup(m * n)}`, `${b * b}${sup(m + n)}`, `${b}${sup(Math.abs(m - n) || 1)}`]); } const c = R(11, 99) / 10, e = R(3, 8); const val = Math.round(c * Math.pow(10, e)); return S(`Write ${val.toLocaleString('en-US')} in scientific notation.`, `${c} × 10${sup(e)}`, [`${c} × 10${sup(e - 1)}`, `${c} × 10${sup(e + 1)}`, `${Math.round(c * 10)} × 10${sup(e)}`]); },
    system() { const x = R(-4, 8), y = R(-4, 8); const a = R(1, 3), b = R(1, 3); return S(`Solve the system: x + y = ${neg(x + y)} and ${a}x − ${b}y = ${neg(a * x - b * y)}`, `(${neg(x)}, ${neg(y)})`, [`(${neg(y)}, ${neg(x)})`, `(${neg(x + 1)}, ${neg(y - 1)})`, `(${neg(-x)}, ${neg(y)})`]); },
    evalLinear() { const m = R(-5, 6) || 2, b = R(-9, 9), x = R(-4, 6); return N(`If y = ${neg(m)}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}, what is y when x = ${neg(x)}?`, m * x + b, 1, { f: neg, offs: [1, -1, -2 * b, m, -m] }); },
    expRules() { const b = pick(['x', 'a', 'y']), m = R(2, 8), n = R(2, 5); return pick([() => S(`Simplify: ${b}${sup(m)} · ${b}${sup(n)}`, `${b}${sup(m + n)}`, [`${b}${sup(m * n)}`, `${b}${sup(m - n)}`, `2${b}${sup(m + n)}`]), () => S(`Simplify: (${b}${sup(m)})${sup(n)}`, `${b}${sup(m * n)}`, [`${b}${sup(m + n)}`, `${b}${sup(m)}`, `${n}${b}${sup(m)}`]), () => S(`Simplify: ${b}${sup(m + n)} ÷ ${b}${sup(n)}`, `${b}${sup(m)}`, [`${b}${sup(m + 2 * n)}`, `${b}${sup(n)}`, `${b}${sup(m * n)}`]), () => S(`What is 7⁰?`, '1', ['0', '7', '70'])])(); },
    factorQuad() { let p = R(-7, 7) || 2, q = R(-7, 7) || -3; const b = p + q, c = p * q; const term = (v) => (v < 0 ? ` − ${Math.abs(v)}` : ` + ${v}`); const sol = (a, b2) => `x = ${neg(a)} or x = ${neg(b2)}`; return S(`Solve: x²${b ? term(b) + 'x' : ''}${c ? term(c) : ''} = 0`, sol(-p, -q), [sol(p, q), sol(-p, q), sol(p + 1, q - 1)]); },
    /* Geometry */
    triAngle() { const a = R(25, 90), b = R(20, 160 - a); return N(`A triangle has angles of ${a}° and ${b}°. What is the third angle?`, 180 - a - b, 5, { f: (v) => v + '°', offs: [5, -5, 10, 360 - a - b - (180 - a - b)] }); },
    distance() { const t = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]]); const x1 = R(-4, 4), y1 = R(-4, 4); return N(`What is the distance between (${neg(x1)}, ${neg(y1)}) and (${neg(x1 + t[0])}, ${neg(y1 + t[1])})?`, t[2], 1, { offs: [t[0] + t[1] - t[2], 1, -1, 2] }); },
    similar() { const a = R(3, 9), b = R(4, 12), k = R(2, 4); return N(`Two triangles are similar. A side of ${a} cm matches a side of ${a * k} cm. Another side of the small triangle is ${b} cm. How long is the matching side of the large triangle?`, b * k, k, { f: (v) => v + ' cm', offs: [a * k - a, k, -k, b] }); },
    trig() { const t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]); const f = pick(['sin', 'cos', 'tan']); const ans = f === 'sin' ? `${t[0]}/${t[2]}` : f === 'cos' ? `${t[1]}/${t[2]}` : `${t[0]}/${t[1]}`; return S(`In a right triangle, angle A is opposite a side of ${t[0]}, the adjacent leg is ${t[1]} and the hypotenuse is ${t[2]}. What is ${f} A?`, ans, [`${t[0]}/${t[2]}`, `${t[1]}/${t[2]}`, `${t[0]}/${t[1]}`, `${t[1]}/${t[0]}`, `${t[2]}/${t[0]}`]); },
    /* Chemistry */
    balance() { return pick([
      () => S('Balance: __H₂ + O₂ → 2H₂O. What coefficient goes in front of H₂?', '2', ['1', '3', '4']),
      () => S('Balance: CH₄ + __O₂ → CO₂ + 2H₂O. What coefficient goes in front of O₂?', '2', ['1', '3', '4']),
      () => S('Balance: N₂ + __H₂ → 2NH₃. What coefficient goes in front of H₂?', '3', ['1', '2', '6']),
      () => S('Balance: 2Na + Cl₂ → __NaCl. What coefficient goes in front of NaCl?', '2', ['1', '3', '4']),
      () => S('Balance: __Fe + 3O₂ → 2Fe₂O₃. What coefficient goes in front of Fe?', '4', ['2', '3', '6']),
      () => S('Balance: C₃H₈ + __O₂ → 3CO₂ + 4H₂O. What coefficient goes in front of O₂?', '5', ['3', '4', '10'])])(); },
    moles() { const s = pick([['water (H₂O, 18 g/mol)', 18], ['carbon dioxide (CO₂, 44 g/mol)', 44], ['sodium chloride (NaCl, 58.5 g/mol)', 58.5], ['oxygen gas (O₂, 32 g/mol)', 32]]); const n = pick([0.5, 1, 2, 3, 4]); return N(`How many moles are in ${fmt(s[1] * n)} g of ${s[0]}?`, n, 1, { f: (v) => fmt(v) + ' mol', offs: [1, -0.5, 0.5, 2], min: 0.25 }); },
    /* Algebra 2 */
    discriminant() { const a = R(1, 3), b = R(-8, 8), c = R(-6, 9); const D = b * b - 4 * a * c; const ans = D > 0 ? '2 real solutions' : D === 0 ? '1 real solution' : '0 real solutions'; const tm = (v, x) => (v ? (v < 0 ? ` − ${Math.abs(v)}${x}` : ` + ${v}${x}`) : ''); return S(`How many real solutions does ${a === 1 ? '' : a}x²${tm(b, 'x')}${tm(c, '')} = 0 have?`, ans, ['2 real solutions', '1 real solution', '0 real solutions', '3 real solutions']); },
    polyEval() { const a = R(1, 3), b = R(-5, 5), c = R(-9, 9), x = R(-3, 3); const v = a * x * x * x + b * x + c; const tm = (k, s) => (k ? (k < 0 ? ` − ${Math.abs(k)}${s}` : ` + ${k}${s}`) : ''); return N(`If f(x) = ${a === 1 ? '' : a}x³${tm(b, 'x')}${tm(c, '')}, what is f(${neg(x)})?`, v, 2, { f: neg, offs: [2, -2, -2 * c, 2 * b * x, 1] }); },
    expGrowth() { const p = pick([50, 100, 200, 500]), n = R(2, 6); return N(`A population of ${p} bacteria doubles every hour. How many are there after ${n} hours?`, p * Math.pow(2, n), p, { offs: [p * Math.pow(2, n - 1), -p * Math.pow(2, n - 1), p * n * 2 - p * Math.pow(2, n), p] }); },
    logEval() { const b = pick([2, 3, 5, 10]), k = R(1, b === 10 ? 5 : 5); const val = Math.pow(b, k); return Math.random() < 0.5 ? N(`What is log${'₀₁₂₃₄₅₆₇₈₉'[b] && b < 10 ? '₀₁₂₃₄₅₆₇₈₉'[b] : '₁₀'} ${val.toLocaleString('en-US')}?`, k, 1, { offs: [1, -1, 2, val / b - k], min: 0 }) : N(`Solve: ${b}ˣ = ${val.toLocaleString('en-US')}`, k, 1, { f: (v) => 'x = ' + v, offs: [1, -1, 2], min: 0 }); },
    complexI() { const n = R(5, 40); const map = ['1', 'i', '−1', '−i']; return S(`Simplify i${sup(n)}.`, map[n % 4], map.filter((_, i) => i !== n % 4)); },
    /* Physics */
    kinematics() { return pick([() => { const d = R(20, 200), t = R(2, 20); return N(`A cyclist travels ${d * t} m in ${t} s. What is the average speed?`, d, 5, { f: (v) => v + ' m/s', offs: [5, -5, 10, d * t - d - t] }); }, () => { const a = R(2, 6), t = R(2, 8); return N(`A car accelerates from rest at ${a} m/s² for ${t} s. How far does it travel? (d = ½at²)`, 0.5 * a * t * t, 2, { f: (v) => fmt(v) + ' m', offs: [0.5 * a * t * t, a * t - 0.5 * a * t * t, 2, -2] }); }, () => { const v1 = R(0, 10), v2 = v1 + R(4, 30), t = R(2, 4); return N(`A runner speeds up from ${v1} m/s to ${v2} m/s in ${t} s. What is the acceleration?`, (v2 - v1) / t, 1, { f: (v) => fmt(v) + ' m/s²', offs: [1, -1, v2 / t - (v2 - v1) / t + 0.5, 2] }); }])(); },
    forceFma() { return Math.random() < 0.5 ? (() => { const m = R(2, 50), a = R(1, 10); return N(`What net force accelerates a ${m} kg object at ${a} m/s²?`, m * a, 5, { f: (v) => v + ' N', offs: [m + a - m * a, 5, -5, 10] }); })() : (() => { const m = R(2, 80); return N(`What is the weight of a ${m} kg object on Earth? (g = 9.8 m/s²)`, m * 9.8, 9.8, { f: (v) => fmt(v) + ' N', offs: [m - m * 9.8, 9.8, -9.8, 1] }); })(); },
    energy() { return pick([() => { const m = R(1, 20), v = R(2, 12); return N(`What is the kinetic energy of a ${m} kg object moving at ${v} m/s? (KE = ½mv²)`, 0.5 * m * v * v, 10, { f: (x) => fmt(x) + ' J', offs: [0.5 * m * v * v, m * v - 0.5 * m * v * v, 10, -10] }); }, () => { const m = R(1, 20), h = R(2, 20); return N(`What is the potential energy of a ${m} kg object ${h} m high? (PE = mgh, g = 9.8)`, m * 9.8 * h, 10, { f: (x) => fmt(x) + ' J', offs: [m * h - m * 9.8 * h, 9.8, -9.8, 98] }); }, () => { const m = R(1, 20), v = R(2, 15); return N(`What is the momentum of a ${m} kg object moving at ${v} m/s?`, m * v, 5, { f: (x) => x + ' kg·m/s', offs: [0.5 * m * v * v - m * v, 5, -5, m] }); }])(); },
    waves() { if (Math.random() < 0.5) { const f = pick([100, 200, 250, 440, 500]), l = pick([0.5, 1, 1.5, 2]); return N(`A wave has frequency ${f} Hz and wavelength ${l} m. What is its speed?`, f * l, 50, { f: (v) => fmt(v) + ' m/s', offs: [f / l - f * l, 50, -50, 100] }); } const t = R(2, 9); return N(`Thunder arrives ${t} s after lightning. About how far away was the strike? (sound ≈ 343 m/s)`, 343 * t, 343, { f: (v) => v.toLocaleString('en-US') + ' m', offs: [343, -343, 100, -100] }); },
    ohm() { const I = pick([0.5, 1, 1.5, 2, 3, 4]), Rr = pick([2, 4, 5, 6, 10, 12, 20]); return pick([() => N(`A ${Rr} Ω resistor carries ${I} A. What is the voltage across it?`, I * Rr, 2, { f: (v) => fmt(v) + ' V', offs: [Rr / I - I * Rr, 2, -2, 1] }), () => N(`A ${fmt(I * Rr)} V battery is connected to a ${Rr} Ω resistor. What is the current?`, I, 0.5, { f: (v) => fmt(v) + ' A', offs: [0.5, -0.5, 1, Rr], min: 0.25 }), () => N(`A device draws ${I} A at ${fmt(I * Rr)} V. What is its power?`, I * I * Rr, 2, { f: (v) => fmt(v) + ' W', offs: [I * Rr - I * I * Rr + 1, 2, -2, I] })])(); },
    /* Precalculus */
    compose() { const a = R(2, 5), b = R(-5, 5), x = R(-3, 4); const g = x * x, f = a * g + b; return N(`If f(x) = ${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} and g(x) = x², what is f(g(${neg(x)}))?`, f, 2, { f: neg, offs: [(a * x + b) * (a * x + b) - f, 2, -2, a] }); },
    radDeg() { const pairs = [[30, 'π/6'], [45, 'π/4'], [60, 'π/3'], [90, 'π/2'], [120, '2π/3'], [135, '3π/4'], [150, '5π/6'], [180, 'π'], [270, '3π/2'], [360, '2π']]; const p = pick(pairs); const others = pairs.filter((x) => x !== p); if (Math.random() < 0.5) { return S(`Convert ${p[0]}° to radians.`, p[1], [pick(others)[1], pick(others)[1], pick(others)[1], pick(others)[1], pick(others)[1]]); } return S(`Convert ${p[1]} radians to degrees.`, p[0] + '°', [pick(others)[0] + '°', pick(others)[0] + '°', pick(others)[0] + '°', pick(others)[0] + '°', pick(others)[0] + '°']); },
    unitCircle() { const t = pick([['sin 30°', '1/2'], ['cos 30°', '√3/2'], ['sin 45°', '√2/2'], ['cos 60°', '1/2'], ['sin 60°', '√3/2'], ['sin 90°', '1'], ['cos 90°', '0'], ['cos 180°', '−1'], ['sin 150°', '1/2'], ['cos 120°', '−1/2'], ['tan 45°', '1'], ['sin 270°', '−1']]); return S(`What is ${t[0]}?`, t[1], ['1/2', '√3/2', '√2/2', '1', '0', '−1', '−1/2', '√3']); },
    sequence() { if (Math.random() < 0.5) { const a = R(-5, 10), d = R(2, 7), n = R(8, 25); return N(`An arithmetic sequence starts ${a}, ${a + d}, ${a + 2 * d}, … What is term ${n}?`, a + (n - 1) * d, d, { f: neg, offs: [d, -d, 2 * d] }); } const a = R(1, 4), r = pick([2, 3]), n = R(4, 7); return N(`A geometric sequence starts ${a}, ${a * r}, ${a * r * r}, … What is term ${n}?`, a * Math.pow(r, n - 1), a, { offs: [a * Math.pow(r, n) - a * Math.pow(r, n - 1), a * Math.pow(r, n - 2) - a * Math.pow(r, n - 1), a] }); },
    compound() { const P = pick([500, 1000, 2000, 5000]), r = pick([0.04, 0.05, 0.06, 0.08]), t = pick([2, 3, 5, 10]); const A = P * Math.pow(1 + r, t); const simple = P * (1 + r * t); const f = (v) => '$' + Math.round(v).toLocaleString('en-US'); return S(`You invest ${f(P)} at ${Math.round(r * 100)}% interest, compounded yearly. About how much will you have after ${t} years?`, f(A), [f(simple), f(P * r * t), f(A + P * r)]); }
  };

  window.LH_GEN = G;
})();
