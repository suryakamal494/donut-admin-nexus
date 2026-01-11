// Matrix Match Renderer
// Row-to-column matching with mobile-friendly grid

import { memo, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MatrixRow {
  id: string;
  text: string;
}

interface MatrixColumn {
  id: string;
  text: string;
}

interface MatrixMatchRendererProps {
  rows: MatrixRow[];
  columns: MatrixColumn[];
  matches: Record<string, string>; // rowId -> columnId
  onChange: (rowId: string, columnId: string) => void;
  disabled?: boolean;
}

const MatrixMatchRenderer = memo(function MatrixMatchRenderer({
  rows,
  columns,
  matches,
  onChange,
  disabled = false,
}: MatrixMatchRendererProps) {
  const [activeRow, setActiveRow] = useState<string | null>(null);

  const handleMatch = (rowId: string, columnId: string) => {
    if (disabled) return;
    onChange(rowId, columnId);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Match items from Column I with Column II:
      </p>

      {/* Mobile Layout: Card-based matching */}
      <div className="space-y-3 sm:hidden">
        {rows.map((row, rowIndex) => {
          const matchedColumn = matches[row.id];
          const isActive = activeRow === row.id;

          return (
            <div key={row.id} className="space-y-2">
              {/* Row Item */}
              <button
                onClick={() => setActiveRow(isActive ? null : row.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left",
                  "transition-all duration-200",
                  isActive
                    ? "border-primary bg-primary/5"
                    : matchedColumn
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-border hover:border-primary/40"
                )}
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                  {rowIndex + 1}
                </span>
                <span className="flex-1 text-sm">{row.text}</span>
                {matchedColumn && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                    → {columns.find((c) => c.id === matchedColumn)?.text.slice(0, 10)}...
                  </span>
                )}
              </button>

              {/* Column Options (when active) */}
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pl-4 space-y-1.5"
                >
                  {columns.map((col, colIndex) => {
                    const isMatched = matches[row.id] === col.id;

                    return (
                      <button
                        key={col.id}
                        onClick={() => {
                          handleMatch(row.id, col.id);
                          setActiveRow(null);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 p-2.5 rounded-lg border text-left",
                          "transition-all duration-150 active:scale-98",
                          isMatched
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-white hover:border-primary/40"
                        )}
                      >
                        <span
                          className={cn(
                            "shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                            isMatched ? "bg-white/20" : "bg-muted"
                          )}
                        >
                          {String.fromCharCode(80 + colIndex)}
                        </span>
                        <span className="flex-1 text-xs">{col.text}</span>
                        {isMatched && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Layout: Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left font-semibold text-muted-foreground bg-muted/50 rounded-tl-lg">
                Column I
              </th>
              {columns.map((col, index) => (
                <th
                  key={col.id}
                  className={cn(
                    "p-3 text-center font-semibold text-muted-foreground bg-muted/50 min-w-[100px]",
                    index === columns.length - 1 && "rounded-tr-lg"
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs">
                      {String.fromCharCode(80 + index)}
                    </span>
                    <span className="text-xs leading-tight">{col.text}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id} className="border-t border-border">
                <td className="p-3 text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {rowIndex + 1}
                    </span>
                    <span>{row.text}</span>
                  </div>
                </td>
                {columns.map((col) => {
                  const isMatched = matches[row.id] === col.id;

                  return (
                    <td key={col.id} className="p-3 text-center">
                      <button
                        onClick={() => handleMatch(row.id, col.id)}
                        disabled={disabled}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 mx-auto",
                          "transition-all duration-150 hover:scale-110",
                          "focus:outline-none focus:ring-2 focus:ring-primary/50",
                          isMatched
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/30 hover:border-primary"
                        )}
                      >
                        {isMatched && (
                          <Check className="w-4 h-4 text-primary-foreground mx-auto" />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Match count */}
      {Object.keys(matches).length > 0 && (
        <p className="text-xs text-primary font-medium text-right">
          {Object.keys(matches).length} of {rows.length} matched
        </p>
      )}
    </div>
  );
});

export default MatrixMatchRenderer;
