import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip, FacilityManager } from "@/components/timetable";
import { Facility } from "@/data/timetableData";
import { Building2, Zap } from "lucide-react";

interface FacilitiesTabProps {
  facilities: Facility[];
  onUpdate: (facilities: Facility[]) => void;
}

export const FacilitiesTab = ({ facilities, onUpdate }: FacilitiesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Facility Management
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                <Zap className="w-3 h-3 mr-1" />
                Advanced
              </Badge>
              <InfoTooltip content="Manage labs, sports facilities, special rooms, and classrooms. Set capacity limits and class restrictions." />
            </CardTitle>
            <CardDescription>Configure rooms, labs, and resources for scheduling</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <FacilityManager
          facilities={facilities}
          onUpdate={onUpdate}
        />
      </CardContent>
    </Card>
  );
};
