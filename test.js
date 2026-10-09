const M = require('./engine.js');
const E = require('./expected.json');
let n = 0, fail = 0;
const eq = (a, b, tag) => {
  n++;
  if (JSON.stringify(a) !== JSON.stringify(b)) { fail++; console.error('FAIL', tag, JSON.stringify(a), '!=', JSON.stringify(b)); }
};
for (const c of E.dilute) { let r; try { r = M.dilute(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'dilute ' + c.in); }
for (const c of E.drops) { let r; try { r = M.drops(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'drops ' + c.in); }
for (const c of E.scale) { let r; try { r = M.scale(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'scale ' + c.in); }
// anchors
const d = M.dilute(5, 20);
eq(d.totalMl, 25, 'anchor total'); eq(d.alcoholMl, 20, 'anchor alcohol');
const dr = M.drops(30, 20, 120);
eq(dr.ml, 1.5, 'anchor drops ml'); eq(dr.pctOfBlend, 25, 'anchor drops pct');
const s = M.scale(3, 2, 1, 10);
eq(s.perPartMl, 1.67, 'anchor per part'); eq(s.baseMl, 5, 'anchor base');
// invariants
n++;
{
  const q = M.scale(7, 5, 3, 45);
  if (Math.abs(q.baseMl + q.heartMl + q.topMl - 45) > 0.05) { fail++; console.error('FAIL scale sum'); }
}
n++;
{
  const q = M.dilute(8, 18);
  if (Math.abs(q.totalMl - q.alcoholMl - 8) > 0.02) { fail++; console.error('FAIL dilute sum'); }
}
// errors
const errs = [
  () => M.dilute(0, 20), () => M.dilute(5, 0), () => M.dilute(5, 101),
  () => M.drops(0, 20, 120), () => M.drops(30, 0, 120), () => M.drops(30, 20, 0), () => M.drops(130, 20, 120),
  () => M.scale(-1, 2, 1, 10), () => M.scale(3, -1, 1, 10), () => M.scale(3, 2, -1, 10), () => M.scale(3, 2, 1, 0), () => M.scale(0, 0, 0, 10),
];
const msgs = ['concentrate must be positive','target concentration must be positive','concentration cannot exceed 100 percent',
  'drops must be positive','drops per ml must be positive','total drops must be positive','a part cannot exceed the whole formula',
  'base parts cannot be negative','heart parts cannot be negative','top parts cannot be negative','total volume must be positive','at least one material needs parts'];
errs.forEach((f, i) => {
  n++;
  try { f(); fail++; console.error('FAIL no-throw', i); }
  catch (e) { if (e.message !== msgs[i]) { fail++; console.error('FAIL msg', i, e.message, 'want', msgs[i]); } }
});
console.log(fail ? fail + ' FAILURES / ' + n : n + '/' + n + ' checks pass');
process.exit(fail ? 1 : 0);
