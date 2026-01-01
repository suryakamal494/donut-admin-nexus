import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, Layers, FileText, Target, Lock, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock master data hierarchy
const masterDataHierarchy = [
  {
    id: "class-6",
    name: "Class 6",
    subjects: [
      {
        id: "math-6",
        name: "Mathematics",
        color: "bg-blue-500",
        chapters: [
          {
            id: "ch1-math-6",
            name: "Knowing Our Numbers",
            topics: ["Large Numbers", "Estimation", "Roman Numerals", "Use of Brackets"],
          },
          {
            id: "ch2-math-6",
            name: "Whole Numbers",
            topics: ["Natural Numbers", "Whole Numbers on Number Line", "Properties of Whole Numbers"],
          },
          {
            id: "ch3-math-6",
            name: "Playing with Numbers",
            topics: ["Factors and Multiples", "Prime and Composite Numbers", "LCM and HCF"],
          },
        ],
      },
      {
        id: "science-6",
        name: "Science",
        color: "bg-green-500",
        chapters: [
          {
            id: "ch1-sci-6",
            name: "Food: Where Does It Come From?",
            topics: ["Food Variety", "Food Sources", "Plant Parts as Food", "Animal Products"],
          },
          {
            id: "ch2-sci-6",
            name: "Components of Food",
            topics: ["Nutrients", "Carbohydrates", "Proteins", "Fats", "Vitamins"],
          },
        ],
      },
    ],
  },
  {
    id: "class-7",
    name: "Class 7",
    subjects: [
      {
        id: "math-7",
        name: "Mathematics",
        color: "bg-blue-500",
        chapters: [
          {
            id: "ch1-math-7",
            name: "Integers",
            topics: ["Properties of Addition", "Properties of Subtraction", "Multiplication", "Division"],
          },
          {
            id: "ch2-math-7",
            name: "Fractions and Decimals",
            topics: ["Multiplication of Fractions", "Division of Fractions", "Decimal Operations"],
          },
        ],
      },
      {
        id: "physics-7",
        name: "Physics",
        color: "bg-purple-500",
        chapters: [
          {
            id: "ch1-phy-7",
            name: "Motion and Time",
            topics: ["Speed", "Distance", "Time Measurement", "Simple Pendulum"],
          },
        ],
      },
    ],
  },
  {
    id: "class-8",
    name: "Class 8",
    subjects: [
      {
        id: "math-8",
        name: "Mathematics",
        color: "bg-blue-500",
        chapters: [
          {
            id: "ch1-math-8",
            name: "Rational Numbers",
            topics: ["Properties", "Representation on Number Line", "Between Two Rational Numbers"],
          },
          {
            id: "ch2-math-8",
            name: "Linear Equations in One Variable",
            topics: ["Solving Equations", "Word Problems", "Reducing Equations"],
          },
        ],
      },
      {
        id: "chemistry-8",
        name: "Chemistry",
        color: "bg-orange-500",
        chapters: [
          {
            id: "ch1-chem-8",
            name: "Synthetic Fibres and Plastics",
            topics: ["Types of Fibres", "Plastics", "Characteristics"],
          },
        ],
      },
    ],
  },
  {
    id: "class-9",
    name: "Class 9",
    subjects: [
      {
        id: "math-9",
        name: "Mathematics",
        color: "bg-blue-500",
        chapters: [
          {
            id: "ch1-math-9",
            name: "Number Systems",
            topics: ["Real Numbers", "Irrational Numbers", "Laws of Exponents"],
          },
          {
            id: "ch2-math-9",
            name: "Polynomials",
            topics: ["Degree of Polynomial", "Zeroes of Polynomial", "Remainder Theorem"],
          },
        ],
      },
      {
        id: "physics-9",
        name: "Physics",
        color: "bg-purple-500",
        chapters: [
          {
            id: "ch1-phy-9",
            name: "Motion",
            topics: ["Distance and Displacement", "Uniform Motion", "Acceleration", "Equations of Motion"],
          },
          {
            id: "ch2-phy-9",
            name: "Force and Laws of Motion",
            topics: ["Newton's Laws", "Inertia", "Momentum", "Conservation of Momentum"],
          },
        ],
      },
    ],
  },
  {
    id: "class-10",
    name: "Class 10",
    subjects: [
      {
        id: "math-10",
        name: "Mathematics",
        color: "bg-blue-500",
        chapters: [
          {
            id: "ch1-math-10",
            name: "Real Numbers",
            topics: ["Euclid's Division Lemma", "Fundamental Theorem of Arithmetic", "Irrational Numbers"],
          },
          {
            id: "ch2-math-10",
            name: "Quadratic Equations",
            topics: ["Standard Form", "Factorization Method", "Quadratic Formula", "Nature of Roots"],
          },
        ],
      },
      {
        id: "chemistry-10",
        name: "Chemistry",
        color: "bg-orange-500",
        chapters: [
          {
            id: "ch1-chem-10",
            name: "Chemical Reactions and Equations",
            topics: ["Types of Reactions", "Balancing Equations", "Effects of Oxidation"],
          },
        ],
      },
    ],
  },
  {
    id: "class-11",
    name: "Class 11",
    subjects: [
      {
        id: "physics-11",
        name: "Physics",
        color: "bg-purple-500",
        chapters: [
          {
            id: "ch1-phy-11",
            name: "Physical World",
            topics: ["Scope of Physics", "Physics and Technology", "Fundamental Forces"],
          },
          {
            id: "ch2-phy-11",
            name: "Units and Measurements",
            topics: ["SI Units", "Dimensional Analysis", "Significant Figures"],
          },
        ],
      },
      {
        id: "chemistry-11",
        name: "Chemistry",
        color: "bg-orange-500",
        chapters: [
          {
            id: "ch1-chem-11",
            name: "Some Basic Concepts of Chemistry",
            topics: ["Atomic and Molecular Masses", "Mole Concept", "Stoichiometry"],
          },
        ],
      },
    ],
  },
  {
    id: "class-12",
    name: "Class 12",
    subjects: [
      {
        id: "physics-12",
        name: "Physics",
        color: "bg-purple-500",
        chapters: [
          {
            id: "ch1-phy-12",
            name: "Electric Charges and Fields",
            topics: ["Coulomb's Law", "Electric Field", "Gauss's Theorem"],
          },
          {
            id: "ch2-phy-12",
            name: "Current Electricity",
            topics: ["Ohm's Law", "Kirchhoff's Rules", "Electrical Energy and Power"],
          },
        ],
      },
      {
        id: "math-12",
        name: "Mathematics",
        color: "bg-blue-500",
        chapters: [
          {
            id: "ch1-math-12",
            name: "Relations and Functions",
            topics: ["Types of Relations", "Types of Functions", "Composition of Functions"],
          },
          {
            id: "ch2-math-12",
            name: "Inverse Trigonometric Functions",
            topics: ["Basic Concepts", "Properties", "Principal Values"],
          },
        ],
      },
    ],
  },
];

