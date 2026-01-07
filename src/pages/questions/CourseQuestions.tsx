import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { mockQuestions, questionTypeLabels, type QuestionType } from "@/data/questionsData";
import { courses } from "@/data/masterData";

const CourseQuestions = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const publishedCourses = courses.filter(c => c.status === 'published');

  // Filter questions
  const filteredQuestions = mockQuestions.filter(q => {
    const matchesSearch = q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || q.type === selectedType;
    // In real implementation, filter by courseId
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Questions"
        description="Manage questions organized under competitive courses (JEE, NEET, Olympiads, etc.)"
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate("/superadmin/questions/course/ai")}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate with AI
            </Button>
            <Button 
              onClick={() => navigate("/superadmin/questions/course/create")}
              className="gap-2 gradient-button"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </div>
        }
      />

      {/* Filters - Compact horizontal row */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border shadow-sm">
        <div className="flex-1 min-w-[200px] max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {publishedCourses.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {(Object.entries(questionTypeLabels) as [QuestionType, string][]).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Badge variant="secondary" className="ml-auto">
          {filteredQuestions.length} questions
        </Badge>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {paginatedQuestions.map((question) => (
          <QuestionCard key={question.id} question={question as any} mode="superadmin" />
        ))}

        {paginatedQuestions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-white rounded-xl border">
            <p>No questions found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseQuestions;
