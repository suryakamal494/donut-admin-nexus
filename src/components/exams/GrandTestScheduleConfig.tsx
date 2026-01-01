import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CalendarIcon, 
  Clock, 
  Users, 
  Building2, 
  Globe,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Institute {
  id: string;
  name: string;
  location: string;
  studentCount: number;
}

interface GrandTestScheduleConfigProps {
  testName: string;
  onSave?: (config: ScheduleConfig) => void;
}

interface ScheduleConfig {
  scheduledDate: Date | null;
  scheduledTime: string;
  duration: number;
  targetAudience: "all" | "direct_users" | "institutes" | "both";
  includeDirectUsers: boolean;
  instituteSelection: "all" | "selected";
  selectedInstitutes: string[];
}

// Mock institutes data
const mockInstitutes: Institute[] = [
  { id: "inst_1", name: "Narayana Junior College", location: "Hyderabad", studentCount: 2500 },
  { id: "inst_2", name: "Sri Chaitanya IIT Academy", location: "Vijayawada", studentCount: 3200 },
  { id: "inst_3", name: "FIITJEE", location: "Delhi", studentCount: 1800 },
  { id: "inst_4", name: "Allen Career Institute", location: "Kota", studentCount: 4500 },
  { id: "inst_5", name: "Resonance", location: "Kota", studentCount: 2800 },
  { id: "inst_6", name: "Aakash Institute", location: "Mumbai", studentCount: 2100 },
  { id: "inst_7", name: "Vidyamandir Classes", location: "Delhi", studentCount: 1600 },
  { id: "inst_8", name: "Motion Education", location: "Kota", studentCount: 1200 },
];

// Generate time slots
const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return [`${hour}:00`, `${hour}:30`];
}).flat();

export const GrandTestScheduleConfig = ({ testName, onSave }: GrandTestScheduleConfigProps) => {
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [includeDirectUsers, setIncludeDirectUsers] = useState(true);
  const [includeInstitutes, setIncludeInstitutes] = useState(true);
  const [instituteSelection, setInstituteSelection] = useState<"all" | "selected">("all");
  const [selectedInstitutes, setSelectedInstitutes] = useState<string[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);

  const handleInstituteToggle = (instituteId: string) => {
    setSelectedInstitutes(prev => 
      prev.includes(instituteId) 
        ? prev.filter(id => id !== instituteId)
        : [...prev, instituteId]
    );
  };

  const handleSelectAllInstitutes = () => {
    if (selectedInstitutes.length === mockInstitutes.length) {
      setSelectedInstitutes([]);
    } else {
      setSelectedInstitutes(mockInstitutes.map(i => i.id));
    }
  };

  const getTotalParticipants = () => {
    let count = 0;
    if (includeDirectUsers) count += 5420; // Mock direct users count
    if (includeInstitutes) {
      if (instituteSelection === "all") {
        count += mockInstitutes.reduce((sum, i) => sum + i.studentCount, 0);
      } else {
        count += mockInstitutes
          .filter(i => selectedInstitutes.includes(i.id))
          .reduce((sum, i) => sum + i.studentCount, 0);
      }
    }
    return count;
  };

  const handleSchedule = () => {
    if (!scheduledDate) {
      toast({ title: "Please select a date", variant: "destructive" });
      return;
    }
    if (!includeDirectUsers && !includeInstitutes) {
      toast({ title: "Please select at least one audience", variant: "destructive" });
      return;
    }
    if (includeInstitutes && instituteSelection === "selected" && selectedInstitutes.length === 0) {
      toast({ title: "Please select at least one institute", variant: "destructive" });
      return;
    }

    setIsScheduled(true);
    toast({ 
      title: "Exam scheduled successfully", 
      description: `Scheduled for ${format(scheduledDate, "PPP")} at ${scheduledTime}` 
    });

    onSave?.({
      scheduledDate,
      scheduledTime,
      duration: 180,
      targetAudience: includeDirectUsers && includeInstitutes ? "both" : includeDirectUsers ? "direct_users" : "institutes",
      includeDirectUsers,
      instituteSelection,
      selectedInstitutes: instituteSelection === "all" ? mockInstitutes.map(i => i.id) : selectedInstitutes
    });
  };

  const handleClearSchedule = () => {
    setIsScheduled(false);
    setScheduledDate(undefined);
    toast({ title: "Schedule cleared" });
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Exam Schedule & Audience
            </CardTitle>
            <CardDescription>
              Schedule when to conduct "{testName}" and select participants
            </CardDescription>
          </div>
          {isScheduled && (
            <Badge className="bg-success/10 text-success border-success/30 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Scheduled
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Schedule Section */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Schedule Date & Time
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Exam Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Select value={scheduledTime} onValueChange={setScheduledTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {scheduledDate && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
              <span className="font-medium">Scheduled for: </span>
              {format(scheduledDate, "EEEE, MMMM d, yyyy")} at {scheduledTime}
            </div>
          )}
        </div>

        {/* Audience Selection */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            Target Audience
          </h4>

          {/* Direct Users Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label className="text-base">Direct Users</Label>
                <p className="text-sm text-muted-foreground">Users registered directly on the platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">~5,420 users</Badge>
              <Switch checked={includeDirectUsers} onCheckedChange={setIncludeDirectUsers} />
            </div>
          </div>

          {/* Institutes Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label className="text-base">Institutes</Label>
                <p className="text-sm text-muted-foreground">Students from partner institutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{mockInstitutes.length} institutes</Badge>
              <Switch checked={includeInstitutes} onCheckedChange={setIncludeInstitutes} />
            </div>
          </div>

          {/* Institute Selection */}
          {includeInstitutes && (
            <div className="space-y-4 pl-4 border-l-2 border-primary/20 ml-4">
              <RadioGroup value={instituteSelection} onValueChange={(v: "all" | "selected") => setInstituteSelection(v)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-institutes" />
                  <Label htmlFor="all-institutes" className="font-normal">
                    All Institutes ({mockInstitutes.reduce((sum, i) => sum + i.studentCount, 0).toLocaleString()} students)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selected" id="selected-institutes" />
                  <Label htmlFor="selected-institutes" className="font-normal">
                    Select Specific Institutes
                  </Label>
                </div>
              </RadioGroup>

              {instituteSelection === "selected" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {selectedInstitutes.length} of {mockInstitutes.length} selected
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleSelectAllInstitutes}>
                      {selectedInstitutes.length === mockInstitutes.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {mockInstitutes.map((institute) => (
                      <div
                        key={institute.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                          selectedInstitutes.includes(institute.id)
                            ? "bg-primary/5 border-primary/30"
                            : "bg-background hover:bg-muted/50"
                        )}
                        onClick={() => handleInstituteToggle(institute.id)}
                      >
                        <Checkbox
                          checked={selectedInstitutes.includes(institute.id)}
                          onCheckedChange={() => handleInstituteToggle(institute.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{institute.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {institute.location} • {institute.studentCount.toLocaleString()} students
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Estimated Participants</span>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {getTotalParticipants().toLocaleString()}
            </Badge>
          </div>
          
          {(!includeDirectUsers && !includeInstitutes) && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              Please select at least one audience type
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4">
          {isScheduled ? (
            <>
              <Button variant="outline" onClick={handleClearSchedule}>
                Clear Schedule
              </Button>
              <Button disabled>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Scheduled
              </Button>
            </>
          ) : (
            <Button onClick={handleSchedule} disabled={!scheduledDate || (!includeDirectUsers && !includeInstitutes)}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Exam
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GrandTestScheduleConfig;
