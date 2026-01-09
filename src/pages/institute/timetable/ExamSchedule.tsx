import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExamBlockForm } from "@/components/timetable/ExamBlockForm";
import { ExamBlockList } from "@/components/timetable/ExamBlockList";
import { ExamYearlyCalendar } from "@/components/timetable/ExamYearlyCalendar";
import { ExamTypeManager } from "@/components/timetable/ExamTypeManager";
import { ExamBlock, ExamType } from "@/types/examBlock";
import { examBlocks as initialBlocks, defaultExamTypes } from "@/data/examBlockData";
import { Plus, List, CalendarDays } from "lucide-react";
import { toast } from "sonner";

const ExamSchedule = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [blocks, setBlocks] = useState<ExamBlock[]>(initialBlocks);
  const [editingBlock, setEditingBlock] = useState<ExamBlock | null>(null);
  const [examTypes, setExamTypes] = useState<ExamType[]>(defaultExamTypes);

  // Get list of exam type IDs currently in use
  const usedTypeIds = useMemo(() => {
    return [...new Set(blocks.map(b => b.examTypeId))];
  }, [blocks]);

  const handleSaveBlock = (block: ExamBlock) => {
    if (editingBlock) {
      setBlocks(prev => prev.map(b => b.id === block.id ? block : b));
      toast.success("Exam updated successfully");
      setEditingBlock(null);
    } else {
      setBlocks(prev => [...prev, { ...block, id: `block-${Date.now()}`, createdAt: new Date().toISOString() }]);
      toast.success("Exam created successfully");
    }
    setActiveTab("list");
  };

  const handleEditBlock = (block: ExamBlock) => {
    setEditingBlock(block);
    setActiveTab("create");
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    toast.success("Exam deleted successfully");
  };

  const handleToggleActive = (blockId: string) => {
    setBlocks(prev => prev.map(b => 
      b.id === blockId ? { ...b, isActive: !b.isActive } : b
    ));
  };

  // Exam type handlers
  const handleAddType = (type: ExamType) => {
    setExamTypes(prev => [...prev, type]);
  };

  const handleUpdateType = (type: ExamType) => {
    setExamTypes(prev => prev.map(t => t.id === type.id ? type : t));
  };

  const handleDeleteType = (typeId: string) => {
    setExamTypes(prev => prev.filter(t => t.id !== typeId));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Exam Schedule"
        description="Schedule exams and reserve time slots in the timetable"
        breadcrumbs={[
          { label: "Timetable", href: "/institute/timetable" },
          { label: "Exam Schedule" },
        ]}
        actions={
          <ExamTypeManager 
            examTypes={examTypes}
            onAddType={handleAddType}
            onUpdateType={handleUpdateType}
            onDeleteType={handleDeleteType}
            usedTypeIds={usedTypeIds}
          />
        }
      />

      <Tabs value={activeTab} onValueChange={(v) => {
        if (v !== "create") setEditingBlock(null);
        setActiveTab(v);
      }}>
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="list" className="gap-2">
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Schedule List</span>
            <span className="sm:hidden">List</span>
          </TabsTrigger>
          <TabsTrigger value="yearly" className="gap-2">
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">Yearly Calendar</span>
            <span className="sm:hidden">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="create" className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{editingBlock ? "Edit Exam" : "Create"}</span>
            <span className="sm:hidden">{editingBlock ? "Edit" : "Create"}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4 sm:mt-6">
          <ExamBlockList
            blocks={blocks}
            onEdit={handleEditBlock}
            onDelete={handleDeleteBlock}
            onToggleActive={handleToggleActive}
            onCreateNew={() => setActiveTab("create")}
            examTypes={examTypes}
          />
        </TabsContent>

        <TabsContent value="yearly" className="mt-4 sm:mt-6">
          <ExamYearlyCalendar 
            blocks={blocks} 
            examTypes={examTypes}
            onEdit={handleEditBlock}
          />
        </TabsContent>

        <TabsContent value="create" className="mt-4 sm:mt-6">
          <ExamBlockForm
            existingBlock={editingBlock}
            onSave={handleSaveBlock}
            onCancel={() => {
              setEditingBlock(null);
              setActiveTab("list");
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamSchedule;
