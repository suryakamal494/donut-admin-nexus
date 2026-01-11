// Integer/Numerical Answer Renderer
// Number input with range validation

import { memo, useState, useCallback } from "react";
import { Hash, Delete } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface IntegerRendererProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  minValue?: number;
  maxValue?: number;
  disabled?: boolean;
}

const IntegerRenderer = memo(function IntegerRenderer({
  value,
  onChange,
  minValue = -999,
  maxValue = 999,
  disabled = false,
}: IntegerRendererProps) {
  const [inputValue, setInputValue] = useState(value?.toString() || "");
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = useCallback(
    (newValue: string) => {
      // Allow negative sign and numbers only
      const sanitized = newValue.replace(/[^0-9-]/g, "");
      
      // Ensure negative sign is only at the start
      const cleanValue = sanitized.replace(/(?!^)-/g, "");
      
      setInputValue(cleanValue);

      if (cleanValue === "" || cleanValue === "-") {
        onChange(undefined);
      } else {
        const num = parseInt(cleanValue, 10);
        if (!isNaN(num)) {
          onChange(num);
        }
      }
    },
    [onChange]
  );

  // Numpad for mobile
  const numpadKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "0", "⌫"];

  const handleNumpadClick = (key: string) => {
    if (disabled) return;

    if (key === "⌫") {
      handleInputChange(inputValue.slice(0, -1));
    } else {
      handleInputChange(inputValue + key);
    }
  };

  const handleClear = () => {
    setInputValue("");
    onChange(undefined);
  };

  return (
    <div className="space-y-4">
      {/* Input Display */}
      <div
        className={cn(
          "relative flex items-center gap-2 px-4 py-3 rounded-xl border-2",
          "transition-all duration-200",
          isFocused ? "border-primary bg-primary/5" : "border-border bg-white",
          disabled && "opacity-60"
        )}
      >
        <Hash className="w-5 h-5 text-muted-foreground shrink-0" />
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter answer"
          disabled={disabled}
          className={cn(
            "flex-1 bg-transparent text-xl font-mono font-bold",
            "focus:outline-none placeholder:text-muted-foreground/50",
            "text-foreground"
          )}
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleClear}
            disabled={disabled}
          >
            <Delete className="w-4 h-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      {/* Range hint */}
      <p className="text-xs text-muted-foreground text-center">
        Enter a value between {minValue} and {maxValue}
      </p>

      {/* Mobile Numpad */}
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto sm:hidden">
        {numpadKeys.map((key) => (
          <button
            key={key}
            onClick={() => handleNumpadClick(key)}
            disabled={disabled}
            className={cn(
              "h-12 rounded-xl font-bold text-lg",
              "transition-all duration-150 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              key === "⌫"
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : key === "-"
                ? "bg-muted text-muted-foreground hover:bg-muted/80"
                : "bg-muted text-foreground hover:bg-muted/80",
              disabled && "opacity-60 cursor-not-allowed"
            )}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
});

export default IntegerRenderer;
