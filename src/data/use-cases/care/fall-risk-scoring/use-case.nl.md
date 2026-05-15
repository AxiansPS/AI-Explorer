# Valrisico Scoring & Preventie

Identificeer patiënten of cliënten met een verhoogd **valrisico** op basis van medische, functionele en contextuele factoren. Het model berekent een risicoscore en geeft aanbevelingen voor preventieve interventies (bijv. extra toezicht, hulpmiddelen, aanpassingen in de omgeving).  

---

## Bedrijfsresultaten & KPI's 
- **Minder valincidenten** → verbeterde veiligheid en lagere zorgkosten.  
- **Gerichte inzet** van preventieve maatregelen → kosteneffectief.  
- **Betere zorgkwaliteit** en hogere patiënttevredenheid.  

**Voorbeeld KPI's**  
Aantal vallen per 1.000 zorgdagen, % hoog-risico patiënten met preventieplan, voorspellingsnauwkeurigheid (AUC, recall), tijdigheid van interventies.

---

## Belanghebbenden
- **Zorgprofessionals** (verpleegkundigen, verzorgenden).  
- **Kwaliteit & Veiligheid teams**.  
- **Operatie** (planning extra toezicht).  
- **Management** (veiligheidsindicatoren).  

---

## Typische data & systemen
- **ECD/EHR**: anamnese, mobiliteit, ADL-scores, medicatie (bijv. ONS, Ysis, Medimo).  
- **Incidentenlogboeken**: eerdere valpartijen.  
- **Context**: kamerindeling, hulpmiddelen, tijdstip, omgeving.  
- **Optioneel**: sensordata (domotica) voor real-time signalen.  

---

## Proces
1. **Data verzamelen**: historische valincidenten + patiëntkenmerken.  
2. **Feature engineering**: leeftijd, medicatieprofiel, mobiliteit, cognitieve status, omgeving.  
3. **Model**: classificatie (hoog/midden/laag risico) of probabilistische score.  
4. **Output**: risicoscore + belangrijkste factoren (uitlegbaarheid).  
5. **Integratie**: dashboard + meldingen in ECD; koppeling met preventieprotocol.  

---

## Modellering opties
- **Baseline**: logistische regressie (interpreteerbaar).  
- **ML**: gradient boosting (XGBoost/LightGBM) voor hogere nauwkeurigheid.  
- **Uitlegbaarheid**: SHAP-plots of feature importance.  
- **Evaluatie**: AUC, recall (hoog-risico), calibratieplots.  

---

## Besluitvorming & actie-integratie
- **Waarschuwingen** voor hoog-risico → automatische taak in ECD.  
- **Aanbevelingen**: hulpmiddelen, extra toezicht, fysiotherapie.  
- **Rapportage**: trends per afdeling, effectiviteit van interventies.  

---

## Governance & risico
- **Privacy**: alleen noodzakelijke zorgdata, DPIA vereist.  
- **Bias**: monitor op leeftijd, geslacht, diagnosegroep.  
- **Menselijke validatie**: zorgprofessional beoordeelt advies.  

---

## Succescriteria
- Reductie van valincidenten > X% binnen 6 maanden.  
- Hoge adoptie door zorgteams.  
- Stabiele modelprestaties (AUC > 0.8).  

---

## Demo/POC-opzet
- **Dataset**: 12 maanden valincidenten + patiëntkenmerken.  
- **Output**: dashboard met risicoscores en belangrijkste factoren.  
- **Scenario**: “Wat als” interventies toegepast worden.  

---

## Varianten & uitbreidingen
- Breder **incidentrisico** (agressie, dwalen).  
- Real-time waarschuwingen via sensoren (domotica).  
- Koppeling met **personeelsplanning** voor extra toezicht.  
