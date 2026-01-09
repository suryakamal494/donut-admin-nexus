import { useState } from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  QuestionType, 
  QuestionLanguage, 
  QuestionDifficulty, 
  QuestionStatus,
  questionTypeLabels,
  languageConfig,
  difficultyConfig,
  statusConfig 
} from "@/data/questionsData";
import { subjectMasterList } from "@/components/subject/SubjectBadge";

interface QuestionFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedSubject: string;
  onSubjectChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (value: string) => void;
  selectedLanguage: string;
  onLanguageChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedClass: string;
  onClassChange: (value: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export const QuestionFilters = ({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedType,
  onTypeChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedLanguage,
  onLanguageChange,
  selectedStatus,
  onStatusChange,
  selectedClass,
  onClassChange,
  onClearFilters,
  activeFilterCount,
}: QuestionFiltersProps) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const classes = [
    { id: "class-6", name: "Class 6" },
    { id: "class-7", name: "Class 7" },
    { id: "class-8", name: "Class 8" },
    { id: "class-9", name: "Class 9" },
    { id: "class-10", name: "Class 10" },
    { id: "class-11", name: "Class 11" },
    { id: "class-12", name: "Class 12" },
  ];

  return (
    <div className="bg-card rounded-2xl p-3 sm:p-4 shadow-soft border border-border/50 space-y-3 sm:space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search questions, topics, IDs..." 
          value={searchQuery} 
          onChange={(e) => onSearchChange(e.target.value)} 
          className="pl-10 pr-10" 
        />
        {searchQuery && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => onSearchChange("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Primary Filters */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
        <Select value={selectedSubject} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <Filter className="w-4 h-4 mr-2 hidden sm:block" />
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjectMasterList.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(questionTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {Object.entries(difficultyConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {Object.entries(languageConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Collapsible open={showMoreFilters} onOpenChange={setShowMoreFilters} className="col-span-2 sm:col-span-1">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              More
              <ChevronDown className={`w-4 h-4 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {activeFilterCount > 0 && (
          <Button variant="ghost" className="gap-2 text-muted-foreground col-span-2 sm:col-span-1 w-full sm:w-auto" onClick={onClearFilters}>
            <X className="w-4 h-4" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* More Filters (Collapsible) */}
      <Collapsible open={showMoreFilters}>
        <CollapsibleContent className="pt-2">
          <div className="flex flex-wrap gap-3 p-3 bg-muted/30 rounded-lg border border-border/30">
            <Select value={selectedClass} onValueChange={onClassChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSubject !== "all" && (
            <Badge variant="secondary" className="gap-1 pr-1">
              Subject: {subjectMasterList.find(s => s.id === selectedSubject)?.name || selectedSubject}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={() => onSubjectChange("all")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {selectedType !== "all" && (
            <Badge variant="secondary" className="gap-1 pr-1">
              Type: {questionTypeLabels[selectedType as QuestionType]}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={() => onTypeChange("all")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {selectedDifficulty !== "all" && (
            <Badge variant="secondary" className="gap-1 pr-1">
              {difficultyConfig[selectedDifficulty as QuestionDifficulty]?.label}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={() => onDifficultyChange("all")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {selectedLanguage !== "all" && (
            <Badge variant="secondary" className="gap-1 pr-1">
              {languageConfig[selectedLanguage as QuestionLanguage]?.label}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={() => onLanguageChange("all")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {selectedClass !== "all" && (
            <Badge variant="secondary" className="gap-1 pr-1">
              {classes.find(c => c.id === selectedClass)?.name}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={() => onClassChange("all")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {selectedStatus !== "all" && (
            <Badge variant="secondary" className="gap-1 pr-1">
              {statusConfig[selectedStatus as QuestionStatus]?.label}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={() => onStatusChange("all")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
