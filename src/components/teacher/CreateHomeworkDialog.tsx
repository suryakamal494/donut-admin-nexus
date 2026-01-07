import { useState } from "react";
import { 
  Sparkles, 
  Loader2,
  FileText,
  Calendar,
  BookOpen,
  Link2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { teacherLessonPlans } from "@/data/teacherData";

interface CreateHomeworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (homework: any) => void;
  linkedLessonPlanId?: string;
}

export const CreateHomeworkDialog = ({
  open,
  onOpenChange,
  onCreated,
  linkedLessonPlanId,
}: CreateHomeworkDialogProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"manual" | "ai">("manual");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const linkedPlan = linkedLessonPlanId 
    ? teacherLessonPlans.find(p => p.id === linkedLessonPlanId)
    : null;

  const [formData, setFormData] = useState({
    title: linkedPlan ? `Homework: ${linkedPlan.topic}` : "",
    description: "",
    subject: linkedPlan?.subject || "Physics",
    batchId: linkedPlan?.batchId || "batch-10a",
    topic: linkedPlan?.topic || "",
    chapter: linkedPlan?.chapter || "",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    homeworkType: "practice",
    linkToLessonPlan: !!linkedLessonPlanId,
    selectedLessonPlanId: linkedLessonPlanId || "",
  });

  const handleGenerateWithAI = async () => {
    if (!formData.topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate homework.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("assessment-ai", {
        body: {
          action: "generate_homework",
          topic: formData.topic,
          subject: formData.subject,
          chapter: formData.chapter,
          homeworkType: formData.homeworkType,
        },
      });

      if (error) throw error;

      if (data?.data) {
        const homework = {
          id: `hw-${Date.now()}`,
          title: data.data.title || formData.title,
          description: data.data.description,
          subject: formData.subject,
          batchId: formData.batchId,
          batchName: formData.batchId === "batch-10a" ? "10A" : formData.batchId === "batch-10b" ? "10B" : "11A",
          className: formData.batchId.includes("10") ? "Class 10" : "Class 11",
          dueDate: formData.dueDate,
          assignedDate: new Date().toISOString().split('T')[0],
          status: "assigned" as const,
          submissionCount: 0,
          totalStudents: 35,
          linkedLessonPlanId: formData.linkToLessonPlan ? formData.selectedLessonPlanId : undefined,
          tasks: data.data.tasks,
        };

        toast({
          title: "Homework Created!",
          description: `Generated ${data.data.tasks?.length || 0} tasks.`,
        });

        onCreated?.(homework);
        onOpenChange(false);
        resetForm();
      }
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate homework. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualCreate = () => {
    if (!formData.title) {
      toast({
        title: "Title Required",
        description: "Please enter a title for the homework.",
        variant: "destructive",
      });
      return;
    }

    const homework = {
      id: `hw-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      batchId: formData.batchId,
      batchName: formData.batchId === "batch-10a" ? "10A" : formData.batchId === "batch-10b" ? "10B" : "11A",
      className: formData.batchId.includes("10") ? "Class 10" : "Class 11",
      dueDate: formData.dueDate,
      assignedDate: new Date().toISOString().split('T')[0],
      status: "assigned" as const,
      submissionCount: 0,
      totalStudents: 35,
      linkedLessonPlanId: formData.linkToLessonPlan ? formData.selectedLessonPlanId : undefined,
    };

    toast({
      title: "Homework Assigned!",
      description: "Students have been notified.",
    });

    onCreated?.(homework);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject: "Physics",
      batchId: "batch-10a",
      topic: "",
      chapter: "",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      homeworkType: "practice",
      linkToLessonPlan: false,
      selectedLessonPlanId: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Homework</DialogTitle>
          <DialogDescription>
            Create homework for your students
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "manual" | "ai")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="gap-2">
              <FileText className="w-4 h-4" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="w-4 h-4" />
              AI Generate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Practice Problems - Newton's Laws"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Instructions for students..."
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Subject</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, subject: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Batch</Label>
                <Select
                  value={formData.batchId}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, batchId: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="batch-10a">10A</SelectItem>
                    <SelectItem value="batch-10b">10B</SelectItem>
                    <SelectItem value="batch-11a">11A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Link to Lesson Plan */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Link to Lesson Plan</span>
              </div>
              <Switch
                checked={formData.linkToLessonPlan}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, linkToLessonPlan: checked }))}
              />
            </div>

            {formData.linkToLessonPlan && (
              <div>
                <Label>Select Lesson Plan</Label>
                <Select
                  value={formData.selectedLessonPlanId}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, selectedLessonPlanId: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Choose a lesson plan" /></SelectTrigger>
                  <SelectContent>
                    {teacherLessonPlans.map(plan => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.title} ({plan.batchName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai" className="space-y-4 mt-4">
            <div>
              <Label>Topic *</Label>
              <Input
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., Newton's Laws of Motion"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Subject</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, subject: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Batch</Label>
                <Select
                  value={formData.batchId}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, batchId: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="batch-10a">10A</SelectItem>
                    <SelectItem value="batch-10b">10B</SelectItem>
                    <SelectItem value="batch-11a">11A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Homework Type</Label>
              <Select
                value={formData.homeworkType}
                onValueChange={(v) => setFormData(prev => ({ ...prev, homeworkType: v }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="practice">Practice Problems</SelectItem>
                  <SelectItem value="reading">Reading Assignment</SelectItem>
                  <SelectItem value="project">Mini Project</SelectItem>
                  <SelectItem value="revision">Revision</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {activeTab === "ai" ? (
            <Button
              className="gradient-button"
              onClick={handleGenerateWithAI}
              disabled={isGenerating || !formData.topic}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate Homework
            </Button>
          ) : (
            <Button
              className="gradient-button"
              onClick={handleManualCreate}
              disabled={!formData.title}
            >
              Assign Homework
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
