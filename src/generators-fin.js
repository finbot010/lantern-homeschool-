/* Lantern Homeschool — money-math practice generators for the Money Smart course.
   Each returns { q, a, w: [3 wrong answers], v?: picture }. Loaded after generators.js. */
(function () {
  const G = window.LH_GEN;
  const R = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const $ = (x) => { const c = Math.round(x * 100); return (c < 0 ? '−$' : '$') + (Math.abs(c) % 100 ? (Math.abs(c) / 100).toFixed(2) : String(Math.abs(c) / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  // Three distinct wrong dollar amounts from candidate values (falls back to nearby amounts).
  function W(ans, cands, step) {
    const out = [], A = $(ans);
    for (const c of cands) { if (out.length >= 3) break; if (!(c >= 0) || !isFinite(c)) continue; const s = $(c); if (s !== A && !out.includes(s)) out.push(s); }
    step = step || (ans >= 100 ? 10 : ans >= 10 ? 1 : 0.25);
    for (let k = 1; out.length < 3 && k < 40; k++) for (const d of [k, -k]) { const s = $(ans + d * step); if (ans + d * step > 0 && s !== A && !out.includes(s) && out.length < 3) out.push(s); }
    return out;
  }
  const M = (q, ans, cands, v, step) => { const r = { q, a: $(ans), w: W(ans, cands, step) }; if (v) r.v = v; return r; };
  const N = (q, ans, cands, unit) => { const f = (n) => n + (unit ? ' ' + (n === 1 ? unit.replace(/s$/, '') : unit) : ''); const out = []; for (const c of cands) { if (out.length >= 3) break; if (c > 0 && c !== ans && !out.includes(f(c))) out.push(f(c)); } for (let k = 1; out.length < 3; k++) for (const d of [k, -k]) { const c = ans + d; if (c > 0 && !out.includes(f(c)) && out.length < 3) out.push(f(c)); } return { q, a: f(ans), w: out }; };
  const ITEMS = [['a pencil', 0.75], ['a sticker pack', 1.25], ['a juice box', 1.5], ['a toy car', 2.75], ['a comic book', 3.5], ['a yo-yo', 4.25], ['a kite', 6.5], ['a book', 7.75]];

  Object.assign(G, {
    /* making change */
    finChange() {
      const [item, price] = pick(ITEMS), paid = price <= 4 ? pick([5, 10]) : 10, ch = paid - price;
      return M(`You buy ${item} for ${$(price)} and pay with a ${$(paid)} bill. How much change do you get?`, ch, [paid - price + 1, price, ch - 0.25, paid - Math.floor(price)]);
    },
    /* weeks to reach a savings goal */
    finSave() {
      const per = pick([2, 3, 4, 5, 6, 8, 10]), weeks = R(3, 10), goal = per * weeks, item = pick(['a skateboard', 'a board game', 'a new ball', 'a puzzle', 'art supplies']);
      return Object.assign(N(`You want ${item} that costs ${$(goal)}. You save ${$(per)} every week. How many weeks will it take?`, weeks, [weeks + 1, weeks - 1, goal - per, Math.ceil(goal / 10)], 'weeks'), { v: { t: 'bars', labels: ['Week 1', 'Week 2', 'Week 3'], values: [per, per * 2, per * 3], title: 'Savings so far ($)' } });
    },
    /* unit price: which is the better buy */
    finUnitPrice() {
      const prod = pick([['granola bars', 'bars'], ['pencils', 'pencils'], ['juice boxes', 'boxes'], ['markers', 'markers']]);
      const a = R(4, 8), b = a * 2 + R(1, 4), ua = R(30, 60) / 100, ub = Math.round((ua + pick([-0.1, -0.08, -0.05, 0.05, 0.08, 0.1])) * 100) / 100;
      const pa = Math.round(a * ua * 100) / 100, pb = Math.round(b * ub * 100) / 100, best = pa / a < pb / b ? 'A' : 'B';
      if (Math.random() < 0.5) return { q: `Pack A has ${a} ${prod[0]} for ${$(pa)}. Pack B has ${b} ${prod[0]} for ${$(pb)}. Which is the better buy (lower price per item)?`, a: 'Pack ' + best, w: ['Pack ' + (best === 'A' ? 'B' : 'A'), 'They cost the same per item', 'The bigger pack is always better'] };
      return M(`A pack of ${a} ${prod[0]} costs ${$(pa)}. What is the price for one? (unit price)`, Math.round((pa / a) * 100) / 100, [pa * a / 10, pa - a / 10, pa / (a + 1)], null, 0.05);
    },
    /* lemonade-stand profit */
    finProfit() {
      const cups = R(10, 40), price = pick([0.5, 0.75, 1, 1.25]), cost = pick([4, 5, 6, 8, 10]), rev = cups * price, profit = rev - cost;
      return M(`Your lemonade stand sells ${cups} cups at ${$(price)} each. Supplies cost ${$(cost)}. What is your profit (money earned minus costs)?`, profit, [rev, rev + cost, cost, profit + price], { t: 'bars', labels: ['Earned', 'Costs', 'Profit'], values: [Math.round(rev), cost, Math.max(0, Math.round(profit))], title: 'Lemonade stand ($)' });
    },
    /* monthly budget: what's left */
    finBudget() {
      const inc = pick([40, 50, 60, 80, 100, 120]), cats = ['Save', 'Spend', 'Share'];
      const s = Math.round(inc * pick([0.2, 0.25, 0.3])), g = Math.round(inc * pick([0.1, 0.05])), sp = inc - s - g;
      const ask = R(0, 2), vals = [s, sp, g];
      if (ask === 1) return M(`You earn ${$(inc)} this month. You put ${$(s)} in savings and give ${$(g)} to charity. How much is left to spend?`, sp, [inc - s, inc - g, s + g, sp + 5], { t: 'bars', labels: cats, values: vals, title: 'My budget ($)' });
      const pct = Math.round((s / inc) * 100);
      if (ask === 0) return { q: `You earn ${$(inc)} and save ${$(s)}. What percent of your money did you save?`, a: pct + '%', w: [pct + 10, pct - 5, s].filter((x, i, a) => x > 0 && x !== pct && a.indexOf(x) === i).map((x) => x + '%').concat(['50%', '5%']).filter((x) => x !== pct + '%').slice(0, 3), v: { t: 'bars', labels: cats, values: vals, title: 'My budget ($)' } };
      return M(`Your budget is ${$(inc)}: save ${$(s)}, share ${$(g)}, and spend the rest. You already spent ${$(Math.round(sp / 2))}. How much spending money is left?`, sp - Math.round(sp / 2), [sp, Math.round(sp / 2) + s, inc - Math.round(sp / 2)], { t: 'bars', labels: cats, values: vals, title: 'My budget ($)' });
    },
    /* sale price after a discount */
    finDiscount() {
      const price = pick([20, 24, 30, 40, 45, 50, 60, 80, 120]), off = pick([10, 15, 20, 25, 30, 40, 50]), save = price * off / 100;
      if (Math.random() < 0.4) return M(`A ${$(price)} pair of shoes is ${off}% off. How much money do you save?`, save, [price - save, off, save * 2]);
      return M(`A jacket costs ${$(price)}. It is on sale for ${off}% off. What is the sale price?`, price - save, [save, price - off, price * (1 + off / 100)]);
    },
    /* sales tax */
    finTax() {
      const price = pick([12, 16, 20, 25, 36, 40, 48, 60, 75]), rate = pick([5, 6, 7, 8, 10]), tax = price * rate / 100;
      if (Math.random() < 0.4) return M(`A game costs ${$(price)}. Sales tax is ${rate}%. How much is the tax?`, tax, [rate, price - tax, tax * 10]);
      return M(`A game costs ${$(price)}. Sales tax is ${rate}%. What is the total you pay?`, price + tax, [price + rate, price - tax, tax]);
    },
    /* simple interest */
    finSimpleInt() {
      const P = pick([100, 200, 400, 500, 1000, 1500, 2000]), r = pick([2, 3, 4, 5, 6, 8]), t = R(1, 5), I = P * r * t / 100;
      if (Math.random() < 0.5) return M(`You put ${$(P)} in a savings account that earns ${r}% simple interest per year. How much interest do you earn in ${t} year${t > 1 ? 's' : ''}?`, I, [P * r / 100, P + I, I * 2, P * r * t]);
      return M(`You borrow ${$(P)} at ${r}% simple interest per year for ${t} year${t > 1 ? 's' : ''}. What is the total you must pay back?`, P + I, [P, I, P + P * r / 100, P * (1 + r)]);
    },
    /* paycheck: gross and net pay */
    finPaycheck() {
      const rate = pick([10, 12, 14, 15, 16, 18, 20]), hrs = pick([10, 15, 20, 25, 30, 40]), gross = rate * hrs, tx = pick([10, 12, 15, 20]), net = gross * (1 - tx / 100);
      if (Math.random() < 0.45) return M(`You work ${hrs} hours at ${$(rate)} per hour. What is your gross pay (before taxes)?`, gross, [rate + hrs, gross * 0.85, gross + rate, gross - rate]);
      return M(`Your gross pay is ${$(gross)}. About ${tx}% is withheld for taxes. What is your net (take-home) pay?`, net, [gross, gross * tx / 100, gross - tx, net - gross * 0.05]);
    },
    /* rule of 72 */
    finRule72() {
      const r = pick([2, 3, 4, 6, 8, 9, 12]), yrs = 72 / r;
      if (Math.random() < 0.5) return N(`Using the Rule of 72, about how many years does it take money to double at ${r}% interest per year?`, yrs, [72 * r > 200 ? 100 : 72 * r, Math.round(100 / r), r, yrs * 2], 'years');
      return { q: `Using the Rule of 72, what yearly interest rate doubles your money in about ${yrs} years?`, a: r + '%', w: [...new Set([yrs, r * 2, r + 1, Math.max(1, r - 1), 72].filter((x) => x !== r))].slice(0, 3).map((x) => x + '%') };
    },
    /* loan cost: monthly payments vs. price */
    finLoan() {
      const pay = pick([150, 200, 250, 300, 350, 400]), mo = pick([12, 24, 36, 48, 60]), price = Math.round(pay * mo * pick([0.82, 0.86, 0.9]) / 100) * 100, total = pay * mo;
      if (Math.random() < 0.5) return M(`A loan has payments of ${$(pay)} a month for ${mo} months. How much will you pay in total?`, total, [pay * 12, total - pay, pay + mo, total / 10]);
      return M(`You borrow to buy a ${$(price)} used car and pay ${$(pay)} a month for ${mo} months (${$(total)} total). How much did the loan cost you in interest?`, total - price, [total, price, (total - price) / 2, pay]);
    },
    /* 50/30/20 budget */
    fin503020() {
      const net = pick([1800, 2000, 2400, 2500, 3000, 3200, 3600, 4000]), part = pick([['needs', 50], ['wants', 30], ['savings and debt payments', 20]]);
      return Object.assign(M(`Using the 50/30/20 budget rule, how much of a ${$(net)} monthly take-home pay goes to ${part[0]}?`, net * part[1] / 100, [net * 0.5, net * 0.3, net * 0.2, net * 0.1].filter((x) => x !== net * part[1] / 100)), { v: { t: 'bars', labels: ['Needs 50%', 'Wants 30%', 'Save 20%'], values: [net * 0.5, net * 0.3, net * 0.2], title: '50/30/20 budget ($)' } });
    },
    /* employer 401(k) match */
    finMatch() {
      const sal = pick([30000, 40000, 50000, 60000, 80000]), m = pick([3, 4, 5, 6]), you = sal * m / 100;
      return M(`You earn ${$(sal)} a year and put ${m}% into your 401(k). Your employer matches 100% of what you put in, up to ${m}% of your pay. How much does your employer add each year?`, you, [you / 2, sal * 0.1, you * 2, m * 100]);
    },
    /* inflation */
    finInflation() {
      const price = pick([4, 5, 10, 20, 50, 100, 200]), r = pick([2, 3, 4, 5]), yrs = pick([1, 2]), after = Math.round(price * Math.pow(1 + r / 100, yrs) * 100) / 100;
      return M(`Inflation is ${r}% per year. Something costs ${$(price)} today. About how much will it cost in ${yrs} year${yrs > 1 ? 's' : ''}?`, after, [price, price + r, price * (1 - r / 100), price * (1 + r * yrs)], null, price >= 50 ? 1 : 0.1);
    },
    /* credit card: paying only the minimum */
    finCard() {
      const bal = pick([500, 800, 1000, 1200, 2000]), apr = pick([18, 20, 24, 30]), mInt = Math.round(bal * apr / 12) / 100;
      if (Math.random() < 0.5) return M(`You have a ${$(bal)} credit card balance with a ${apr}% APR. About how much interest is charged in one month? (APR ÷ 12 × balance)`, mInt, [bal * apr / 100, apr, mInt * 2, bal / 12]);
      return M(`A credit card has a ${$(bal)} balance and charges ${apr}% interest per year. If you pay nothing for a year (simple interest), how much will you owe?`, bal * (1 + apr / 100), [bal, bal * apr / 100, bal + apr]);
    }
  });
})();
