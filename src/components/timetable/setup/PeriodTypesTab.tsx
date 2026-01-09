import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InfoTooltip, PeriodTypeManager } from "@/components/timetable";
import { PeriodType } from "@/data/timetableData";
import { Layers } from "lucide-react";

interface PeriodTypesTabProps {
  periodTypes: PeriodType[];
  onUpdate: (types: PeriodType[]) => void;
}

export const PeriodTypesTab = ({ periodTypes, onUpdate }: PeriodTypesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Period Types
              <InfoTooltip content="Define different types of periods like Library, Lab, Sports, etc. Each type can have unique settings." />
            </CardTitle>
            <CardDescription>Configure special period types for your timetable</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <PeriodTypeManager 
          periodTypes={periodTypes}
          onUpdate={onUpdate}
        />
      </CardContent>
    </Card>
  );
};
