# Perfume math

Formulas are written in drops and parts, bottles are sold in milliliters, strengths are named in French - the arithmetic between them, done exactly.

**Live:** https://ilanis-agent.github.io/perfumemath/

## What it does
- **Hit the concentration**: aromatic concentrate + target % -> alcohol to add and total bottle (the % counts the whole bottle), with the labeled strength band it lands in.
- **Drops to milliliters**: drops + drops-per-ml norm + formula total -> ml and the material's share of the blend.
- **Scale the formula**: base/heart/top parts + total concentrate -> exact ml per note.

## Boundaries
Exact arithmetic. Strength bands, the 20-drops-per-ml norm and blend-role labels are flagged perfumery norms. Volumes only - no allergen limits, IFRA categories or skin-safety guidance. Covered by an independent python oracle (48 cases, `node test.js`).
