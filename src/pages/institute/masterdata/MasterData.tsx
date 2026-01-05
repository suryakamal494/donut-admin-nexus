import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, BookOpen, Layers, FileText, Target, Lock, Search, Globe } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { classes, subjects } from "@/data/mockData";
import { 
  allCBSEChapters, 
  allCBSETopics, 
  getChaptersByClassAndSubject, 
  getTopicsByChapter,
  cbseDataStats,
  type CBSEChapter,
  type CBSETopic
} from "@/data/cbseMasterData";
import { SubjectBadge, getSubjectColor } from "@/components/subject";

// Build hierarchical structure from CBSE data
const buildMasterDataHierarchy = () => {
  // Filter to only the 5 core subjects we have data for
  const coreSubjectIds = ["1", "2", "3", "8", "12"]; // Physics, Chemistry, Math, Hindi, History
  
  return classes.map(cls => {
    const classSubjects = subjects
      .filter(sub => coreSubjectIds.includes(sub.id))
      .map(sub => {
        const chapters = getChaptersByClassAndSubject(cls.id, sub.id);
        if (chapters.length === 0) return null;
        
        const subjectColor = getSubjectColor(sub.name);
        
        return {
          id: `${sub.id}-${cls.id}`,
          name: sub.name,
          subjectId: sub.id,
          color: subjectColor.bg,
          textColor: subjectColor.text,
          chapters: chapters.map(ch => {
            const topics = getTopicsByChapter(ch.id);
            return {
              id: ch.id,
              name: ch.name,
              nameHindi: ch.nameHindi,
              nameTransliterated: ch.nameTransliterated,
              topics: topics.map(t => ({
                id: t.id,
                name: t.name,
                nameHindi: t.nameHindi
              }))
            };
          })
        };
      })
      .filter(Boolean);
    
    return {
      id: cls.id,
      name: cls.name,
      subjects: classSubjects
    };
  }).filter(cls => cls.subjects.length > 0);
};

interface TreeNodeProps {
  level: "class" | "subject" | "chapter" | "topic";
  name: string;
  nameHindi?: string;
  nameTransliterated?: string;
  children?: React.ReactNode;
  color?: string;
  textColor?: string;
  subjectName?: string;
  count?: number;
  defaultExpanded?: boolean;
}

const TreeNode = ({ 
  level, 
  name, 
  nameHindi,
  nameTransliterated,
  children, 
  color, 
  textColor,
  subjectName,
  count, 
  defaultExpanded = false 
}: TreeNodeProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasChildren = !!children;

  const icons = {
    class: BookOpen,
    subject: Layers,
    chapter: FileText,
    topic: Target,
  };

  const Icon = icons[level];

  const levelStyles = {
    class: "font-semibold text-foreground",
    subject: "font-medium text-foreground",
    chapter: "text-foreground",
    topic: "text-muted-foreground text-sm",
  };

  // Determine if this is a Hindi chapter (has nameHindi)
  const isHindiContent = !!nameHindi;

  return (
    <div className={cn("select-none", level !== "class" && "ml-6")}>
      <div
        className={cn(
          "flex items-center gap-2 py-2 px-3 rounded-lg transition-colors cursor-pointer",
          hasChildren ? "hover:bg-muted/50" : "hover:bg-muted/30",
          level === "class" && "bg-muted/30"
        )}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          <button className="p-0.5 hover:bg-muted rounded">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        {level === "subject" && subjectName ? (
          <SubjectBadge subject={subjectName} size="sm" showIcon />
        ) : color ? (
          <div className={cn("w-5 h-5 rounded-md flex items-center justify-center", color)}>
            <Icon className={cn("w-3 h-3", textColor || "text-white")} />
          </div>
        ) : (
          <Icon className={cn("w-4 h-4", level === "topic" ? "text-muted-foreground" : "text-primary")} />
        )}

        <div className="flex flex-col flex-1 min-w-0">
          {isHindiContent ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn(levelStyles[level], "font-hindi")}>{nameHindi}</span>
              <span className="text-xs text-muted-foreground">({name})</span>
            </div>
          ) : (
            <span className={levelStyles[level]}>{name}</span>
          )}
        </div>

        {count !== undefined && count > 0 && (
          <Badge variant="secondary" className="ml-auto text-xs shrink-0">
            {count} {level === "class" ? "subjects" : level === "subject" ? "chapters" : "topics"}
          </Badge>
        )}
      </div>

      {hasChildren && expanded && <div className="mt-1">{children}</div>}
    </div>
  );
};

