import { useState } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockQuestions } from "@/data/mockData";
import { cn } from "@/lib/utils";

const difficultyColors = {
  easy: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  hard: "bg-destructive/10 text-destructive border-destructive/20",
};

const typeLabels = {
  mcq: "MCQ",
  multiple: "Multiple Choice",
  assertion: "Assertion-Reasoning",
  paragraph: "Paragraph",
  numerical: "Numerical",
  fill: "Fill in Blanks",
  short: "Short Answer",
  long: "Long Answer",
};

const Questions = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Question Bank"
        description="Manage all questions across subjects and chapters"
        breadcrumbs={[{ label: "Dashboard", href: "/superadmin/dashboard" }, { label: "Questions" }]}
        actions={
          <div className="flex gap-3">
            <Link to="/superadmin/questions/ai">
              <Button variant="outline" className="gap-2">
                <Sparkles className="w-4 h-4" />
                AI Generator
              </Button>
            </Link>
            <Link to="/superadmin/questions/create">
              <Button className="gradient-button gap-2">
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </Link>
          </div>
        }
      />

      {/* Filters */}
      <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search questions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-3 flex-wrap">
            <Select>
              <SelectTrigger className="w-36"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="maths">Mathematics</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-36"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="mcq">MCQ</SelectItem>
                <SelectItem value="numerical">Numerical</SelectItem>
                <SelectItem value="multiple">Multiple Choice</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-36"><SelectValue placeholder="Difficulty" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {mockQuestions.map((question) => (
          <div key={question.id} className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant="outline" className="bg-muted">{typeLabels[question.type]}</Badge>
                  <Badge variant="outline" className={cn(difficultyColors[question.difficulty], "capitalize")}>{question.difficulty}</Badge>
                  <Badge variant="outline">{question.subject}</Badge>
                  <Badge variant="outline">{question.chapter}</Badge>
                </div>
                <p className="text-foreground font-medium">{question.question}</p>
                {question.options && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {question.options.map((opt, i) => (
                      <div key={i} className={cn(
                        "p-2 rounded-lg text-sm border",
                        opt === question.correctAnswer ? "bg-success/10 border-success/30 text-success" : "bg-muted/30 border-border/50"
                      )}>
                        {String.fromCharCode(65 + i)}. {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground">
              <span>Marks: {question.marks}</span>
              <span>Negative: -{question.negativeMarks}</span>
              <span>Added: {question.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;