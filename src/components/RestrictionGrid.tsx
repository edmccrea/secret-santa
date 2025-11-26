import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RestrictionGridProps {
  participants: string[];
  restrictions: { giver: string; restricted: string }[];
  onToggleRestriction: (giver: string, restricted: string) => void;
}

export const RestrictionGrid: React.FC<RestrictionGridProps> = ({
  participants,
  restrictions,
  onToggleRestriction,
}) => {
  const isRestricted = (giver: string, restricted: string) => {
    return restrictions.some(
      (r) => r.giver === giver && r.restricted === restricted
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        <div className="grid" style={{ gridTemplateColumns: `auto repeat(${participants.length}, minmax(40px, 1fr))` }}>
          {/* Header Row */}
          <div className="p-2 font-medium text-sm text-muted-foreground self-end">Giver \ Receiver</div>
          {participants.map((p, i) => (
            <div key={`header-${i}`} className="h-16 flex items-end justify-center pb-2">
              <span className="rotate-[-45deg] origin-bottom-left translate-x-3 text-sm font-medium whitespace-nowrap">
                {p}
              </span>
            </div>
          ))}

          {/* Rows */}
          {participants.map((giver, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {/* Row Header */}
              <div className="p-2 font-medium text-sm truncate max-w-[120px]" title={giver}>
                {giver}
              </div>
              
              {/* Cells */}
              {participants.map((receiver, colIndex) => {
                const isSelf = rowIndex === colIndex;
                const restricted = isRestricted(giver, receiver);

                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={cn(
                      "border border-muted/50 flex items-center justify-center h-10 w-full transition-colors",
                      isSelf ? "bg-neutral-200 dark:bg-neutral-800 cursor-not-allowed" : "cursor-pointer hover:bg-muted/30",
                      restricted && !isSelf && "bg-destructive/10"
                    )}
                    onClick={() => !isSelf && onToggleRestriction(giver, receiver)}
                  >
                    {isSelf ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                    ) : restricted ? (
                      <X className="h-4 w-4 text-destructive" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-muted-foreground/20" />
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Click a cell to toggle restrictions. Rows are Givers, Columns are Receivers.
      </p>
    </div>
  );
};
