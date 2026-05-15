import React, { useState } from 'react';
import { Lightbulb, Cog, Target, TrendingUp, AlertTriangle, Check, AlertCircle, Building2, Rocket, ShieldAlert } from 'lucide-react';
import { TreeNodeData } from '../types/treeTypes';
import { getUseCasesForNode, getUseCaseContent } from '../utils/useCases';
import { UseCaseCard } from './UseCaseCard';
import { UseCaseModal } from './UseCaseModal';
import qualityInspectionImage from '../assets/use-cases/automated-quality-inspection.jpg';
import demandForcastingImage from '../assets/use-cases/demand-forecasting.png';
import knowledgeAgent from'../assets/use-cases/knowledge-agent.png';
import maintenanceLogAnalytics from'../assets/use-cases/maintenance-log-analytics.jpg';
import ovenTemperatureOptimization from'../assets/use-cases/oven-temperature-optimization.jpg';
import predictiveMaintenance from'../assets/use-cases/predictive-maintenance.png';
import productionProcessAutomation from'../assets/use-cases/production-process-automation.jpg';
import careSmartSearchAgent from '../assets/use-cases/care-smart-search-agent.jpg';
import smartWebsiteSearchAgent from '../assets/use-cases/industry-smart-website-search.png';
import routePlanningOrderPickers from '../assets/use-cases/route-planning-order-pickers.png';
import sentimentAnalysisIndustry from '../assets/use-cases/sentiment-analysis-industry.png';
import bedOccupancyForecasting from '../assets/use-cases/bed-occupancy-forecasting.jpg';
import absenteeismAnomalyDetection from '../assets/use-cases/absenteeism-anomaly-detection.jpg';
import careDemandSegmentation from '../assets/use-cases/care-demand-segmentation.jpg';
import fallRiskScoring from '../assets/use-cases/fall-risk-scoring.jpg';
import smartTriageAssistant from '../assets/use-cases/smart-triage-assistant.jpg';
import workforceOptimization from '../assets/use-cases/workforce-optimization.jpg';
import sentimentAnalysisCare from '../assets/use-cases/sentiment-analysis-care.jpg';

interface DetailCardProps {
  node: TreeNodeData;
  parentName?: string;
  className?: string;
  isBusinessMode?: boolean;
  businessFocus?: 'care' | 'industry';
  language?: 'en' | 'nl';
}

const USE_CASE_IMAGES: Record<string, string> = {
  'automated-quality-inspection': qualityInspectionImage,
  'demand-forecasting': demandForcastingImage,
  'internal-knowledge-agent': knowledgeAgent,
  'maintenance-log-analysis': maintenanceLogAnalytics,
  'oven-temperature-optimization': ovenTemperatureOptimization,
  'predictive-maintenance': predictiveMaintenance,
  'production-process-optimization': productionProcessAutomation,
  'care-smart-search-agent': careSmartSearchAgent,
  'smart-website-search-agent': smartWebsiteSearchAgent,
  'route-planning-order-pickers': routePlanningOrderPickers,
  'sentiment-analysis': sentimentAnalysisIndustry,
  'care-occupancy-bed-forecasting': bedOccupancyForecasting,
  'care-absenteeism-anomaly-detection': absenteeismAnomalyDetection,
  'care-demand-segmentation': careDemandSegmentation,
  'care-fall-risk-scoring': fallRiskScoring,
  'care-sentiment-analysis-feedback': sentimentAnalysisCare,
  'care-dossier-agent-rag': careSmartSearchAgent,
  'care-smart-triage-assistant': smartTriageAssistant,
  'care-workforce-optimization': workforceOptimization,
};

