# Slimme Zoekagent

**Korte beschrijving**  
Een retrieval‑augmented assistent die zorgprofessionals helpt om **informatie te vinden, begrijpen en opstellen**, gebaseerd op officiële protocollen, richtlijnen en (geautoriseerde) casusdata. De agent haalt de meest relevante passages op, toont **bronverwijzingen** en genereert gestructureerde **concepten** (overdrachtsnotities, incidentverslagen, overdrachtsrapporten) die door een mens kunnen worden beoordeeld en afgerond.  

---

## Bedrijfsresultaten & KPI's 
- **Tijdbesparing aan het zorgbed** door minder zoekwerk en handmatig schrijven.  
- **Hogere first‑time‑right** door consistente toepassing van actuele protocollen.  
- **Minder variatie** in documentatiekwaliteit; betere continuïteit van zorg.  

**Voorbeeld KPI's**  
Gemiddelde minuten bespaard per zoekopdracht/concept, first‑time‑right percentage, groundedness (antwoorden met bronverwijzing), zoekafbreekpercentage, adoptie (DAU/WAU), gebruikerswaardering (CSAT/NPS).

---

## Belanghebbenden
- **Verpleegkundigen & verzorgenden** (sneller zoeken; protocolgerichte acties).  
- **Artsen & paramedici** (snelle referentie; voorgedefinieerde concepten).  
- **Kwaliteit & Veiligheid** (naleving richtlijnen; gestandaardiseerde notities).  
- **Nieuw personeel & trainees** (besluitvorming en leren op de werkvloer).  

---

## Typische data & systemen (voorbeelden)
- **Protocollen & werkinstructies**: klinische richtlijnen, MIC/incidentprocedures (SharePoint / kennisbanken).  
- **Zorgdossiers**: ECD/EHR-notities en probleemlijsten (rolgebaseerde toegang; bijv. ONS, Ysis, HiX/Epic).  
- **Medicatie & zorgpaden**: formularia, zorgpaden (bijv. Medimo).  
- **Operationele documenten**: checklists, formulieren, sjablonen.  
- **Metadata**: versie, geldigheidsdatum, afdeling, patiëntpopulatie.  

> **Privacy eerst**: beperk tot noodzakelijke data; geef voorkeur aan **document retrieval** + **expliciete bronverwijzingen**; toegang via bestaande rolmodellen.

---

## Proces (RAG-pijplijn)
1. **Inladen & normaliseren**: documenten ophalen uit goedgekeurde bronnen; converteren naar tekst; dedupliceren; versiegegevens vastleggen.  
2. **Chunken & taggen**: splitsen in semantisch coherente stukken (bijv. 300–800 tokens) met koppen, afdeling, geldigheidsperiode en bron-URL.  
3. **Indexeren**: dubbele index (keyword/BM25 en vector embeddings) voor robuuste recall; incrementele updates.  
4. **Ophalen**: hybride zoekopdracht (keyword + vector) → top‑k passages; **her-rangschikking** (cross‑encoder) voor precisie.  
5. **Gegrond concept genereren**: LLM aansturen om **geciteerde passages** te gebruiken; invullen van **gestructureerde sjablonen** (overdracht, incident, ontslag).  
6. **Gebruikersreview**: gebruiker bewerkt/keurt goed; **feedback** verfijnt toekomstige retrieval.  
7. **Audit & opslag**: prompts/antwoorden/verwijzingen opslaan voor audit; log welke bronnen zijn gebruikt.  

---

## Concepttypen (voorbeelden)
- **Klinische overdrachtsnotitie** (SBAR of ISBAR-sjabloon).  
- **Incident/MIC-samenvatting** gekoppeld aan relevant protocol.  
- **Overdrachts-/ontslagrapport** met medicatie en vervolgacties.  
- **Checklistextractie** (bijv. pre-procedure checks) uit protocollen.  

---

## Modellering & configuratie
- **Embeddings**: zorgspecifieke of meertalige embeddings; evaluatie op domeinrecall.  
- **Hybride retrieval**: BM25 + vector; **her-rangschikking** met cross‑encoders verbetert top‑3 precisie.  
- **Groundedness-waarborgen**: vereis bronverwijzing bij elke feitelijke claim; beperk generatie tot opgehaalde context; weiger bij lage zekerheid of conflicterende bronnen.  
- **Sjabloonprompts**: aparte prompts voor Zoeken vs. Opstellen; inclusief stijl, toon en lokale beleidsreferenties.  
- **Versiebeheer**: geef voorkeur aan laatste geldige protocol; waarschuw bij verlopen inhoud.  

---

## Besluitvorming & actie-integratie
- **Inline bronverwijzingen** (link naar SharePoint/EHR-sectie).  
- **One‑click invoeging** in EHR-notitieveld (rolgebaseerde toegang).  
- **Taaksuggesties**: maak vervolgacties aan op basis van geciteerd protocol.  
- **Uitlegbaarheid**: “Waarom deze aanbeveling?” → toon exacte paragraaf.  

---

## Governance, privacy & risico
- **DPIA & wettelijke basis**: vereist bij gebruik van echte patiëntdata; begin met alleen protocolretrieval.  
- **Toegangscontrole**: handhaaf bestaande RBAC; geen afdelingsoverstijgende toegang.  
- **PHI-minimalisatie**: standaard alleen protocollen; patiëntdata alleen bij **zorgrelatie** en expliciet verzoek.  
- **Auditbaarheid**: sla verwijzingen, versies en goedkeuringen op; maak kwaliteitsaudits mogelijk.  
- **Bias & veiligheid**: model geeft geen medisch advies buiten beleidstekst; toon altijd bronnen; klinisch oordeel blijft leidend (**mens-in-de-loop**).  

---

## Succescriteria
- ≥ **30–50% tijdbesparing** bij zoeken en opstellen van standaardnotities.  
- ≥ **90% antwoorden met geldige bronverwijzing**; groundedness-score boven drempel.  
- **Verbetering in protocolnaleving** (gemeten via steekproefaudits).  
- Positieve gebruikerswaardering (bijv. CSAT ≥ 4.2/5).  

---

## Demo/POC-opzet
- **Scope**: 150–300 waardevolle protocoldocumenten voor 2–3 afdelingen; 3–5 veelvoorkomende taken (overdracht, incident, medicatiecheck).  
- **Golden set**: 50 Q&A-pairs om retrievalprecisie/recall en groundedness te evalueren.  
- **Dashboard**: latency, top‑k precisie, bronverwijzingsdekking, gebruikersfeedbackloop.  
- **Uitrol**: start met **alleen protocollen**; fase 2: gecontroleerde toegang tot patiëntcontext.  

---

## Varianten & uitbreidingen
- **Mantelzorgchat**: burgergerichte versie met uitleg in begrijpelijke taal en sterk beperkte bronnen.  
- **Meertalige ondersteuning**: vertaal concepten met behoud van bronverwijzingen in originele taal.  
- **Formuliervulling**: gestructureerde velden (bijv. incidentdatum, locatie) direct uit tekst halen.  
- **Veiligheidschecker**: detecteer ongefundeerde claims vóór opslaan van concept.  