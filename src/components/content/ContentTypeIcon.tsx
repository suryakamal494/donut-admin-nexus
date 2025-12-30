import { Video, FileText, Presentation, AppWindow, Play, Image, Headphones, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export type ContentType = "video" | "pdf" | "ppt" | "iframe" | "animation" | "image" | "audio" | "scorm";

interface ContentTypeIconProps {
  type: ContentType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const typeConfig: Record<ContentType, { icon: React.ElementType; label: string; color: string }> = {
  video: { icon: Video, label: "Video", color: "text-red-500" },
  pdf: { icon: FileText, label: "PDF", color: "text-orange-500" },
  ppt: { icon: Presentation, label: "PPT", color: "text-amber-500" },
  iframe: { icon: AppWindow, label: "Interactive", color: "text-blue-500" },
  animation: { icon: Play, label: "Animation", color: "text-purple-500" },
  image: { icon: Image, label: "Image", color: "text-green-500" },
  audio: { icon: Headphones, label: "Audio", color: "text-pink-500" },
  scorm: { icon: Package, label: "SCORM", color: "text-teal-500" },
};

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-10 h-10",
};

export const ContentTypeIcon = ({ type, size = "md", className }: ContentTypeIconProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;
  
  return (
    <Icon className={cn(sizeClasses[size], config.color, className)} />
  );
};

export const getContentTypeLabel = (type: ContentType): string => {
  return typeConfig[type]?.label || type;
};

export const getContentTypeColor = (type: ContentType): string => {
  return typeConfig[type]?.color || "text-muted-foreground";
};