export const DetailCard: React.FC<DetailCardProps> = ({ node, parentName, className = '', isBusinessMode = false, businessFocus, language = 'en' }) => {
  const useCases = isBusinessMode ? getUseCasesForNode(node.id || node.name, businessFocus) : [];
  const isLeafNode = !node.children || node.children.length === 0;
  const [selectedUseCase, setSelectedUseCase] = useState<typeof useCases[0] | null>(null);
  
  const labels = {
    realWorldApps: language === 'nl' ? 'Praktijkvoorbeelden' : 'Real-World Applications',
    gettingStarted: language === 'nl' ? 'Aan de slag' : 'Getting Started',
    commonPitfalls: language === 'nl' ? 'Valkuilen en hoe ze te vermijden' : 'Common Pitfalls & How to Avoid Them',
    overview: language === 'nl' ? 'Overzicht' : 'Overview',
    howItWorks: language === 'nl' ? 'Hoe het werkt' : 'How It Works',
    applications: language === 'nl' ? 'Toepassingen' : 'Applications',
    advantages: language === 'nl' ? 'Voordelen' : 'Advantages',
    limitations: language === 'nl' ? 'Beperkingen' : 'Limitations',
    category: language === 'nl' ? 'Categorie' : 'Category',
  };
  // Business mode with use cases - new layout
  if (isBusinessMode && isLeafNode && useCases.length > 0) {
    return (
      <div className="contents">
        <div className={className}>
          {/* Descriptive Introduction */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">{node.name}</h1>
            <p 
              className="text-xl text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: node.overview }}
            />
          </div>

          {/* Use Cases Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-6 flex items-center">
              <Building2 className="w-6 h-6 mr-3" />
              {labels.realWorldApps}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map((useCase) => (
                 <UseCaseCard
                  key={useCase.metadata.id}
                  useCase={useCase}
                  imageSrc={USE_CASE_IMAGES[useCase.metadata.id] || qualityInspectionImage}
                   onClick={() => setSelectedUseCase(useCase)}
                   language={language}
                />
              ))}
            </div>
          </div>

          {/* Getting Started Section */}
          {node.gettingStarted && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-cyan-400 mb-6 flex items-center">
                <Rocket className="w-6 h-6 mr-3" />
                {labels.gettingStarted}
              </h2>
              <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-6">
                <ul className="space-y-3">
                  {node.gettingStarted.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="text-green-400 mt-1 w-5 h-5 flex-shrink-0" />
                      <span className="text-gray-100 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Common Pitfalls Section */}
          {node.pitfalls && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-cyan-400 mb-6 flex items-center">
                <ShieldAlert className="w-6 h-6 mr-3" />
                {labels.commonPitfalls}
              </h2>
              <div className="bg-gray-800/50 border border-yellow-500/30 rounded-lg p-6">
                <ul className="space-y-3">
                  {node.pitfalls.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <AlertTriangle className="text-yellow-400 mt-1 w-5 h-5 flex-shrink-0" />
                      <span className="text-gray-100 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Use Case Modal */}
        {selectedUseCase && (
          <UseCaseModal
            useCase={selectedUseCase}
            imageSrc={USE_CASE_IMAGES[selectedUseCase.metadata.id] || qualityInspectionImage}
            onClose={() => setSelectedUseCase(null)}
            language={language}
          />
        )}
      </div>
    );
  }

  // Technical mode or non-leaf nodes - original layout
  return (
    <div className={`bg-gray-800/50 border-cyan-500/30 backdrop-blur-sm shadow-2xl rounded-lg border ${className}`}>
      {/* Card Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg p-6">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center space-x-3">
          <Lightbulb className="w-6 h-6" />
          <span>{node.name}</span>
        </h2>
        {parentName && (
          <p className="text-cyan-100 text-base mt-2">{labels.category}: {parentName}</p>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 text-gray-100">
        <div className="grid gap-6">
          {/* Overview */}
          {node.overview && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center text-cyan-400">
                <Lightbulb className="w-4 h-4 mr-2" />
                {labels.overview}
              </h3>
              <p className="text-base leading-relaxed">{node.overview}</p>
            </div>
          )}

          {/* How It Works */}
          {node.howItWorks && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center text-cyan-400">
                <Cog className="w-4 h-4 mr-2" />
                {labels.howItWorks}
              </h3>
              <p className="text-base leading-relaxed">{node.howItWorks}</p>
            </div>
          )}

          {/* Applications */}
          {node.applications && node.applications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center text-cyan-400">
                <Target className="w-4 h-4 mr-2" />
                {labels.applications}
              </h3>
              <ul className="space-y-2">
                {node.applications.map((app, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Check className="text-green-400 mt-1 w-4 h-4 flex-shrink-0" />
                    <span className="text-base leading-relaxed">{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Advantages */}
          {node.advantages && node.advantages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center text-cyan-400">
                <TrendingUp className="w-4 h-4 mr-2" />
                {labels.advantages}
              </h3>
              <ul className="space-y-2">
                {node.advantages.map((advantage, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Check className="text-green-400 mt-1 w-4 h-4 flex-shrink-0" />
                    <span className="text-base leading-relaxed">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Limitations */}
          {node.limitations && node.limitations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center text-cyan-400">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {labels.limitations}
              </h3>
              <ul className="space-y-2">
                {node.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertCircle className="text-yellow-400 mt-1 w-4 h-4 flex-shrink-0" />
                    <span className="text-base leading-relaxed">{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
