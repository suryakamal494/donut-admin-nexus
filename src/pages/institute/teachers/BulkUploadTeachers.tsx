import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Upload,
  FileSpreadsheet,
  ClipboardPaste,
  Check,
  X,
  AlertCircle,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ParsedTeacher {
  name: string;
  email: string;
  mobile: string;
  subjects: string;
  isValid: boolean;
  errors: string[];
}

const sampleData = `Dr. Rajesh Kumar	rajesh@school.edu	9876543210	Physics, Mathematics
Mrs. Priya Sharma	priya@school.edu	9876543211	Chemistry
Mr. Amit Patel	amit@school.edu	9876543212	Biology, Science`;

const BulkUploadTeachers = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("paste");
  const [pasteData, setPasteData] = useState("");
  const [parsedTeachers, setParsedTeachers] = useState<ParsedTeacher[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateMobile = (mobile: string) => {
    return /^\d{10}$/.test(mobile.replace(/\D/g, ""));
  };

  const parseData = (data: string) => {
    const lines = data.trim().split("\n").filter((line) => line.trim());
    const parsed: ParsedTeacher[] = [];

    for (const line of lines) {
      // Handle tab-separated (from Excel/Sheets copy) or comma-separated
      const parts = line.includes("\t")
        ? line.split("\t").map((p) => p.trim())
        : line.split(",").map((p) => p.trim());

      const errors: string[] = [];
      const [name = "", email = "", mobile = "", subjects = ""] = parts;

      if (!name) errors.push("Name is required");
      if (!email && !mobile) errors.push("Email or Mobile is required");
      if (email && !validateEmail(email)) errors.push("Invalid email format");
      if (mobile && !validateMobile(mobile)) errors.push("Mobile should be 10 digits");
      if (!subjects) errors.push("At least one subject is required");

      parsed.push({
        name,
        email,
        mobile,
        subjects,
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
    setParsedTeachers(parsed);
  };

  const handleRemoveRow = (index: number) => {
    setParsedTeachers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    const validTeachers = parsedTeachers.filter((t) => t.isValid);
    if (validTeachers.length === 0) {
      toast.error("No valid teachers to upload");
      return;
    }

    setIsProcessing(true);
    // Simulate upload
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`Successfully added ${validTeachers.length} teachers!`);
      navigate("/institute/teachers");
    }, 1500);
  };

  const downloadTemplate = () => {
    const csvContent = `Name,Email,Mobile,Subjects
Dr. Rajesh Kumar,rajesh@school.edu,9876543210,"Physics, Mathematics"
Mrs. Priya Sharma,priya@school.edu,9876543211,Chemistry
Mr. Amit Patel,amit@school.edu,9876543212,"Biology, Science"`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teachers_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const validCount = parsedTeachers.filter((t) => t.isValid).length;
  const invalidCount = parsedTeachers.filter((t) => !t.isValid).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Bulk Upload Teachers"
        description="Add multiple teachers at once by pasting data or uploading a file. No complex formatting required!"
        action={
          <Button variant="outline" onClick={() => navigate("/institute/teachers")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Teachers
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="paste" className="gap-2">
            <ClipboardPaste className="h-4 w-4" />
            Copy & Paste
          </TabsTrigger>
          <TabsTrigger value="file" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Upload CSV
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paste" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Paste Your Data</CardTitle>
              <CardDescription>
                Copy rows from Excel, Google Sheets, or any table and paste below. Each row should have: Name, Email, Mobile, Subjects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Expected Format (tab or comma separated):</p>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-background p-3 rounded border">
{`Name    Email    Mobile    Subjects
Dr. Rajesh Kumar    rajesh@school.edu    9876543210    Physics, Mathematics`}
                </pre>
              </div>

              <Textarea
                placeholder="Paste your data here...

Example:
Dr. Rajesh Kumar	rajesh@school.edu	9876543210	Physics, Mathematics
Mrs. Priya Sharma	priya@school.edu	9876543211	Chemistry"
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />

              <div className="flex items-center gap-3">
                <Button onClick={handleParse}>
                  <Check className="h-4 w-4 mr-2" />
                  Parse Data
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPasteData(sampleData)}
                >
                  Load Sample Data
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setPasteData("");
                    setParsedTeachers([]);
                  }}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload CSV File</CardTitle>
              <CardDescription>
                Download our template, fill it in Excel or Google Sheets, then upload
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>

              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm font-medium mb-2">
                  Drop your CSV file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supports .csv files up to 5MB
                </p>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const text = event.target?.result as string;
                        // Skip header row
                        const lines = text.split("\n").slice(1).join("\n");
                        setPasteData(lines);
                        handleParse();
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
                <Button variant="outline" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choose File
                  </label>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Parsed Data Preview */}
      {parsedTeachers.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Preview</CardTitle>
                <CardDescription>
                  Review the parsed data before uploading
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {validCount > 0 && (
                  <Badge className="bg-emerald-100 text-emerald-700">
                    {validCount} valid
                  </Badge>
                )}
                {invalidCount > 0 && (
                  <Badge variant="destructive">
                    {invalidCount} with errors
                  </Badge>
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
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedTeachers.map((teacher, index) => (
                  <TableRow
                    key={index}
                    className={cn(!teacher.isValid && "bg-destructive/5")}
                  >
                    <TableCell>
                      {teacher.isValid ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{teacher.name || "-"}</TableCell>
                    <TableCell>{teacher.email || "-"}</TableCell>
                    <TableCell>{teacher.mobile || "-"}</TableCell>
                    <TableCell>{teacher.subjects || "-"}</TableCell>
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

            {invalidCount > 0 && (
              <div className="mt-4 p-4 bg-destructive/10 rounded-lg">
                <p className="text-sm font-medium text-destructive mb-2">
                  Errors found in {invalidCount} row(s):
                </p>
                <ul className="text-sm text-destructive/80 list-disc list-inside">
                  {parsedTeachers
                    .filter((t) => !t.isValid)
                    .slice(0, 3)
                    .map((t, i) => (
                      <li key={i}>
                        {t.name || `Row ${i + 1}`}: {t.errors.join(", ")}
                      </li>
                    ))}
                  {invalidCount > 3 && (
                    <li>...and {invalidCount - 3} more</li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleUpload}
                disabled={validCount === 0 || isProcessing}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {validCount} Teacher{validCount !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkUploadTeachers;
