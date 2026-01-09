import { useState, lazy, Suspense } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarRange, Layout, GitCompareArrows } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy tab content components
const YearOverviewContent = lazy(() => 
  import("./YearOverview").then(module => ({ default: module.YearOverviewContent }))
);
const TeachingViewContent = lazy(() => 
  import("./TeachingView").then(module => ({ default: module.TeachingViewContent }))
);
const SectionAlignmentContent = lazy(() => 
  import("./SectionAlignment").then(module => ({ default: module.SectionAlignmentContent }))
);

// Loading skeleton for tab content
function TabContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export default function AcademicViews() {
  const [activeTab, setActiveTab] = useState("year-overview");

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Academic Views"
        description="Analyze curriculum progress and alignment across batches"
        breadcrumbs={[
          { label: "Syllabus Tracker", href: "/institute/academic-schedule/progress" },
          { label: "Academic Views" },
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 lg:w-auto lg:inline-flex bg-white/80 backdrop-blur-sm border border-orange-100/50 p-1 rounded-lg h-auto">
          <TabsTrigger 
            value="year-overview"
            className="flex items-center gap-2 px-4 py-2.5 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-all"
          >
            <CalendarRange className="h-4 w-4" />
            <span className="hidden sm:inline">Year Overview</span>
            <span className="sm:hidden">Year</span>
          </TabsTrigger>
          <TabsTrigger 
            value="teaching-view"
            className="flex items-center gap-2 px-4 py-2.5 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-all"
          >
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Teaching View</span>
            <span className="sm:hidden">Teaching</span>
          </TabsTrigger>
          <TabsTrigger 
            value="section-alignment"
            className="flex items-center gap-2 px-4 py-2.5 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-all"
          >
            <GitCompareArrows className="h-4 w-4" />
            <span className="hidden sm:inline">Section Alignment</span>
            <span className="sm:hidden">Alignment</span>
          </TabsTrigger>
        </TabsList>

        {/* Conditional rendering - only load active tab */}
        <div className="mt-4">
          <Suspense fallback={<TabContentSkeleton />}>
            {activeTab === "year-overview" && <YearOverviewContent />}
            {activeTab === "teaching-view" && <TeachingViewContent />}
            {activeTab === "section-alignment" && <SectionAlignmentContent />}
          </Suspense>
        </div>
      </Tabs>
    </div>
  );
}
