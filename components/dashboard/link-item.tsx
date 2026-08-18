"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { updateLink, deleteLink } from "@/app/dashboard/actions";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function LinkItem({ link }: { link: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const handleUpdate = (field: string, value: any) => {
    updateLink(link.id, { [field]: value });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm ${
        isDragging ? "opacity-50 ring-2 ring-primary" : ""
      }`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <Input
          defaultValue={link.title}
          onBlur={(e) => {
            if (e.target.value !== link.title) handleUpdate("title", e.target.value);
          }}
          className="border-none shadow-none focus-visible:ring-0 px-0 h-8 font-medium"
        />
        <Input
          defaultValue={link.url}
          type="url"
          onBlur={(e) => {
            if (e.target.value !== link.url) handleUpdate("url", e.target.value);
          }}
          className="border-none shadow-none focus-visible:ring-0 px-0 h-8 text-sm text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={`active-${link.id}`} 
            checked={link.active}
            onCheckedChange={(checked) => handleUpdate("active", checked)}
          />
          <label 
            htmlFor={`active-${link.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only md:not-sr-only"
          >
            Active
          </label>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteLink(link.id)}
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
}
