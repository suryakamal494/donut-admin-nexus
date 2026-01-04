import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, UserPlus, Calendar, ArrowLeft, Lock, FileText, Clock, Award, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SubjectBadge } from "@/components/subject/SubjectBadge";
import { mockPreviousYearPapers, groupPapersByExamAndYear, examTypeLabels, PreviousYearPaper } from "@/data/examsData";
import ScheduleExamDialog from "@/components/institute/exams/ScheduleExamDialog";
import AssignBatchesDialog from "@/components/institute/exams/AssignBatchesDialog";

const PreviousYearPapers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [examTypeFilter, setExamTypeFilter] = useState<string>("all");
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [assignBatchesDialogOpen, setAssignBatchesDialogOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<{ id: string; name: string; batches: string[] } | null>(null);

  // Only show published papers from Super Admin
  const publishedPapers = mockPreviousYearPapers.filter(p => p.status === "published");
  
  // Apply filters
  const filteredPapers = publishedPapers.filter((paper) => {
    const matchesSearch = paper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          paper.session?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = examTypeFilter === "all" || paper.examType === examTypeFilter;
    return matchesSearch && matchesType;
  });

  const groupedPapers = groupPapersByExamAndYear(filteredPapers);

  const handleViewPaper = (paper: PreviousYearPaper) => {
    navigate(`/institute/exams/pyp-view/${paper.id}`);
  };

  const handleAssignPaper = (paper: PreviousYearPaper) => {
    setSelectedPaper({ id: paper.id, name: paper.name, batches: [] });
    setAssignBatchesDialogOpen(true);
  };

  const handleSchedulePaper = (paper: PreviousYearPaper) => {
    setSelectedPaper({ id: paper.id, name: paper.name, batches: [] });
    setScheduleDialogOpen(true);
  };

  const totalPapers = publishedPapers.length;
  const examTypes = [...new Set(publishedPapers.map(p => p.examType))];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Previous Year Papers"
        description="Access and assign past exam papers shared by Super Admin"
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Exams", href: "/institute/exams" },
          { label: "Previous Year Papers" },
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate("/institute/exams")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exams
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{totalPapers}</p>
            <p className="text-sm text-muted-foreground">Total Papers</p>
          </CardContent>
        </Card>
        {examTypes.map(type => (
          <Card key={type} className="bg-muted/30">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">
                {publishedPapers.filter(p => p.examType === type).length}
              </p>
              <p className="text-sm text-muted-foreground">{examTypeLabels[type]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search papers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Exam Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Exam Types</SelectItem>
            <SelectItem value="jee_main">JEE Main</SelectItem>
            <SelectItem value="jee_advanced">JEE Advanced</SelectItem>
            <SelectItem value="neet">NEET</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grouped Papers */}
      {Object.keys(groupedPapers).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedPapers).map(([examType, yearGroups]) => (
            <Card key={examType} className="overflow-hidden">
              <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">{examTypeLabels[examType]}</h3>
                </div>
                <Badge variant="secondary">
                  {Object.values(yearGroups).flat().length} Papers
                </Badge>
              </div>
              <CardContent className="p-4">
                <Accordion type="multiple" className="space-y-2">
                  {Object.entries(yearGroups)
                    .sort(([a], [b]) => Number(b) - Number(a))
                    .map(([year, papers]) => (
                    <AccordionItem key={year} value={year} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-medium">{year}</span>
                          <Badge variant="outline" className="ml-2">{papers.length} Papers</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          {papers.map((paper) => (
                            <Card key={paper.id} className="border hover:border-primary/50 transition-colors">
                              <CardContent className="p-4">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="font-medium text-foreground">{paper.name}</h4>
                                    {paper.session && (
                                      <p className="text-sm text-muted-foreground">{paper.session}</p>
                                    )}
                                  </div>
                                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                    <Lock className="w-3 h-3" />
                                    Super Admin
                                  </Badge>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5" />
                                    {paper.totalQuestions} Qs
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Award className="w-3.5 h-3.5" />
                                    {paper.totalMarks} Marks
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {paper.duration} min
                                  </span>
                                </div>

                                {/* Subjects */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {paper.subjects.map((subject) => (
                                    <SubjectBadge key={subject} subject={subject} size="xs" />
                                  ))}
                                </div>

                                {/* Rank/Percentile Indicators */}
                                {(paper.rankEnabled || paper.percentileEnabled) && (
                                  <div className="flex items-center gap-2 mb-3">
                                    {paper.percentileEnabled && (
                                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                                        <BarChart3 className="w-3 h-3" />
                                        Percentile Enabled
                                      </Badge>
                                    )}
                                  </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-2 border-t">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewPaper(paper)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleAssignPaper(paper)}
                                  >
                                    <UserPlus className="w-4 h-4 mr-1" />
                                    Assign
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => handleSchedulePaper(paper)}
                                  >
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Schedule
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12">
          <CardContent className="text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No previous year papers found</p>
            <p className="text-sm text-muted-foreground">
              Papers will appear here once shared by Super Admin
            </p>
          </CardContent>
        </Card>
      )}

      {/* Schedule Dialog */}
      {selectedPaper && (
        <ScheduleExamDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          exam={selectedPaper}
          onScheduleSaved={(date, time) => {
            console.log("Scheduled PYP:", selectedPaper.id, date, time);
          }}
        />
      )}

      {/* Assign Batches Dialog */}
      {selectedPaper && (
        <AssignBatchesDialog
          open={assignBatchesDialogOpen}
          onOpenChange={setAssignBatchesDialogOpen}
          exam={selectedPaper}
          onBatchesSaved={(batches) => {
            console.log("Batches assigned to PYP:", selectedPaper.id, batches);
          }}
        />
      )}
    </div>
  );
};

export default PreviousYearPapers;
