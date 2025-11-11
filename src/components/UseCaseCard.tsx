import React from 'react';
import { UseCase } from '../utils/useCases';
import { ArrowRight } from 'lucide-react';

interface UseCaseCardProps {
  useCase: UseCase;
  imageSrc: string;
  onClick: () => void;
  language?: 'en' | 'nl';
}

export const UseCaseCard: React.FC<UseCaseCardProps> = ({ useCase, imageSrc, onClick, language = 'en' }) => {
  const displayTitle = language === 'nl' && useCase.metadata.title_nl ? useCase.metadata.title_nl : useCase.metadata.title;
  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border border-cyan-500/30 bg-gray-800/50 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-cyan-400/60 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/20"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={displayTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
          {displayTitle}
        </h4>
        
        {/* Read More */}
        <div className="flex items-center text-cyan-400 text-sm font-medium mt-4 group-hover:gap-3 gap-2 transition-all">
          <span>{language === 'nl' ? 'Bekijk details' : 'View details'}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};
