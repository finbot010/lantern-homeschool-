/* Lantern Homeschool — problem generators for the expanded 2nd and 8th grade math courses.
   Each returns { q, a, w: [three wrong answers] }. Every call makes a new problem, so retakes never repeat. */
(function () {
  const G = window.LH_GEN;
  const R = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const neg = (x) => (x < 0 ? '−' + Math.abs(x) : String(x));
  const r2 = (x) => Math.round(x * 100) / 100;
  const f = (x) => { const v = r2(x); return Number.isInteger(v) ? String(v) : String(v); };
  // q, correct answer, candidate wrong answers; fills to 3 unique wrongs with nearby numbers when needed
  function mk(q, a, wrongs, fmt) {
    fmt = fmt || ((x) => String(x)); const A = typeof a === 'string' ? a : fmt(a), out = [];
    for (const w of wrongs) { const s = typeof w === 'string' ? w : fmt(w); if (s !== A && !out.includes(s) && !/NaN|Infinity/.test(s)) out.push(s); if (out.length === 3) break; }
    if (typeof a === 'number') for (const d of [1, -1, 2, -2, 3, 5, 10, -10]) { if (out.length >= 3) break; const s = fmt(a + d); if (s !== A && !out.includes(s) && (a + d >= 0 || a < 0)) out.push(s); }
    else { const m = A.match(/(\d+)(?!.*\d)/); if (m) for (const d of [5, 10, -5, 1, 2, -1, 20]) { if (out.length >= 3) break; const v = Number(m[1]) + d; if (v < 0) continue; const s = A.slice(0, m.index) + v + A.slice(m.index + m[1].length); if (s !== A && !out.includes(s)) out.push(s); } }
    return { q, a: A, w: out.slice(0, 3) };
  }
  const usd = (v) => '$' + (Number.isInteger(r2(v)) ? String(r2(v)) : r2(v).toFixed(2));
  const names = ['Mia', 'Leo', 'Ana', 'Sam', 'Luis', 'Zoe', 'Eli', 'Rosa', 'Ben', 'Ivy'];

  Object.assign(G, {
    /* ───── Grade 2 ───── */
    fact20() { // fluency with strategies: make ten, doubles, missing addend
      return pick([
        () => { const a = R(6, 9), b = R(10 - a + 1, 9); return mk(`${a} + ${b} = ?`, a + b, [a + b - 1, a + b + 1, a + b - 10]); },
        () => { const a = R(3, 9); return mk(`Double ${a}: ${a} + ${a} = ?`, 2 * a, [2 * a + 1, 2 * a - 1, a + 2]); },
        () => { const t = R(11, 18), b = R(3, 9); return mk(`${t} − ${b} = ?`, t - b, [t - b + 1, t - b - 1, t + b - 10]); },
        () => { const t = R(10, 18), a = R(2, t - 2); return mk(`${a} + ? = ${t}`, t - a, [t - a + 1, t - a - 1, t + a]); }
      ])();
    },
    compare3() {
      const a = R(100, 999); let b = pick([a + pick([9, 90, -9, -90, 1, -1]), R(100, 999), Number(String(a).split('').reverse().join(''))]);
      if (b < 100 || b > 999) b = a + 1; const sym = a > b ? '>' : a < b ? '<' : '=';
      return { q: `Which symbol makes this true?  ${a} ☐ ${b}`, a: sym, w: ['>', '<', '='].filter((x) => x !== sym).concat(['You can\'t tell']).slice(0, 3) };
    },
    word2() {
      const n = pick(names);
      return pick([
        () => { const a = R(15, 60), b = R(8, 35); return mk(`${n} has ${a} stickers and gets ${b} more. How many stickers now?`, a + b, [a - b, a + b + 10, a + b - 1]); },
        () => { const a = R(40, 95), b = R(12, a - 10); return mk(`There were ${a} apples. People ate ${b}. How many are left?`, a - b, [a + b, a - b + 10, a - b - 1]); },
        () => { const a = R(20, 50), b = R(5, 20), c = R(5, 15); return mk(`${n} had ${a} marbles, won ${b} more, then gave away ${c}. How many marbles now?`, a + b - c, [a + b + c, a - b - c, a + b]); },
        () => { const a = R(12, 40), d = R(5, 20); return mk(`${n} read ${a} pages. A friend read ${d} more pages than ${n}. How many pages did the friend read?`, a + d, [a - d, d, a + d + 10]); },
        () => { const t = R(50, 99), a = R(10, t - 15); return mk(`A class needs ${t} cups. They have ${a}. How many more cups do they need?`, t - a, [t + a, t - a + 10, a]); }
      ])();
    },
    addsub1000() {
      if (Math.random() < 0.5) { const a = R(120, 600), b = R(110, 399); return mk(`${a} + ${b} = ?`, a + b, [a + b - 100, a + b + 10, a + b - 10, a + b + 100]); }
      const a = R(300, 999), b = R(101, a - 50); return mk(`${a} − ${b} = ?`, a - b, [a - b + 100, a - b - 10, a - b + 10, a + b]);
    },
    missing2() {
      return pick([
        () => { const a = R(10, 60), x = R(5, 39); return mk(`? + ${a} = ${a + x}`, x, [x + 10, x - 1, a + x + a]); },
        () => { const t = R(40, 99), x = R(5, t - 10); return mk(`${t} − ? = ${t - x}`, x, [t - x, x + 10, x - 10]); },
        () => { const a = R(20, 70), x = R(10, 29); return mk(`${a} + ? = ${a + x}`, x, [a + x, x + 1, x - 10]); },
        () => { const st = pick([2, 5, 10]), s0 = st * R(1, 10); return mk(`What number is missing? ${s0}, ${s0 + st}, ?, ${s0 + 3 * st}`, s0 + 2 * st, [s0 + 2 * st + 1, s0 + st + 1, s0 + 4 * st]); }
      ])();
    },
    length2() {
      return pick([
        () => { const [o, a, w] = pick([['a pencil', '6 inches', ['6 feet', '6 yards', '60 inches']], ['a door', '7 feet', ['7 inches', '7 centimeters', '70 feet']], ['a paper clip', '3 centimeters', ['3 meters', '30 meters', '3 feet']], ['a school bus', '12 meters', ['12 centimeters', '12 inches', '1 meter']], ['your shoe', '8 inches', ['8 feet', '8 yards', '80 inches']]]); return { q: `Which is the best estimate for the length of ${o}?`, a, w }; },
        () => { const a = R(25, 90), b = R(10, a - 5), u = pick(['cm', 'inches']); return mk(`A red ribbon is ${a} ${u} long. A blue ribbon is ${b} ${u} long. How much longer is the red ribbon?`, a - b, [a + b, a - b + 10, b], (v) => v + ' ' + u); },
        () => { const [big, small] = pick([['1 foot', '1 inch'], ['1 meter', '1 centimeter'], ['1 yard', '1 foot'], ['1 meter', '1 foot']]); return { q: `Which is longer: ${big} or ${small}?`, a: big, w: [small, 'They are the same', 'You can\'t tell'] }; }
      ])();
    },
    picgraph2() {
      const key = pick([2, 5, 10]), n = R(2, 7), name = pick(names), thing = pick(['books', 'shells', 'stickers', 'apples']);
      if (Math.random() < 0.5) return mk(`In a picture graph, each ★ means ${key} ${thing}. ${name} has ★${'★'.repeat(n - 1)} (${n} stars). How many ${thing} is that?`, n * key, [n, n + key, n * key - key]);
      const a = R(2, 6), b = R(a + 1, 9); return mk(`A line plot shows how long some leaves are. ${a} leaves are 3 inches long and ${b} leaves are 4 inches long. How many more leaves are 4 inches long than 3 inches long?`, b - a, [a + b, b, b - a + 1]);
    },
    arrays2() {
      const r = R(2, 5), c = R(2, 5);
      return pick([
        () => mk(`A garden has ${r} rows with ${c} plants in each row. How many plants are there?`, r * c, [r + c, r * c + c, r * c - 1]),
        () => { const rr = Math.max(3, r); return { q: `Which addition matches ${rr} rows of ${c} chairs?`, a: Array(rr).fill(c).join(' + '), w: [`${rr} + ${c}`, Array(rr).fill(c + 1).join(' + '), Array(rr + 1).fill(c).join(' + ')] }; },
        () => mk(`${r} bags each hold ${c} oranges. How many oranges in all?`, r * c, [r + c, r * c + 1, c])
      ])();
    },

    /* ───── Grade 8 ───── */
    irrational() {
      return pick([
        () => { let n; do { n = R(2, 50); } while (Number.isInteger(Math.sqrt(n))); const sq = pick([4, 9, 16, 25, 36, 49]); return { q: 'Which number is irrational?', a: `√${n}`, w: [`√${sq}`, pick(['0.25', '0.3 (repeating)', '1.75']), pick(['3/7', '−5', '22/7'])] }; },
        () => { let n; do { n = R(3, 99); } while (Number.isInteger(Math.sqrt(n))); const lo = Math.floor(Math.sqrt(n)); return mk(`√${n} is between which two whole numbers?`, `${lo} and ${lo + 1}`, [`${lo - 1} and ${lo}`, `${lo + 1} and ${lo + 2}`, `${Math.floor(n / 2)} and ${Math.floor(n / 2) + 1}`, `${lo + 2} and ${lo + 3}`, `${n - 1} and ${n}`]); },
        () => { const d = pick([[1, 3, '0.333…'], [2, 3, '0.666…'], [1, 9, '0.111…'], [5, 9, '0.555…'], [4, 11, '0.3636…']]); return mk(`Which fraction equals the repeating decimal ${d[2]}?`, `${d[0]}/${d[1]}`, [`${d[0]}/${d[1] + 1}`, `${d[0]}/10`, `${d[0]}/${d[1] * 10}`, `${d[1]}/${d[0]}`]); },
        () => { let n; do { n = R(2, 30); } while (Number.isInteger(Math.sqrt(n))); return { q: `Is √${n} rational or irrational?`, a: 'Irrational', w: ['Rational', 'It is an integer', 'It is a whole number'] }; }
      ])();
    },
    roots() {
      return pick([
        () => { const r = R(2, 15); return mk(`Solve x² = ${r * r} (x > 0).`, r, [r * r / 2, r + 1, r - 1], (v) => 'x = ' + v); },
        () => { const r = R(2, 6); return mk(`What is the cube root of ${r ** 3}?`, r, [r * r, r + 1, (r ** 3) / 3 | 0]); },
        () => { const r = R(2, 5); return mk(`A cube has volume ${r ** 3} cm³. How long is each edge?`, r, [r ** 2, r + 1, (r ** 3) / 6 | 0], (v) => v + ' cm'); },
        () => { const r = R(4, 12); return mk(`A square has area ${r * r} m². How long is each side?`, r, [r * r / 4, r * 2, r + 2], (v) => v + ' m'); }
      ])();
    },
    pctChange8() {
      return pick([
        () => { const o = pick([20, 40, 50, 80, 120, 200]), p = pick([10, 20, 25, 50]); const nw = o * (1 + p / 100); return mk(`A price rises from ${usd(o)} to ${usd(nw)}. What is the percent increase?`, p + '%', [p * 2 + '%', (100 - p) + '%', f((nw - o)) + '%']); },
        () => { const o = pick([40, 60, 80, 120, 150]), p = pick([10, 20, 25, 30]); return mk(`A $${o} jacket is ${p}% off. What is the sale price?`, usd(o * (1 - p / 100)), [usd(o * p / 100), usd(o - p), usd(o * (1 + p / 100))]); },
        () => { const p = pick([20, 25, 40, 50]), part = pick([6, 8, 10, 12, 15]); const whole = part * 100 / p; return mk(`${part} is ${p}% of what number?`, whole, [part * p / 100, whole / 2, whole + part]); },
        () => { const a = R(2, 9), b = R(2, 9), k = R(3, 8); return mk(`A recipe uses ${a} cups of flour for every ${b} cups of milk. How much flour for ${b * k} cups of milk?`, a * k, [b * k, a * b, a + k], (v) => v + ' cups'); }
      ])();
    },
    solCount() {
      const a = R(2, 6), b = R(1, 9), kind = pick(['one', 'none', 'many']);
      let q;
      if (kind === 'many') q = `${a}(x + ${b}) = ${a}x + ${a * b}`;
      else if (kind === 'none') q = `${a}(x + ${b}) = ${a}x + ${a * b + R(1, 5)}`;
      else { const c = a + R(1, 3); q = `${a}x + ${b} = ${c}x − ${R(1, 9)}`; }
      const A = { one: 'Exactly one solution', none: 'No solution', many: 'Infinitely many solutions' }[kind];
      return { q: `How many solutions does this equation have?  ${q}`, a: A, w: ['Exactly one solution', 'No solution', 'Infinitely many solutions', 'Exactly two solutions'].filter((x) => x !== A).slice(0, 3) };
    },
    ineq8() {
      return pick([
        () => { const a = R(2, 7), x = R(-4, 9), b = R(1, 12); return mk(`Solve: ${a}x + ${b} > ${neg(a * x + b)}`, `x > ${neg(x)}`, [`x < ${neg(x)}`, `x > ${neg(x + 1)}`, `x > ${neg(a * x + b)}`, `x > ${neg(x - 1)}`]); },
        () => { const a = R(2, 6), x = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8]), b = R(1, 10); return mk(`Solve: −${a}x + ${b} ≤ ${neg(-a * x + b)}`, `x ≥ ${neg(x)}`, [`x ≤ ${neg(x)}`, `x ≥ ${neg(-x)}`, `x ≤ ${neg(-x)}`]); },
        () => { const c = pick([5, 8, 12]), m = pick([40, 50, 60, 75]), base = pick([0, 10, 15]); const n = Math.floor((m - base) / c); return mk(`Tickets cost $${c} each${base ? ' plus a $' + base + ' fee' : ''}. You have $${m}. What is the greatest number of tickets you can buy?`, n, [n + 1, Math.ceil(m / c), n - 1]); }
      ])();
    },
    slopeInt() {
      const m = pick([-4, -3, -2, -1, 2, 3, 4, 5]); let b = R(-8, 8); while (!b || Math.abs(b) === Math.abs(m)) b = R(-8, 8);
      const co = (c) => (c === 1 ? '' : c === -1 ? '−' : neg(c)), tail = (c) => (c < 0 ? '− ' + Math.abs(c) : '+ ' + c);
      const eq = `y = ${co(m)}x ${tail(b)}`;
      return pick([
        () => mk(`What is the y-intercept of ${eq}?`, neg(b), [neg(m), neg(-b), '0']),
        () => mk(`What is the slope of ${eq}?`, neg(m), [neg(b), neg(-m), '1']),
        () => { const x = R(-3, 5); return mk(`For ${eq}, what is y when x = ${neg(x)}?`, neg(m * x + b), [neg(m + x + b), neg(m * x - b), neg(m * (x + 1) + b)]); },
        () => ({ q: `Which equation has slope ${neg(m)} and y-intercept ${neg(b)}?`, a: eq, w: [`y = ${co(b || 2)}x ${tail(m)}`, `y = ${co(-m)}x ${tail(b)}`, `y = ${co(m)}x ${tail(-b)}`] }),
        () => { const x1 = R(-3, 3), x2 = x1 + R(1, 4); return mk(`A line passes through (${neg(x1)}, ${neg(m * x1 + b)}) and (${neg(x2)}, ${neg(m * x2 + b)}). What is its slope?`, neg(m), [neg(-m), neg(m + 1), neg(b)]); }
      ])();
    },
    linNon() {
      return pick([
        () => ({ q: 'Which equation is a linear function?', a: pick(['y = 4x − 1', 'y = −x + 7', 'y = 0.5x']), w: ['y = x² + 1', 'y = 3/x', 'y = 2ˣ'] }),
        () => ({ q: 'Which equation is NOT a linear function?', a: pick(['y = x² − 3', 'y = 5/x', 'y = 3ˣ']), w: ['y = 2x + 5', 'y = −4x', 'y = x − 9'] }),
        () => { const m = R(2, 5), b = R(0, 6), xs = [0, 1, 2, 3]; const lin = Math.random() < 0.5; const ys = xs.map((x) => (lin ? m * x + b : x * x + b)); return { q: `x: ${xs.join(', ')} → y: ${ys.join(', ')}. Is this function linear?`, a: lin ? `Yes, y goes up by ${m} each time` : 'No, the change in y is not constant', w: lin ? ['No, the change in y is not constant', `Yes, y goes up by ${m + 1} each time`, 'No, it starts at a number other than 0'] : [`Yes, y goes up by ${ys[1] - ys[0]} each time`, 'Yes, because x goes up by 1', 'No, because y starts at ' + b] }; },
        () => { const m = R(2, 6), b = R(1, 9); return mk(`A taxi charges $${b} plus $${m} per mile. What is the rate of change (in dollars per mile)?`, '$' + m, ['$' + b, '$' + (m + b), '$' + m * b]); }
      ])();
    },
    stats8() {
      const n = R(5, 7), xs = Array.from({ length: n }, () => R(2, 20)); const sum = xs.reduce((a, b) => a + b, 0); xs[n - 1] += (n - (sum % n)) % n; const s = xs.slice().sort((a, b) => a - b), mean = xs.reduce((a, b) => a + b, 0) / n;
      return pick([
        () => mk(`What is the mean of ${xs.join(', ')}?`, mean, [s[Math.floor(n / 2)] === mean ? mean + 1 : s[Math.floor(n / 2)], mean + 2, s[n - 1] - s[0]]),
        () => { const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; return mk(`What is the median of ${xs.join(', ')}?`, med, [xs[Math.floor(n / 2)] === med ? med + 1 : xs[Math.floor(n / 2)], f(mean) === f(med) ? med + 2 : r2(mean), med - 1]); },
        () => mk(`What is the range of ${xs.join(', ')}?`, s[n - 1] - s[0], [s[n - 1], r2(mean), s[n - 1] - s[1]]),
        () => ({ q: `The data ${s.join(', ')} gets one new value: 95. What happens?`, a: 'The mean increases a lot; the median changes only a little', w: ['The median increases a lot; the mean stays the same', 'Both stay exactly the same', 'The range gets smaller'] })
      ])();
    },
    scatter8() {
      const m = pick([2, 3, 4, 5, 1.5, 2.5]), b = pick([10, 20, 30, 40, 50]), x = R(2, 10);
      return pick([
        () => mk(`A line of best fit for test scores is y = ${m}x + ${b}, where x is hours studied. What score does it predict for ${x} hours?`, r2(m * x + b), [r2(m + x + b), r2(m * x), r2(m * (x + 1) + b)]),
        () => ({ q: `In the model y = ${m}x + ${b} (x = hours studied, y = score), what does ${m} mean?`, a: `The score goes up about ${m} points for each extra hour`, w: [`A student who studies 0 hours scores ${m}`, `Students study ${m} hours on average`, `The highest score is ${m}`] }),
        () => ({ q: `In the model y = ${m}x + ${b} (x = hours studied, y = score), what does ${b} mean?`, a: `The predicted score for 0 hours of study`, w: [`The score gained per hour`, `The number of students`, `The highest possible score`] }),
        () => { const k = pick([['hours of practice', 'free throws made', 'Positive'], ['outside temperature', 'heating bill', 'Negative'], ['shoe size', 'math score', 'No clear']]); return { q: `What kind of association would you expect between ${k[0]} and ${k[1]}?`, a: k[2] + (k[2] === 'No clear' ? ' association' : ' association'), w: ['Positive association', 'Negative association', 'No clear association', 'Perfect association'].filter((x) => x !== k[2] + ' association').slice(0, 3) }; }
      ])();
    },
    twoWay8() {
      const a = R(8, 20), b = R(4, 15), c = R(5, 18), d = R(4, 16); // rows: plays sport / no; cols: plays music / no
      const t = a + b + c + d, sport = a + b, music = a + c;
      const tbl = `Survey of ${t} students — Sports & music: ${a}; sports only: ${b}; music only: ${c}; neither: ${d}.`;
      return pick([
        () => mk(`${tbl} How many students play sports?`, sport, [a, a + c, t - sport]),
        () => mk(`${tbl} What fraction of all students play music?`, `${music}/${t}`, [`${a}/${t}`, `${music}/${sport}`, `${c}/${t}`]),
        () => mk(`${tbl} Of the students who play sports, what fraction also play music?`, `${a}/${sport}`, [`${a}/${t}`, `${a}/${music}`, `${b}/${sport}`]),
        () => mk(`${tbl} How many students play neither?`, d, [b + c, t - a, c])
      ])();
    },
    angles8() {
      return pick([
        () => { const a = R(30, 80), b = R(30, 160 - a); return mk(`A triangle has angles of ${a}° and ${b}°. What is the third angle?`, 180 - a - b, [360 - a - b, 90 - Math.min(a, b), a + b], (v) => v + '°'); },
        () => { const a = R(30, 75), b = R(30, 75); return mk(`A triangle's two inside angles are ${a}° and ${b}°. What is the exterior angle at the third corner?`, a + b, [180 - a - b, 180 - a, 360 - a - b], (v) => v + '°'); },
        () => { const a = R(35, 145); return mk(`Two parallel lines are cut by a transversal. One angle is ${a}°. What is its corresponding angle?`, a, [180 - a, 90, 360 - a], (v) => v + '°'); },
        () => { const a = R(35, 145); return mk(`Two parallel lines are cut by a transversal. One angle is ${a}°. What is the measure of a same-side interior angle paired with it?`, 180 - a, [a, 90 - (a % 90), 360 - a], (v) => v + '°'); }
      ])();
    },
    dilate8() {
      return pick([
        () => { const k = pick([2, 3, 0.5, 1.5]), s = pick([4, 6, 8, 10]); return mk(`A shape is dilated by a scale factor of ${k}. A side that was ${s} cm becomes how long?`, r2(s * k), [s + k, s / k, s * k * 2], (v) => f(v) + ' cm'); },
        () => { const a = pick([3, 4, 5, 6]), k = pick([2, 3, 4]), b = a + R(1, 4); return mk(`Two triangles are similar. Small sides: ${a} and ${b}. The large triangle's side matching ${a} is ${a * k}. What is the side matching ${b}?`, b * k, [b + a * k - a, b * k + 1, a * b], (v) => f(v)); },
        () => { const k = pick([2, 3]), x = R(1, 5), y = R(1, 5); return mk(`The point (${x}, ${y}) is dilated from the origin by a factor of ${k}. Where does it go?`, `(${x * k}, ${y * k})`, [`(${x + k}, ${y + k})`, `(${x * k}, ${y})`, `(${y * k}, ${x * k})`]); },
        () => { const k = pick([2, 3]); return mk(`A rectangle is enlarged by a scale factor of ${k}. Its area is multiplied by…`, k * k, [k, 2 * k, k * k * k]); }
      ])();
    },
    dist8() {
      const [p, q, h] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]); const x = R(-4, 4), y = R(-4, 4), sx = pick([1, -1]), sy = pick([1, -1]);
      return mk(`What is the distance between (${neg(x)}, ${neg(y)}) and (${neg(x + sx * p)}, ${neg(y + sy * q)})?`, h, [p + q, h + 1, Math.abs(p - q) + h - 1]);
    }
  });
})();
