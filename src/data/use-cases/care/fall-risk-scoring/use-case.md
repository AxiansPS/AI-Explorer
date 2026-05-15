# Fall Risk Scoring & Prevention

Identify patients or clients with an elevated **fall risk** based on medical, functional, and contextual factors. The model calculates a risk score and provides recommendations for preventive interventions (e.g., extra supervision, assistive devices, environmental adjustments).

---

## Business outcomes & KPIs
- **Fewer fall incidents** → improved safety and lower care costs.
- **Targeted deployment** of preventive measures (cost-effective).
- **Better quality of care** and higher patient satisfaction.

**Example KPIs**  
Number of falls per 1,000 care days, % of high-risk patients with prevention plan, prediction accuracy (AUC, recall), timeliness of interventions.

---

## Beneficiaries
- **Care professionals** (nurses, caregivers).
- **Quality & Safety teams**.
- **Operations** (planning extra supervision).
- **Management** (safety indicators).

---

## Typical data & systems
- **EHR/ECD**: anamnesis, mobility, ADL scores, medication (e.g., ONS, Ysis, Medimo).
- **Incident logs**: previous falls.
- **Context**: room setup, assistive devices, time of day, environment.
- **Optional**: sensor data (domotics) for real-time signals.

---

## Process
1. **Collect data**: historical falls + patient characteristics.
2. **Feature engineering**: age, medication profile, mobility, cognitive status, environment.
3. **Model**: classification (high/medium/low risk) or probabilistic score.
4. **Output**: risk score + top drivers (explainability).
5. **Integration**: dashboard + alerts in EHR; link to prevention protocol.

---

## Modeling options
- **Baseline**: logistic regression (interpretable).
- **ML**: gradient boosting (XGBoost/LightGBM) for higher accuracy.
- **Explainability**: SHAP plots or feature importance.
- **Evaluation**: AUC, recall (high-risk), calibration plots.

---

## Decision & action integration
- **Alerts** for high-risk → automatic task in EHR.
- **Recommendations**: assistive devices, extra supervision, physiotherapy.
- **Reporting**: trends per ward, intervention effectiveness.

---

## Governance & risk
- **Privacy**: only necessary care data, DPIA required.
- **Bias**: monitor for age, gender, diagnosis group bias.
- **Human-in-the-loop**: care professional validates advice.

---

## Success criteria
- Reduction in falls > X% within 6 months.
- High adoption by care teams.
- Stable model performance (AUC > 0.8).

---

## Demo/POC outline
- **Dataset**: 12 months of falls + patient features.
- **Output**: dashboard with risk scores and top drivers.
- **Scenario**: “What if” interventions applied.

---

## Variants & extensions
- Broader **incident risk** (aggression, wandering).
- Real-time alerts via sensors (domotics).
- Link with **staff planning** for extra supervision.