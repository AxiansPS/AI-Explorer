# Zorgvraagsegmentatie (Cohorting)

Groepeer patiënten/cliënten in **cohorten** op basis van zorgintensiteit, functionele status, diagnoses, comorbiditeiten, incidentgeschiedenis en zorggebruik. Cohorten maken gerichte planning, personeelsratio’s, preventieprogramma’s en financiële sturing mogelijk (bijv. tarieven/contracten), en verbeteren de stabiliteit en voorspelbaarheid van de operatie.  

---

## Bedrijfsresultaten & KPI's 
- **Voorspelbare werkdruk** en soepelere planning per cohort.  
- **Betere personeelsmix** en vaardigheidsafstemming per cohort.  
- **Gerichte interventies** (bijv. valpreventie, medicatiecontrole) waar ze het meeste effect hebben.  
- **Verbeterde marges** door betere product-/tariefmix en minder verspilling.  

**Voorbeeld KPI's**  
Variantie (σ²) van werkdrukminuten per cliënt binnen cohorten (↓), voorspellingsnauwkeurigheid per cohort (MAPE/MAE), vermijdbare incidenten per 1.000 zorgdagen (↓), marge per cohort (↑), heropname-/overplaatsingspercentage (↓), cohortstabiliteit over tijd (Adjusted Rand Index).  

---

## Belanghebbenden
- **Operatie / Capaciteitsmanagement** (planning per cohort).  
- **Verpleegkundigen & zorgmanagers** (vaardighedenmix, protocolnaleving).  
- **Financiën & Contractering** (tarieven, waardegedreven zorgproducten).  
- **Kwaliteit & Veiligheid** (gerichte preventie).  
- **Data & Analyse** (input voor voorspelling en optimalisatie).  

---

## Typische data & systemen (voorbeelden)
- **ECD/EHR**: diagnoses/probleemlijsten, ADL-scores, urgentie-indicatoren, interventies, verblijfsduur/episode-info (bijv. ONS, Ysis, HiX/Epic, Kepler).  
- **Zorgminuten & tijdregistratie**: geregistreerde activiteiten/complexiteit (bijv. uit ECD of Exact).  
- **Incidenten & observaties**: vallen, agressie, alarmen.  
- **Medicatie & zorgpaden**: aantal medicatieklassen, padnaleving (bijv. Medimo).  
- **HR-vaardigheden** (voor mapping): beschikbare competenties (AFAS), en **roosterbeperkingen** (Ortec).  

> Data wordt samengevoegd op **cliënt/episode**-niveau en geaggregeerd naar stabiele vensters (bijv. wekelijks). PII wordt geminimaliseerd; rolgebaseerde toegang is van toepassing.  

---

## Proces (van data naar actie)
1. **Doelstellingen & kaders definiëren**: welke beslissingen worden door cohorten ondersteund (planning, tarieven, preventie)? Welke attributen zijn *in* of *uit* (bijv. uitsluiten van beschermde kenmerken).  
2. **Feature engineering**: werkdrukminuten per categorie, ADL/urgentie-scores, incidentfrequenties, medicatieklassen, case-mix-indicatoren, comorbiditeiten, gebruikstrends.  
3. **Dimensiereductie** (optioneel): PCA/UMAP om structuur te vangen en ruis te verminderen.  
4. **Clustering**: bouw cohorten met **k-means/Gaussian Mixture** (parametrisch) of **HDBSCAN** (density-based) voor variabele cohortgroottes en outlierbehandeling.  
5. **Profilering & naamgeving**: genereer **cohortkaarten** (grootte, behoeften, topkenmerken, risicoprofielen) en labels leesbaar voor zorgprofessionals (bijv. “Hoog-zorg, cognitieve beperking & vallen”).  
6. **Validatie**: interne metrics (silhouette, Davies–Bouldin) en **externe** uitkomsten (incidenten, verblijfsduur, heropnames) om relevantie te bevestigen.  
7. **Uitrol**: cohort-ID zichtbaar maken in dashboards en planningssystemen; maandelijks/kwartaalgewijs updaten.  

---

## Modellering opties
- **Clustering**: k-means, Gaussian Mixture, HDBSCAN, Spectral clustering (voor niet-convexe structuren).  
- **Semi-supervised constraints**: **must-link/cannot-link** paren gestuurd door zorgprofessionals (afstemming op beleidsrealiteit).  
- **Stabiliteitschecks**: bootstrapped clustering om robuustheid van cohorten te waarborgen.  
- **Drift monitoring**: detecteer verschuivingen in distributies en retrain indien nodig.  

---

## Besluitvorming & actie-integratie
- **Planning & personeelsinzet**: cohortvraag voedt **voorspelling** (#1) en **personeelsoptimalisatie** (#2) met aangepaste drempels en vaardigheidsmix.  
- **Preventieprogramma’s**: richt specifieke interventies op risicocohorten (bijv. vallen, polyfarmacie).  
- **Financiële sturing**: identificeer onder-/overgecompenseerde cohorten; informeer contractonderhandelingen en productontwikkeling.  
- **Zorgpaden**: koppel cohort aan protocolbundels en controleer naleving.  

---

## Governance, privacy & risico
- **AVG & PHI-minimalisatie**: alleen noodzakelijke klinische/operationele kenmerken opnemen; pseudonimiseren voor modellering.  
- **Eerlijkheid & uitlegbaarheid**: documenteer uitgesloten gevoelige attributen; geef **prototypevoorbeelden** en **kenmerkbijdragen** per cohort.  
- **Veranderingsmanagement**: cohortdefinities reviewen met klinische leads; versiebeheer van cohortkaarten publiceren.  
- **Veiligheid**: cohorten ondersteunen beslissingen maar vervangen geen klinisch oordeel.  

---

## Succescriteria
- ↓ **werkdrukvariatie binnen cohorten** en ↑ voorspellingsnauwkeurigheid.  
- ↑ **operationele stabiliteit** (minder last-minute wijzigingen).  
- **Meetbare outcomeverbeteringen** (bijv. minder incidenten) in gerichte cohorten.  
- Positieve feedback van managers & zorgprofessionals over interpretatie en bruikbaarheid.  

---

## Demo/POC-opzet
- **Scope**: 6–12 maanden data voor 2–3 afdelingen.  
- **Methode**: features engineeren → clusteren → cohortkaarten maken → valideren op uitkomsten.  
- **Dashboard**: cohortgroottes, profielen, uitkomsten en planningslagen.  
- **Wat-als**: simuleer personeelsregels of interventies per cohort en vergelijk KPI’s.  

---

## Varianten & uitbreidingen
- **Dynamische cohorting**: cliënten kunnen van cohort wisselen bij veranderende behoeften.  
- **Segmentatie + scoring**: combineren met **risicoscores** (bijv. vallen) voor prioritering binnen een cohort.  
- **Regionale planning**: cohortvraag opschalen naar gemeente/regio voor capaciteitsafspraken.  