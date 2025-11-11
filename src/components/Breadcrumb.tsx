import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { TreeNodeData } from '../types/treeTypes';
import { Button } from './ui/button';

interface BreadcrumbProps {
  path: TreeNodeData[];
  onNavigate: (index: number) => void;
  onBack: () => void;
  inline?: boolean;
  className?: string;
  showBackButton?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  path,
  onNavigate,
  onBack,
  inline = false,
  className = '',
  showBackButton = true
}) => {
  if (path.length <= 1) return null;

  const shouldShowBackButton = showBackButton && path.length > 1;

  const containerClasses = inline
    ? `flex flex-col items-start gap-2 ${className}`
    : `fixed top-6 left-6 z-40 flex items-center gap-2 ${className}`;

  const pathClasses = inline
    ? 'flex flex-wrap items-center gap-2 text-sm text-foreground/80 text-left'
    : 'flex items-center gap-2 ml-4';

  return (
    <div className={containerClasses}>
      {shouldShowBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      )}
      
      <div className={pathClasses}>
        {path.map((node, index) => (
          <span key={node.id} className="contents">
            {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            <button
              onClick={() => onNavigate(index)}
              className={`text-sm transition-colors ${
                index === path.length - 1
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {node.name}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};