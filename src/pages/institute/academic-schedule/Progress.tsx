import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { ProgressBatchCard } from "@/components/academic-schedule";
import { batchProgressSummaries, pendingConfirmations } from "@/data/academicScheduleData";

export default function Progress() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Get unique classes
  const classOptions = useMemo(() => {
    const classes = [...new Set(batchProgressSummaries.map(b => b.className))];
    return classes.sort();
  }, []);

  // Filter batches
  const filteredBatches = useMemo(() => {
    return batchProgressSummaries.filter(batch => {
      const matchesSearch = 
        batch.batchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.className.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesClass = classFilter === "all" || batch.className === classFilter;
      const matchesStatus = statusFilter === "all" || batch.status === statusFilter;
      
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [searchQuery, classFilter, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = batchProgressSummaries.length;
    const ahead = batchProgressSummaries.filter(b => b.status === "ahead").length;
    const onTrack = batchProgressSummaries.filter(b => b.status === "on_track").length;
    const lagging = batchProgressSummaries.filter(b => b.status === "lagging" || b.status === "critical").length;
    const pending = pendingConfirmations.length;
    
    return { total, ahead, onTrack, lagging, pending };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Syllabus Progress"
        description="Track teaching progress across all batches and subjects"
        breadcrumbs={[
          { label: "Syllabus Tracker" },
          { label: "Progress" },
        ]}
        actions={
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Batches</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.ahead}</p>
                <p className="text-xs text-muted-foreground">Ahead</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.onTrack}</p>
                <p className="text-xs text-muted-foreground">On Track</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <TrendingDown className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.lagging}</p>
                <p className="text-xs text-muted-foreground">Lagging</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending Confirms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search batches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            
            {/* Class Filter */}
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classOptions.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ahead">Ahead</SelectItem>
                <SelectItem value="on_track">On Track</SelectItem>
                <SelectItem value="lagging">Lagging</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {(classFilter !== "all" || statusFilter !== "all" || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => {
                setClassFilter("all");
                setStatusFilter("all");
                setSearchQuery("");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Batch Cards Grid */}
      {filteredBatches.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No batches found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBatches.map(batch => (
            <ProgressBatchCard key={batch.batchId} batch={batch} />
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {filteredBatches.length} of {batchProgressSummaries.length} batches
      </div>
    </div>
  );
}
