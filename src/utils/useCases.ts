export interface UseCaseMetadata {
  id: string;
  title: string;
  title_nl?: string;
  company: string;
  sector: string;
  tags: string[];
}

export interface UseCase {
  metadata: UseCaseMetadata;
  content: string;
}

// Import tag hierarchy
import tagHierarchy from '../data/use-cases/tags.json';

// Function to expand tags based on hierarchy
function expandTags(tags: string[]): string[] {
  const expandedSet = new Set<string>();
  
  for (const tag of tags) {
    if (tagHierarchy[tag as keyof typeof tagHierarchy]) {
      const hierarchy = tagHierarchy[tag as keyof typeof tagHierarchy];
      hierarchy.forEach(hierarchyTag => expandedSet.add(hierarchyTag));
    } else {
      // If tag not in hierarchy, add it as-is
      expandedSet.add(tag);
    }
  }
  
  return Array.from(expandedSet);
}

// Function to remove lowest-level tags, keeping only higher-level ones
function removeLowestLevelTags(expandedTags: string[]): string[] {
  const lowestLevelTags = Object.keys(tagHierarchy);
  return expandedTags.filter(tag => !lowestLevelTags.includes(tag));
}

// Function to process use case tags
function processUseCaseTags(tags: string[]): string[] {
  const expanded = expandTags(tags);
  return removeLowestLevelTags(expanded);
}

// Dynamically load use cases (metadata + markdown) from the repository
const metaModules = import.meta.glob('../data/use-cases/**/metadata.json', { eager: true, import: 'default' }) as Record<string, UseCaseMetadata>;
const contentModules = import.meta.glob('../data/use-cases/**/use-case.md', { eager: true, as: 'raw' }) as Record<string, string>;
const contentModulesNL = import.meta.glob('../data/use-cases/**/use-case.nl.md', { eager: true, as: 'raw' }) as Record<string, string>;

const LOADED_USE_CASES: UseCase[] = Object.entries(metaModules).map(([path, metadata]) => {
  const dir = path.replace(/\/metadata\.json$/, '');
  const contentPath = `${dir}/use-case.md`;
  const content = contentModules[contentPath] ?? '';
  
  // Extract sector from folder path
  const pathParts = path.split('/');
  const sectorIndex = pathParts.findIndex(part => part === 'use-cases') + 1;
  const sector = pathParts[sectorIndex] || 'unknown';
  
  return { 
    metadata: {
      ...metadata,
      sector: sector
    }, 
    content 
  };
});

// Static use cases data - in a real app this would be loaded dynamically
const USE_CASES: UseCase[] = [
  {
    metadata: {
      id: "itho-teams-helpdesk-agent",
      title: "AI Helpdesk/Teams Agent",
      company: "Itho Daalderop",
      sector: "Industry",
      tags: ["knowledge-retrieval", "document-search-drafting", "smart-assistants", "text-analysis", "summarization-extraction", "text-classification", "sentiment-analysis"]
    },
    content: `# AI Helpdesk/Teams Agent — Itho Daalderop

**One‑liner**  
A **Teams‑native copilot** that grounds on KB articles, tickets, and product docs to **triage**, **auto‑draft** responses with citations, and **auto‑route** cases—following a **Fabric Data Agent** pattern with Maestro integration.

## Business problem
High ticket volumes; slow knowledge retrieval; inconsistent answers; SLA pressure.

## Solution overview
- **User journey:** User asks in Teams → intent detection → **context retrieval (RAG)** → **auto‑draft** reply → human approve/send → feedback loop.  
- **Automation:** Priority **auto‑routing** using metadata; *optional* auto‑close for high‑confidence known issues.  
- **Guardrails:** Role‑based retrieval, prompt governance, approval thresholds, audit logs.

## Data & models
- Fabric semantic model (Gold); vector index; classification for intent/urgency; **sentiment** for escalation; GPT‑family for drafting.

## KPIs & value
First‑contact resolution, mean handle time, deflection rate, SLA adherence, CSAT.

## Risks & controls
PII exposure → RBAC + redaction; wrong routing → confidence thresholds + fallbacks.`
  },
  {
    metadata: {
      id: "metaalunie-slimme-zoekmachine",
      title: "Smart RAG Search for the Metaalunie Website",
      company: "Metaalunie",
      sector: "Industry",
      tags: ["knowledge-retrieval", "document-search-drafting", "summarization-extraction", "text-classification"]
    },
    content: ` # Smart RAG Search for Members — Metaalunie

**One‑liner**  
Prompt Flow–orchestrated **RAG** with **semantic vector search** (Azure AI Search), **dense reranking**, and **Azure OpenAI** to deliver grounded, citation‑rich answers on the Metaalunie website. Includes **policy overrule** responses and **MAT** operations.

## Business problem
Members need instant, reliable answers across policy pages and handbooks without navigating silos.

## Solution overview
- **Architecture:** Fabric Lakehouse → chunking → **embeddings** → vector index + semantic reranker → **grounded generation**.  
- **Prompting:** System prompt, tone, few‑shots, and **overrule** for sensitive topics (policy‑compliant canned responses).  
- **Ops:** Ingestion from Maestro to search index, health telemetry, guardrail monitoring (content safety, PII redaction).

## Data & models
- **Sources:** Website corpus in Fabric (gold)  
- **Models:** Text‑embedding for vectors; GPT‑family for answer synthesis  
- **Indexing:** Azure AI Search (vector + hybrid)

## KPIs & value
Self‑service rate, p95 answer latency, citation coverage %, deflection vs. service desk.

## Risks & controls
- Hallucination → strict grounding, citation thresholds  
- Policy topics → overrule responses  
- Drift → scheduled re‑indexing and evaluation sets`
  }
];

