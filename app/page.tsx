import { MainLayout } from "@/components/layout/main-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 text-center py-24 md:py-32 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary mb-6">
          <Sparkles className="w-3 h-3 mr-2" />
          LinkyBun is now in Public Beta
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mb-6">
          One link to rule them all. <br className="hidden md:block" />
          <span className="text-primary">Beautifully simple.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          Create your personalized link-in-bio page in seconds. Share your latest content, track clicks, and grow your audience effortlessly.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button asChild size="lg" className="rounded-full px-8 text-base">
            <Link href="/auth/login">
              Claim your LinkyBun
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-base">
            <Link href="/sdivyansh">
              View Demo
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-muted/30 py-24 border-t">
        <div className="container mx-auto max-w-5xl px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Lightning Fast</h3>
              <p className="text-muted-foreground">Built on Next.js App Router for instant page loads and unparalleled performance.</p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Stunning Design</h3>
              <p className="text-muted-foreground">Minimalist, dark-mode ready themes that make your content pop.</p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Secure & Private</h3>
              <p className="text-muted-foreground">Enterprise-grade security powered by Supabase. You own your data.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
