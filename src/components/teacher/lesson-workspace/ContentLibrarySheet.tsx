import { useState, useMemo } from "react";
import {
  Search,
  FileText,
  Video,
  Image as ImageIcon,
  Presentation,
  File,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type BlockType, type LessonPlanBlock } from "./types";

interface ContentLibrarySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectContent: (block: Omit<LessonPlanBlock, "id">) => void;
  blockType: BlockType;
  chapter?: string;
  subject?: string;
}

// Extended mock library content (25+ items)
const mockLibraryContent = [
  // Physics - Mechanics
  { id: "1", title: "Newton's Laws - Complete Guide", type: "presentation", duration: 15, subject: "Physics", chapter: "Mechanics", slides: 32, views: 1250 },
  { id: "2", title: "Force and Motion Explained", type: "video", duration: 12, subject: "Physics", chapter: "Mechanics", views: 3420 },
  { id: "3", title: "Momentum Conservation Demo", type: "presentation", duration: 10, subject: "Physics", chapter: "Mechanics", slides: 18, views: 890 },
  { id: "4", title: "Friction Types and Applications", type: "document", duration: 8, subject: "Physics", chapter: "Mechanics", pages: 12, views: 560 },
  { id: "5", title: "Projectile Motion Animation", type: "video", duration: 8, subject: "Physics", chapter: "Mechanics", views: 2100 },
  { id: "6", title: "Free Body Diagrams - Step by Step", type: "presentation", duration: 20, subject: "Physics", chapter: "Mechanics", slides: 45, views: 1800 },
  
  // Physics - Electrostatics
  { id: "7", title: "Coulomb's Law Derivation", type: "document", duration: 15, subject: "Physics", chapter: "Electrostatics", pages: 8, views: 720 },
  { id: "8", title: "Electric Field Lines Visualization", type: "video", duration: 10, subject: "Physics", chapter: "Electrostatics", views: 1560 },
  { id: "9", title: "Gauss's Law Applications", type: "presentation", duration: 25, subject: "Physics", chapter: "Electrostatics", slides: 38, views: 980 },
  
  // Chemistry - Atomic Structure
  { id: "10", title: "Atomic Models - Bohr to Quantum", type: "presentation", duration: 18, subject: "Chemistry", chapter: "Atomic Structure", slides: 28, views: 2300 },
  { id: "11", title: "Electron Configuration Tutorial", type: "video", duration: 15, subject: "Chemistry", chapter: "Atomic Structure", views: 4100 },
  { id: "12", title: "Quantum Numbers Explained", type: "document", duration: 12, subject: "Chemistry", chapter: "Atomic Structure", pages: 15, views: 890 },
  
  // Chemistry - Organic
  { id: "13", title: "IUPAC Nomenclature Rules", type: "presentation", duration: 22, subject: "Chemistry", chapter: "Organic Chemistry", slides: 42, views: 3200 },
  { id: "14", title: "Isomerism Types with Examples", type: "video", duration: 18, subject: "Chemistry", chapter: "Organic Chemistry", views: 2800 },
  { id: "15", title: "Reaction Mechanisms - SN1 vs SN2", type: "presentation", duration: 20, subject: "Chemistry", chapter: "Organic Chemistry", slides: 35, views: 1650 },
  
  // Mathematics - Calculus
  { id: "16", title: "Limits and Continuity", type: "presentation", duration: 25, subject: "Mathematics", chapter: "Calculus", slides: 50, views: 4500 },
  { id: "17", title: "Differentiation Formulas", type: "document", duration: 10, subject: "Mathematics", chapter: "Calculus", pages: 8, views: 3200 },
  { id: "18", title: "Integration Techniques", type: "video", duration: 30, subject: "Mathematics", chapter: "Calculus", views: 5600 },
  { id: "19", title: "Applications of Derivatives", type: "presentation", duration: 28, subject: "Mathematics", chapter: "Calculus", slides: 55, views: 2100 },
  
  // Mathematics - Algebra
  { id: "20", title: "Quadratic Equations Masterclass", type: "video", duration: 22, subject: "Mathematics", chapter: "Algebra", views: 3800 },
  { id: "21", title: "Polynomials - Complete Guide", type: "presentation", duration: 18, subject: "Mathematics", chapter: "Algebra", slides: 32, views: 1900 },
  
  // Biology - Cell Biology
  { id: "22", title: "Cell Structure and Organelles", type: "presentation", duration: 20, subject: "Biology", chapter: "Cell Biology", slides: 40, views: 4200 },
  { id: "23", title: "Mitosis vs Meiosis", type: "video", duration: 15, subject: "Biology", chapter: "Cell Biology", views: 5100 },
  { id: "24", title: "Cell Membrane Transport", type: "document", duration: 12, subject: "Biology", chapter: "Cell Biology", pages: 10, views: 1200 },
  
  // Biology - Genetics
  { id: "25", title: "DNA Replication Animation", type: "video", duration: 12, subject: "Biology", chapter: "Genetics", views: 6200 },
  { id: "26", title: "Mendelian Genetics Problems", type: "presentation", duration: 25, subject: "Biology", chapter: "Genetics", slides: 48, views: 2800 },
  { id: "27", title: "Genetic Disorders Overview", type: "document", duration: 15, subject: "Biology", chapter: "Genetics", pages: 18, views: 980 },
];

