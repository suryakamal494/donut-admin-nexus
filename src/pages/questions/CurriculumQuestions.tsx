import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Sparkles, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { mockQuestions, questionTypeLabels, type QuestionType } from "@/data/questionsData";
import { classes as cbseClasses } from "@/data/mockData";
import { getActiveCurriculums } from "@/data/masterData";
import { 
  getChaptersByCurriculumClassAndSubject, 
  getSubjectsForCurriculumAndClass 
} from "@/data/cbseMasterData";

const CurriculumQuestions = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const activeCurriculums = getActiveCurriculums();

  // Get subjects based on selected curriculum and class
  const availableSubjects = useMemo(() => {
    if (selectedCurriculum === "all" || selectedClass === "all") {
      return [];
    }
    return getSubjectsForCurriculumAndClass(selectedCurriculum, selectedClass);
  }, [selectedCurriculum, selectedClass]);

  // Get chapters based on selected curriculum, class, and subject
  const availableChapters = useMemo(() => {
    if (selectedCurriculum === "all" || selectedClass === "all" || selectedSubject === "all") {
      return [];
    }
    return getChaptersByCurriculumClassAndSubject(selectedCurriculum, selectedClass, selectedSubject);
  }, [selectedCurriculum, selectedClass, selectedSubject]);

  // Filter questions (curriculum-based only)
  const filteredQuestions = mockQuestions.filter(q => {
    const matchesSearch = q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "all" || q.classId === selectedClass;
    const matchesSubject = selectedSubject === "all" || q.subjectId === selectedSubject;
    const matchesType = selectedType === "all" || q.type === selectedType;
    return matchesSearch && matchesClass && matchesSubject && matchesType;
  });

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset dependent filters when parent changes
  const handleCurriculumChange = (value: string) => {
    setSelectedCurriculum(value);
    setSelectedClass("all");
    setSelectedSubject("all");
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedSubject("all");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculum Questions"
        description="Manage questions organized under the curriculum tree (Board → Class → Subject → Chapter)"
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate("/superadmin/questions/curriculum/upload")}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload PDF
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/superadmin/questions/curriculum/ai")}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate with AI
            </Button>
            <Button 
              onClick={() => navigate("/superadmin/questions/curriculum/create")}
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
        
        <Select value={selectedCurriculum} onValueChange={handleCurriculumChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Curriculum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Boards</SelectItem>
            {activeCurriculums.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={selectedClass} 
          onValueChange={handleClassChange}
          disabled={selectedCurriculum === "all"}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {cbseClasses.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={selectedSubject} 
          onValueChange={setSelectedSubject}
          disabled={selectedClass === "all"}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {availableSubjects.map(s => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
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

export default CurriculumQuestions;