interface TreeNodeProps {
  level: "class" | "subject" | "chapter" | "topic";
  name: string;
  children?: React.ReactNode;
  color?: string;
  count?: number;
  defaultExpanded?: boolean;
}

const TreeNode = ({ level, name, children, color, count, defaultExpanded = false }: TreeNodeProps) => {
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

        {color ? (
          <div className={cn("w-5 h-5 rounded-md flex items-center justify-center", color)}>
            <Icon className="w-3 h-3 text-white" />
          </div>
        ) : (
          <Icon className={cn("w-4 h-4", level === "topic" ? "text-muted-foreground" : "text-primary")} />
        )}

        <span className={levelStyles[level]}>{name}</span>

        {count !== undefined && (
          <Badge variant="secondary" className="ml-auto text-xs">
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
  const [expandedClasses, setExpandedClasses] = useState<string[]>(["class-11", "class-12"]);

  const filteredData = masterDataHierarchy.filter((classData) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    // Check class name
    if (classData.name.toLowerCase().includes(query)) return true;
    
    // Check subjects
    for (const subject of classData.subjects) {
      if (subject.name.toLowerCase().includes(query)) return true;
      
      // Check chapters
      for (const chapter of subject.chapters) {
        if (chapter.name.toLowerCase().includes(query)) return true;
        
        // Check topics
        for (const topic of chapter.topics) {
          if (topic.toLowerCase().includes(query)) return true;
        }
      }
    }
    
    return false;
  });

  // Calculate total counts
  const totalClasses = masterDataHierarchy.length;
  const totalSubjects = masterDataHierarchy.reduce((acc, c) => acc + c.subjects.length, 0);
  const totalChapters = masterDataHierarchy.reduce(
    (acc, c) => acc + c.subjects.reduce((a, s) => a + s.chapters.length, 0),
    0
  );
  const totalTopics = masterDataHierarchy.reduce(
    (acc, c) =>
      acc + c.subjects.reduce((a, s) => a + s.chapters.reduce((t, ch) => t + ch.topics.length, 0), 0),
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Data"
        description={
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span>Read-only view of the academic hierarchy shared by Super Admin</span>
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
              filteredData.map((classData) => (
                <TreeNode
                  key={classData.id}
                  level="class"
                  name={classData.name}
                  count={classData.subjects.length}
                  defaultExpanded={expandedClasses.includes(classData.id) || !!searchQuery}
                >
                  {classData.subjects.map((subject) => (
                    <TreeNode
                      key={subject.id}
                      level="subject"
                      name={subject.name}
                      color={subject.color}
                      count={subject.chapters.length}
                      defaultExpanded={!!searchQuery}
                    >
                      {subject.chapters.map((chapter) => (
                        <TreeNode
                          key={chapter.id}
                          level="chapter"
                          name={chapter.name}
                          count={chapter.topics.length}
                          defaultExpanded={!!searchQuery}
                        >
                          {chapter.topics.map((topic, idx) => (
                            <TreeNode key={`${chapter.id}-topic-${idx}`} level="topic" name={topic} />
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
            This academic hierarchy is managed by the Super Admin and shared across all institutes.
            You can use this structure to create tests, plan timetables, and organize your academic content.
            Contact Super Admin if you need changes to this structure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MasterData;
