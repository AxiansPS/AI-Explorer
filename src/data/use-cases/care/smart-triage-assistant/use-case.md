# Smart Triage Assistant (Protocol‑Guided Intake)

A conversational assistant that supports **triage and intake** by guiding clinicians through protocol‑based questions, extracting key symptoms from free text, checking red‑flag criteria, and proposing a **triage level + next‑best actions** with **clear source citations**. The assistant speeds up safe decision‑making while keeping a **human‑in‑the‑loop** for final approval.

> **Safety note:** This assistant **does not replace clinical judgment**. It provides protocol‑guided suggestions that must be reviewed/confirmed by qualified staff.

---

## Business outcomes & KPIs
- **Faster, more consistent triage** → shorter time‑to‑decision and improved patient flow.
- **Higher safety** via automated red‑flag checks and protocol adherence.
- **Reduced cognitive load** → fewer omissions in high‑pressure situations.
- **Better documentation quality** with structured outputs ready for the EHR.

**Example KPIs**  
Time‑to‑triage (↓), under‑/over‑triage rate vs. gold standard (↓), protocol adherence (↑), percentage of triage notes auto‑drafted (↑), clinician satisfaction (CSAT), re‑triage within 24h (↓).

---

## Beneficiaries
- **Nurses / triage nurses / intake teams** in ED, urgent care, GP‑cooperatives, VVT, and GGZ.
- **Bed & flow coordinators** (earlier signal of urgency and demand).
- **Quality & Safety** (standardization, auditability).
- **IT/Data** (consistent, structured triage data for downstream analytics).

---

## Typical data & systems (examples)
- **EHR/ECD** (e.g., ONS, Ysis, HiX/Epic, Kepler): demographics, complaints, vitals, history.
- **Knowledge bases / protocols**: locally approved triage protocols, red‑flag lists, care pathways (SharePoint/CLB/knowledge portals).
- **Context**: current occupancy/availability to support routing (link to forecasting).
- **Audit store**: logs of prompts, answers, citations, model/version.

> Access is **role‑based**; the assistant shows only information a user is authorized to see. PHI is minimized in prompts.

---

## Process (from input to decision support)
1. **Intake & parsing**  
   - Capture chief complaint (free text + selectable list).  
   - **NLU** extracts symptoms, onset, duration, severity; collects vitals (manual or device feed).
2. **Evidence retrieval**  
   - Retrieve relevant **triage protocol** sections; show **citations** (titles, versions, validity dates).
3. **Risk checks**  
   - Apply **red‑flag rules** (age, vitals, specific symptoms, comorbidities).  
   - Optional **risk score** (e.g., early‑warning style) for additional signal.
4. **Recommendation & next‑best questions**  
   - Propose **triage level** (e.g., high/medium/low urgency or local 5‑level scale), plus **next questions** to disambiguate.  
   - Provide **routing options** (e.g., ED, urgent clinic, home visit, self‑care + follow‑up).
5. **Draft & hand‑off**  
   - Generate a **structured triage note** (SBAR/ISBAR), including cited protocol passages.  
   - User reviews/edits; upon approval, push to EHR and (optionally) create tasks/alerts.
6. **Audit & learning**  
   - Store decisions, citations, and outcomes for quality review and model improvements.

---

## Modeling & orchestration options
- **NLU/NLP**: symptom extraction (NER), complaint classification (`text-classification`), summarization of patient narrative (`summarization-extraction`).
- **Retrieval‑augmented generation (RAG)**: hybrid search (BM25 + embeddings) over **approved protocols**; strict grounding with **mandatory citations**.
- **Decision layer**:  
  - **Rules engine / decision tables** for red flags and hard safety constraints (`decision-automation`).  
  - Optional **risk scoring** (calibrated classifier) to complement rule checks.
- **Guardrails**: refusal to answer beyond protocol scope; require confirmation for high‑risk suggestions; show “why” (evidence snippets).

---

## Decision & action integration
- **In‑workflow UI** (within EHR/ECD): inline citations, suggested triage code, and one‑click note insertion.  
- **Alerts**: trigger when red‑flag criteria met (e.g., abnormal vitals) with clear escalation steps.  
- **Routing**: propose destination based on urgency **and** capacity (optionally pull from occupancy forecasts).  
- **Handover**: auto‑populate handover templates; attach the cited protocol sections for review.

---

## Governance, privacy & risk
- **Clinical governance**: use only **locally approved** triage protocols; version and validity must be visible.  
- **Human‑in‑the‑loop**: the assistant cannot finalize triage—**clinician approval required**.  
- **Calibration & QA**: regular back‑testing vs. gold‑standard triage decisions; monitor under‑/over‑triage and drift.  
- **Privacy**: PHI minimization in prompts; role‑based access; detailed audit trail.  
- **Safety**: conservative defaults (err on safety), explicit conflict handling when sources disagree.

---

## Success criteria
- **≥ 20–30%** reduction in time‑to‑triage (baseline‑adjusted).  
- **Meaningful drop in under‑/over‑triage** vs. baseline without harming flow.  
- **≥ 90%** of assistant outputs include valid **citations** to current protocols.  
- High clinician satisfaction (target CSAT ≥ 4.2/5) and adoption (DAU/WAU).

---

## Demo/POC outline
- **Scope**: 3–5 common chief complaints (e.g., chest pain, dyspnea, fever in elderly, fall with head injury, mental distress).  
- **Corpus**: 100–200 protocol pages with version metadata from your knowledge base.  
- **Gold set**: 50 historical triage cases for evaluation (de‑identified).  
- **Measures**: time‑to‑triage, agreement with gold standard, citation coverage, user feedback.

---

## Variants & extensions
- **Telephone triage** (contact center) and **home‑care intake** (community/VVT).  
- **Self‑service pre‑triage** for patients (strictly restricted sources, layman wording, safety net).  
- **Language support** with controlled translations that preserve clinical meaning.  
- **Decision support for follow‑up** (e.g., next‑day check‑ins, safety‑net instructions).