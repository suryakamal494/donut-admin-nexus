import { Plus, Search, Users, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

const batches = [
  { id: "1", name: "JEE 2025 - Batch A", course: "JEE Main", students: 120, startDate: "2024-04-01", status: "active" },
  { id: "2", name: "JEE 2025 - Batch B", course: "JEE Main", students: 95, startDate: "2024-04-15", status: "active" },
  { id: "3", name: "NEET 2025", course: "NEET", students: 180, startDate: "2024-04-01", status: "active" },
  { id: "4", name: "CBSE Class 12", course: "CBSE Board", students: 250, startDate: "2024-04-01", status: "active" },
];

const Batches = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Batch Management"
        description="Create and manage student batches"
        breadcrumbs={[{ label: "Dashboard", href: "/superadmin/dashboard" }, { label: "Batches" }]}
        actions={<Button className="gradient-button gap-2"><Plus className="w-4 h-4" />Create Batch</Button>}
      />

      <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/50">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search batches..." className="pl-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <div key={batch.id} className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 hover-lift">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
            <h3 className="font-semibold text-lg">{batch.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{batch.course}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{batch.students} Students</span>
              <span className="text-muted-foreground">Started: {batch.startDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Batches;