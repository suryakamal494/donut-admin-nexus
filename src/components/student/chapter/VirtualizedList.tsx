// Virtualized List for Student Module - Efficient scrolling for large lists

import { useRef, useCallback, ReactNode } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getItemKey: (item: T) => string;
  estimatedItemHeight?: number;
  overscan?: number;
  className?: string;
  gap?: number;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  getItemKey,
  estimatedItemHeight = 100,
  overscan = 5,
  className,
  gap = 12,
  emptyMessage = "No items found",
  emptyIcon,
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => estimatedItemHeight + gap, [estimatedItemHeight, gap]),
    overscan,
  });

  if (items.length === 0) {
    return (
      <div className={cn(
        "bg-white/50 backdrop-blur-xl rounded-2xl border border-white/50",
        "p-6 text-center"
      )}>
        {emptyIcon}
        <p className="text-sm text-muted-foreground mt-2">{emptyMessage}</p>
      </div>
    );
  }

  // Only use virtualization for lists with more than 10 items
  // Smaller lists don't benefit from virtualization overhead
  if (items.length <= 10) {
    return (
      <div className={cn("space-y-3", className)}>
        {items.map((item, index) => (
          <div key={getItemKey(item)}>{renderItem(item, index)}</div>
        ))}
      </div>
    );
  }

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={cn("overflow-auto", className)}
      style={{ contain: "strict" }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
                paddingBottom: `${gap}px`,
              }}
            >
              {renderItem(item, virtualItem.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VirtualizedList;
