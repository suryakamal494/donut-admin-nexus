/**
 * Content Renderer for Presentation Mode
 * Renders different block types: video, animation, PDF, presentation, etc.
 */

import { BookOpen, Play, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonPlanBlock } from "../types";
import { QuizContent } from "./QuizContent";
import { getEmbedUrl, getPdfViewerUrl, themeClasses } from "./types";
import type { PresentationTheme } from "./types";

interface ContentRendererProps {
  block: LessonPlanBlock;
  theme: PresentationTheme;
}

export const ContentRenderer = ({ block, theme }: ContentRendererProps) => {
  const tc = themeClasses[theme];

  // Quiz content
  if (block.type === 'quiz' && block.questions && block.questions.length > 0) {
    return <QuizContent block={block} theme={theme} />;
  }

  const contentUrl = block.attachmentUrl || block.embedUrl;
  
  if (contentUrl) {
    let url = getEmbedUrl(contentUrl);
    
    // Video content
    if (block.sourceType === 'video' || 
        url.includes('youtube') || 
        url.includes('youtu.be') || 
        url.includes('vimeo')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-6">
          <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={url}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={block.title}
            />
          </div>
        </div>
      );
    }

    // Animation/Simulation
    if (block.sourceType === 'animation' || 
        url.includes('phet') || 
        url.includes('desmos') ||
        url.includes('geogebra')) {
      return (
        <div className="w-full h-full p-6">
          <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={url}
              className="w-full h-full"
              allowFullScreen
              title={block.title}
            />
          </div>
        </div>
      );
    }

    // PDF/Document - Use Google Docs Viewer for external PDFs
    if (block.sourceType === 'pdf' || block.sourceType === 'document' || url.endsWith('.pdf')) {
      const pdfUrl = getPdfViewerUrl(url);
      return (
        <div className="w-full h-full p-6">
          <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title={block.title}
            />
          </div>
        </div>
      );
    }

    // Presentation (Google Slides)
    if (block.sourceType === 'ppt' ||
        block.sourceType === 'presentation' || 
        url.includes('docs.google.com') ||
        url.includes('slides.google.com')) {
      let embedUrl = url;
      if (!url.includes('/pub?') && !url.includes('/embed')) {
        embedUrl = url.replace('/edit', '/embed').replace('/view', '/embed');
        if (!embedUrl.includes('/embed')) {
          embedUrl = embedUrl + '/embed';
        }
      }
      return (
        <div className="w-full h-full p-6">
          <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              title={block.title}
            />
          </div>
        </div>
      );
    }

    // Generic iframe fallback
    return (
      <div className="w-full h-full p-6">
        <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            src={url}
            className="w-full h-full"
            allowFullScreen
            title={block.title}
          />
        </div>
      </div>
    );
  }

  // Homework / Text content fallback
  return (
    <div className="flex flex-col items-center justify-center h-full p-12 text-center">
      <div className="max-w-3xl">
        {block.type === 'homework' && (
          <ClipboardList className={cn("w-20 h-20 mx-auto mb-6", tc.textMuted)} />
        )}
        {block.type === 'explain' && !contentUrl && (
          <BookOpen className={cn("w-20 h-20 mx-auto mb-6", tc.textMuted)} />
        )}
        {block.type === 'demonstrate' && !contentUrl && (
          <Play className={cn("w-20 h-20 mx-auto mb-6", tc.textMuted)} />
        )}
        <h2 className={cn("text-3xl font-bold mb-6", tc.text)}>{block.title}</h2>
        {block.content && (
          <p className={cn("text-xl leading-relaxed whitespace-pre-wrap", tc.textMuted)}>
            {block.content}
          </p>
        )}
      </div>
    </div>
  );
};