// Process use case tags to expand and filter them  
const SOURCE_USE_CASES = LOADED_USE_CASES.length ? LOADED_USE_CASES : USE_CASES;

const PROCESSED_USE_CASES: UseCase[] = SOURCE_USE_CASES.map(useCase => ({
  ...useCase,
  metadata: {
    ...useCase.metadata,
    tags: processUseCaseTags(useCase.metadata.tags),
    sector: (useCase.metadata.sector || '').toLowerCase() // normalize sector to lowercase
  }
}));

// Mapping from node names to tag equivalents
const NODE_TAG_MAPPING: Record<string, string> = {
  'Information Retrieval': 'information-retrieval',
  'Smart Assistants': 'smart-assistants',
  'Text Analysis': 'text-analysis',
  'Predict & Plan': 'predict-plan',
  'Predict': 'predict',
  'Decision Making': 'decision-making',
  'Optimize': 'optimize',
  'Image Recognition': 'image-recognition',
  'Detect': 'detect',
  // Dutch equivalents (Business NL taxonomy)
  'Informatie Opvragen': 'information-retrieval',
  'Slimme Assistenten': 'smart-assistants',
  'Tekstanalyse': 'text-analysis',
  'Voorspellen': 'predict',
  'Optimaliseren': 'optimize',
  'Detecteren': 'detect'
};

// Prefer stable node IDs over localized names when mapping to tags
const NODE_ID_TAG_MAPPING: Record<string, string> = {
  // Common IDs used across taxonomies
  'information-retrieval': 'information-retrieval',
  'smart-assistants': 'smart-assistants',
  'text-analysis': 'text-analysis',
  'predict': 'predict',
  'decision-making': 'decision-making',
  'optimize': 'optimize',
  'image-recognition': 'image-recognition',
  'detect': 'detect',
  'predict-plan': 'predict-plan'
};

export function getUseCaseContent(useCase: UseCase, language: 'en' | 'nl' = 'en'): string {
  if (language === 'nl') {
    const metaPath = Object.keys(metaModules).find(path => {
      const meta = metaModules[path];
      return meta.id === useCase.metadata.id;
    });
    if (metaPath) {
      const dir = metaPath.replace(/\/metadata\.json$/, '');
      const nlPath = `${dir}/use-case.nl.md`;
      return contentModulesNL[nlPath] || useCase.content;
    }
  }
  return useCase.content;
}

export function getUseCasesForNode(nodeKey: string, businessFocus?: 'care' | 'industry'): UseCase[] {
  // Resolve tag by ID first (stable), then fall back to localized name mapping
  const tag = NODE_ID_TAG_MAPPING[nodeKey] ?? NODE_TAG_MAPPING[nodeKey];
  if (!tag) return [];
  
  return PROCESSED_USE_CASES.filter(useCase => {
    const hasTag = useCase.metadata.tags.includes(tag);
    
    // If businessFocus is specified, filter by sector (both lowercase)
    if (businessFocus) {
      return hasTag && (useCase.metadata.sector === businessFocus);
    }
    
    return hasTag;
  });
}

export function getAllUseCases(): UseCase[] {
  return PROCESSED_USE_CASES;
}