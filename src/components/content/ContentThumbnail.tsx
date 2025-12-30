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
      "relative w-full h-40 bg-muted/50 flex items-center justify-center overflow-hidden group rounded-t-xl",
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
      <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium flex items-center gap-1.5">
        <ContentTypeIcon type={type} size="sm" />
        <span className="capitalize">{type}</span>
      </div>

      {/* Play overlay for video/animation/audio */}
      {isPlayable && showPlayOverlay && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  );
};
