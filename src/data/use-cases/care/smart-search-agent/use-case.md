# Smart Search Agent

A retrieval‑augmented assistant that helps care professionals **find, understand, and draft** content grounded in official protocols, guidelines, and (authorized) case data. The agent retrieves the most relevant passages, shows **source citations**, and generates structured **drafts** (handover notes, incident summaries, transfer reports) that a human can review and finalize.

---

## Business outcomes & KPIs
- **Time saved at the point of care** by reducing search and manual drafting.
- **Higher first‑time‑right** through consistent use of up‑to‑date protocols.
- **Reduced variation** in documentation quality; better continuity of care.

**Example KPIs**  
Average minutes saved per query/draft, first‑time‑right rate, groundedness (answers with citations), search abandonment rate, adoption (DAU/WAU), user satisfaction (CSAT/NPS).

---

## Beneficiaries
- **Nurses & caregivers** (faster retrieval; protocol‑aligned actions).
- **Physicians & allied health** (quick reference; templated drafts).
- **Quality & Safety** (adherence to guidelines; standardized notes).
- **New staff & trainees** (on‑the‑job decision support and learning).

---

## Typical data & systems (examples)
- **Protocols & work instructions**: clinical guidelines, MIC/incident procedures (SharePoint / knowledge bases).
- **Care records**: ECD/EHR notes and problem lists (role‑based, least‑privilege access; e.g., ONS, Ysis, HiX/Epic).
- **Medication & pathways**: formularies, care pathways (e.g., Medimo).
- **Operational docs**: checklists, forms, templates.
- **Metadata**: version, validity dates, department, patient population.

> **Privacy first**: limit to necessary data; prefer **document retrieval** + **explicit citations**; access enforced by existing role models.

---

## Process (RAG pipeline)
1. **Ingest & normalize**: pull documents from approved repositories; convert to text; de‑duplicate; record version metadata.
2. **Chunk & tag**: split into semantically coherent chunks (e.g., 300–800 tokens) with headings, department, validity period, and source URL.
3. **Indexing**: dual index (keyword/BM25 and vector embeddings) for robust recall; incremental updates.
4. **Retrieval**: hybrid search (keyword + vector) → top‑k passages; **re‑ranking** (cross‑encoder) for precision.
5. **Grounded drafting**: prompt the LLM to **quote and cite** retrieved passages; fill **structured templates** (handover, incident summary, discharge note).
6. **User review**: user edits/approves; captured **feedback** refines future retrieval.
7. **Audit & storage**: store prompts/answers/citations for audit; log which sources were used.

---

## Draft types (examples)
- **Clinical handover summary** (SBAR or ISBAR template).
- **Incident/MIC summary** linked to the relevant protocol.
- **Transfer/discharge summary** with medication and follow‑up tasks.
- **Checklist extraction** (e.g., pre‑procedure checks) from protocols.

---

## Modeling & configuration
- **Embeddings**: healthcare‑tuned or multilingual embeddings; evaluate domain recall.
- **Hybrid retrieval**: BM25 + vector; **re‑ranking** with cross‑encoders improves top‑3 precision.
- **Groundedness guardrails**: require citations for each factual claim; restrict generation to retrieved context; refusal if confidence is low or sources conflict.
- **Template prompts**: separate prompts for Search vs. Draft; include style, tone, and local policy references.
- **Versioning**: prefer latest valid protocol; warn on expired content.

---

## Decision & action integration
- **Inline citations** (link back to SharePoint/EHR doc section).
- **One‑click insert** into the EHR note field (respecting role‑based access).
- **Task suggestions**: create follow‑up tasks based on the cited protocol.
- **Explainability**: “Why this recommendation?” → show the exact paragraph.

---

## Governance, privacy & risk
- **DPIA & lawful basis**: required for any use of real patient data; start with protocol‑only retrieval if needed.
- **Access control**: enforce existing RBAC; no cross‑department leakage.
- **PHI minimization**: default to **protocol‑only** for search; patient data used only when the user is in a **care relationship** and explicitly requests it.
- **Auditability**: store citations, versions, and user approvals; enable quality audits.
- **Bias & safety**: model does not synthesize medical advice beyond the policy text; always show sources; encourage clinical judgment (**human‑in‑the‑loop**).

---

## Success criteria
- ≥ **30–50% time reduction** for finding and drafting standard notes.
- ≥ **90% answers with valid citations**; groundedness score above threshold.
- **Protocol adherence** improvement (measured via random audits).
- Positive user satisfaction (e.g., CSAT ≥ 4.2/5).

---

## Demo/POC outline
- **Scope**: 150–300 high‑value protocol documents for 2–3 wards; 3–5 common tasks (handover, incident summary, medication check).
- **Golden set**: 50 Q&A pairs to evaluate retrieval precision/recall and groundedness.
- **Dashboard**: latency, top‑k precision, citation coverage, user feedback loop.
- **Rollout**: begin with **protocols‑only**; phase‑2 gated access to patient context.

---

## Variants & extensions
- **Mantelzorg chat**: a citizen‑facing version with layman explanations and strongly restricted sources.
- **Multilingual support**: translate drafts while keeping citations in the original language.
- **Form filling**: extract structured fields (e.g., incident date, location) directly from the cited text.
- **Safety checker**: detect ungrounded claims before a draft can be saved.