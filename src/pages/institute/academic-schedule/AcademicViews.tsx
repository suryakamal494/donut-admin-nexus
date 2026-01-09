import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarRange, Layout, GitCompareArrows } from "lucide-react";
import { YearOverviewContent } from "./YearOverview";
import { TeachingViewContent } from "./TeachingView";
import { SectionAlignmentContent } from "./SectionAlignment";

export default function AcademicViews() {
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

      <Tabs defaultValue="year-overview" className="w-full">
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

        <TabsContent value="year-overview" className="mt-4">
          <YearOverviewContent />
        </TabsContent>

        <TabsContent value="teaching-view" className="mt-4">
          <TeachingViewContent />
        </TabsContent>

        <TabsContent value="section-alignment" className="mt-4">
          <SectionAlignmentContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
