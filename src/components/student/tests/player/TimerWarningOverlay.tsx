// Timer Warning Overlay Component
// Full-screen overlay for final countdown warnings

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTimeDisplay } from "@/data/student/testSession";

interface TimerWarningOverlayProps {
  remainingTime: number;
  isVisible: boolean;
  onDismiss?: () => void;
}

const TimerWarningOverlay = memo(function TimerWarningOverlay({
  remainingTime,
  isVisible,
  onDismiss,
}: TimerWarningOverlayProps) {
  // Show overlay only in last 30 seconds
  const showOverlay = isVisible && remainingTime <= 30 && remainingTime > 0;

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
        >
          {/* Pulsing border effect */}
          <motion.div
            animate={{
              boxShadow: [
                "inset 0 0 0 4px rgba(239, 68, 68, 0.3)",
                "inset 0 0 0 8px rgba(239, 68, 68, 0.5)",
                "inset 0 0 0 4px rgba(239, 68, 68, 0.3)",
              ],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0"
          />

          {/* Centered countdown */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-red-500/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex flex-col items-center gap-2 text-white">
              <motion.div
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <AlertTriangle className="w-10 h-10" />
              </motion.div>

              <span className="text-sm font-medium opacity-90">Time Remaining</span>

              <motion.span
                key={remainingTime}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-mono font-bold"
              >
                {remainingTime}
              </motion.span>

              <span className="text-xs opacity-75">seconds</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default TimerWarningOverlay;
