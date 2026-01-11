// PDF Viewer Component - Document reading experience

import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut,
  Download,
  Bookmark,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { BundleContentItem } from "@/data/student/lessonBundles";

interface PDFViewerProps {
  content: BundleContentItem;
  onComplete?: () => void;
}

export function PDFViewer({ content, onComplete }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const totalPages = content.pageCount || 1;

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Mark as complete when reaching last page
      if (currentPage + 1 === totalPages && onComplete) {
        onComplete();
      }
    }
  };

  const zoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };

  const zoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[80px] text-center">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomOut}
            disabled={zoom <= 50}
            className="h-8 w-8"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[50px] text-center">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomIn}
            disabled={zoom >= 200}
            className="h-8 w-8"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PDF Content Area */}
      <div className="flex-1 overflow-auto p-4">
        <div 
          className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-200"
          style={{ 
            width: `${Math.min(zoom, 100)}%`,
            maxWidth: "800px",
            transform: zoom > 100 ? `scale(${zoom / 100})` : undefined,
            transformOrigin: "top center"
          }}
        >
          {/* Mock PDF Page */}
          <div className="aspect-[8.5/11] bg-white p-8 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="font-bold text-lg text-foreground">{content.title}</h2>
                <p className="text-sm text-muted-foreground">Page {currentPage}</p>
              </div>
            </div>

            {/* Mock content lines */}
            <div className="space-y-3 flex-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-3 bg-slate-100 rounded",
                    i % 4 === 0 ? "w-3/4" : "w-full",
                    i === 5 && "h-32 bg-slate-50 border border-slate-200" // Image placeholder
                  )}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 mt-auto border-t border-slate-100 text-xs text-muted-foreground">
              <span>{content.title}</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-friendly page nav at bottom */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 bg-white border-t border-slate-200 lg:hidden">
        <Button
          variant="outline"
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="flex-1 max-w-[150px]"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="flex-1 max-w-[150px]"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export default PDFViewer;
