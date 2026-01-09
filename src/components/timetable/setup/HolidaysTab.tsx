import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/timetable";
import { Holiday } from "@/components/timetable/HolidayCalendarDialog";
import { CalendarDays } from "lucide-react";

interface HolidaysTabProps {
  holidays: Holiday[];
  onManageClick: () => void;
}

export const HolidaysTab = ({ holidays, onManageClick }: HolidaysTabProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Holiday Calendar
              <InfoTooltip content="Mark dates as holidays. These days will be blocked in the timetable grid automatically." />
            </CardTitle>
            <CardDescription>Define school holidays and non-working days</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{holidays.length} Holidays Configured</p>
            <p className="text-sm text-muted-foreground">These dates will be blocked in the timetable</p>
          </div>
          <Button onClick={onManageClick} className="gap-2">
            <CalendarDays className="w-4 h-4" />
            Manage Holidays
          </Button>
        </div>

        {/* Holiday Preview */}
        {holidays.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {holidays.slice(0, 8).map((holiday, i) => (
              <div key={i} className="p-3 rounded-lg border bg-muted/30">
                <p className="text-sm font-medium">{holiday.name}</p>
                <p className="text-xs text-muted-foreground">{holiday.date}</p>
              </div>
            ))}
            {holidays.length > 8 && (
              <div className="p-3 rounded-lg border bg-muted/30 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">+{holidays.length - 8} more</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
