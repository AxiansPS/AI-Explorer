import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { TreeNodeData, NodePosition } from '../types/treeTypes';
import { CircleNode } from './CircleNode';
import { Tooltip } from './Tooltip';
import { Breadcrumb } from './Breadcrumb';
import { DetailCard } from './DetailCard';
import logoUrl from '../assets/Axians_Logo_RGB.svg';
import { Button } from './ui/button';

interface NavigationViewProps {
  currentNode: TreeNodeData;
  path: TreeNodeData[];
  onNodeClick: (node: TreeNodeData) => void;
  onNavigate: (index: number) => void;
  onBack: () => void;
  onHome?: () => void;
  isBusinessMode?: boolean;
  businessFocus?: 'care' | 'industry';
  language?: 'en' | 'nl';
  settingsMenu?: ReactNode;
}

export const NavigationView: React.FC<NavigationViewProps> = ({
  currentNode,
  path,
  onNodeClick,
  onNavigate,
  onBack,
  onHome,
  isBusinessMode,
  businessFocus, // Add businessFocus prop
  language,
  settingsMenu
}) => {
  const [hoveredNode, setHoveredNode] = useState<TreeNodeData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [animatingNode, setAnimatingNode] = useState<TreeNodeData | null>(null);
  const [animatingNodePosition, setAnimatingNodePosition] = useState<NodePosition | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDetailCards, setShowDetailCards] = useState(false);
  const detailSectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (detailSectionRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const detailRect = detailSectionRef.current.getBoundingClientRect();
        const isVisible = detailRect.top <= containerRect.top + containerRect.height * 0.8;
        setShowDetailCards(isVisible);
        console.log('Scroll check:', { 
          detailTop: detailRect.top, 
          containerTop: containerRect.top, 
          containerHeight: containerRect.height, 
          isVisible 
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Check initial state after a short delay to ensure DOM is ready
      setTimeout(handleScroll, 100);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentNode]); // Re-run when currentNode changes

  const calculateNodePositions = (): { positions: NodePosition[], nodeSize: number } => {
    if (!currentNode.children || currentNode.children.length === 0) return { positions: [], nodeSize: 80 };

    const centerX = containerSize.width / 2;
    const centerY = containerSize.height / 2;
    const children = currentNode.children;
    const childCount = children.length;

    // Calculate optimal node size and spacing using geometric formula
    const availableWidth = containerSize.width * 0.8; // Use 80% of screen width
    const availableHeight = containerSize.height * 0.7; // Use 70% of screen height
    
    // Calculate node size based on available space
    let nodeSize: number;
    let radius: number;
    
    if (childCount === 1) {
      // Single node - make it reasonably sized
      nodeSize = Math.min(200, Math.min(availableWidth, availableHeight) * 0.3);
      radius = 0;
    } else {
      // Use geometric formula: r = R * sin(π/n) / (1+k)
      const F = 0.78;
      const minDimension = Math.min(containerSize.width, containerSize.height);
      const k = 1/3; // Ratio constant for spacing
      const n = childCount;
      
      // Solve for R: R = (0.5 * F * minDimension) / (1 + sin(π/n) / (1+k))
      const sinTerm = Math.sin(Math.PI / n);
      const denominator = 1 + sinTerm / (1 + k);
      radius = (0.5 * F * minDimension) / denominator;
      
      // Calculate optimal node radius using the geometric formula
      const nodeRadius = radius * sinTerm / (1 + k);
      nodeSize = nodeRadius * 2;
      
      // Ensure minimum viable sizes
      radius = Math.max(radius, 100);
      nodeSize = Math.max(nodeSize, 60);
    }

    const positions = children.map((_, index) => {
      if (childCount === 1) {
        return {
          x: centerX,
          y: centerY,
          angle: 0,
          radius: 0
        };
      }
      
      const angle = (index * 2 * Math.PI) / childCount;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        x,
        y,
        angle,
        radius
      };
    });

    return { positions, nodeSize };
  };

  const handleNodeClick = (node: TreeNodeData, position: NodePosition) => {
    if (isAnimating) return; // Prevent clicks during animation
    
    if (node.children && node.children.length > 0) {
      // Start zoom animation at the original child position
      setIsAnimating(true);
      setAnimatingNode(node);
      setAnimatingNodePosition(position);
      
      // Trigger navigation after a short delay to allow animation to start
      setTimeout(() => {
        onNodeClick(node);
        setAnimatingNode(null);
        setAnimatingNodePosition(null);
        setIsAnimating(false);
      }, 600);
    } else {
      onNodeClick(node);
    }
  };

  const { positions, nodeSize: childNodeSize } = calculateNodePositions();
  const parentNodeSize = Math.min(containerSize.width, containerSize.height) * 0.6;
  const hasBackPath = path.length > 1;

  return (
    <div 
      ref={containerRef}
      className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 w-full overflow-y-auto scrollbar-hide pt-24" 
      style={{ height: '100vh' }}
    >
      {/* Top Header with Logo, Breadcrumb and Title */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="relative max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex flex-col items-start gap-2 min-w-[180px] self-start">
              {onHome ? (
                <button onClick={onHome} aria-label="Go to homepage" className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-sm">
                  <img src={logoUrl} alt="Company logo" className="h-8 md:h-9 object-contain" />
                </button>
              ) : (
                <img src={logoUrl} alt="Company logo" className="h-8 md:h-9 object-contain shrink-0" />
              )}
              <Breadcrumb path={path} onNavigate={onNavigate} onBack={onBack} inline className="w-full" showBackButton={false} />
            </div>

            <div className="flex items-center justify-end min-w-[48px] self-center">
              {settingsMenu}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-lg md:text-2xl font-bold pointer-events-auto text-center px-8 truncate">
              {currentNode.name}
            </h1>
          </div>
        </div>
      </div>

      {hasBackPath && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors bg-white/5 border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      )}

      {/* Radial Color Highlights */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgb(0, 255, 255) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgb(255, 0, 255) 0%, transparent 50%)
          `
        }}>
        </div>
      </div>
      
      {/* Node Visualization Section */}
      <div className="relative flex-shrink-0" style={{ height: `${containerSize.height}px` }}>
        
        
        {/* Parent node (current level) - transparent and unclickable */}
        <div className="z-10 pointer-events-none">
          <CircleNode
            node={currentNode}
            position={{
              x: containerSize.width / 2,
              y: containerSize.height / 2,
              angle: 0,
              radius: 0
            }}
            size={parentNodeSize}
            isRoot={path.length === 1}
            className="opacity-0"
            isBusinessMode={false} // Disable business mode for parent node to hide guidance
            businessFocus={businessFocus}
            language={language}
          />
        </div>

        {/* Child nodes */}
        <div className="z-20">
          {currentNode.children?.map((child, index) => {
            // Hide the node that's currently animating to prevent duplication
            if (animatingNode && child.id === animatingNode.id) {
              return null;
            }

            return (
              <CircleNode
                key={child.id}
                node={child}
                position={positions[index]}
                size={childNodeSize}
                onClick={() => handleNodeClick(child, positions[index])}
                onHover={setHoveredNode}
                isBusinessMode={isBusinessMode}
                businessFocus={businessFocus} // Pass businessFocus prop
                language={language}
              />
            );
          })}
        </div>

        {/* Animating node */}
        {animatingNode && animatingNodePosition && (
          <div className="z-30">
            <CircleNode
              node={animatingNode}
              position={animatingNodePosition}
              size={childNodeSize}
              isRoot={false}
              onHover={() => {}}
              className="animate-zoom-to-center"
              style={{
                '--start-x': `${animatingNodePosition.x}px`,
                '--start-y': `${animatingNodePosition.y}px`,
                '--center-x': `${containerSize.width / 2}px`,
                '--center-y': `${containerSize.height / 2}px`
              } as React.CSSProperties}
              isBusinessMode={isBusinessMode}
              businessFocus={businessFocus} // Pass businessFocus prop
              language={language}
            />
          </div>
        )}

        {/* Tooltip */}
        <Tooltip node={hoveredNode} position={mousePosition} />

        {/* Scroll Indicator - Positioned at bottom of node visualization */}
        {currentNode.children && currentNode.children.length > 0 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-lg font-medium">
              <ChevronDown className="w-5 h-5 animate-bounce" />
              <span>{language === 'nl' ? 'Scroll om details te verkennen' : 'Scroll down to explore detailed information'}</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Detail Cards Section - Only for non-leaf nodes */}
      {currentNode.children && currentNode.children.length > 0 && (
        <div 
          ref={detailSectionRef}
          className="relative z-10 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800"
          style={{ 
            width: '100%'
          }}
        >
          <div className="max-w-6xl mx-auto p-6">

            {/* Detail Card for Current Node */}
            <div className="max-w-4xl mx-auto">
              {(() => {
                // Check if current node has detailed information
                const hasDetails = currentNode.overview || currentNode.howItWorks || 
                  (currentNode.applications && currentNode.applications.length > 0) ||
                  (currentNode.advantages && currentNode.advantages.length > 0) ||
                  (currentNode.limitations && currentNode.limitations.length > 0);

                console.log(`Current node ${currentNode.name} has details:`, hasDetails, {
                  overview: !!currentNode.overview,
                  howItWorks: !!currentNode.howItWorks,
                  applications: currentNode.applications?.length || 0,
                  advantages: currentNode.advantages?.length || 0,
                  limitations: currentNode.limitations?.length || 0
                });

                if (!hasDetails) {
                  return (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-lg">
                        No detailed information available for {currentNode.name}.
                        <br />
                        Click on individual nodes to explore their details.
                      </div>
                    </div>
                  );
                }

                return (
                  <div className={`scroll-reveal ${showDetailCards ? 'revealed' : ''}`}>
                    <DetailCard
                      node={currentNode}
                      parentName={path.length > 1 ? path[path.length - 2]?.name : undefined}
                      className="transform transition-all duration-500"
                      isBusinessMode={isBusinessMode}
                      businessFocus={businessFocus}
                      language={language}
                    />
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};