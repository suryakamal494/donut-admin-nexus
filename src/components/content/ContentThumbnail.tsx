import { Play } from "lucide-react";
import { ContentTypeIcon, ContentType } from "./ContentTypeIcon";
import { cn } from "@/lib/utils";

interface ContentThumbnailProps {
  type: ContentType;
  thumbnailUrl?: string;
  title: string;
  className?: string;
  showPlayOverlay?: boolean;
}

export const ContentThumbnail = ({ 
  type, 
  thumbnailUrl, 
  title, 
  className,
  showPlayOverlay = true 
}: ContentThumbnailProps) => {
  const isPlayable = type === "video" || type === "animation" || type === "audio";

  return (
    <div className={cn(
      "relative w-full h-32 sm:h-40 bg-muted/50 flex items-center justify-center overflow-hidden group rounded-t-xl",
      className
    )}>
      {thumbnailUrl ? (
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <ContentTypeIcon type={type} size="lg" className="opacity-50" />
      )}
      
      {/* Type badge */}
      <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-background/80 backdrop-blur-sm text-[10px] sm:text-xs font-medium flex items-center gap-1 sm:gap-1.5">
        <ContentTypeIcon type={type} size="sm" />
        <span className="capitalize">{type}</span>
      </div>

      {/* Play overlay for video/animation/audio */}
      {isPlayable && showPlayOverlay && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play className="w-4 h-4 sm:w-6 sm:h-6 text-primary ml-0.5 sm:ml-1" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  );
};
