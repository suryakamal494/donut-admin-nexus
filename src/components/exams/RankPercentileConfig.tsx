import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Trash2,
  Eye,
  Plus,
  X
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface RankPercentileEntry {
  id: string;
  marks: number;
  percentile: number;
  rank: number;
  college: string;
}

interface RankPercentileConfigProps {
  examName: string;
  onSave?: (data: RankPercentileEntry[]) => void;
}

// Sample mock data
const sampleData: RankPercentileEntry[] = [
  { id: "1", marks: 300, percentile: 99.99, rank: 100, college: "IIT Bombay - CS" },
  { id: "2", marks: 290, percentile: 99.95, rank: 500, college: "IIT Delhi - CS" },
  { id: "3", marks: 280, percentile: 99.90, rank: 1000, college: "IIT Madras - CS" },
  { id: "4", marks: 270, percentile: 99.80, rank: 2000, college: "IIT Kanpur - CS" },
  { id: "5", marks: 260, percentile: 99.70, rank: 3000, college: "IIT Kharagpur - CS" },
  { id: "6", marks: 250, percentile: 99.50, rank: 5000, college: "IIT Roorkee - CS" },
  { id: "7", marks: 240, percentile: 99.30, rank: 7000, college: "IIT Guwahati - CS" },
  { id: "8", marks: 230, percentile: 99.00, rank: 10000, college: "NIT Trichy - CS" },
  { id: "9", marks: 220, percentile: 98.50, rank: 15000, college: "NIT Warangal - CS" },
  { id: "10", marks: 210, percentile: 98.00, rank: 20000, college: "NIT Surathkal - CS" },
  { id: "11", marks: 200, percentile: 97.50, rank: 25000, college: "BITS Pilani - CS" },
  { id: "12", marks: 180, percentile: 96.00, rank: 40000, college: "IIIT Hyderabad" },
  { id: "13", marks: 160, percentile: 94.00, rank: 60000, college: "DTU - CS" },
  { id: "14", marks: 140, percentile: 91.00, rank: 90000, college: "NSUT - CS" },
  { id: "15", marks: 120, percentile: 87.00, rank: 130000, college: "State Engineering College" },
];

