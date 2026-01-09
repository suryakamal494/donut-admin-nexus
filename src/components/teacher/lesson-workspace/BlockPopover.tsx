import { useState, useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { 
  Search, 
  Sparkles, 
  Upload, 
  FileText, 
  Video, 
  Image as ImageIcon,
  Loader2,
  X,
  Link as LinkIcon,
  Presentation,
  FileSpreadsheet,
  Filter,
  Clock,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { blockTypeConfig, detectLinkType, type BlockType, type LessonPlanBlock, type LinkType } from "./types";

interface BlockPopoverProps {
  type: BlockType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBlock: (block: Omit<LessonPlanBlock, 'id'>) => void;
  chapter?: string;
  subject?: string;
  children: React.ReactNode;
}

// Content type configuration
type ContentType = 'video' | 'presentation' | 'document' | 'image' | 'animation' | 'simulation';

const contentTypeConfig: Record<ContentType, { icon: typeof Video; label: string; color: string }> = {
  video: { icon: Video, label: 'Video', color: 'text-red-600 bg-red-50' },
  presentation: { icon: Presentation, label: 'PPT', color: 'text-orange-600 bg-orange-50' },
  document: { icon: FileText, label: 'Doc', color: 'text-blue-600 bg-blue-50' },
  image: { icon: ImageIcon, label: 'Image', color: 'text-green-600 bg-green-50' },
  animation: { icon: BookOpen, label: 'Animation', color: 'text-purple-600 bg-purple-50' },
  simulation: { icon: FileSpreadsheet, label: 'Simulation', color: 'text-cyan-600 bg-cyan-50' },
};

// Extended mock library content (35+ items)
const mockLibraryContent = [
  // Physics - Mechanics (8 items)
  { id: '1', title: "Newton's Laws - Complete Guide", type: 'presentation' as ContentType, duration: 15, chapter: 'Mechanics', subject: 'Physics', source: 'global' },
  { id: '2', title: "Force and Motion Explained", type: 'video' as ContentType, duration: 12, chapter: 'Mechanics', subject: 'Physics', source: 'global' },
  { id: '3', title: "Momentum Conservation Demo", type: 'video' as ContentType, duration: 10, chapter: 'Mechanics', subject: 'Physics', source: 'institute' },
  { id: '4', title: "Friction Types and Applications", type: 'document' as ContentType, duration: 8, chapter: 'Mechanics', subject: 'Physics', source: 'global' },
  { id: '5', title: "Projectile Motion Simulation", type: 'simulation' as ContentType, duration: 15, chapter: 'Mechanics', subject: 'Physics', source: 'global' },
  { id: '6', title: "Free Body Diagrams Tutorial", type: 'presentation' as ContentType, duration: 20, chapter: 'Mechanics', subject: 'Physics', source: 'institute' },
  { id: '7', title: "Work, Energy & Power", type: 'video' as ContentType, duration: 18, chapter: 'Mechanics', subject: 'Physics', source: 'global' },
  { id: '8', title: "Circular Motion Basics", type: 'animation' as ContentType, duration: 8, chapter: 'Mechanics', subject: 'Physics', source: 'global' },
  
  // Physics - Electrostatics (6 items)
  { id: '9', title: "Coulomb's Law Explained", type: 'video' as ContentType, duration: 14, chapter: 'Electrostatics', subject: 'Physics', source: 'global' },
  { id: '10', title: "Electric Field Lines", type: 'animation' as ContentType, duration: 10, chapter: 'Electrostatics', subject: 'Physics', source: 'global' },
  { id: '11', title: "Gauss's Law Applications", type: 'presentation' as ContentType, duration: 22, chapter: 'Electrostatics', subject: 'Physics', source: 'institute' },
  { id: '12', title: "Capacitors and Dielectrics", type: 'video' as ContentType, duration: 16, chapter: 'Electrostatics', subject: 'Physics', source: 'global' },
  { id: '13', title: "Electric Potential Energy", type: 'document' as ContentType, duration: 12, chapter: 'Electrostatics', subject: 'Physics', source: 'global' },
  { id: '14', title: "Conductors in Electric Fields", type: 'simulation' as ContentType, duration: 14, chapter: 'Electrostatics', subject: 'Physics', source: 'global' },
  
  // Physics - Optics (5 items)
  { id: '15', title: "Reflection and Refraction", type: 'video' as ContentType, duration: 15, chapter: 'Optics', subject: 'Physics', source: 'global' },
  { id: '16', title: "Lens Maker's Equation", type: 'presentation' as ContentType, duration: 18, chapter: 'Optics', subject: 'Physics', source: 'global' },
  { id: '17', title: "Wave Optics - Interference", type: 'animation' as ContentType, duration: 12, chapter: 'Optics', subject: 'Physics', source: 'institute' },
  { id: '18', title: "Diffraction Patterns Demo", type: 'video' as ContentType, duration: 10, chapter: 'Optics', subject: 'Physics', source: 'global' },
  { id: '19', title: "Polarization of Light", type: 'simulation' as ContentType, duration: 14, chapter: 'Optics', subject: 'Physics', source: 'global' },
  
  // Chemistry (8 items)
  { id: '20', title: "Atomic Structure Basics", type: 'presentation' as ContentType, duration: 20, chapter: 'Atomic Structure', subject: 'Chemistry', source: 'global' },
  { id: '21', title: "Periodic Table Trends", type: 'video' as ContentType, duration: 15, chapter: 'Periodic Table', subject: 'Chemistry', source: 'global' },
  { id: '22', title: "Chemical Bonding Types", type: 'animation' as ContentType, duration: 12, chapter: 'Chemical Bonding', subject: 'Chemistry', source: 'global' },
  { id: '23', title: "VSEPR Theory Explained", type: 'video' as ContentType, duration: 18, chapter: 'Chemical Bonding', subject: 'Chemistry', source: 'institute' },
  { id: '24', title: "Organic Nomenclature Guide", type: 'document' as ContentType, duration: 25, chapter: 'Organic Chemistry', subject: 'Chemistry', source: 'global' },
  { id: '25', title: "Reaction Mechanisms", type: 'presentation' as ContentType, duration: 22, chapter: 'Organic Chemistry', subject: 'Chemistry', source: 'global' },
  { id: '26', title: "Thermodynamics Laws", type: 'video' as ContentType, duration: 20, chapter: 'Thermodynamics', subject: 'Chemistry', source: 'global' },
  { id: '27', title: "Chemical Equilibrium", type: 'simulation' as ContentType, duration: 15, chapter: 'Equilibrium', subject: 'Chemistry', source: 'institute' },
  
  // Mathematics (8 items)
  { id: '28', title: "Differentiation Basics", type: 'video' as ContentType, duration: 18, chapter: 'Calculus', subject: 'Mathematics', source: 'global' },
  { id: '29', title: "Integration Techniques", type: 'presentation' as ContentType, duration: 25, chapter: 'Calculus', subject: 'Mathematics', source: 'global' },
  { id: '30', title: "Matrices and Determinants", type: 'video' as ContentType, duration: 20, chapter: 'Linear Algebra', subject: 'Mathematics', source: 'global' },
  { id: '31', title: "Vector Algebra Complete", type: 'presentation' as ContentType, duration: 22, chapter: 'Vectors', subject: 'Mathematics', source: 'institute' },
  { id: '32', title: "Probability Distributions", type: 'video' as ContentType, duration: 16, chapter: 'Probability', subject: 'Mathematics', source: 'global' },
  { id: '33', title: "Trigonometric Identities", type: 'document' as ContentType, duration: 15, chapter: 'Trigonometry', subject: 'Mathematics', source: 'global' },
  { id: '34', title: "Coordinate Geometry 3D", type: 'animation' as ContentType, duration: 14, chapter: 'Coordinate Geometry', subject: 'Mathematics', source: 'global' },
  { id: '35', title: "Conic Sections Visualized", type: 'simulation' as ContentType, duration: 18, chapter: 'Conic Sections', subject: 'Mathematics', source: 'institute' },
];

// Link type badges
const linkTypeBadges: Record<LinkType, { label: string; className: string }> = {
  youtube: { label: 'YouTube', className: 'bg-red-100 text-red-700 border-red-200' },
  vimeo: { label: 'Vimeo', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  'google-drive': { label: 'Google Drive', className: 'bg-green-100 text-green-700 border-green-200' },
  'google-docs': { label: 'Google Docs', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  iframe: { label: 'Embed', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  unknown: { label: 'Link', className: 'bg-gray-100 text-gray-700 border-gray-200' },
};

// Content item component for virtualized list
const ContentItem = ({ 
  item, 
  onSelect 
}: { 
  item: typeof mockLibraryContent[0]; 
  onSelect: () => void;
}) => {
  const typeConfig = contentTypeConfig[item.type];
  const TypeIcon = typeConfig.icon;
  
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left",
        "hover:bg-primary/5 transition-colors",
        "border border-transparent hover:border-primary/20"
      )}
    >
      <div className={cn(
        "w-9 h-9 rounded-md flex items-center justify-center shrink-0",
        typeConfig.color
      )}>
        <TypeIcon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
            {typeConfig.label}
          </Badge>
          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" />
            {item.duration} min
          </span>
          {item.source === 'institute' && (
            <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">
              🏫
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
};

export const BlockPopover = ({ 
  type, 
  open, 
  onOpenChange, 
  onAddBlock,
  chapter,
  subject,
  children 
}: BlockPopoverProps) => {
  const [activeTab, setActiveTab] = useState<'library' | 'ai' | 'custom'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContentType, setSelectedContentType] = useState<string>('all');
  const [aiPrompt, setAiPrompt] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customDuration, setCustomDuration] = useState('10');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Custom tab - input mode (upload or link)
  const [inputMode, setInputMode] = useState<'upload' | 'link'>('upload');
  const [linkUrl, setLinkUrl] = useState('');
  const [detectedLinkType, setDetectedLinkType] = useState<LinkType>('unknown');
  
  // Virtual scroll ref
  const parentRef = useRef<HTMLDivElement>(null);
  
  const config = blockTypeConfig[type];

  // Filter content
  const filteredContent = useMemo(() => {
    return mockLibraryContent.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chapter.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedContentType === 'all' || item.type === selectedContentType;
      
      // Prioritize subject context if provided
      const matchesSubject = !subject || item.subject.toLowerCase() === subject.toLowerCase();
      
      return matchesSearch && matchesType && matchesSubject;
    });
  }, [searchQuery, selectedContentType, subject]);

  // Virtual list
  const rowVirtualizer = useVirtualizer({
    count: filteredContent.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56, // Approximate row height
    overscan: 5,
  });

  // Detect link type when URL changes
  const handleLinkChange = (url: string) => {
    setLinkUrl(url);
    setDetectedLinkType(detectLinkType(url));
  };

  const handleLibrarySelect = (item: typeof mockLibraryContent[0]) => {
    onAddBlock({
      type,
      title: item.title,
      source: 'library',
      sourceId: item.id,
      sourceType: item.type,
      duration: item.duration,
    });
    onOpenChange(false);
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onAddBlock({
      type,
      title: aiPrompt,
      content: `AI-generated content for: ${aiPrompt}`,
      source: 'ai',
      duration: 10,
      aiGenerated: true,
    });
    
    setIsGenerating(false);
    setAiPrompt('');
    onOpenChange(false);
  };

  const handleCustomAdd = () => {
    if (inputMode === 'link') {
      if (!linkUrl.trim()) return;
      
      const title = customTitle.trim() || `${linkTypeBadges[detectedLinkType].label} Content`;
      
      onAddBlock({
        type,
        title,
        source: 'custom',
        duration: parseInt(customDuration) || 10,
        embedUrl: linkUrl,
        linkType: detectedLinkType,
        sourceType: detectedLinkType === 'youtube' || detectedLinkType === 'vimeo' ? 'video' : 'embed',
      });
    } else {
      if (!customTitle.trim()) return;
      
      onAddBlock({
        type,
        title: customTitle,
        source: 'custom',
        duration: parseInt(customDuration) || 10,
      });
    }
    
    setCustomTitle('');
    setCustomDuration('10');
    setLinkUrl('');
    setInputMode('upload');
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[380px] sm:w-[420px] p-0 bg-popover" 
        align="start"
        side="bottom"
        sideOffset={8}
        collisionPadding={{ top: 80, left: 16, right: 16, bottom: 16 }}
        avoidCollisions={true}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div>
            <h4 className="font-semibold text-sm">Add {config.label} Block</h4>
            <p className="text-xs text-muted-foreground">
              {activeTab === 'library' 
                ? `${filteredContent.length} items available`
                : 'Choose a content source'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex flex-col">
          <div className="px-3 pt-3">
            <TabsList className="w-full grid grid-cols-3 mb-3">
              <TabsTrigger value="library" className="text-xs gap-1">
                <FileText className="w-3 h-3" />
                Library
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-xs gap-1">
                <Sparkles className="w-3 h-3" />
                AI
              </TabsTrigger>
              <TabsTrigger value="custom" className="text-xs gap-1">
                <Upload className="w-3 h-3" />
                Custom
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Library Tab - Virtualized */}
          <TabsContent value="library" className="mt-0 flex-1 flex flex-col">
            {/* Filters */}
            <div className="px-3 pb-2 space-y-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
              
              {/* Type filter */}
              <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                <SelectTrigger className="h-7 text-[10px]">
                  <Filter className="w-3 h-3 mr-1" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all" className="text-xs">All Types</SelectItem>
                  <SelectItem value="video" className="text-xs">Videos</SelectItem>
                  <SelectItem value="presentation" className="text-xs">Presentations</SelectItem>
                  <SelectItem value="document" className="text-xs">Documents</SelectItem>
                  <SelectItem value="animation" className="text-xs">Animations</SelectItem>
                  <SelectItem value="simulation" className="text-xs">Simulations</SelectItem>
                </SelectContent>
              </Select>
              
              {chapter && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground uppercase">Context:</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {subject} • {chapter}
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Virtualized Content List */}
            <div 
              ref={parentRef}
              className="h-[240px] overflow-auto px-3"
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const item = filteredContent[virtualRow.index];
                  return (
                    <div
                      key={item.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <ContentItem
                        item={item}
                        onSelect={() => handleLibrarySelect(item)}
                      />
                    </div>
                  );
                })}
              </div>
              
              {filteredContent.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Search className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No content found</p>
                  <p className="text-xs">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* AI Tab */}
          <TabsContent value="ai" className="mt-0 p-3 space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Describe what you want to teach
              </label>
              <Textarea
                placeholder={`e.g., "Explain Newton's second law with real-world examples..."`}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[80px] text-sm resize-none"
              />
            </div>
            
            {chapter && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">Context:</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {subject} • {chapter}
                </Badge>
              </div>
            )}
            
            <Button
              className="w-full gradient-button gap-2"
              onClick={handleAIGenerate}
              disabled={!aiPrompt.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Content
                </>
              )}
            </Button>
          </TabsContent>
          
          {/* Custom Tab */}
          <TabsContent value="custom" className="mt-0 p-3 space-y-3">
            {/* Input Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={inputMode === 'upload' ? 'default' : 'outline'}
                size="sm"
                className={cn("flex-1 h-8 text-xs", inputMode === 'upload' && "gradient-button")}
                onClick={() => setInputMode('upload')}
              >
                <Upload className="w-3 h-3 mr-1" />
                Upload File
              </Button>
              <Button
                variant={inputMode === 'link' ? 'default' : 'outline'}
                size="sm"
                className={cn("flex-1 h-8 text-xs", inputMode === 'link' && "gradient-button")}
                onClick={() => setInputMode('link')}
              >
                <LinkIcon className="w-3 h-3 mr-1" />
                Add Link
              </Button>
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Block Title {inputMode === 'link' && '(optional)'}
              </label>
              <Input
                placeholder="Enter title..."
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Duration (minutes)
              </label>
              <Input
                type="number"
                placeholder="10"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                className="h-9 text-sm w-24"
                min={1}
                max={60}
              />
            </div>
            
            {inputMode === 'upload' ? (
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  Drag & drop files or click to browse
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  PDF, PPT, DOC, MP4, Images
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Paste YouTube, Vimeo, or any URL..."
                    value={linkUrl}
                    onChange={(e) => handleLinkChange(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
                
                {linkUrl && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">Detected:</span>
                    <Badge 
                      variant="outline" 
                      className={cn("text-[10px] px-1.5 py-0", linkTypeBadges[detectedLinkType].className)}
                    >
                      {linkTypeBadges[detectedLinkType].label}
                    </Badge>
                  </div>
                )}
                
                <p className="text-[10px] text-muted-foreground">
                  Supports: YouTube, Vimeo, Google Drive, Google Slides, or any iframe embed
                </p>
              </div>
            )}
            
            <Button
              className="w-full"
              onClick={handleCustomAdd}
              disabled={inputMode === 'upload' ? !customTitle.trim() : !linkUrl.trim()}
            >
              {inputMode === 'upload' ? (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Add Block
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Add Link
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
