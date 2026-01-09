import React, { useRef, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface VirtualTableColumn<T> {
  key: string;
  header: string;
  width?: string;
  className?: string;
  headerClassName?: string;
  render: (item: T, index: number) => React.ReactNode;
}

interface VirtualizedTableProps<T> {
  data: T[];
  columns: VirtualTableColumn<T>[];
  rowHeight?: number;
  maxHeight?: number;
  getRowKey: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function VirtualizedTable<T>({
  data,
  columns,
  rowHeight = 52,
  maxHeight = 600,
  getRowKey,
  onRowClick,
  emptyMessage = "No data available",
  className,
}: VirtualizedTableProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => rowHeight, [rowHeight]),
    overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border/50", className)}>
      {/* Fixed header */}
      <div className="overflow-x-auto">
        <Table className="min-w-[500px]">
          <TableHeader>
            <TableRow className="bg-muted/30">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn("text-xs sm:text-sm", col.headerClassName)}
                  style={{ width: col.width }}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      {/* Virtualized body */}
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        <div className="overflow-x-auto">
          <Table className="min-w-[500px]">
            <TableBody>
              {/* Spacer for virtualized positioning */}
              <tr style={{ height: `${virtualItems[0]?.start ?? 0}px` }} />
              
              {virtualItems.map((virtualRow) => {
                const item = data[virtualRow.index];
                return (
                  <TableRow
                    key={getRowKey(item)}
                    className={cn(
                      "hover:bg-muted/20",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick?.(item)}
                    style={{ height: `${rowHeight}px` }}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={col.className}
                        style={{ width: col.width }}
                      >
                        {col.render(item, virtualRow.index)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              
              {/* Bottom spacer */}
              <tr
                style={{
                  height: `${virtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end ?? 0)}px`,
                }}
              />
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Row count indicator */}
      <div className="px-4 py-2 bg-muted/20 border-t border-border/50 text-xs text-muted-foreground">
        Showing {data.length} {data.length === 1 ? "row" : "rows"}
      </div>
    </div>
  );
}