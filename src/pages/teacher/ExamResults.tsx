import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Users,
  Trophy,
  TrendingUp,
  BarChart3,
  Target,
  Medal,
  Download,
  Share2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { teacherExams } from "@/data/teacher/exams";
import { getExamAnalytics, generateExamAnalytics, type ExamAnalytics } from "@/data/teacher/examResults";
import { QuestionAnalysisCard, StudentResultRow, TopPerformerRow } from "@/components/teacher/exams/results";

const PIE_COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#6b7280"];

const ExamResults = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  // Get exam details
  const exam = useMemo(() => teacherExams.find(e => e.id === examId), [examId]);
  
  // Get or generate analytics
  const analytics: ExamAnalytics | null = useMemo(() => {
    if (!exam) return null;
    const existing = getExamAnalytics(exam.id);
    if (existing) return existing;
    return generateExamAnalytics(exam.id, exam.name, exam.totalMarks);
  }, [exam]);

  if (!exam || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Exam Not Found</h2>
        <p className="text-muted-foreground mb-4">The exam you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/teacher/exams")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exams
        </Button>
      </div>
    );
  }

  // Prepare chart data
  const scoreDistributionData = analytics.scoreDistribution.map((d, i) => ({
    ...d,
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const questionSuccessData = analytics.questionAnalysis.map(q => ({
    name: `Q${q.questionNumber}`,
    successRate: q.successRate,
    avgTime: q.averageTime,
    difficulty: q.difficulty,
  }));

  const attemptDistribution = [
    { name: "Correct", value: analytics.questionAnalysis.reduce((sum, q) => sum + q.correctAttempts, 0), color: "#22c55e" },
    { name: "Incorrect", value: analytics.questionAnalysis.reduce((sum, q) => sum + q.incorrectAttempts, 0), color: "#ef4444" },
    { name: "Unattempted", value: analytics.questionAnalysis.reduce((sum, q) => sum + q.unattempted, 0), color: "#6b7280" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-20 md:pb-6">
      <PageHeader
        title="Exam Results"
        description={exam.name}
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Exams", href: "/teacher/exams" },
          { label: "Results" },
        ]}
      />

      {/* Quick Actions */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <Button variant="outline" size="sm" className="shrink-0 h-9">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" className="shrink-0 h-9">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Key Stats - Mobile scrollable, Desktop grid */}
      <ScrollArea className="w-full -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-3 sm:grid sm:grid-cols-4 min-w-max sm:min-w-0">
          <Card className="w-[140px] sm:w-auto shrink-0 card-premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.attemptedCount}</p>
                  <p className="text-xs text-muted-foreground">of {analytics.totalStudents} attempted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-[140px] sm:w-auto shrink-0 card-premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.averageScore}</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-[140px] sm:w-auto shrink-0 card-premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.highestScore}</p>
                  <p className="text-xs text-muted-foreground">Highest</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-[140px] sm:w-auto shrink-0 card-premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.passPercentage}%</p>
                  <p className="text-xs text-muted-foreground">Pass Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <ScrollBar orientation="horizontal" className="sm:hidden" />
      </ScrollArea>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full sm:w-auto h-auto p-1 grid grid-cols-3 sm:flex">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="questions" className="text-xs sm:text-sm">Questions</TabsTrigger>
          <TabsTrigger value="students" className="text-xs sm:text-sm">Students</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Score Distribution */}
            <Card className="card-premium">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                      <XAxis 
                        dataKey="range" 
                        tick={{ fontSize: 11 }} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 11 }} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        formatter={(value: number) => [
                          `${value} students (${scoreDistributionData.find(d => d.count === value)?.percentage}%)`,
                          'Count'
                        ]}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {scoreDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-4 justify-center">
                  {scoreDistributionData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: d.fill }} />
                      <span className="text-muted-foreground">{d.range}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attempt Analysis Pie Chart */}
            <Card className="card-premium">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Overall Attempt Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attemptDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {attemptDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex justify-center gap-6 mt-2">
                  {attemptDistribution.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-muted-foreground">{d.name}</span>
                      <span className="text-xs font-medium">{d.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <Card className="card-premium">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Medal className="w-4 h-4 text-amber-500" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topPerformers.slice(0, 5).map((student, idx) => (
                  <TopPerformerRow key={student.id} student={student} index={idx} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-4">
          <Card className="card-premium">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Question-wise Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={questionSuccessData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11 }} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 11 }} 
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [`${value}%`, 'Success Rate']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="successRate" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary) / 0.2)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Question Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {analytics.questionAnalysis.map((q) => (
              <QuestionAnalysisCard key={q.questionId} question={q} />
            ))}
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card className="card-premium">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">All Students</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {analytics.topPerformers.map((student) => (
                  <StudentResultRow key={student.id} student={student} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamResults;
