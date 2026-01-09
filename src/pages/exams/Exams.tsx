import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Filter, FileText, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { YearAccordion, GrandTestCard } from "@/components/exams";
import { ScheduleDialog, AudienceDialog } from "@/components/exams/ScheduleDialog";
import { 
  mockPreviousYearPapers, 
  mockGrandTests, 
  groupPapersByExamAndYear,
  PreviousYearPaper,
  GrandTest,
  examTypeLabels 
} from "@/data/examsData";
import { toast } from "sonner";

const Exams = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("previous-year");
  const [pypSearchQuery, setPypSearchQuery] = useState("");
  const [pypExamFilter, setPypExamFilter] = useState("all");
  const [gtSearchQuery, setGtSearchQuery] = useState("");
  const [gtStatusFilter, setGtStatusFilter] = useState("all");
  
  // Schedule/Audience dialog state
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [audienceDialogOpen, setAudienceDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<GrandTest | null>(null);

  // Group PYPs by exam type and year
  const groupedPapers = groupPapersByExamAndYear(mockPreviousYearPapers);
  
  // Filter PYPs
  const filteredGroupedPapers = pypExamFilter === "all" 
    ? groupedPapers 
    : { [pypExamFilter]: groupedPapers[pypExamFilter] || {} };
  
  // Filter Grand Tests
  const filteredGrandTests = mockGrandTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(gtSearchQuery.toLowerCase());
    const matchesStatus = gtStatusFilter === "all" || test.status === gtStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handlers for Previous Year Papers
  const handleViewPaper = (paper: PreviousYearPaper) => {
    navigate(`/superadmin/exams/review/${paper.id}?type=previous_year&method=pdf`);
  };

  const handleEditPaper = (paper: PreviousYearPaper) => {
    navigate(`/superadmin/exams/review/${paper.id}?type=previous_year&method=pdf`);
  };

  const handleStatsPaper = (paper: PreviousYearPaper) => {
    toast.info(`Viewing stats for ${paper.name}`);
  };

  // Handlers for Grand Tests
  const handleViewTest = (test: GrandTest) => {
    navigate(`/superadmin/exams/review/${test.id}?type=grand_test&method=${test.creationMethod}`);
  };

  const handleEditTest = (test: GrandTest) => {
    navigate(`/superadmin/exams/review/${test.id}?type=grand_test&method=${test.creationMethod}`);
  };

  const handleStatsTest = (test: GrandTest) => {
    toast.info(`Viewing stats for ${test.name}`);
  };
  
  const handleScheduleTest = (test: GrandTest) => {
    setSelectedTest(test);
    setScheduleDialogOpen(true);
  };
  
  const handleAudienceTest = (test: GrandTest) => {
    setSelectedTest(test);
    setAudienceDialogOpen(true);
  };

  const handlePublishRanks = (test: GrandTest) => {
    toast.success(`Ranks published for ${test.name}`);
  };

  const handleDeleteTest = (test: GrandTest) => {
    toast.warning(`Delete ${test.name}? (Mock action)`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Exam Management"
        description="Create and manage Previous Year Papers and Grand Tests for competitive exams"
        breadcrumbs={[{ label: "Dashboard", href: "/superadmin/dashboard" }, { label: "Exams" }]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="grid w-max sm:w-full max-w-md grid-cols-2 h-10 sm:h-12 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger 
              value="previous-year" 
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg h-full whitespace-nowrap px-3 sm:px-4"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Previous Year Papers</span>
              <span className="sm:hidden">PYP</span>
            </TabsTrigger>
            <TabsTrigger 
              value="grand-tests" 
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg h-full whitespace-nowrap px-3 sm:px-4"
            >
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Grand Tests</span>
              <span className="sm:hidden">Tests</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Previous Year Papers Tab */}
        <TabsContent value="previous-year" className="space-y-4 sm:space-y-6">
          {/* Filters & Actions */}
          <div className="bg-card rounded-2xl p-3 sm:p-4 shadow-soft border border-border/50">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search papers..." 
                    value={pypSearchQuery} 
                    onChange={(e) => setPypSearchQuery(e.target.value)} 
                    className="pl-10 h-9 text-sm" 
                  />
                </div>
                <Select value={pypExamFilter} onValueChange={setPypExamFilter}>
                  <SelectTrigger className="w-full sm:w-36 h-9 text-xs sm:text-sm">
                    <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    <SelectValue placeholder="Exam Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exams</SelectItem>
                    <SelectItem value="jee_main">JEE Main</SelectItem>
                    <SelectItem value="jee_advanced">JEE Advanced</SelectItem>
                    <SelectItem value="neet">NEET</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Link to="/superadmin/exams/previous-year/create">
                <Button size="sm" className="gradient-button gap-1.5 sm:gap-2 w-full text-xs sm:text-sm h-9">
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Create Previous Year Paper</span>
                  <span className="sm:hidden">Create PYP</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Papers Grouped by Exam Type */}
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(filteredGroupedPapers).map(([examType, yearGroups]) => (
              <YearAccordion
                key={examType}
                examType={examType}
                yearGroups={yearGroups}
                onViewPaper={handleViewPaper}
                onEditPaper={handleEditPaper}
                onStatsPaper={handleStatsPaper}
              />
            ))}
            
            {Object.keys(filteredGroupedPapers).length === 0 && (
              <div className="text-center py-8 sm:py-12 bg-card rounded-2xl border border-border/50">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-base sm:text-lg mb-1">No Papers Found</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {pypExamFilter !== "all" 
                    ? `No ${examTypeLabels[pypExamFilter]} papers available` 
                    : "Start by creating your first Previous Year Paper"}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Grand Tests Tab */}
        <TabsContent value="grand-tests" className="space-y-4 sm:space-y-6">
          {/* Filters & Actions */}
          <div className="bg-card rounded-2xl p-3 sm:p-4 shadow-soft border border-border/50">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search grand tests..." 
                    value={gtSearchQuery} 
                    onChange={(e) => setGtSearchQuery(e.target.value)} 
                    className="pl-10 h-9 text-sm" 
                  />
                </div>
                <Select value={gtStatusFilter} onValueChange={setGtStatusFilter}>
                  <SelectTrigger className="w-full sm:w-36 h-9 text-xs sm:text-sm">
                    <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Link to="/superadmin/exams/grand-test/create">
                <Button size="sm" className="gradient-button gap-1.5 sm:gap-2 w-full text-xs sm:text-sm h-9">
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Create Grand Test</span>
                  <span className="sm:hidden">Create Test</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Grand Tests Grid */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGrandTests.map((test) => (
              <GrandTestCard
                key={test.id}
                test={test}
                onView={handleViewTest}
                onEdit={handleEditTest}
                onStats={handleStatsTest}
                onSchedule={handleScheduleTest}
                onAudience={handleAudienceTest}
                onPublishRanks={handlePublishRanks}
                onDelete={handleDeleteTest}
              />
            ))}
          </div>

          {filteredGrandTests.length === 0 && (
            <div className="text-center py-8 sm:py-12 bg-card rounded-2xl border border-border/50">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-base sm:text-lg mb-1">No Grand Tests Found</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {gtStatusFilter !== "all" 
                  ? `No ${gtStatusFilter} grand tests available` 
                  : "Start by creating your first Grand Test"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Schedule Dialog */}
      {selectedTest && (
        <>
          <ScheduleDialog
            open={scheduleDialogOpen}
            onOpenChange={setScheduleDialogOpen}
            test={selectedTest}
            onScheduleSaved={() => toast.success("Schedule saved")}
          />
          <AudienceDialog
            open={audienceDialogOpen}
            onOpenChange={setAudienceDialogOpen}
            test={selectedTest}
            onAudienceSaved={() => toast.success("Audience saved")}
          />
        </>
      )}
    </div>
  );
};

export default Exams;
