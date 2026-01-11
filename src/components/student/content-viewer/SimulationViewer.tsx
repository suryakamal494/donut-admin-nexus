// Simulation Viewer Component - Interactive simulation experience

import { useState } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Maximize,
  Info,
  Beaker
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { BundleContentItem } from "@/data/student/lessonBundles";

interface SimulationViewerProps {
  content: BundleContentItem;
  onComplete?: () => void;
}

export function SimulationViewer({ content, onComplete }: SimulationViewerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Simulation Area */}
      <div className="flex-1 relative flex items-center justify-center p-4">
        {/* Mock simulation canvas */}
        <div className="w-full max-w-2xl aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden relative">
          {/* Simulation placeholder */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={cn(
              "w-24 h-24 rounded-2xl flex items-center justify-center mb-4",
              "bg-gradient-to-br from-emerald-500/20 to-emerald-600/20",
              "border border-emerald-500/30"
            )}>
              <Beaker className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">
              {content.title}
            </h3>
            <p className="text-slate-400 text-sm text-center max-w-xs">
              {content.description || "Interactive simulation ready to run"}
            </p>

            {!isRunning && (
              <Button
                onClick={() => setIsRunning(true)}
                className="mt-6 bg-emerald-600 hover:bg-emerald-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Simulation
              </Button>
            )}
          </div>

          {/* Running state indicator */}
          {isRunning && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-xs font-medium">Running</span>
              </div>
            </div>
          )}

          {/* Animated elements when running */}
          {isRunning && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Mock animated particles */}
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: "0s" }} />
              <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-green-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-purple-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: "0.4s" }} />
              <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-amber-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: "0.6s" }} />
            </div>
          )}
        </div>

        {/* Info panel */}
        {showInfo && (
          <div className="absolute top-4 left-4 right-4 bg-slate-800/95 backdrop-blur-sm rounded-xl p-4 border border-slate-700 max-w-md">
            <h4 className="text-white font-semibold mb-2">About This Simulation</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              This interactive simulation helps you visualize and understand the concept.
              Adjust the speed slider to control the animation rate, and use the controls
              to play, pause, or reset the simulation.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(false)}
              className="mt-3 text-slate-400 hover:text-white"
            >
              Got it
            </Button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-slate-800 border-t border-slate-700 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Speed slider */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-slate-400 text-sm min-w-[60px]">Speed</span>
            <Slider
              value={[speed]}
              onValueChange={(v) => setSpeed(v[0])}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-white text-sm min-w-[40px] text-right">{speed}%</span>
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowInfo(!showInfo)}
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Info className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setIsRunning(false);
              }}
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => setIsRunning(!isRunning)}
              className={cn(
                "min-w-[120px]",
                isRunning 
                  ? "bg-amber-600 hover:bg-amber-700" 
                  : "bg-emerald-600 hover:bg-emerald-700"
              )}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Settings className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimulationViewer;
