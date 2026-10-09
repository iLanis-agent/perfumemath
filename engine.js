/* Perfume math - exact dilution and scaling arithmetic on labeled perfumery norms. No allergen/IFRA guidance. */
const r2 = x => Math.round(x * 100) / 100;
const bad = m => { throw new Error(m); };
const pos = (v, m) => { if (!Number.isFinite(v) || v <= 0) bad(m); };
const band = p =>
  p >= 20 ? 'parfum / extrait territory (labeled)' :
  p >= 15 ? 'eau de parfum (labeled)' :
  p >= 5 ? 'eau de toilette (labeled)' :
  p >= 2 ? 'eau de cologne (labeled)' : 'a body mist (labeled)';

function dilute(concentrateMl, targetPct) {
  pos(concentrateMl, 'concentrate must be positive'); pos(targetPct, 'target concentration must be positive');
  if (targetPct > 100) bad('concentration cannot exceed 100 percent');
  const totalMl = concentrateMl * 100 / targetPct;
  const alcoholMl = totalMl - concentrateMl;
  return { totalMl: r2(totalMl), alcoholMl: r2(alcoholMl), verdict: band(targetPct) };
}

function drops(dropsCount, dropsPerMl, totalDrops) {
  pos(dropsCount, 'drops must be positive'); pos(dropsPerMl, 'drops per ml must be positive'); pos(totalDrops, 'total drops must be positive');
  if (dropsCount > totalDrops) bad('a part cannot exceed the whole formula');
  const ml = dropsCount / dropsPerMl;
  const pct = dropsCount / totalDrops * 100;
  const verdict = pct >= 50 ? 'the backbone of the blend (labeled)' :
    pct >= 20 ? 'a supporting role (labeled)' : 'an accent - measure carefully (labeled)';
  return { ml: r2(ml), pctOfBlend: r2(pct), verdict };
}

function scale(partsA, partsB, partsC, totalMl) {
  for (const [v, m] of [[partsA, 'base parts cannot be negative'], [partsB, 'heart parts cannot be negative'], [partsC, 'top parts cannot be negative']])
    if (!Number.isFinite(v) || v < 0) bad(m);
  pos(totalMl, 'total volume must be positive');
  const sum = partsA + partsB + partsC;
  if (sum <= 0) bad('at least one material needs parts');
  const perPart = totalMl / sum;
  return {
    perPartMl: r2(perPart),
    baseMl: r2(partsA * perPart), heartMl: r2(partsB * perPart), topMl: r2(partsC * perPart)
  };
}

const api = { dilute, drops, scale, band };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.Perfumemath = api;
