# Sentimentanalyse voor Feedback van Patiënten & Mantelzorgers

Analyseer **vrije tekstfeedback** van patiënten, familieleden en mantelzorgers om **emoties, toon en tevredenheidssignalen** te detecteren. Het systeem classificeert sentiment (positief, neutraal, negatief) en haalt sleutelthema’s uit de tekst, waardoor zorgorganisaties **risico’s vroegtijdig kunnen signaleren**, de servicekwaliteit verbeteren en de impact van interventies kunnen meten.  

---

## Bedrijfsresultaten & KPI's 
- **Vroegtijdige detectie van ontevredenheid** → proactieve oplossing vóór escalatie.  
- **Verbeterde zorgkwaliteit** door bruikbare inzichten uit echte feedback.  
- **Betere naleving** van patiëntbelevings-KPI’s en accreditatie-eisen.  

**Voorbeeld KPI's**  
% negatieve sentimenten gesignaleerd en opgelost, gemiddelde reactietijd op klachten, correlatie tussen sentimenttrends en incidenten, stijging in patiënttevredenheidsscore.

---

## Belanghebbenden
- **Kwaliteit & Veiligheid teams** (monitoren van beleving en veiligheidssignalen).  
- **Patiëntrelaties / Klachtenafhandeling** (prioriteren van urgente gevallen).  
- **Management** (volgen van sentimenttrends per afdeling).  
- **HR** (analyse van medewerkersfeedback op welzijnssignalen).  

---

## Typische databronnen
- **Patiëntenenquêtes** (open tekstvelden).  
- **Klachtformulieren** en **incidentverslagen**.  
- **Chattranscripten** van digitale zorgkanalen.  
- **Social listening** (optioneel, indien beleid dit toestaat).  

---

## Proces
1. **Verzamel tekstdata** uit enquêtes, klachten en chatlogs.  
2. **Voorbewerking**: taaldetectie, anonimisering, tokenisatie.  
3. **Sentimentclassificatie**: positief/neutraal/negatief of multi-class (bijv. boosheid, angst, vertrouwen).  
4. **Thema-extractie**: herken terugkerende onderwerpen (bijv. wachttijd, houding personeel).  
5. **Visualisatie & meldingen**: dashboards met sentimenttrends en doorklik naar gemarkeerde cases.  

---

## Modellering opties
- **Regelgebaseerd + lexicon** voor snelle resultaten (bijv. VADER).  
- **ML/Deep Learning**: transformer-gebaseerde modellen (BERT, RoBERTa) getraind op zorgspecifieke toon.  
- **Uitlegbaarheid**: markeer zinnen die sentimentclassificatie beïnvloeden.  

---

## Besluitvorming & actie-integratie
- **Waarschuwingen** bij sterk negatief sentiment → activeer escalatieworkflow.  
- **Dashboards** voor management: sentiment per afdeling, trend over tijd.  
- **Integratie** met kwaliteitsverbeterprogramma’s en HR-welzijnsinitiatieven.  

---

## Governance & risico
- **Privacy**: anonimiseer persoonlijke gegevens vóór analyse.  
- **Bias**: monitor op taal- of cultuurgebonden vertekening in sentimentmodellen.  
- **Transparantie**: geef voorbeelden waarom een tekst als negatief is geclassificeerd.  

---

## Succescriteria
- Minder onopgeloste klachten.  
- Snellere reactie op negatieve feedback.  
- Positieve correlatie tussen sentimentverbetering en patiënttevredenheid.  

---

## Demo/POC-opzet
- **Scope**: 3–6 maanden aan enquête- en klachtdata.  
- **Output**: dashboard met sentimentverdeling en hoofdthema’s.  
- **Scenario**: simuleer waarschuwing bij piek in negatief sentiment op een afdeling.  

---

## Varianten & uitbreidingen
- **Emotiedetectie** voor slachtofferhulp of triage in GGZ.  
- **Real-time monitoring** van chatkanalen voor escalatie.  
- **Combinatie met samenvatting** voor rapportage aan bestuur.  