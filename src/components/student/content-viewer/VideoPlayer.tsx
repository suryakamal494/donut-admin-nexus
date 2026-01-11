// Video Player Component - Full-screen video viewing experience

import { useState } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { BundleContentItem } from "@/data/student/lessonBundles";

interface VideoPlayerProps {
  content: BundleContentItem;
  onComplete?: () => void;
}

export function VideoPlayer({ content, onComplete }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(35); // Mock progress
  const [showControls, setShowControls] = useState(true);

  // Parse duration string to seconds for display
  const durationParts = content.duration?.split(":") || ["0", "0"];
  const totalSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
  const currentSeconds = Math.floor((progress / 100) * totalSeconds);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div 
      className="relative w-full h-full bg-black flex flex-col"
      onClick={() => setShowControls(!showControls)}
    >
      {/* Video Area (Mock) */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Placeholder for actual video */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 mx-auto">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
            <p className="text-white/60 text-sm">Video Player</p>
            <p className="text-white font-medium mt-1">{content.title}</p>
          </div>
        </div>

        {/* Large play/pause overlay */}
        {!isPlaying && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(true);
            }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* Controls overlay */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent",
          "p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="mb-3">
          <Slider
            value={[progress]}
            onValueChange={(v) => setProgress(v[0])}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/70 mt-1">
            <span>{formatTime(currentSeconds)}</span>
            <span>{content.duration}</span>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>

            {/* Skip buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="w-5 h-5" />
            </Button>

            {/* Volume */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Settings className="w-5 h-5" />
            </Button>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
