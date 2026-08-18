"use client";

import { logClick } from "@/app/[username]/actions";

export function PublicLinkItem({ link }: { link: any }) {
  const handleClick = () => {
    // Fire and forget, don't await so it doesn't block navigation
    logClick(link.id, document.referrer).catch(() => {});
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block w-full p-4 mb-4 text-center font-medium border rounded-xl hover:bg-muted transition-colors shadow-sm bg-card text-card-foreground"
    >
      {link.title}
    </a>
  );
}
