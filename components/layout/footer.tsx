import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Layers } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 mx-auto max-w-6xl px-4 md:px-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-3 md:px-0">
          <Layers className="size-5 text-muted-foreground" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ for creators. © 2026 LinkyBun.
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
          <div className="pl-4 border-l">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
