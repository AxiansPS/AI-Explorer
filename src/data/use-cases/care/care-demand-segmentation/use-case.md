# Care Demand Segmentation (Cohorting)

Group patients/clients into **cohorts** based on care intensity, functional status, diagnoses, comorbidities, incident history, and service utilization. Cohorts enable targeted planning, staffing ratios, prevention programs, and financial steering (e.g., tariffs/contracts), and they improve the stability and predictability of operations.

---

## Business outcomes & KPIs
- **More predictable workload** and smoother planning by cohort.
- **Better staffing mix** and skills alignment per cohort.
- **Focused interventions** (e.g., fall prevention, medication review) where they matter most.
- **Improved margins** through better product/tariff mix and reduced waste.

**Example KPIs**  
Variance (σ²) of workload minutes per client within cohorts (↓), forecast accuracy per cohort (MAPE/MAE), avoidable incidents per 1,000 care days (↓), margin per cohort (↑), readmission/transfer rate (↓), cohort stability over time (Adjusted Rand Index).

---

## Beneficiaries
- **Operations / Capacity management** (planning per cohort).
- **Nurse & care managers** (skills mix, protocol adherence).
- **Finance & Contracting** (tariffs, value-based care products).
- **Quality & Safety** (targeted prevention).
- **Data & Analytics** (inputs to forecasting and optimization).

---

## Typical data & systems (examples)
- **EHR/ECD**: diagnoses/problem lists, ADL scores, acuity indicators, interventions, LOS/episode info (e.g., ONS, Ysis, HiX/Epic, Kepler).
- **Care minutes & timesheets**: registered activities/complexity (e.g., from ECD or Exact).
- **Incidents & observations**: falls, aggression, alarms.
- **Medication & pathways**: counts of medication classes, pathway adherence (e.g., Medimo).
- **HR skills** (for mapping): available competencies (AFAS), and **roster** constraints (Ortec).

> Data is joined at **client/episode** level, then aggregated to stable windows (e.g., weekly). PII is minimized; role-based access applies.

---

## Process (from data to action)
1. **Define objectives & guardrails**: what decisions will cohorts inform (planning, tariffs, prevention)? Which attributes are *in* or *out* (e.g., exclude protected characteristics).
2. **Feature engineering**: workload minutes by category, ADL/acuity scores, incident frequencies, medication classes, case-mix indicators, comorbidities, utilization trends.
3. **Dimensionality reduction** (optional): PCA/UMAP to capture structure and denoise.
4. **Clustering**: build cohorts with **k‑means/Gaussian Mixture** (parametric) or **HDBSCAN** (density‑based) to allow variable cohort sizes and handle outliers.
5. **Profiling & naming**: generate **cohort cards** (size, needs, top features, risk patterns) and clinician‑readable labels (e.g., “High‑care, cognitive impairment & falls”).
6. **Validation**: internal metrics (silhouette, Davies–Bouldin) and **external** outcomes (incidents, LOS, readmissions) to confirm business relevance.
7. **Deployment**: expose cohort ID in dashboards and planning tools; update monthly/quarterly.

---

## Modeling options
- **Clustering**: k‑means, Gaussian Mixture, HDBSCAN, Spectral clustering (for non‑convex structures).
- **Semi‑supervised constraints**: **must‑link/cannot‑link** pairs guided by clinicians (align with policy realities).
- **Stability checks**: bootstrapped clustering to ensure cohorts are robust.
- **Drift monitoring**: detect when distributions shift and retrain.

---

## Decision & action integration
- **Planning & staffing**: cohort‑level demand feeds **forecasting** (#1) and **workforce optimization** (#2) with tailored thresholds and skill mixes.
- **Prevention programs**: target high‑risk cohorts (e.g., falls, polypharmacy) with specific interventions.
- **Financial steering**: identify under‑/over‑compensated cohorts; inform contract negotiations and productization.
- **Care pathways**: map cohort to protocol bundles and check adherence.

---

## Governance, privacy & risk
- **GDPR & PHI minimization**: include only necessary clinical/operational features; pseudonymize for modeling.
- **Fairness & explainability**: document excluded sensitive attributes; provide **prototype representatives** and **feature contributions** for each cohort.
- **Change management**: review cohort definitions with clinical leads; publish versioned cohort cards.
- **Safety**: cohorts inform decisions but do not replace clinical judgment.

---

## Success criteria
- ↓ **within‑cohort workload variance** and ↑ forecast accuracy.
- ↑ **operational stability** (fewer last‑minute changes).
- **Measurable outcome gains** (e.g., fewer incidents) in targeted cohorts.
- Positive manager & clinician feedback on interpretability and usefulness.

---

## Demo/POC outline
- **Scope**: 6–12 months data for 2–3 departments.
- **Method**: engineer features → cluster → produce cohort cards → validate on outcomes.
- **Dashboard**: cohort sizes, profiles, outcomes, and planning overlays.
- **What‑if**: simulate staffing rules or interventions per cohort and compare KPIs.

---

## Variants & extensions
- **Dynamic cohorting**: allow clients to move cohorts as needs change.
- **Segmentation + scoring**: combine with **risk scores** (e.g., falls) for prioritization inside a cohort.
- **Regional planning**: roll up cohort demand to municipality/region for capacity agreements.