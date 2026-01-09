import { ArrowLeft, Save, Play, MoreVertical, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkspaceHeaderProps {
  isNew: boolean;
  subject: string;
  batchName: string;
  status: 'draft' | 'ready' | 'completed';
  isSaving: boolean;
  onBack: () => void;
  onSave: () => void;
  onStartClass: () => void;
  onClone?: () => void;
}

export const WorkspaceHeader = ({
  isNew,
  subject,
  batchName,
  status,
  isSaving,
  onBack,
  onSave,
  onStartClass,
  onClone,
}: WorkspaceHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Left Section */}
      <div className="flex items-center gap-3 min-w-0">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
              {isNew ? "New Lesson" : "Edit Lesson"}
            </h1>
            <Badge 
              variant="secondary" 
              className={`shrink-0 text-[10px] px-2 ${
                status === 'draft' 
                  ? 'bg-amber-100 text-amber-700' 
                  : status === 'ready'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {subject} • {batchName}
          </p>
        </div>
      </div>
      
      {/* Right Section - Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* More Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onClone}>
              <Copy className="w-4 h-4 mr-2" />
              Clone to Another Batch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Save Button */}
        <Button 
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="gap-1.5"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Save</span>
        </Button>
        
        {/* Start Class Button */}
        <Button 
          size="sm"
          className="gradient-button gap-1.5"
          onClick={onStartClass}
        >
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">Present</span>
        </Button>
      </div>
    </div>
  );
};
