import { useState } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { classes, courses, subjects, chapters, topics } from "@/data/mockData";
import { cn } from "@/lib/utils";

type Tab = "classes" | "courses" | "curriculum" | "subjects" | "chapters" | "topics";

const tabs: { id: Tab; label: string }[] = [
  { id: "classes", label: "Classes" },
  { id: "courses", label: "Courses" },
  { id: "curriculum", label: "Curriculum" },
  { id: "subjects", label: "Subjects" },
  { id: "chapters", label: "Chapters" },
  { id: "topics", label: "Topics" },
];

const curriculums = [
  { id: "1", name: "CBSE", code: "CBSE", description: "Central Board" },
  { id: "2", name: "ICSE", code: "ICSE", description: "Indian Certificate" },
  { id: "3", name: "State Board", code: "STATE", description: "Various States" },
];

const Parameters = () => {
  const [activeTab, setActiveTab] = useState<Tab>("classes");

  const getActiveData = () => {
    switch (activeTab) {
      case "classes": return classes;
      case "courses": return courses;
      case "curriculum": return curriculums;
      case "subjects": return subjects;
      case "chapters": return chapters;
      case "topics": return topics;
      default: return [];
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Global Parameters"
        description="Manage classes, courses, subjects, and content hierarchy"
        breadcrumbs={[{ label: "Dashboard", href: "/superadmin/dashboard" }, { label: "Parameters" }]}
      />

      {/* Tabs */}
      <div className="bg-card rounded-2xl p-2 shadow-soft border border-border/50 inline-flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeTab === tab.id ? "gradient-button text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold capitalize">{activeTab}</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gradient-button gap-2"><Plus className="w-4 h-4" />Add {activeTab.slice(0, -1)}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New {activeTab.slice(0, -1)}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder={`Enter ${activeTab.slice(0, -1)} name`} />
                </div>
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input placeholder="Enter code" />
                </div>
                <Button className="w-full gradient-button">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {getActiveData().map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors">
              <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.code || item.description}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Parameters;