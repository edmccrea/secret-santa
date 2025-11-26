import React from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ParticipantItemProps {
  id: string;
  name: string;
  restrictions: string[];
  onRemoveRestriction: (restrictedName: string) => void;
  onRemoveParticipant: () => void;
}

export const ParticipantItem: React.FC<ParticipantItemProps> = ({
  id,
  name,
  restrictions,
  onRemoveRestriction,
  onRemoveParticipant,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: id,
    data: { name },
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: id,
    data: { name },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setDroppableRef}
      className={cn(
        "relative p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-colors",
        isOver && "bg-accent border-primary ring-2 ring-primary/20",
        isDragging && "opacity-50",
      )}
    >
      <div
        ref={setDraggableRef}
        style={style}
        className="flex items-center gap-3"
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{name || "Unnamed"}</div>
          
          {restrictions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-xs text-muted-foreground mr-1">Cannot gift:</span>
              {restrictions.map((restricted) => (
                <Badge
                  key={restricted}
                  variant="secondary"
                  className="h-5 px-1.5 text-[10px] gap-1 hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer group"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation(); // Prevent drag start
                    onRemoveRestriction(restricted);
                  }}
                >
                  {restricted}
                  <X className="h-2.5 w-2.5 opacity-50 group-hover:opacity-100" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onRemoveParticipant}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
