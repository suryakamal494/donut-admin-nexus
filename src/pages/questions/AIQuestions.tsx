import { Sparkles, Upload, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const AIQuestions = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="AI Question Generator"
        description="Generate questions using AI or from previous year papers"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Questions", href: "/superadmin/questions" },
          { label: "AI Generator" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generate from Topic */}
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-button flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Generate from Topic</h3>
              <p className="text-sm text-muted-foreground">AI creates questions based on topic</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="maths">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Chapter</Label>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Number of Questions</Label>
                <Input type="number" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <Label>Difficulty Mix</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Mostly Easy</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="hard">Mostly Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Additional Instructions (Optional)</Label>
              <Textarea placeholder="e.g., Focus on numerical problems, include diagrams..." />
            </div>
            <Button className="w-full gradient-button gap-2">
              <Wand2 className="w-4 h-4" />
              Generate Questions
            </Button>
          </div>
        </div>

        {/* Upload Previous Year Paper */}
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-donut-purple/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-donut-purple" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Upload Previous Year Paper</h3>
              <p className="text-sm text-muted-foreground">Extract questions from PDF</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-medium">Drag & drop PDF here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
              <Button variant="outline" className="mt-4">Select File</Button>
            </div>
            <div className="space-y-2">
              <Label>Exam Type</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="jee-main">JEE Main</SelectItem>
                  <SelectItem value="jee-adv">JEE Advanced</SelectItem>
                  <SelectItem value="neet">NEET</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" variant="outline" disabled>
              <Upload className="w-4 h-4 mr-2" />
              Upload & Extract
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIQuestions;