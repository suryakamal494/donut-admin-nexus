import { Star, BookOpen, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DisplayChapter } from "@/data/masterData";

interface Topic {
  id: string;
  name: string;
  chapterId: string;
}

interface ChapterItemProps {
  chapter: DisplayChapter;
  topics: Topic[];
  isExpanded: boolean;
  onToggle: () => void;
  onDeleteChapter: (chapterId: string, chapterName: string) => void;
  onDeleteTopic: (topicId: string, topicName: string) => void;
}

export const ChapterItem = ({
  chapter,
  topics,
  isExpanded,
  onToggle,
  onDeleteChapter,
  onDeleteTopic,
}: ChapterItemProps) => {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className={cn(
        "rounded-lg border transition-all group/chapter",
        chapter.isCourseOwned 
          ? "border-coral-200 dark:border-coral-800/50 bg-coral-50/50 dark:bg-coral-950/20" 
          : "border-border/50 bg-card"
      )}>
        <CollapsibleTrigger asChild>
          <button className="w-full p-3 flex items-start gap-3 text-left hover:bg-muted/30 rounded-lg transition-colors">
            <span className="mt-0.5 text-muted-foreground">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2">
                {chapter.isCourseOwned ? (
                  <Star className="w-4 h-4 text-coral-500 mt-0.5 shrink-0" />
                ) : (
                  <BookOpen className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">
                    {chapter.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] px-1.5 py-0 h-4 border-0",
                        chapter.isCourseOwned
                          ? "bg-coral-500/10 text-coral-600 dark:text-coral-400"
                          : "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                      )}
                    >
                      {chapter.sourceLabel}
                    </Badge>
                    {topics.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {topics.length} topic{topics.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Delete Chapter Button */}
            <div className="opacity-0 group-hover/chapter:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Chapter</AlertDialogTitle>
                    <AlertDialogDescription>
                      Remove "{chapter.name}" from this course? This won't delete the chapter from the curriculum.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => onDeleteChapter(chapter.id, chapter.name)}
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          {topics.length > 0 && (
            <div className="px-3 pb-3 pt-0">
              <div className="ml-9 pl-3 border-l-2 border-muted space-y-1.5">
                {topics.map((topic, index) => (
                  <div 
                    key={topic.id}
                    className="flex items-center gap-2 py-1.5 px-2 rounded text-sm hover:bg-muted/30 transition-colors group/topic"
                  >
                    <span className="text-xs text-muted-foreground w-5">
                      {index + 1}.
                    </span>
                    <span className="text-foreground flex-1">{topic.name}</span>
                    
                    {/* Delete Topic Button */}
                    <div className="opacity-0 group-hover/topic:opacity-100 transition-opacity">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-6 h-6 text-destructive">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Topic</AlertDialogTitle>
                            <AlertDialogDescription>
                              Remove "{topic.name}" from this course?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => onDeleteTopic(topic.id, topic.name)}
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
