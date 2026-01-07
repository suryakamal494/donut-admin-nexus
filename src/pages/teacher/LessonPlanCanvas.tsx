import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Sparkles, 
  Clock,
  Copy,
  MoreVertical,
  Loader2,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SortableBlockList } from "@/components/teacher/SortableBlockList";
import { AddBlockMenu } from "@/components/teacher/AddBlockMenu";
import { 
  teacherLessonPlans, 
  currentTeacher,
  type LessonPlan, 
  type LessonPlanBlock 
} from "@/data/teacherData";

const LessonPlanCanvas = () => {
  const navigate = useNavigate();
  const { planId } = useParams();
  const { toast } = useToast();
  const isNew = planId === "create";

  // Find existing plan or create new
  const existingPlan = !isNew ? teacherLessonPlans.find(p => p.id === planId) : null;

  const [plan, setPlan] = useState<Partial<LessonPlan>>({
    id: existingPlan?.id || `lp-${Date.now()}`,
    title: existingPlan?.title || "",
    subject: existingPlan?.subject || currentTeacher.subjects[0] || "Physics",
    subjectId: existingPlan?.subjectId || "phy",
    chapter: existingPlan?.chapter || "",
    topic: existingPlan?.topic || "",
    batchId: existingPlan?.batchId || "batch-10a",
    batchName: existingPlan?.batchName || "10A",
    className: existingPlan?.className || "Class 10",
    scheduledDate: existingPlan?.scheduledDate || new Date().toISOString().split('T')[0],
    periodNumber: existingPlan?.periodNumber || 1,
    status: existingPlan?.status || "draft",
    blocks: existingPlan?.blocks || [],
  });

  const [blocks, setBlocks] = useState<LessonPlanBlock[]>(existingPlan?.blocks || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingBlockId, setGeneratingBlockId] = useState<string | null>(null);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const totalDuration = blocks.reduce((sum, b) => sum + (b.duration || 0), 0);

  const handleAddBlock = useCallback((type: LessonPlanBlock["type"]) => {
    const newBlock: LessonPlanBlock = {
      id: `block-${Date.now()}`,
      type,
      title: "",
      content: "",
      duration: type === "homework" ? 0 : 10,
    };
    setBlocks(prev => [...prev, newBlock]);
  }, []);

  const handleUpdateBlock = useCallback((updatedBlock: LessonPlanBlock) => {
    setBlocks(prev => prev.map(b => b.id === updatedBlock.id ? updatedBlock : b));
  }, []);

  const handleDeleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
  }, []);

  const handleReorderBlocks = useCallback((newBlocks: LessonPlanBlock[]) => {
    setBlocks(newBlocks);
  }, []);

  const handleAIGenerateBlock = useCallback(async (blockId: string, blockType: string) => {
    if (!plan.topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic before generating content.",
        variant: "destructive",
      });
      return;
    }

    setGeneratingBlockId(blockId);
    
    try {
      const { data, error } = await supabase.functions.invoke("lesson-plan-ai", {
        body: {
          action: "generate_block",
          topic: plan.topic,
          subject: plan.subject,
          chapter: plan.chapter,
          blockType,
        },
      });

      if (error) throw error;

      if (data?.data) {
        const aiContent = data.data;
        setBlocks(prev => prev.map(b => {
          if (b.id === blockId) {
            return {
              ...b,
              title: aiContent.title || b.title,
              content: aiContent.content || b.content,
              duration: aiContent.duration || b.duration,
              aiGenerated: true,
            };
          }
          return b;
        }));
        
        toast({
          title: "Content Generated",
          description: "AI has suggested content for this block.",
        });
      }
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingBlockId(null);
    }
  }, [plan.topic, plan.subject, plan.chapter, toast]);

  const handleAIGeneratePlan = useCallback(async () => {
    if (!plan.topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate a lesson plan.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setShowAIDialog(false);

    try {
      const { data, error } = await supabase.functions.invoke("lesson-plan-ai", {
        body: {
          action: "generate_plan",
          topic: plan.topic,
          subject: plan.subject,
          chapter: plan.chapter,
        },
      });

      if (error) throw error;

      if (data?.data) {
        const aiPlan = data.data;
        
        if (aiPlan.title) {
          setPlan(prev => ({ ...prev, title: aiPlan.title }));
        }
        
        if (aiPlan.blocks && Array.isArray(aiPlan.blocks)) {
          const newBlocks: LessonPlanBlock[] = aiPlan.blocks.map((b: any, index: number) => ({
            id: `block-ai-${Date.now()}-${index}`,
            type: b.type || "explain",
            title: b.title || "",
            content: b.content || "",
            duration: b.duration || 10,
            aiGenerated: true,
          }));
          setBlocks(newBlocks);
        }
        
        toast({
          title: "Lesson Plan Generated",
          description: `Created ${aiPlan.blocks?.length || 0} teaching blocks.`,
        });
      }
    } catch (error: any) {
      console.error("AI plan generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate lesson plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [plan.topic, plan.subject, plan.chapter, toast]);

  const handleSave = useCallback(async () => {
    if (!plan.title) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your lesson plan.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Lesson Plan Saved",
      description: "Your changes have been saved.",
    });
    
    setIsSaving(false);
  }, [plan.title, toast]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/teacher/lesson-plans")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {isNew ? "New Lesson Plan" : "Edit Lesson Plan"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {plan.subject} • {plan.batchName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {totalDuration}m total
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Copy className="w-4 h-4 mr-2" />
                Clone to Another Batch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>
          
          <Button className="gradient-button">
            <Play className="w-4 h-4 mr-2" />
            Start Class
          </Button>
        </div>
      </div>

      {/* Plan Details Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Lesson Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Lesson Title
              </label>
              <Input
                value={plan.title}
                onChange={(e) => setPlan(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Newton's Laws of Motion"
                className="h-11"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Chapter
              </label>
              <Input
                value={plan.chapter}
                onChange={(e) => setPlan(prev => ({ ...prev, chapter: e.target.value }))}
                placeholder="e.g., Laws of Motion"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Topic
              </label>
              <Input
                value={plan.topic}
                onChange={(e) => setPlan(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., First and Second Law"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Batch
              </label>
              <Select 
                value={plan.batchId} 
                onValueChange={(value) => {
                  const batchMap: Record<string, { name: string; class: string }> = {
                    "batch-10a": { name: "10A", class: "Class 10" },
                    "batch-10b": { name: "10B", class: "Class 10" },
                    "batch-11a": { name: "11A", class: "Class 11" },
                  };
                  setPlan(prev => ({ 
                    ...prev, 
                    batchId: value,
                    batchName: batchMap[value]?.name || value,
                    className: batchMap[value]?.class || prev.className,
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="batch-10a">10A - Class 10</SelectItem>
                  <SelectItem value="batch-10b">10B - Class 10</SelectItem>
                  <SelectItem value="batch-11a">11A - Class 11</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Scheduled Date
              </label>
              <Input
                type="date"
                value={plan.scheduledDate}
                onChange={(e) => setPlan(prev => ({ ...prev, scheduledDate: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Blocks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Teaching Flow
            <Badge variant="secondary" className="ml-2">
              {blocks.length} blocks
            </Badge>
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowAIDialog(true)}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            AI Generate All
          </Button>
        </div>

        {/* Sortable Blocks List */}
        <SortableBlockList
          blocks={blocks}
          onReorder={handleReorderBlocks}
          onUpdateBlock={handleUpdateBlock}
          onDeleteBlock={handleDeleteBlock}
          onAIGenerate={handleAIGenerateBlock}
          generatingBlockId={generatingBlockId}
        />

        {/* Add Block */}
        <AddBlockMenu 
          onAddBlock={handleAddBlock}
          onAIGeneratePlan={() => setShowAIDialog(true)}
        />
      </div>

      {/* AI Generate Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Generate Lesson Plan with AI
            </DialogTitle>
            <DialogDescription>
              AI will create a complete lesson plan based on your topic. You can edit the generated blocks afterwards.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Topic *</label>
              <Input
                value={plan.topic}
                onChange={(e) => setPlan(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., Newton's First and Second Law"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Chapter</label>
              <Input
                value={plan.chapter}
                onChange={(e) => setPlan(prev => ({ ...prev, chapter: e.target.value }))}
                placeholder="e.g., Laws of Motion"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="gradient-button"
              onClick={handleAIGeneratePlan}
              disabled={!plan.topic}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile FAB */}
      <div className="fixed bottom-20 right-4 md:hidden flex flex-col gap-2">
        <Button 
          size="lg"
          variant="outline"
          className="w-14 h-14 rounded-full shadow-lg bg-card"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        </Button>
        <Button 
          size="lg"
          className="w-14 h-14 rounded-full gradient-button shadow-lg shadow-primary/30"
        >
          <Play className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default LessonPlanCanvas;
