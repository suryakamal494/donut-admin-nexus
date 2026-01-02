import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { instituteContent, InstituteContentItem } from "@/data/instituteData";
import {
  ContentPreviewDialog,
  ContentEditDialog,
  ContentPagination,
  ContentType,
} from "@/components/content";
import {
  InstituteContentCard,
  InstituteContentFilters,
  InstituteContentListItem,
  SourceFilter,
} from "@/components/institute/content";

const ITEMS_PER_PAGE = 15;

const InstituteContent = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [typeFilter, setTypeFilter] = useState<ContentType | "all">("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dialog states
  const [previewContent, setPreviewContent] = useState<InstituteContentItem | null>(null);
  const [editContent, setEditContent] = useState<InstituteContentItem | null>(null);
  const [contentList, setContentList] = useState<InstituteContentItem[]>(instituteContent);

  // Filter content
  const filteredContent = useMemo(() => {
    return contentList.filter(content => {
      const matchesSearch = searchQuery === "" || 
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSource = sourceFilter === "all" || content.source === sourceFilter;
      const matchesType = typeFilter === "all" || content.type === typeFilter;
      const matchesSubject = subjectFilter === "all" || content.subjectId === subjectFilter;
      const matchesClass = classFilter === "all" || content.classId === classFilter;
      const matchesStatus = statusFilter === "all" || content.status === statusFilter;
      
      return matchesSearch && matchesSource && matchesType && matchesSubject && matchesClass && matchesStatus;
    });
  }, [contentList, searchQuery, sourceFilter, typeFilter, subjectFilter, classFilter, statusFilter]);

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

  const handlePreview = (content: InstituteContentItem) => setPreviewContent(content);
  
  const handleEdit = (content: InstituteContentItem) => {
    if (content.source === "institute") {
      setEditContent(content);
    }
  };
  
  const handleDelete = (content: InstituteContentItem) => {
    if (content.source === "institute") {
      setContentList(prev => prev.filter(c => c.id !== content.id));
    }
  };
  
  const handleSave = (updatedContent: InstituteContentItem) => {
    setContentList(prev => prev.map(c => c.id === updatedContent.id ? updatedContent : c));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Content Library"
        description="Browse and manage learning materials for your students"
        breadcrumbs={[{ label: "Dashboard", href: "/institute/dashboard" }, { label: "Content" }]}
        actions={
          <div className="flex gap-3">
            <Link to="/institute/content/create">
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />Create Content
              </Button>
            </Link>
            <Link to="/institute/content/ai-generate">
              <Button className="gradient-button gap-2">
                <Sparkles className="w-4 h-4" />AI Content Generator
              </Button>
            </Link>
          </div>
        }
      />

      {/* Helpful Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground text-sm">Your Unified Content Library</p>
          <p className="text-sm text-muted-foreground mt-1">
            Access content from the <span className="font-medium text-slate-600 dark:text-slate-400">Global Library</span> (platform-wide resources) 
            and <span className="font-medium text-emerald-600 dark:text-emerald-400">Your Content</span> (created by your institute). 
            Use the source filter to switch between them.
          </p>
        </div>
      </div>

      <InstituteContentFilters
        searchQuery={searchQuery}
        onSearchChange={(v) => handleFilterChange(setSearchQuery, v)}
        sourceFilter={sourceFilter}
        onSourceChange={(v) => handleFilterChange(setSourceFilter, v)}
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
        <div className="bg-card rounded-2xl p-12 text-center shadow-soft border border-border/50">
          <p className="text-muted-foreground mb-2">No content found matching your filters.</p>
          {sourceFilter === "institute" && (
            <p className="text-sm text-muted-foreground">
              Start by <Link to="/institute/content/create" className="text-primary hover:underline">uploading your own content</Link> or 
              <Link to="/institute/content/ai-generate" className="text-primary hover:underline ml-1">generating with AI</Link>.
            </p>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedContent.map((content) => (
            <InstituteContentCard
              key={content.id}
              content={content}
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
              content={content}
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
            setEditContent(content as InstituteContentItem);
          }
        }}
      />

      <ContentEditDialog
        content={editContent}
        open={!!editContent}
        onOpenChange={(open) => !open && setEditContent(null)}
        onSave={handleSave}
      />
    </div>
  );
};

export default InstituteContent;
