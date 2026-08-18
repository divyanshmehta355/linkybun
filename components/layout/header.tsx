import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react";
import { Layers } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto max-w-6xl px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:bg-primary/90 transition-colors">
            <Layers className="size-5" />
          </div>
          <span className="hidden font-bold sm:inline-block tracking-tight text-lg">LinkyBun</span>
        </Link>
        <div className="flex items-center gap-4">
          <Suspense fallback={<div className="h-9 w-20 bg-muted animate-pulse rounded-md" />}>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
