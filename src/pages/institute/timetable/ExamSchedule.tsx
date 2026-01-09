import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExamBlockForm } from "@/components/timetable/ExamBlockForm";
import { ExamBlockList } from "@/components/timetable/ExamBlockList";
import { ExamBlock } from "@/types/examBlock";
import { examBlocks as initialBlocks } from "@/data/examBlockData";
import { Plus, Calendar } from "lucide-react";
import { toast } from "sonner";

const ExamSchedule = () => {
  const [activeTab, setActiveTab] = useState("view");
  const [blocks, setBlocks] = useState<ExamBlock[]>(initialBlocks);
  const [editingBlock, setEditingBlock] = useState<ExamBlock | null>(null);

  const handleSaveBlock = (block: ExamBlock) => {
    if (editingBlock) {
      // Update existing block
      setBlocks(prev => prev.map(b => b.id === block.id ? block : b));
      toast.success("Block updated successfully");
      setEditingBlock(null);
    } else {
      // Add new block
      setBlocks(prev => [...prev, { ...block, id: `block-${Date.now()}`, createdAt: new Date().toISOString() }]);
      toast.success("Block created successfully");
    }
    setActiveTab("view");
  };

  const handleEditBlock = (block: ExamBlock) => {
    setEditingBlock(block);
    setActiveTab("create");
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    toast.success("Block deleted successfully");
  };

  const handleToggleActive = (blockId: string) => {
    setBlocks(prev => prev.map(b => 
      b.id === blockId ? { ...b, isActive: !b.isActive } : b
    ));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Exam Schedule"
        description="Create blocks to reserve time slots for exams and activities"
        breadcrumbs={[
          { label: "Timetable", href: "/institute/timetable" },
          { label: "Exam Schedule" },
        ]}
      />

      <Tabs value={activeTab} onValueChange={(v) => {
        if (v === "view") setEditingBlock(null);
        setActiveTab(v);
      }}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="view" className="gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">View Schedule</span>
            <span className="sm:hidden">View</span>
          </TabsTrigger>
          <TabsTrigger value="create" className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{editingBlock ? "Edit Block" : "Create Block"}</span>
            <span className="sm:hidden">{editingBlock ? "Edit" : "Create"}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="mt-4 sm:mt-6">
          <ExamBlockList
            blocks={blocks}
            onEdit={handleEditBlock}
            onDelete={handleDeleteBlock}
            onToggleActive={handleToggleActive}
            onCreateNew={() => setActiveTab("create")}
          />
        </TabsContent>

        <TabsContent value="create" className="mt-4 sm:mt-6">
          <ExamBlockForm
            existingBlock={editingBlock}
            onSave={handleSaveBlock}
            onCancel={() => {
              setEditingBlock(null);
              setActiveTab("view");
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamSchedule;
