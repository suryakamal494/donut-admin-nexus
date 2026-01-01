import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  User,
  Users,
  ClipboardPaste,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Check,
  X,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { batches } from "@/data/instituteData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ParsedStudent {
  name: string;
  rollNumber: string;
  username: string;
  isValid: boolean;
  errors: string[];
}

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const generateUsername = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, ".").replace(/\.+/g, ".");
};

const AddStudent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedBatchId = searchParams.get("batchId");

  const [activeTab, setActiveTab] = useState("manual");
  const [selectedBatchId, setSelectedBatchId] = useState(preselectedBatchId || "");

  // Manual form state
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(generatePassword());
  const [showPassword, setShowPassword] = useState(false);

  // Bulk upload state
  const [pasteData, setPasteData] = useState("");
  const [parsedStudents, setParsedStudents] = useState<ParsedStudent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!username || username === generateUsername(name)) {
      setUsername(generateUsername(value));
    }
  };

  const handleManualAdd = () => {
    if (!selectedBatchId) {
      toast.error("Please select a batch");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter student name");
      return;
    }

    toast.success(`${name} added to ${selectedBatch?.className} - ${selectedBatch?.name}`);
    navigate("/institute/students");
  };

  const parseData = (data: string) => {
    const lines = data.trim().split("\n").filter((line) => line.trim());
    const parsed: ParsedStudent[] = [];

    for (const line of lines) {
      const parts = line.includes("\t")
        ? line.split("\t").map((p) => p.trim())
        : line.split(",").map((p) => p.trim());

      const errors: string[] = [];
      const [name = "", rollNumber = "", username = ""] = parts;

      if (!name) errors.push("Name is required");

      parsed.push({
        name,
        rollNumber: rollNumber || String(parsed.length + 1).padStart(3, "0"),
        username: username || generateUsername(name),
        isValid: errors.length === 0,
        errors,
      });
    }

    return parsed;
  };

  const handleParse = () => {
    if (!pasteData.trim()) {
      toast.error("Please paste some data first");
      return;
    }
    const parsed = parseData(pasteData);
    setParsedStudents(parsed);
  };

  const handleRemoveRow = (index: number) => {
    setParsedStudents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBulkUpload = () => {
    if (!selectedBatchId) {
      toast.error("Please select a batch");
      return;
    }

    const validStudents = parsedStudents.filter((s) => s.isValid);
    if (validStudents.length === 0) {
      toast.error("No valid students to add");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(
        `Added ${validStudents.length} students to ${selectedBatch?.className} - ${selectedBatch?.name}`
      );
      navigate("/institute/students");
    }, 1500);
  };

  const validCount = parsedStudents.filter((s) => s.isValid).length;
  const invalidCount = parsedStudents.filter((s) => !s.isValid).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Add Students"
        description="Add students one by one or upload multiple students at once using copy-paste."
        actions={
          <Button variant="outline" onClick={() => navigate("/institute/students")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Button>
        }
      />

      {/* Batch Selection */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Select Batch</CardTitle>
          <CardDescription>
            Choose which batch these students will be added to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Select a batch..." />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.className} - {batch.name} ({batch.academicYear})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="manual" className="gap-2">
            <User className="h-4 w-4" />
            Add One by One
          </TabsTrigger>
          <TabsTrigger value="bulk" className="gap-2">
            <ClipboardPaste className="h-4 w-4" />
            Bulk Add (Copy-Paste)
          </TabsTrigger>
        </TabsList>

        {/* Manual Add */}
        <TabsContent value="manual" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Details</CardTitle>
              <CardDescription>
                Enter the student's information. Username and password are auto-generated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Aarav Patel"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    placeholder="e.g., 001"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Auto-generated from name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setPassword(generatePassword())}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleManualAdd}
                  disabled={!selectedBatchId || !name.trim()}
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Add */}
        <TabsContent value="bulk" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Paste Student Data</CardTitle>
              <CardDescription>
                Copy rows from Excel, Google Sheets, or any table. Each row: Name, Roll Number (optional), Username (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Expected Format:</p>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-background p-3 rounded border">
{`Name    Roll Number    Username
Aarav Patel    001    aarav.patel
Diya Sharma    002    
Arjun Singh`}
                </pre>
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Roll number and username are optional - they'll be auto-generated if empty
                </p>
              </div>

              <Textarea
                placeholder="Paste your data here...

Example:
Aarav Patel	001
Diya Sharma	002
Arjun Singh	003"
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
              />

              <div className="flex items-center gap-3">
                <Button onClick={handleParse}>
                  <Check className="h-4 w-4 mr-2" />
                  Parse Data
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setPasteData("");
                    setParsedStudents([]);
                  }}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Parsed Preview */}
          {parsedStudents.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Preview</CardTitle>
                    <CardDescription>
                      Review the parsed data before adding
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {validCount > 0 && (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        {validCount} valid
                      </Badge>
                    )}
                    {invalidCount > 0 && (
                      <Badge variant="destructive">{invalidCount} with errors</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]">Status</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedStudents.map((student, index) => (
                      <TableRow
                        key={index}
                        className={cn(!student.isValid && "bg-destructive/5")}
                      >
                        <TableCell>
                          {student.isValid ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {student.name || "-"}
                        </TableCell>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell className="text-muted-foreground">
                          @{student.username}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveRow(index)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleBulkUpload}
                    disabled={validCount === 0 || !selectedBatchId || isProcessing}
                    className="bg-gradient-to-r from-primary to-primary/80"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        Add {validCount} Student{validCount !== 1 ? "s" : ""}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddStudent;
