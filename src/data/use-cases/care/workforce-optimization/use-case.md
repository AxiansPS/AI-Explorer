# Workforce Demand–Supply Optimization (PIL/PNIL)

**Short description**  
Optimize the alignment between **predicted care demand** and **available workforce** (permanent staff and PNIL/flex) by generating cost‑efficient, compliant rosters. The solution uses forecasted demand (from occupancy models) and applies optimization algorithms to minimize PNIL costs, reduce understaffing, and respect labor rules.

---

## Business outcomes & KPIs
- **Lower PNIL/flex costs** through better planning.
- **Improved coverage** of shifts → fewer last‑minute calls.
- **Higher staff satisfaction** by reducing ad‑hoc changes.
- **Compliance** with labor agreements and qualifications.

**Example KPIs**  
Coverage %, PNIL spend vs. baseline, # last‑minute changes, overtime hours, rule violations, solver runtime.

---

## Beneficiaries
- **HR & Workforce planning** (strategic and tactical).
- **Operations/Capacity management** (daily/weekly planning).
- **Finance** (cost control).
- **Nurse managers** (less firefighting).

---

## Typical data & systems
- **Forecasted demand**: from occupancy/bed forecasting (#1).
- **Roster data**: shifts, skills, preferences (Ortec, AFAS).
- **HR contracts**: FTE, availability, PNIL pool (AFAS).
- **Regulations**: CAO rules, rest times, skill mix.

---

## Process
1. **Input**: demand forecast per unit/day, staff availability, constraints.
2. **Model**: optimization engine (mixed‑integer programming or heuristic solver).
3. **Objective**: minimize PNIL cost + penalty for understaffing and rule violations.
4. **Output**: optimized roster suggestions with KPIs and scenario comparisons.
5. **Integration**: export to Ortec or HR system for execution.

---

## Modeling options
- **Exact**: Mixed Integer Linear Programming (MILP) for small/medium instances.
- **Heuristic/metaheuristic**: Genetic algorithms, Tabu search for large scale.
- **Multi‑objective**: cost vs. fairness vs. coverage.
- **Scenario analysis**: what‑if PNIL rates, demand spikes, absence scenarios.

---

## Decision & action integration
- **Dashboard**: coverage heatmap, PNIL cost projection, scenario toggles.
- **Alerts**: when coverage < threshold or PNIL > budget.
- **API**: push optimized rosters to scheduling tools.

---

## Governance & risk
- **Transparency**: show why a roster was chosen (constraint satisfaction).
- **Human‑in‑the‑loop**: planners approve before publishing.
- **Data privacy**: only use necessary HR attributes; anonymize where possible.

---

## Success criteria
- PNIL cost reduction vs. baseline.
- Coverage improvement (target > 98%).
- Positive planner feedback on usability.

---

## Demo/POC outline
- **Data slice**: 2–3 units, 4 weeks of demand + staff availability.
- **Baseline vs. optimized**: show cost and coverage delta.
- **Scenario toggles**: PNIL rate changes, absence shocks.

---

## Variants & extensions
- Add **fairness constraints** (equal weekend shifts).
- Integrate with **leave planning** and **training schedules**.
- Combine with **route optimization** for home care.