export const RankPercentileConfig = ({ examName, onSave }: RankPercentileConfigProps) => {
  const [rankEnabled, setRankEnabled] = useState(true);
  const [percentileEnabled, setPercentileEnabled] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [entries, setEntries] = useState<RankPercentileEntry[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [addEntryOpen, setAddEntryOpen] = useState(false);
  
  // New entry form
  const [newEntry, setNewEntry] = useState<Partial<RankPercentileEntry>>({
    marks: 0,
    percentile: 0,
    rank: 0,
    college: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv"
      ];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
        toast({ title: "Invalid file type", description: "Please upload an Excel (.xlsx, .xls) or CSV file", variant: "destructive" });
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleUpload = () => {
    if (!uploadedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload and processing
    setTimeout(() => {
      setIsUploading(false);
      setDataLoaded(true);
      setEntries(sampleData);
      toast({ title: "Data uploaded successfully", description: `${sampleData.length} entries loaded from ${uploadedFile.name}` });
    }, 1500);
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const headers = "Marks,Percentile,Rank,College";
    const sampleRows = [
      "300,99.99,100,IIT Bombay - CS",
      "290,99.95,500,IIT Delhi - CS",
      "280,99.90,1000,IIT Madras - CS"
    ];
    const csvContent = [headers, ...sampleRows].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rank_percentile_template.csv";
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Template downloaded", description: "Fill in the data and upload" });
  };

  const handleClearData = () => {
    setEntries([]);
    setDataLoaded(false);
    setUploadedFile(null);
    toast({ title: "Data cleared", description: "Rank/percentile mapping removed" });
  };

  const handleAddEntry = () => {
    if (!newEntry.marks || !newEntry.percentile || !newEntry.rank || !newEntry.college) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    
    const entry: RankPercentileEntry = {
      id: Date.now().toString(),
      marks: newEntry.marks!,
      percentile: newEntry.percentile!,
      rank: newEntry.rank!,
      college: newEntry.college!
    };
    
    setEntries(prev => [...prev, entry].sort((a, b) => b.marks - a.marks));
    setNewEntry({ marks: 0, percentile: 0, rank: 0, college: "" });
    setAddEntryOpen(false);
    toast({ title: "Entry added successfully" });
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleSave = () => {
    onSave?.(entries);
    toast({ title: "Configuration saved", description: "Rank/percentile mapping saved successfully" });
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Rank & Percentile Configuration
            </CardTitle>
            <CardDescription>
              Configure rank and percentile mapping for "{examName}"
            </CardDescription>
          </div>
          {dataLoaded && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {entries.length} Entries Loaded
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable Toggles */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Rank Display</Label>
              <p className="text-sm text-muted-foreground">Show expected rank to students</p>
            </div>
            <Switch checked={rankEnabled} onCheckedChange={setRankEnabled} />
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Percentile Display</Label>
              <p className="text-sm text-muted-foreground">Show percentile to students</p>
            </div>
            <Switch checked={percentileEnabled} onCheckedChange={setPercentileEnabled} />
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">How it works</p>
            <p className="text-muted-foreground">
              Upload an Excel/CSV file with marks, percentile, rank, and college data. 
              When students complete this paper, they'll see their expected rank, 
              percentile, and potential colleges based on their score.
            </p>
          </div>
        </div>

        {/* Upload Section */}
        {!dataLoaded ? (
          <div className="space-y-4">
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                uploadedFile ? "border-success bg-success/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
              )}
            >
              <input
                type="file"
                id="rank-file-upload"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
              />
              <label htmlFor="rank-file-upload" className="cursor-pointer">
                {uploadedFile ? (
                  <div className="space-y-2">
                    <FileSpreadsheet className="w-12 h-12 text-success mx-auto" />
                    <p className="font-medium text-foreground">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" type="button">
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="font-medium text-foreground">
                      Upload Rank/Percentile Data
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Drag & drop an Excel or CSV file, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Columns: Marks, Percentile, Rank, College
                    </p>
                  </div>
                )}
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              
              {uploadedFile && (
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & Process
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Data Loaded View */
          <div className="space-y-4">
            {/* Data Preview Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Marks</TableHead>
                    <TableHead className="w-28">Percentile</TableHead>
                    <TableHead className="w-24">Rank</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.slice(0, 5).map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.marks}</TableCell>
                      <TableCell>{entry.percentile.toFixed(2)}%</TableCell>
                      <TableCell>{entry.rank.toLocaleString()}</TableCell>
                      <TableCell>{entry.college}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {entries.length > 5 && (
                <div className="p-2 bg-muted/50 text-center text-sm text-muted-foreground">
                  +{entries.length - 5} more entries
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View All ({entries.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => setAddEntryOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleClearData}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Data
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Full Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Rank & Percentile Data</DialogTitle>
            <DialogDescription>{entries.length} entries loaded</DialogDescription>
          </DialogHeader>
          <div className="overflow-auto max-h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Marks</TableHead>
                  <TableHead className="w-28">Percentile</TableHead>
                  <TableHead className="w-24">Rank</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.marks}</TableCell>
                    <TableCell>{entry.percentile.toFixed(2)}%</TableCell>
                    <TableCell>{entry.rank.toLocaleString()}</TableCell>
                    <TableCell>{entry.college}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Entry Dialog */}
      <Dialog open={addEntryOpen} onOpenChange={setAddEntryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Entry</DialogTitle>
            <DialogDescription>Manually add a rank/percentile mapping entry</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Marks</Label>
              <Input
                type="number"
                value={newEntry.marks}
                onChange={(e) => setNewEntry({ ...newEntry, marks: parseInt(e.target.value) })}
                placeholder="e.g., 280"
              />
            </div>
            <div>
              <Label>Percentile</Label>
              <Input
                type="number"
                step="0.01"
                value={newEntry.percentile}
                onChange={(e) => setNewEntry({ ...newEntry, percentile: parseFloat(e.target.value) })}
                placeholder="e.g., 99.90"
              />
            </div>
            <div>
              <Label>Rank</Label>
              <Input
                type="number"
                value={newEntry.rank}
                onChange={(e) => setNewEntry({ ...newEntry, rank: parseInt(e.target.value) })}
                placeholder="e.g., 1000"
              />
            </div>
            <div>
              <Label>College</Label>
              <Input
                value={newEntry.college}
                onChange={(e) => setNewEntry({ ...newEntry, college: e.target.value })}
                placeholder="e.g., IIT Madras - CS"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddEntryOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEntry}>Add Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RankPercentileConfig;
