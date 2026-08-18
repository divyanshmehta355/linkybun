"use client";

import { useRef } from "react";
import { addLink } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export function AddLinkForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await addLink(formData);
    formRef.current?.reset();
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm"
    >
      <div className="flex-1 flex flex-col gap-2">
        <Input 
          name="title" 
          placeholder="Title (e.g. My Website)" 
          required 
          className="border-none shadow-none focus-visible:ring-0 px-0 h-8 font-medium"
        />
        <Input 
          name="url" 
          type="url" 
          placeholder="URL (e.g. https://example.com)" 
          required
          className="border-none shadow-none focus-visible:ring-0 px-0 h-8 text-sm text-muted-foreground"
        />
      </div>
      <div className="flex items-center">
        <Button type="submit" size="icon" className="rounded-full w-12 h-12">
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Link</span>
        </Button>
      </div>
    </form>
  );
}
