"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/services", label: "Services & Rates" },
  { href: "/packages", label: "Packages" },
  { href: "/availability", label: "Availability" },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
  const location = usePathname();

  return (
    <div className="light min-h-[100dvh] bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <span className="font-display text-2xl tracking-wide text-primary">BOPHERZ</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${
                    location === href
                      ? "text-foreground bg-muted/60"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/">
            <button className="hidden sm:inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-4 py-2 rounded-sm text-sm tracking-wide hover:bg-primary/90 transition-colors">
              Request Booking <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>

          {/* Mobile nav */}
          <nav className="flex md:hidden items-center gap-3 text-sm">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="text-muted-foreground hover:text-foreground transition-colors">
                {label.split(" ")[0]}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/40 bg-card/20">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-12">
            <div>
              <div className="font-display text-2xl text-primary tracking-wide mb-3">BOPHERZ</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional audio rental and DJ services for weddings, corporate events, concerts, and private
                celebrations across Jamaica.
              </p>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Quick Links</div>
              <div className="space-y-2">
                {[
                  { href: "/", label: "Request a Booking" },
                  { href: "/services", label: "Services & Rates" },
                  { href: "/packages", label: "Event Packages" },
                  { href: "/availability", label: "Check Availability" },
                ].map(({ href, label }) => (
                  <div key={href}>
                    <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Contact</div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Kingston, Jamaica</p>
                <p>Available island-wide</p>
                <p className="pt-2 font-mono text-xs text-primary">BPH-YYYY-XXXX</p>
                <p className="text-xs">Use your booking reference to track your request</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border/40 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Bopherz Entertainment. All rights reserved.
            </p>
            <div className="flex items-center gap-1">
              <Link href="/admin/login" className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
