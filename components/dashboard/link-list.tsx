"use client";

import { useState, useEffect } from "react";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { LinkItem } from "./link-item";
import { reorderLinks } from "@/app/dashboard/actions";

export function LinkList({ initialLinks }: { initialLinks: any[] }) {
  const [links, setLinks] = useState(initialLinks);

  // Sync state if initialLinks prop changes (e.g. from server action revalidation)
  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      let newLinks = [];
      setLinks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        newLinks = arrayMove(items, oldIndex, newIndex);
        return newLinks;
      });

      if (newLinks.length > 0) {
        // Calculate new positions and call server action
        const updates = newLinks.map((link, index) => ({
          id: link.id,
          position: index,
        }));
        await reorderLinks(updates);
      }
    }
  };

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-xl bg-muted/50">
        <p className="text-muted-foreground">You don't have any links yet.</p>
        <p className="text-sm text-muted-foreground">Add one using the form above.</p>
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext 
        items={links.map(l => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <LinkItem key={link.id} link={link} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
