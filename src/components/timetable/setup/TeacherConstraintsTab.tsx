import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip, TeacherConstraintsManager } from "@/components/timetable";
import { TeacherLoad, TeacherConstraint } from "@/data/timetableData";
import { AlertTriangle, Zap } from "lucide-react";

interface TeacherConstraintsTabProps {
  teachers: TeacherLoad[];
  constraints: TeacherConstraint[];
  onUpdate: (constraints: TeacherConstraint[]) => void;
}

export const TeacherConstraintsTab = ({
  teachers,
  constraints,
  onUpdate,
}: TeacherConstraintsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Teacher Constraints
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                <Zap className="w-3 h-3 mr-1" />
                Advanced
              </Badge>
              <InfoTooltip content="Set detailed availability rules for each teacher including max periods per day, consecutive limits, and time windows." />
            </CardTitle>
            <CardDescription>Configure availability rules and limits for teachers</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TeacherConstraintsManager
          teachers={teachers}
          constraints={constraints}
          onUpdate={onUpdate}
        />
      </CardContent>
    </Card>
  );
};