const contentTypeIcons: Record<string, React.ReactNode> = {
  presentation: <Presentation className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  document: <FileText className="w-4 h-4" />,
  image: <ImageIcon className="w-4 h-4" />,
};

const contentTypeColors: Record<string, string> = {
  presentation: "bg-orange-100 text-orange-700 border-orange-200",
  video: "bg-blue-100 text-blue-700 border-blue-200",
  document: "bg-green-100 text-green-700 border-green-200",
  image: "bg-purple-100 text-purple-700 border-purple-200",
};

export const ContentLibrarySheet = ({
  open,
  onOpenChange,
  onSelectContent,
  blockType,
  chapter,
  subject,
}: ContentLibrarySheetProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  // Get unique filter values
  const subjects = useMemo(
    () => [...new Set(mockLibraryContent.map((c) => c.subject))],
    []
  );

  // Filter content
  const filteredContent = useMemo(() => {
    return mockLibraryContent.filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || c.type === typeFilter;
      const matchesSubject = subjectFilter === "all" || c.subject === subjectFilter;
      return matchesSearch && matchesType && matchesSubject;
    });
  }, [searchQuery, typeFilter, subjectFilter]);

  const handleSelect = (item: typeof mockLibraryContent[0]) => {
    onSelectContent({
      type: blockType,
      title: item.title,
      source: "library",
      sourceId: item.id,
      sourceType: item.type,
      duration: item.duration,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[550px] lg:max-w-[600px] p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="p-4 border-b shrink-0">
          <SheetTitle className="text-lg">Content Library</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Select content for your lesson
          </p>
        </SheetHeader>

        {/* Filters */}
        <div className="p-4 border-b space-y-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 flex-1">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="presentation">Presentations</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="image">Images</SelectItem>
              </SelectContent>
            </Select>

            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="h-9 flex-1">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredContent.length} items
            {chapter && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {chapter}
              </Badge>
            )}
          </div>
        </div>

        {/* Content List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {filteredContent.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg text-left",
                  "border hover:border-primary/30 hover:bg-muted/50",
                  "transition-all duration-200"
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    contentTypeColors[item.type]
                  )}
                >
                  {contentTypeIcons[item.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                  
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                      {item.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.duration} min
                    </span>
                    {"slides" in item && (
                      <span className="text-xs text-muted-foreground">
                        {item.slides} slides
                      </span>
                    )}
                    {"pages" in item && (
                      <span className="text-xs text-muted-foreground">
                        {item.pages} pages
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                    <span>{item.subject}</span>
                    <span>•</span>
                    <span>{item.chapter}</span>
                    <span>•</span>
                    <span>{item.views?.toLocaleString()} views</span>
                  </div>
                </div>
              </button>
            ))}

            {filteredContent.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <File className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No content found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer hint */}
        <div className="p-4 border-t shrink-0 text-center text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 inline-block mr-1" />
          Can't find what you need? Use AI Generate in the popover
        </div>
      </SheetContent>
    </Sheet>
  );
};
