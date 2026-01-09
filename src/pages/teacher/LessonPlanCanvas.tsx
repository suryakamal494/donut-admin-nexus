import { useState, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { currentTeacher } from "@/data/teacherData";
import {
  WorkspaceHeader,
  WorkspaceContextBar,
  WorkspaceToolbar,
  WorkspaceCanvas,
  WorkspaceFooter,
  BlockPopover,
  QuizPopover,
  AIAssistDialog,
  type LessonPlanBlock,
  type BlockType,
  type WorkspaceContext,
} from "@/components/teacher/lesson-workspace";

const LessonPlanCanvas = () => {
  const navigate = useNavigate();
  const { planId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const isNew = planId === "create";

  // Context from URL (from timetable)
  const contextBatch = searchParams.get('batch');
  const contextBatchName = searchParams.get('batchName');
  const contextDate = searchParams.get('date');
  const contextClassName = searchParams.get('className');
  const contextChapter = searchParams.get('chapter');

  // Workspace context
  const [context, setContext] = useState<WorkspaceContext>({
    className: contextClassName || "Class 10",
    subject: currentTeacher.subjects[0] || "Physics",
    chapter: contextChapter || "",
    scheduledDate: contextDate || new Date().toISOString().split('T')[0],
    batchName: contextBatchName || "10A",
    batchId: contextBatch || "batch-10a",
    isFromTimetable: !!contextBatch,
  });

  const [blocks, setBlocks] = useState<LessonPlanBlock[]>([]);
  const [status, setStatus] = useState<'draft' | 'ready' | 'completed'>('draft');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeBlockType, setActiveBlockType] = useState<BlockType | null>(null);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [topic, setTopic] = useState('');

  const totalDuration = blocks.reduce((sum, b) => sum + (b.duration || 0), 0);

  const handleAddBlock = useCallback((block: Omit<LessonPlanBlock, 'id'>) => {
    const newBlock: LessonPlanBlock = {
      ...block,
      id: `block-${Date.now()}`,
    };
    setBlocks(prev => [...prev, newBlock]);
    setActiveBlockType(null);
  }, []);

  const handleBlockClick = (type: BlockType) => {
    setActiveBlockType(activeBlockType === type ? null : type);
  };

  const handleEditBlock = useCallback((block: LessonPlanBlock) => {
    // For now, just show toast - full edit dialog can be added later
    toast({ title: "Edit Block", description: `Editing: ${block.title}` });
  }, [toast]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
  }, []);

  const handleReorderBlocks = useCallback((newBlocks: LessonPlanBlock[]) => {
    setBlocks(newBlocks);
  }, []);

  const handleAddBetween = useCallback((index: number, type: BlockType) => {
    const newBlock: LessonPlanBlock = {
      id: `block-${Date.now()}`,
      type,
      title: "",
      source: 'custom',
      duration: 10,
    };
    setBlocks(prev => [...prev.slice(0, index), newBlock, ...prev.slice(index)]);
  }, []);

  const handleAIGenerate = useCallback(async () => {
    if (!topic) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("lesson-plan-ai", {
        body: {
          action: "generate_plan",
          topic,
          subject: context.subject,
          chapter: context.chapter,
        },
      });

      if (error) throw error;

      if (data?.data?.blocks) {
        const newBlocks: LessonPlanBlock[] = data.data.blocks.map((b: any, i: number) => ({
          id: `block-ai-${Date.now()}-${i}`,
          type: ['explain', 'demonstrate', 'quiz', 'homework'].includes(b.type) ? b.type : 'explain',
          title: b.title || "",
          content: b.content || "",
          duration: b.duration || 10,
          source: 'ai' as const,
          aiGenerated: true,
        }));
        setBlocks(newBlocks);
        toast({ title: "Lesson Generated", description: `Created ${newBlocks.length} blocks` });
      }
    } catch (error: any) {
      toast({ title: "Generation Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  }, [topic, context.subject, context.chapter, toast]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    toast({ title: "Saved", description: "Lesson plan saved as draft" });
    setIsSaving(false);
  }, [toast]);

  const handlePublish = useCallback(async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setStatus('ready');
    toast({ title: "Published", description: "Lesson plan is ready for class" });
    setIsSaving(false);
  }, [toast]);

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24 sm:pb-6">
      <WorkspaceHeader
        isNew={isNew}
        subject={context.subject}
        batchName={context.batchName}
        status={status}
        isSaving={isSaving}
        onBack={() => navigate("/teacher/lesson-plans")}
        onSave={handleSave}
        onStartClass={() => toast({ title: "Starting class..." })}
      />

      <WorkspaceContextBar context={context} />

      <WorkspaceToolbar
        onBlockClick={handleBlockClick}
        onAIAssist={() => setShowAIDialog(true)}
        isGenerating={isGenerating}
        activeBlock={activeBlockType}
      />

      {/* Block Popovers - rendered conditionally */}
      {activeBlockType && activeBlockType !== 'quiz' && (
        <BlockPopover
          type={activeBlockType}
          open={!!activeBlockType}
          onOpenChange={(open) => !open && setActiveBlockType(null)}
          onAddBlock={handleAddBlock}
          chapter={context.chapter}
          subject={context.subject}
        >
          <div />
        </BlockPopover>
      )}

      {activeBlockType === 'quiz' && (
        <QuizPopover
          open={true}
          onOpenChange={(open) => !open && setActiveBlockType(null)}
          onAddBlock={handleAddBlock}
          chapter={context.chapter}
          subject={context.subject}
        >
          <div />
        </QuizPopover>
      )}

      <WorkspaceCanvas
        blocks={blocks}
        onReorder={handleReorderBlocks}
        onEditBlock={handleEditBlock}
        onDeleteBlock={handleDeleteBlock}
        onAddBetween={handleAddBetween}
      />

      <WorkspaceFooter
        totalDuration={totalDuration}
        blockCount={blocks.length}
        isSaving={isSaving}
        onSaveDraft={handleSave}
        onPublish={handlePublish}
      />

      <AIAssistDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        topic={topic}
        chapter={context.chapter}
        subject={context.subject}
        onTopicChange={setTopic}
        onChapterChange={(ch) => setContext(prev => ({ ...prev, chapter: ch }))}
        onGenerate={handleAIGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default LessonPlanCanvas;
