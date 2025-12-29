import { useNavigate } from "react-router-dom";
import { Upload, Video, FileText, Presentation, FileCode, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

const contentTypes = [
  { id: "video", label: "Video", icon: Video, accept: ".mp4,.webm,.mov" },
  { id: "pdf", label: "PDF", icon: FileText, accept: ".pdf" },
  { id: "ppt", label: "Presentation", icon: Presentation, accept: ".ppt,.pptx" },
  { id: "doc", label: "Document", icon: FileText, accept: ".doc,.docx" },
  { id: "html", label: "HTML", icon: FileCode, accept: ".html,.htm" },
  { id: "iframe", label: "External URL", icon: LinkIcon, accept: "" },
];

const UploadContent = () => {
  const [selectedType, setSelectedType] = useState("video");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({ title: "Content Uploaded!", description: "Content has been added to the library." });
    navigate("/superadmin/content");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Upload Content"
        description="Add new learning content to the library"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Content", href: "/superadmin/content" },
          { label: "Upload" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Content Type Selection */}
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Content Type</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                    selectedType === type.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                >
                  <type.icon className={cn("w-6 h-6", selectedType === type.id ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Upload File</h3>
            {selectedType === "iframe" ? (
              <div className="space-y-2">
                <Label>External URL</Label>
                <Input placeholder="https://www.youtube.com/embed/..." />
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                <Upload className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium text-lg">Drag & drop your file here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                <Button variant="outline" className="mt-4">Select File</Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: {contentTypes.find(t => t.id === selectedType)?.accept || "Any"}
                </p>
              </div>
            )}
          </div>

          {/* Content Details */}
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Content Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input placeholder="Enter content title" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe what this content covers..." className="min-h-24" />
              </div>
              <div className="space-y-2">
                <Label>Learning Objectives</Label>
                <Textarea placeholder="What will students learn from this content?" className="min-h-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Classification</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="maths">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Chapter *</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mechanics">Mechanics</SelectItem>
                    <SelectItem value="thermo">Thermodynamics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Topic</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newton">Newton's Laws</SelectItem>
                    <SelectItem value="energy">Work & Energy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="11">Class 11</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button className="w-full gradient-button" onClick={handleSubmit}>
            Upload Content
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadContent;