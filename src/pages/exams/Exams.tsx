import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Eye, Edit, Copy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockExams } from "@/data/mockData";

const typeLabels = {
  chapter: "Chapter Test",
  topic: "Topic Test",
  subject: "Subject Test",
  grand: "Grand Test",
  previous: "Previous Year",
  live: "Live Assessment",
};

const Exams = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Exam Management"
        description="Create and manage all types of examinations"
        breadcrumbs={[{ label: "Dashboard", href: "/superadmin/dashboard" }, { label: "Exams" }]}
        actions={
          <Link to="/superadmin/exams/create">
            <Button className="gradient-button gap-2"><Plus className="w-4 h-4" />Create Exam</Button>
          </Link>
        }
      />

      <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search exams..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-3">
            <Select><SelectTrigger className="w-36"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="chapter">Chapter Test</SelectItem>
                <SelectItem value="grand">Grand Test</SelectItem>
                <SelectItem value="live">Live Assessment</SelectItem>
              </SelectContent>
            </Select>
            <Select><SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Exam Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockExams.map((exam) => (
              <TableRow key={exam.id} className="hover:bg-muted/20">
                <TableCell>
                  <div>
                    <p className="font-medium">{exam.name}</p>
                    <p className="text-xs text-muted-foreground">{exam.assignedBatches.join(", ")}</p>
                  </div>
                </TableCell>
                <TableCell>{typeLabels[exam.type]}</TableCell>
                <TableCell>{exam.subject}</TableCell>
                <TableCell>{exam.duration} min</TableCell>
                <TableCell>{exam.totalQuestions}</TableCell>
                <TableCell><StatusBadge status={exam.status} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Copy className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Users className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Exams;