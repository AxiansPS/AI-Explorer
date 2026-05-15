import React from 'react';
import { X } from 'lucide-react';
import { UseCase, getUseCaseContent } from '../utils/useCases';
import { Button } from './ui/button';

interface UseCaseModalProps {
  useCase: UseCase;
  imageSrc: string;
  onClose: () => void;
  language?: 'en' | 'nl';
}

export const UseCaseModal: React.FC<UseCaseModalProps> = ({ useCase, imageSrc, onClose, language = 'en' }) => {
  // Get language-specific content
  const content = getUseCaseContent(useCase, language);
  const displayTitle = language === 'nl' && useCase.metadata.title_nl ? useCase.metadata.title_nl : useCase.metadata.title;
  
  // Remove the first H1 title and any horizontal rules from content
  const contentWithoutTitle = content
    .replace(/^#\s+.+$/m, '') // Remove first H1
    .replace(/^---+$/gm, '')   // Remove horizontal rules
    .trim();
  
  // Parse markdown to HTML with proper formatting
  const parseMarkdown = (markdown: string) => {
    // First, handle horizontal rules (remove them)
    let html = markdown.replace(/^---+$/gm, '');
    
    // Handle headers
    html = html.replace(/^### (.*$)/gim, '<h4 class="text-lg font-semibold text-cyan-300 mt-6 mb-3">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="text-xl font-semibold text-cyan-400 mt-8 mb-4">$1</h3>');
    
    // Handle bold text (must come before lists to handle bold in lists)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300 font-semibold">$1</strong>');
    
    // Handle lists - preserve bold text within
    html = html.replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 leading-relaxed">$1</li>');
    html = html.replace(/(<li[^>]*>.*?<\/li>\s*)+/gs, '<ul class="list-disc space-y-1 mb-6 text-gray-200">$&</ul>');
    
    // Handle paragraphs - split by double newlines
    const parts = html.split(/\n\n+/);
    html = parts.map(part => {
      const trimmed = part.trim();
      // Don't wrap if it's already a formatted element
      if (trimmed && !trimmed.startsWith('<h') && !trimmed.startsWith('<ul') && !trimmed.startsWith('<li')) {
        return `<p class="mb-4 leading-relaxed text-gray-200">${trimmed}</p>`;
      }
      return trimmed;
    }).join('\n\n');
    
    return html;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 border border-cyan-500/30 rounded-xl shadow-2xl">
        {/* Close Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-gray-800/95 hover:bg-gray-700 border-cyan-500/50 shadow-lg"
        >
          <X className="w-5 h-5 text-cyan-400" />
        </Button>

        {/* Hero Image */}
        <div className="relative h-72 md:h-80 overflow-hidden rounded-t-xl">
          <img 
            src={imageSrc} 
            alt={displayTitle}
            style={{ objectPosition: 'center 30%' }}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-white">{displayTitle}</h2>
          
          <div className="max-w-none">
            <div 
              className="use-case-content"
              dangerouslySetInnerHTML={{ 
                __html: parseMarkdown(contentWithoutTitle)
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
