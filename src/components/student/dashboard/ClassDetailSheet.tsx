// Class Detail Sheet Component
// Opens when tapping a class in the schedule timeline

import { useNavigate } from "react-router-dom";
import { Clock, MapPin, User, BookOpen, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { subjectColors, type ScheduleItem } from "@/data/student/dashboard";
import { useToast } from "@/hooks/use-toast";

interface ClassDetailSheetProps {
  classItem: ScheduleItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ClassDetailSheet = ({ classItem, open, onOpenChange }: ClassDetailSheetProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!classItem || classItem.type === 'break') return null;

  const colors = classItem.subject ? subjectColors[classItem.subject] : null;

  const handleJoinClass = () => {
    if (classItem.status === 'current') {
      // For live classes, show toast about video integration
      toast({
        title: "Joining Class",
        description: "Live video class integration coming soon!",
        duration: 2000,
      });
    } else if (classItem.status === 'upcoming') {
      toast({
        title: "Class Not Started",
        description: "This class hasn't started yet. Check back later!",
        duration: 2000,
      });
    } else {
      // For completed classes, navigate to subject content
      if (classItem.subject) {
        onOpenChange(false);
        navigate(`/student/subjects/${classItem.subject}`);
      }
    }
  };

  const getButtonText = () => {
    switch (classItem.status) {
      case 'current':
        return 'Join Class';
      case 'upcoming':
        return 'Class Not Started';
      case 'completed':
        return 'View Content';
      default:
        return 'Join Class';
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background/95 backdrop-blur-xl">
        <DrawerHeader className="text-left pb-2">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors?.bg || 'bg-primary'}`}
            >
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <DrawerTitle className="text-xl capitalize">{classItem.subject}</DrawerTitle>
              <DrawerDescription className="text-sm">
                {classItem.topic}
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-4">
          {/* Class Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Time</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {classItem.time} - {classItem.endTime}
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium">Room</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                Room {classItem.room}
              </p>
            </div>
          </div>

          {/* Teacher Info */}
          <div className="bg-muted/50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <User className="w-4 h-4" />
              <span className="text-xs font-medium">Teacher</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {classItem.teacher}
            </p>
          </div>

          {/* Chapter Overview */}
          <div className="bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl p-4 border border-border/50">
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-donut-coral" />
              Chapter Overview
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Today's class covers {classItem.topic}. Make sure to review the previous 
              chapter notes before joining. Interactive exercises and a quick quiz 
              will be included in this session.
            </p>
          </div>

          {/* Status Badge */}
          {classItem.status === 'current' && (
            <div className="flex items-center gap-2 text-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-green-600 font-medium">Class is live now</span>
            </div>
          )}
        </div>

        <DrawerFooter className="pt-2">
          <Button 
            onClick={handleJoinClass}
            disabled={classItem.status === 'upcoming'}
            className="w-full h-12 bg-gradient-to-r from-donut-coral to-donut-orange text-white font-semibold rounded-xl shadow-lg shadow-donut-coral/25 disabled:opacity-50"
            size="lg"
          >
            <Video className="w-5 h-5 mr-2" />
            {getButtonText()}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ClassDetailSheet;
