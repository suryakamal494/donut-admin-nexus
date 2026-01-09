import { useState } from "react";
import { 
  Search, 
  Sparkles, 
  Upload, 
  FileText, 
  Video, 
  Image as ImageIcon,
  Loader2,
  X
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { blockTypeConfig, type BlockType, type LessonPlanBlock } from "./types";

interface BlockPopoverProps {
  type: BlockType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBlock: (block: Omit<LessonPlanBlock, 'id'>) => void;
  chapter?: string;
  subject?: string;
  children: React.ReactNode;
}

// Mock library content
const mockLibraryContent = [
  { id: '1', title: "Newton's Laws - Complete Guide", type: 'presentation', duration: 15 },
  { id: '2', title: "Force and Motion Explained", type: 'video', duration: 12 },
  { id: '3', title: "Momentum Conservation Demo", type: 'presentation', duration: 10 },
  { id: '4', title: "Friction Types and Applications", type: 'document', duration: 8 },
];

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
  const [aiPrompt, setAiPrompt] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customDuration, setCustomDuration] = useState('10');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const config = blockTypeConfig[type];

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
    // Simulate AI generation
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
    if (!customTitle.trim()) return;
    
    onAddBlock({
      type,
      title: customTitle,
      source: 'custom',
      duration: parseInt(customDuration) || 10,
    });
    
    setCustomTitle('');
    setCustomDuration('10');
    onOpenChange(false);
  };

  const filteredContent = mockLibraryContent.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[340px] p-0" 
        align="start"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div>
            <h4 className="font-semibold text-sm">Add {config.label} Block</h4>
            <p className="text-xs text-muted-foreground">Choose a content source</p>
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
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="p-3">
          <TabsList className="w-full grid grid-cols-3 mb-3">
            <TabsTrigger value="library" className="text-xs gap-1">
              <FileText className="w-3 h-3" />
              Library
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs gap-1">
              <Sparkles className="w-3 h-3" />
              AI Generate
            </TabsTrigger>
            <TabsTrigger value="custom" className="text-xs gap-1">
              <Upload className="w-3 h-3" />
              Custom
            </TabsTrigger>
          </TabsList>
          
          {/* Library Tab */}
          <TabsContent value="library" className="mt-0 space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
            
            {chapter && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground uppercase">Suggested for:</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {chapter}
                </Badge>
              </div>
            )}
            
            <ScrollArea className="h-[180px]">
              <div className="space-y-1.5">
                {filteredContent.map((item) => {
                  const TypeIcon = item.type === 'video' ? Video 
                    : item.type === 'presentation' ? FileText 
                    : ImageIcon;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLibrarySelect(item)}
                      className={cn(
                        "w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left",
                        "hover:bg-primary/5 transition-colors",
                        "border border-transparent hover:border-primary/20"
                      )}
                    >
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <TypeIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.type} • {item.duration} min
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* AI Tab */}
          <TabsContent value="ai" className="mt-0 space-y-3">
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
          <TabsContent value="custom" className="mt-0 space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Block Title
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
            
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">
                Drag & drop files or click to browse
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                PDF, PPT, DOC, MP4, Images
              </p>
            </div>
            
            <Button
              className="w-full"
              onClick={handleCustomAdd}
              disabled={!customTitle.trim()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Add Block
            </Button>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
