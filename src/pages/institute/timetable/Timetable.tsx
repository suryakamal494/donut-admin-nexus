import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { SubjectBadge } from "@/components/subject";
import { batches, timetableSlots, TimetableSlot } from "@/data/instituteData";
import { cn } from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const TIME_SLOTS = [
  { start: "08:00", end: "08:45", label: "8:00 - 8:45 AM" },
  { start: "08:45", end: "09:30", label: "8:45 - 9:30 AM" },
  { start: "09:45", end: "10:30", label: "9:45 - 10:30 AM" },
  { start: "10:30", end: "11:15", label: "10:30 - 11:15 AM" },
  { start: "11:30", end: "12:15", label: "11:30 - 12:15 PM" },
  { start: "12:15", end: "13:00", label: "12:15 - 1:00 PM" },
  { start: "14:00", end: "14:45", label: "2:00 - 2:45 PM" },
  { start: "14:45", end: "15:30", label: "2:45 - 3:30 PM" },
];

const subjectColors: Record<string, string> = {
  mat: "bg-blue-100 text-blue-700 border-blue-200",
  phy: "bg-indigo-100 text-indigo-700 border-indigo-200",
  che: "bg-teal-100 text-teal-700 border-teal-200",
  bio: "bg-green-100 text-green-700 border-green-200",
  eng: "bg-amber-100 text-amber-700 border-amber-200",
  hin: "bg-orange-100 text-orange-700 border-orange-200",
  sci: "bg-purple-100 text-purple-700 border-purple-200",
  sst: "bg-rose-100 text-rose-700 border-rose-200",
  cs: "bg-cyan-100 text-cyan-700 border-cyan-200",
  eco: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const Timetable = () => {
  const [searchParams] = useSearchParams();
  const preselectedBatchId = searchParams.get("batchId");

  const [selectedBatchId, setSelectedBatchId] = useState(
    preselectedBatchId || batches[0]?.id || ""
  );
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId);

  // Filter timetable slots for selected batch
  const batchSlots = timetableSlots.filter((slot) => slot.batchId === selectedBatchId);

  // Get slot for a specific day and time
  const getSlot = (day: typeof DAYS[number], startTime: string): TimetableSlot | undefined => {
    return batchSlots.find((slot) => slot.day === day && slot.startTime === startTime);
  };

  // Get current week dates
  const getWeekDates = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + currentWeekOffset * 7);

    return DAYS.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  };

  const weekDates = getWeekDates();
  const weekStart = weekDates[0];
  const weekEnd = weekDates[5];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable"
        description="View and manage class schedules for each batch. See which teacher teaches what subject at each time slot."
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a batch..." />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.className} - {batch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "weekly" | "monthly")}>
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {viewMode === "weekly" && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[180px] text-center">
              {formatDate(weekStart)} - {formatDate(weekEnd)}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {currentWeekOffset !== 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentWeekOffset(0)}
              >
                Today
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Selected Batch Info */}
      {selectedBatch && (
        <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {selectedBatch.className} - {selectedBatch.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedBatch.subjects.length} subjects • {selectedBatch.teacherCount} teachers
                  </p>
                </div>
              </div>
              <Badge variant="secondary">{selectedBatch.academicYear}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Timetable Grid */}
      {viewMode === "weekly" && (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground w-[120px]">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time
                    </div>
                  </th>
                  {DAYS.map((day, index) => {
                    const date = weekDates[index];
                    const isToday = date.toDateString() === new Date().toDateString();
                    return (
                      <th
                        key={day}
                        className={cn(
                          "p-3 text-center text-sm font-medium",
                          isToday
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        <div>{day}</div>
                        <div className="text-xs font-normal mt-0.5">
                          {formatDate(date)}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((timeSlot, rowIndex) => (
                  <tr
                    key={timeSlot.start}
                    className={cn(
                      "border-b",
                      rowIndex % 2 === 0 ? "bg-background" : "bg-muted/10"
                    )}
                  >
                    <td className="p-3 text-sm text-muted-foreground font-medium">
                      {timeSlot.label}
                    </td>
                    {DAYS.map((day) => {
                      const slot = getSlot(day, timeSlot.start);
                      const isToday =
                        weekDates[DAYS.indexOf(day)].toDateString() ===
                        new Date().toDateString();

                      return (
                        <td
                          key={`${day}-${timeSlot.start}`}
                          className={cn(
                            "p-2 text-center",
                            isToday && "bg-primary/5"
                          )}
                        >
                          {slot ? (
                            <div
                              className={cn(
                                "p-2 rounded-lg border transition-all hover:shadow-md cursor-pointer",
                                subjectColors[slot.subjectId] || "bg-muted"
                              )}
                            >
                              <p className="font-medium text-sm">{slot.subject}</p>
                              <p className="text-xs opacity-80 mt-0.5 truncate">
                                {slot.teacher.split(" ").slice(-1)[0]}
                              </p>
                            </div>
                          ) : (
                            <div className="p-2 text-xs text-muted-foreground/50">
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Monthly View */}
      {viewMode === "monthly" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DAYS.map((day) => {
                const daySlots = batchSlots.filter((s) => s.day === day);
                return (
                  <Card key={day} className="border">
                    <CardHeader className="py-3 px-4 bg-muted/30">
                      <CardTitle className="text-sm font-medium">{day}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 space-y-2">
                      {daySlots.length > 0 ? (
                        daySlots
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map((slot) => (
                            <div
                              key={slot.id}
                              className={cn(
                                "p-2 rounded-lg border flex items-center justify-between",
                                subjectColors[slot.subjectId] || "bg-muted"
                              )}
                            >
                              <div>
                                <p className="font-medium text-sm">{slot.subject}</p>
                                <p className="text-xs opacity-70">{slot.teacher}</p>
                              </div>
                              <span className="text-xs opacity-70">
                                {slot.startTime}
                              </span>
                            </div>
                          ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No classes
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Subject Colors
          </CardTitle>
        </CardHeader>
        <CardContent className="py-3">
          <div className="flex flex-wrap gap-2">
            {selectedBatch?.subjects.map((subjectId) => {
              const slot = batchSlots.find((s) => s.subjectId === subjectId);
              return (
                <div
                  key={subjectId}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-sm font-medium",
                    subjectColors[subjectId] || "bg-muted"
                  )}
                >
                  {slot?.subject || subjectId.toUpperCase()}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timetable;