const MasterData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedClasses, setExpandedClasses] = useState<string[]>(["6", "7"]); // Class 11, 12 expanded by default

  // Build hierarchy from real CBSE data
  const masterDataHierarchy = useMemo(() => buildMasterDataHierarchy(), []);

  const filteredData = useMemo(() => {
    if (!searchQuery) return masterDataHierarchy;
    
    const query = searchQuery.toLowerCase();
    
    return masterDataHierarchy.map(classData => {
      // Check if class name matches
      if (classData.name.toLowerCase().includes(query)) {
        return classData;
      }
      
      // Filter subjects
      const filteredSubjects = classData.subjects
        .map(subject => {
          if (!subject) return null;
          
          // Check subject name
          if (subject.name.toLowerCase().includes(query)) {
            return subject;
          }
          
          // Filter chapters
          const filteredChapters = subject.chapters.filter(chapter => {
            // Check chapter name (English)
            if (chapter.name.toLowerCase().includes(query)) return true;
            // Check chapter name (Hindi)
            if (chapter.nameHindi?.includes(query)) return true;
            // Check chapter name (Transliterated)
            if (chapter.nameTransliterated?.toLowerCase().includes(query)) return true;
            // Check topics
            return chapter.topics.some(topic => 
              topic.name.toLowerCase().includes(query) ||
              topic.nameHindi?.includes(query)
            );
          });
          
          if (filteredChapters.length > 0) {
            return { ...subject, chapters: filteredChapters };
          }
          
          return null;
        })
        .filter(Boolean);
      
      if (filteredSubjects.length > 0) {
        return { ...classData, subjects: filteredSubjects };
      }
      
      return null;
    }).filter(Boolean);
  }, [masterDataHierarchy, searchQuery]);

  // Calculate total counts from real data
  const totalClasses = masterDataHierarchy.length;
  const totalSubjects = masterDataHierarchy.reduce((acc, c) => acc + c.subjects.length, 0);
  const totalChapters = cbseDataStats.totalChapters;
  const totalTopics = cbseDataStats.totalTopics;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Data"
        description={
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span>Read-only view of CBSE academic hierarchy shared by Super Admin</span>
          </div>
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Master Data" },
        ]}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{totalClasses}</div>
            <div className="text-sm text-muted-foreground">Classes</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-500">{totalSubjects}</div>
            <div className="text-sm text-muted-foreground">Subjects</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-500">{totalChapters}</div>
            <div className="text-sm text-muted-foreground">Chapters</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-500">{totalTopics}</div>
            <div className="text-sm text-muted-foreground">Topics</div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Breakdown */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Subject Coverage (CBSE Syllabus)</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <SubjectBadge subject="Mathematics" size="sm" showIcon />
              <span className="text-xs text-muted-foreground">{cbseDataStats.subjectBreakdown.mathematics} chapters</span>
            </div>
            <div className="flex items-center gap-2">
              <SubjectBadge subject="Physics" size="sm" showIcon />
              <span className="text-xs text-muted-foreground">{cbseDataStats.subjectBreakdown.physics} chapters</span>
            </div>
            <div className="flex items-center gap-2">
              <SubjectBadge subject="Chemistry" size="sm" showIcon />
              <span className="text-xs text-muted-foreground">{cbseDataStats.subjectBreakdown.chemistry} chapters</span>
            </div>
            <div className="flex items-center gap-2">
              <SubjectBadge subject="History" size="sm" showIcon />
              <span className="text-xs text-muted-foreground">{cbseDataStats.subjectBreakdown.history} chapters</span>
            </div>
            <div className="flex items-center gap-2">
              <SubjectBadge subject="Hindi" size="sm" showIcon />
              <span className="text-xs text-muted-foreground">{cbseDataStats.subjectBreakdown.hindi} chapters (bilingual)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search classes, subjects, chapters, or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Hierarchy Tree */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="space-y-1">
            {filteredData.length > 0 ? (
              filteredData.map((classData: any) => (
                <TreeNode
                  key={classData.id}
                  level="class"
                  name={classData.name}
                  count={classData.subjects.length}
                  defaultExpanded={expandedClasses.includes(classData.id) || !!searchQuery}
                >
                  {classData.subjects.map((subject: any) => (
                    <TreeNode
                      key={subject.id}
                      level="subject"
                      name={subject.name}
                      subjectName={subject.name}
                      color={subject.color}
                      textColor={subject.textColor}
                      count={subject.chapters.length}
                      defaultExpanded={!!searchQuery}
                    >
                      {subject.chapters.map((chapter: any) => (
                        <TreeNode
                          key={chapter.id}
                          level="chapter"
                          name={chapter.name}
                          nameHindi={chapter.nameHindi}
                          nameTransliterated={chapter.nameTransliterated}
                          count={chapter.topics.length}
                          defaultExpanded={!!searchQuery}
                        >
                          {chapter.topics.map((topic: any) => (
                            <TreeNode 
                              key={topic.id} 
                              level="topic" 
                              name={topic.name}
                              nameHindi={topic.nameHindi}
                            />
                          ))}
                        </TreeNode>
                      ))}
                    </TreeNode>
                  ))}
                </TreeNode>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Note */}
      <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
        <Lock className="w-5 h-5 text-muted-foreground mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">About Master Data</p>
          <p>
            This is a read-only view of the CBSE academic curriculum. The master data is centrally managed by the 
            Super Admin and includes Classes 6-12 with 5 core subjects: Mathematics, Physics, Chemistry, History, and Hindi.
          </p>
          <p className="mt-2">
            <strong className="text-foreground">Multilingual Support:</strong> Hindi chapters are displayed in Devanagari script 
            with English transliteration. This foundation supports future expansion to regional languages.
          </p>
          <p className="mt-2 text-xs">
            Data source: NCERT CBSE Syllabus • Last updated: January 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default MasterData;
