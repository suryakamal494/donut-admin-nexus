import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "success" | "error";

const UploadPDF = () => {
  const navigate = useNavigate();
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }
    
    setFileName(file.name);
    setUploadState("uploading");

    // Simulate upload process
    setTimeout(() => {
      setUploadState("success");
    }, 2000);
  };

  const handleGoToReview = () => {
    navigate("/superadmin/questions/review");
  };

  if (uploadState === "success") {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="PDF to Questions"
          breadcrumbs={[
            { label: "Dashboard", href: "/superadmin/dashboard" },
            { label: "Question Bank", href: "/superadmin/questions" },
            { label: "Upload PDF" },
          ]}
        />

        <div className="bg-card rounded-2xl p-12 shadow-soft border border-border/50 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3">PDF Uploaded Successfully!</h2>
          
          <p className="text-muted-foreground mb-2">
            <span className="font-medium text-foreground">{fileName}</span> has been uploaded.
          </p>
          
          <div className="bg-primary/5 rounded-xl p-6 mt-6 mb-8 border border-primary/10">
            <p className="text-lg font-medium text-foreground mb-2">Sit back & relax</p>
            <p className="text-muted-foreground">
              We are processing your document. Questions, answers, solutions, subjects, and chapters will be detected automatically.
            </p>
            <p className="text-sm text-primary mt-3">
              You will be notified once questions are ready for review.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Link to="/superadmin/questions">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Question Bank
              </Button>
            </Link>
            <Button onClick={handleGoToReview} className="gradient-button gap-2">
              Go to Review
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="PDF to Questions"
        description="Upload exam papers or question PDFs to automatically extract questions."
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Question Bank", href: "/superadmin/questions" },
          { label: "Upload PDF" },
        ]}
        actions={
          <Link to="/superadmin/questions">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        }
      />

      <div className="max-w-2xl mx-auto">
        {/* Upload Area */}
        <div
          className={cn(
            "bg-card rounded-2xl p-8 shadow-soft border-2 border-dashed transition-all duration-300",
            dragActive 
              ? "border-primary bg-primary/5" 
              : "border-border/50 hover:border-primary/50",
            uploadState === "uploading" && "pointer-events-none opacity-70"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors",
              dragActive ? "bg-primary/20" : "bg-muted"
            )}>
              {uploadState === "uploading" ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <Upload className={cn(
                  "w-8 h-8 transition-colors",
                  dragActive ? "text-primary" : "text-muted-foreground"
                )} />
              )}
            </div>

            {uploadState === "uploading" ? (
              <>
                <h3 className="text-xl font-semibold mb-2">Uploading...</h3>
                <p className="text-muted-foreground">{fileName}</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2">
                  {dragActive ? "Drop your PDF here" : "Drag & Drop PDF"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  or click to browse files
                </p>
                
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload">
                  <Button variant="outline" className="gap-2 cursor-pointer" asChild>
                    <span>
                      <FileText className="w-4 h-4" />
                      Browse Files
                    </span>
                  </Button>
                </label>
              </>
            )}
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-sm text-muted-foreground text-center mt-4">
          Supported: Competitive exam papers, previous year papers, or any question PDF.
        </p>

        {/* Important Note */}
        <div className="bg-primary/5 rounded-xl p-5 mt-6 border border-primary/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">How this works</p>
              <p className="text-sm text-muted-foreground">
                Just upload the PDF. Questions, answers, solutions, subjects, and chapters will be detected automatically.
              </p>
              <p className="text-sm text-primary mt-2">
                You will be notified once the questions are ready for review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPDF;