import { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { instituteContent, InstituteContentItem, assignedTracks } from "@/data/instituteData";
import {
  ContentCard,
  ContentItem,
  ContentPreviewDialog,
  ContentPagination,
  ContentType,
} from "@/components/content";
import {
  InstituteContentFilters,
  InstituteContentListItem,
  SourceFilter,
  CourseFilter,
} from "@/components/institute/content";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 15;

const InstituteContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [courseFilter, setCourseFilter] = useState<CourseFilter>("all");
  const [typeFilter, setTypeFilter] = useState<ContentType | "all">("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dialog states
  const [previewContent, setPreviewContent] = useState<InstituteContentItem | null>(null);
  const [contentToDelete, setContentToDelete] = useState<InstituteContentItem | null>(null);
  const [contentList, setContentList] = useState<InstituteContentItem[]>(instituteContent);

  // Check if selected course has classes
  const selectedTrack = assignedTracks.find(t => t.id === courseFilter);
  const showClassFilter = courseFilter === "all" || (selectedTrack?.hasClasses ?? true);

  // Filter content
  const filteredContent = useMemo(() => {
    return contentList.filter(content => {
      const matchesSearch = searchQuery === "" || 
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSource = sourceFilter === "all" || content.source === sourceFilter;
      const matchesType = typeFilter === "all" || content.type === typeFilter;
      const matchesSubject = subjectFilter === "all" || content.subjectId === subjectFilter;
      // Only filter by class if we're showing classes (curriculum-based)
      const matchesClass = !showClassFilter || classFilter === "all" || content.classId === classFilter;
      const matchesStatus = statusFilter === "all" || content.status === statusFilter;
      
      return matchesSearch && matchesSource && matchesType && matchesSubject && matchesClass && matchesStatus;
    });
  }, [contentList, searchQuery, sourceFilter, typeFilter, subjectFilter, classFilter, statusFilter, showClassFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredContent.length / ITEMS_PER_PAGE);
  const paginatedContent = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContent.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredContent, currentPage]);

  // Reset to page 1 when filters change
  const handleFilterChange = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    setCurrentPage(1);
  };

  // Handle course change - reset class filter if course doesn't have classes
  const handleCourseChange = (value: CourseFilter) => {
    setCourseFilter(value);
    const track = assignedTracks.find(t => t.id === value);
    if (track && !track.hasClasses) {
      setClassFilter("all");
    }
    setCurrentPage(1);
  };

  const handlePreview = useCallback((content: ContentItem) => setPreviewContent(content as InstituteContentItem), []);
  
  const handleEdit = useCallback((content: ContentItem) => {
    const instituteItem = content as InstituteContentItem;
    if (instituteItem.source === "institute") {
      navigate(`/institute/content/edit/${instituteItem.id}`);
    }
  }, [navigate]);
  
  const handleDelete = useCallback((content: ContentItem) => {
    const instituteItem = content as InstituteContentItem;
    if (instituteItem.source === "institute") {
      setContentToDelete(instituteItem);
    }
  }, []);

  const confirmDelete = useCallback(() => {
    if (contentToDelete) {
      setContentList(prev => prev.filter(c => c.id !== contentToDelete.id));
      toast({
        title: "Content Deleted",
        description: `"${contentToDelete.title}" has been removed from your library.`,
      });
      setContentToDelete(null);
    }
  }, [contentToDelete, toast]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Content Library"
        description="Browse and manage learning materials for your students"
        breadcrumbs={[{ label: "Dashboard", href: "/institute/dashboard" }, { label: "Content" }]}
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link to="/institute/content/create" className="w-full sm:w-auto">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                <span className="hidden xs:inline">Create Content</span>
                <span className="xs:hidden">Create</span>
              </Button>
            </Link>
            <Link to="/institute/content/ai-generate" className="w-full sm:w-auto">
              <Button className="gradient-button gap-2 w-full sm:w-auto">
                <Sparkles className="w-4 h-4" />
                <span className="hidden xs:inline">AI Content Generator</span>
                <span className="xs:hidden">AI Generate</span>
              </Button>
            </Link>
          </div>
        }
      />

      <InstituteContentFilters
        searchQuery={searchQuery}
        onSearchChange={(v) => handleFilterChange(setSearchQuery, v)}
        sourceFilter={sourceFilter}
        onSourceChange={(v) => handleFilterChange(setSourceFilter, v)}
        courseFilter={courseFilter}
        onCourseChange={handleCourseChange}
        typeFilter={typeFilter}
        onTypeChange={(v) => handleFilterChange(setTypeFilter, v)}
        subjectFilter={subjectFilter}
        onSubjectChange={(v) => handleFilterChange(setSubjectFilter, v)}
        classFilter={classFilter}
        onClassChange={(v) => handleFilterChange(setClassFilter, v)}
        statusFilter={statusFilter}
        onStatusChange={(v) => handleFilterChange(setStatusFilter, v)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalItems={filteredContent.length}
      />

      {filteredContent.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 sm:p-12 text-center shadow-soft border border-border/50">
          <p className="text-muted-foreground mb-2">No content found matching your filters.</p>
          {sourceFilter === "institute" && (
            <p className="text-sm text-muted-foreground">
              Start by <Link to="/institute/content/create" className="text-primary hover:underline">uploading your own content</Link> or 
              <Link to="/institute/content/ai-generate" className="text-primary hover:underline ml-1">generating with AI</Link>.
            </p>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paginatedContent.map((content) => (
            <ContentCard
              key={content.id}
              content={content as ContentItem}
              mode="institute"
              onPreview={handlePreview}
              onEdit={content.source === "institute" ? handleEdit : undefined}
              onDelete={content.source === "institute" ? handleDelete : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-soft border border-border/50 divide-y divide-border">
          {paginatedContent.map((content) => (
            <InstituteContentListItem
              key={content.id}
              content={content as ContentItem}
              onPreview={handlePreview}
              onEdit={content.source === "institute" ? handleEdit : undefined}
              onDelete={content.source === "institute" ? handleDelete : undefined}
            />
          ))}
        </div>
      )}

      <ContentPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredContent.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      <ContentPreviewDialog
        content={previewContent}
        open={!!previewContent}
        onOpenChange={(open) => !open && setPreviewContent(null)}
        onEdit={(content) => {
          if ((content as InstituteContentItem).source === "institute") {
            setPreviewContent(null);
            handleEdit(content);
          }
        }}
        mode="institute"
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!contentToDelete} onOpenChange={(open) => !open && setContentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{contentToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InstituteContent;