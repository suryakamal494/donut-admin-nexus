import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Grid, List, Play, Download, Eye, Edit, Trash2, Video, FileText, Presentation, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockContent } from "@/data/mockData";
import { cn } from "@/lib/utils";

const typeIcons = {
  video: Video,
  pdf: FileText,
  ppt: Presentation,
  doc: FileText,
  html: FileCode,
  iframe: FileCode,
};

const Content = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Content Library"
        description="Manage all learning content - videos, documents, presentations"
        breadcrumbs={[{ label: "Dashboard", href: "/superadmin/dashboard" }, { label: "Content" }]}
        actions={
          <Link to="/superadmin/content/upload">
            <Button className="gradient-button gap-2"><Plus className="w-4 h-4" />Upload Content</Button>
          </Link>
        }
      />

      <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search content..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-3">
            <Select><SelectTrigger className="w-36"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="ppt">Presentation</SelectItem>
              </SelectContent>
            </Select>
            <Select><SelectTrigger className="w-36"><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="maths">Mathematics</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border border-border rounded-lg">
              <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}>
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")}>
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockContent.map((content) => {
            const Icon = typeIcons[content.type];
            return (
              <div key={content.id} className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden hover-lift">
                <div className="h-40 bg-muted/50 flex items-center justify-center relative group">
                  <Icon className="w-16 h-16 text-muted-foreground" />
                  {content.type === "video" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="icon" className="rounded-full w-12 h-12">
                        <Play className="w-6 h-6" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{content.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{content.description}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <span className="capitalize">{content.type}</span>
                    <span>•</span>
                    <span>{content.duration ? `${content.duration} min` : content.size}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    <Button variant="ghost" size="sm" className="flex-1"><Eye className="w-4 h-4 mr-1" />Preview</Button>
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-soft border border-border/50 divide-y divide-border">
          {mockContent.map((content) => {
            const Icon = typeIcons[content.type];
            return (
              <div key={content.id} className="p-4 flex items-center gap-4 hover:bg-muted/20">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <Icon className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{content.title}</h3>
                  <p className="text-sm text-muted-foreground">{content.subject} • {content.chapter}</p>
                </div>
                <div className="text-sm text-muted-foreground capitalize">{content.type}</div>
                <div className="text-sm text-muted-foreground">{content.duration ? `${content.duration} min` : content.size}</div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Content;