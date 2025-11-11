import React, { useState, useEffect } from 'react';
import { TreeNodeData } from '../types/treeTypes';
import { aiTaxonomyData } from '../data/aiTaxonomyData';
import { aiTaxonomyDataBusiness } from '../data/aiTaxonomyDataBusiness';
import { aiTaxonomyDataBusinessNL } from '../data/aiTaxonomyDataBusiness.nl';
import { Homepage } from './Homepage';
import { NavigationView } from './NavigationView';
import { DetailPage } from './DetailPage';
import { Switch } from './ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Code, Briefcase, Stethoscope, Factory, Languages, Menu } from 'lucide-react';

type ViewMode = 'homepage' | 'navigation' | 'detail';

export const AIExplorer: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('homepage');
  const [currentPath, setCurrentPath] = useState<TreeNodeData[]>([aiTaxonomyData]);
  const [detailNode, setDetailNode] = useState<TreeNodeData | null>(null);
  const [isBusinessMode, setIsBusinessMode] = useState<boolean>(false);
  const [businessFocus, setBusinessFocus] = useState<'care' | 'industry'>('care'); // New state for business focus
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'nl'>('en'); // New state for language

  // Load business mode from localStorage on mount and sync path
  useEffect(() => {
    const savedBusinessMode = localStorage.getItem('businessMode');
    if (savedBusinessMode !== null) {
      const businessMode = JSON.parse(savedBusinessMode);
      setIsBusinessMode(businessMode);
      setCurrentPath([businessMode ? aiTaxonomyDataBusiness : aiTaxonomyData]);
    }
  }, []);

  // Save business mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('businessMode', JSON.stringify(isBusinessMode));
  }, [isBusinessMode]);

  // Load business focus from localStorage on mount
  useEffect(() => {
    const savedBusinessFocus = localStorage.getItem('businessFocus');
    if (savedBusinessFocus !== null) {
      setBusinessFocus(savedBusinessFocus as 'care' | 'industry');
    }
  }, []);

  // Save business focus to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('businessFocus', businessFocus);
  }, [businessFocus]);

  // Load current language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('currentLanguage');
    if (savedLanguage !== null) {
      setCurrentLanguage(savedLanguage as 'en' | 'nl');
    }
  }, []);

  // Save current language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('currentLanguage', currentLanguage);
  }, [currentLanguage]);

  const currentNode = currentPath[currentPath.length - 1];

  const getBusinessData = () => {
    return currentLanguage === 'nl' ? aiTaxonomyDataBusinessNL : aiTaxonomyDataBusiness;
  };

  const handleBusinessModeToggle = (checked: boolean) => {
    setIsBusinessMode(checked);
    setViewMode('homepage');
    setCurrentPath([checked ? getBusinessData() : aiTaxonomyData]);
    setDetailNode(null);
  };

  const handleBusinessFocusToggle = (focus: 'care' | 'industry') => {
    setBusinessFocus(focus);
  };

  const handleEnterTaxonomy = () => {
    setViewMode('navigation');
  };

  const handleNodeClick = (node: TreeNodeData) => {
    if (!node.children || node.children.length === 0) {
      // Leaf node - show detail page
      setDetailNode(node);
      setViewMode('detail');
    } else {
      // Has children - navigate deeper
      setCurrentPath([...currentPath, node]);
    }
  };

  const handleNavigate = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    } else {
      setViewMode('homepage');
    }
  };

  const handleHome = () => {
    setViewMode('homepage');
    setCurrentPath([isBusinessMode ? getBusinessData() : aiTaxonomyData]);
  };

  // Update taxonomy data when language changes while preserving current selection by IDs
  useEffect(() => {
    if (!isBusinessMode) return;
    const newRoot = getBusinessData();
    const idToNode = new Map<string, TreeNodeData>();
    const stack: TreeNodeData[] = [newRoot];
    while (stack.length) {
      const n = stack.pop()!;
      idToNode.set(n.id, n);
      n.children?.forEach(c => stack.push(c));
    }
    const newPath: TreeNodeData[] = [];
    for (const oldNode of currentPath) {
      const mapped = idToNode.get(oldNode.id);
      if (!mapped) break;
      newPath.push(mapped);
    }
    setCurrentPath(newPath.length ? newPath : [newRoot]);
    if (detailNode) {
      const mappedDetail = idToNode.get(detailNode.id);
      setDetailNode(mappedDetail || null);
      setViewMode(mappedDetail ? 'detail' : 'navigation');
    }
  }, [currentLanguage]);

  const handleBackToTaxonomy = () => {
    setViewMode('navigation');
    setDetailNode(null);
    // Keep current path to return to the same navigation level
  };

  const getParentName = (node: TreeNodeData): string | undefined => {
    // Find the parent of the detail node in the current path
    for (let i = currentPath.length - 1; i >= 0; i--) {
      const pathNode = currentPath[i];
      if (pathNode.children?.some(child => child.id === node.id)) {
        return pathNode.name;
      }
    }
    return undefined;
  };

  switch (viewMode) {
    case 'homepage':
      return (
        <div className="relative min-h-screen">
          {/* Settings Menu */}
          <div className="fixed top-6 right-6 z-50">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-4">
                  {/* Language Switcher */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">{currentLanguage === 'nl' ? 'Taal' : 'Language'}</label>
                    <div className="flex gap-2">
                      <Button
                        variant={currentLanguage === 'en' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => setCurrentLanguage('en')}
                      >
                        <Languages className="w-4 h-4 mr-2" />
                        English
                      </Button>
                      <Button
                        variant={currentLanguage === 'nl' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => setCurrentLanguage('nl')}
                      >
                        <Languages className="w-4 h-4 mr-2" />
                        Nederlands
                      </Button>
                    </div>
                  </div>

                  {/* Technical/Business Mode Toggle */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">View Mode</label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <Switch
                        id="business-mode"
                        checked={isBusinessMode}
                        onCheckedChange={handleBusinessModeToggle}
                      />
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Care/Industry Toggle */}
                  {isBusinessMode && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Business Focus</label>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <Switch
                          id="business-focus"
                          checked={businessFocus === 'industry'}
                          onCheckedChange={(checked) => handleBusinessFocusToggle(checked ? 'industry' : 'care')}
                        />
                        <div className="flex items-center gap-2">
                          <Factory className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Homepage
            rootNode={isBusinessMode ? getBusinessData() : aiTaxonomyData}
            onEnterTaxonomy={handleEnterTaxonomy}
            isBusinessMode={isBusinessMode}
            language={currentLanguage}
          />
        </div>
      );

    case 'navigation': {
      const navigationSettingsMenu = (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
              <Menu className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <div className="space-y-4">
              {/* Language Switcher */}
              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <div className="flex gap-2">
                  <Button
                    variant={currentLanguage === 'en' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setCurrentLanguage('en')}
                  >
                    <Languages className="w-4 h-4 mr-2" />
                    English
                  </Button>
                  <Button
                    variant={currentLanguage === 'nl' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setCurrentLanguage('nl')}
                  >
                    <Languages className="w-4 h-4 mr-2" />
                    Nederlands
                  </Button>
                </div>
              </div>

              {/* Technical/Business Mode Toggle */}
              <div>
                <label className="text-sm font-medium mb-2 block">View Mode</label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <Switch
                    id="business-mode"
                    checked={isBusinessMode}
                    onCheckedChange={handleBusinessModeToggle}
                  />
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Care/Industry Toggle */}
              {isBusinessMode && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Business Focus</label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Switch
                      id="business-focus"
                      checked={businessFocus === 'industry'}
                      onCheckedChange={(checked) => handleBusinessFocusToggle(checked ? 'industry' : 'care')}
                    />
                    <div className="flex items-center gap-2">
                      <Factory className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      );

      return (
        <div className="relative min-h-screen">
          <NavigationView
            currentNode={currentNode}
            path={currentPath}
            onNodeClick={handleNodeClick}
            onNavigate={handleNavigate}
            onBack={handleBack}
            onHome={handleHome}
            isBusinessMode={isBusinessMode} // Pass isBusinessMode
            businessFocus={businessFocus} // Pass businessFocus
            language={currentLanguage}
            settingsMenu={navigationSettingsMenu}
          />
        </div>
      );
    }

    case 'detail':
      return detailNode ? (
        <div className="relative min-h-screen">
          {/* Settings Menu */}
          <div className="fixed top-6 right-6 z-50">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-4">
                  {/* Language Switcher */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Language</label>
                    <div className="flex gap-2">
                      <Button
                        variant={currentLanguage === 'en' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => setCurrentLanguage('en')}
                      >
                        <Languages className="w-4 h-4 mr-2" />
                        English
                      </Button>
                      <Button
                        variant={currentLanguage === 'nl' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => setCurrentLanguage('nl')}
                      >
                        <Languages className="w-4 h-4 mr-2" />
                        Nederlands
                      </Button>
                    </div>
                  </div>

                  {/* Technical/Business Mode Toggle */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">View Mode</label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <Switch
                        id="business-mode"
                        checked={isBusinessMode}
                        onCheckedChange={handleBusinessModeToggle}
                      />
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Care/Industry Toggle */}
                  {isBusinessMode && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Business Focus</label>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <Switch
                          id="business-focus"
                          checked={businessFocus === 'industry'}
                          onCheckedChange={(checked) => handleBusinessFocusToggle(checked ? 'industry' : 'care')}
                        />
                        <div className="flex items-center gap-2">
                          <Factory className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <DetailPage
            node={detailNode}
            getParentName={getParentName}
            onBack={handleBackToTaxonomy}
            isBusinessMode={isBusinessMode}
            businessFocus={businessFocus}
            language={currentLanguage}
          />
        </div>
      ) : null;

    default:
      return null;
  }
};