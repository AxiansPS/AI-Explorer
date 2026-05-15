import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { ChevronDown, ArrowLeft, Mail, Phone, ChevronUp, MessageCircle } from 'lucide-react';
import { TreeNodeData, NodePosition } from '../types/treeTypes';
import { CircleNode } from './CircleNode';
import { Tooltip } from './Tooltip';
import { Breadcrumb } from './Breadcrumb';
import { DetailCard } from './DetailCard';
import logoUrl from '../assets/Axians_Logo_RGB.svg';
const teunPortrait = new URL('../assets/portrait_Teun.JPG', import.meta.url).href;
const jordyPortrait = new URL('../assets/Portrait_Jordy.png', import.meta.url).href;
import { Button } from './ui/button';

const HEADER_HEIGHT = 96; // px, aligns with header padding

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
  const [detailHeight, setDetailHeight] = useState(0);
  const detailSectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [showContacts, setShowContacts] = useState(false);
  const contactCardRef = useRef<HTMLDivElement>(null);

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
        
        const scrollTop = containerRef.current.scrollTop;
        const fadeStart = 50;   // start fading after 50px
        const fadeEnd = 200;    // fully invisible after 200px
        const opacity = Math.max(0, 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart));
        setScrollOpacity(opacity);
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

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined' || !detailSectionRef.current) {
      setDetailHeight(detailSectionRef.current?.offsetHeight || 0);
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setDetailHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(detailSectionRef.current);

    return () => observer.disconnect();
  }, [currentNode, containerSize.height]);

  useEffect(() => {
    if (!showContacts) return;
  
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowContacts(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!contactCardRef.current) return;
      if (!contactCardRef.current.contains(e.target as Node)) {
        setShowContacts(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [showContacts]);

  const calculateNodePositions = (): { positions: NodePosition[], nodeSize: number, center: { x: number, y: number }, effectiveHeight: number } => {
    const fullHeight = containerSize.height || window.innerHeight || HEADER_HEIGHT * 2;
    const centerX = containerSize.width / 2;
    const effectiveHeight = Math.max(fullHeight - HEADER_HEIGHT, 1);
    const centerY = effectiveHeight / 2;

    if (!currentNode.children || currentNode.children.length === 0) {
      return { positions: [], nodeSize: 80, center: { x: centerX, y: centerY }, effectiveHeight };
    }

    const children = currentNode.children;
    const childCount = children.length;

    // Calculate optimal node size and spacing using geometric formula
    const availableWidth = containerSize.width * 0.8; // Use 80% of screen width
    const availableHeight = effectiveHeight * 0.7; // Use 70% of effective height
    
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
      const minDimension = Math.min(containerSize.width, effectiveHeight);
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

    return { positions, nodeSize, center: { x: centerX, y: centerY }, effectiveHeight };
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

  const { positions, nodeSize: childNodeSize, center, effectiveHeight } = calculateNodePositions();
  const parentNodeSize = Math.min(containerSize.width, effectiveHeight) * 0.6;
  const hasBackPath = path.length > 1;

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-y-auto scrollbar-hide bg-gradient-to-br from-gray-900 via-black to-gray-800" 
      style={{ height: '100vh', paddingTop: HEADER_HEIGHT }}
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
        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Take the button out of flow, but position it inside this wrapper so alignment is unchanged */}
          <div className="absolute top-4 z-40 pointer-events-auto">
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
        </div>
      )}


      {/* Radial Color Highlights */}
      <div 
        className="absolute left-0 right-0 top-0 opacity-10 pointer-events-none"
        style={{ height: `${containerSize.height + detailHeight + HEADER_HEIGHT}px` }}
      >
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
              x: center.x,
              y: center.y,
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
              '--center-x': `${center.x}px`,
              '--center-y': `${center.y}px`
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
            <div
              className="absolute z-50 flex flex-col items-center gap-2 text-cyan-400 text-sm md:text-base font-medium transition-opacity duration-200"
              style={{ bottom: HEADER_HEIGHT + 24, left: '50%', transform: 'translateX(-50%)', opacity: scrollOpacity }}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute block w-8 h-8 rounded-full bg-cyan-400/8 animate-ping" aria-hidden="true" />
                <ChevronDown className="w-6 h-6 animate-bounce-strong text-cyan-400 drop-shadow-[0_8px_24px_rgba(0,255,255,0.12)]" />
              </div>
              <span className="text-center hint-pulse">
                {language === 'nl'
                  ? 'Scroll om details te verkennen'
                  : 'Scroll down to explore detailed information'}
              </span>
            </div>
        )}
      </div>

      {/* Detail Cards Section - Only for non-leaf nodes */}
      {currentNode.children && currentNode.children.length > 0 && (
        <div 
          ref={detailSectionRef}
          className="relative z-10 min-h-screen"
          style={{ width: '100%' }}
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
      
      {/* --- Floating Contact Button (bottom-left) + Popover --- */}
      <div className="fixed left-4 md:left-6 bottom-4 md:bottom-6 z-40 pointer-events-none">
        <div className="relative pointer-events-auto" ref={contactCardRef}>
          {/* Standalone glass button */}
          <button
            type="button"
            onClick={() => setShowContacts((v) => !v)}
            className="
              group inline-flex items-center gap-2
              rounded-full border border-white/10 bg-white/5 backdrop-blur-md
              text-white/90 hover:text-white
              shadow-md shadow-black/30 hover:shadow-cyan-500/20
              px-4 py-2 md:px-5 md:py-2.5
              transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60
            "
            aria-expanded={showContacts}
            aria-controls="more-contacts"
            aria-label="Open contact information"
            title="Contact"
          >
            <MessageCircle className="w-4 h-4 text-cyan-300 transition-colors group-hover:text-cyan-200" />
            <span className="text-sm font-medium">
              Questions about AI &amp; development?
            </span>
            {showContacts ? (
              <ChevronUp className="w-4 h-4 text-cyan-300" />
            ) : (
              <ChevronDown className="w-4 h-4 text-cyan-300" />
            )}
          </button>

          {/* Popover (floating) */}
          {showContacts && (
            <div
              id="more-contacts"
              role="dialog"
              aria-label="Contact information"
              className="
                absolute left-0 bottom-[calc(100%+12px)]
                w-[min(88vw,22rem)]
                rounded-xl border border-white/10 bg-black/60 backdrop-blur-lg
                shadow-xl shadow-black/50 text-white p-4
                animate-in fade-in zoom-in-95 duration-150
              "
              style={{ transformOrigin: 'left bottom' }}
            >
              <div className="text-sm font-semibold text-cyan-300 mb-2">
                Contact
              </div>

              <div className="space-y-4 text-sm">
                {/* Teun */}
                <div className="flex items-center gap-3">
                  <img src={teunPortrait} alt="Teun van de Laar" className="w-16 h-16 rounded-full object-cover border border-white/10" />
                  <div>
                    <div className="font-medium">Teun van de Laar</div>
                    <div className="text-xs text-white/60">AI, Data &amp; Analytics Consultant</div>
                    <div className="mt-1.5 space-y-1">
                      <a
                        href="mailto:teun.vandelaar@axians.com"
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                      >
                        <Mail className="w-4 h-4" />
                        teun.vandelaar@axians.com
                      </a>
                      <a
                        href="tel:+31612345678"
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                      >
                        <Phone className="w-4 h-4" />
                        +31 6 25 54 39 71
                      </a>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Jordy */}
                <div className="flex items-center gap-3">
                  <img src={jordyPortrait} alt="Jordy Ravesteijn" className="w-16 h-16 rounded-full object-cover border border-white/10" />
                  <div>
                    <div className="font-medium">Jordy Ravesteijn</div>
                    <div className="text-xs text-white/60">Business Development Manager AI, Data &amp; Analytics</div>
                    <div className="mt-1.5 space-y-1">
                      <a
                        href="mailto:jordy.ravesteijn@axians.com"
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                      >
                        <Mail className="w-4 h-4" />
                        jordy.ravesteijn@axians.com
                      </a>
                      <a
                        href="tel:+31600000000"
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                      >
                        <Phone className="w-4 h-4" />
                        +31 6 25 57 88 67
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional small caret pointing to the button */}
              <div
                className="
                  absolute left-4 -bottom-1.5 h-3 w-3
                  bg-black/60 backdrop-blur-lg
                  border-l border-t border-white/10
                  rotate-45
                "
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};