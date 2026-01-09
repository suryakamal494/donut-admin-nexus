import { useState, useEffect, ReactNode } from "react";

interface DelayedFallbackProps {
  children: ReactNode;
  delay?: number;
}

/**
 * Shows fallback content only after a delay.
 * This prevents skeleton "flash" for fast-loading pages.
 */
export function DelayedFallback({ children, delay = 150 }: DelayedFallbackProps) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!showFallback) {
    return null;
  }

  return <>{children}</>;
}
