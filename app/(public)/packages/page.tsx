"use client";

import { useGetPublicPackages, getGetPublicPackagesQueryKey } from "@/hooks/api";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

function formatJMD(amount: number) {
  return new Intl.NumberFormat("en-JM", { style: "currency", currency: "JMD", maximumFractionDigits: 0 }).format(amount);
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  "Birthday Party": "text-amber-400",
  "House Party": "text-amber-400",
  "Private Event": "text-amber-400",
  "Wedding Reception": "text-rose-400",
  "Engagement Party": "text-rose-400",
  "Corporate Launch": "text-sky-400",
  Conference: "text-sky-400",
  "Award Ceremony": "text-sky-400",
  "Concert / Stage Show": "text-primary",
  Festival: "text-primary",
  "Dancehall Event": "text-primary",
};

export default function PackagesPage() {
  const { data: packages, isLoading } = useGetPublicPackages({
    query: { queryKey: getGetPublicPackagesQueryKey() },
  });

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 left-[-10%] w-[600px] h-[500px] bg-primary/8 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-16 max-w-7xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-4">
          ◢ Event Packages
        </div>
        <h1 className="text-6xl md:text-8xl font-display leading-[0.9] mb-6">
          PICK YOUR<br />
          <span className="text-primary">PACKAGE.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
          Curated bundles designed for different event types. Starting prices shown — final quote depends on your
          venue, duration, and exact requirements.
        </p>
      </section>

      {/* Packages Grid */}
      <section className="container mx-auto px-4 pb-20 max-w-7xl">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-card border border-border rounded-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages?.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative flex flex-col p-8 border rounded-sm transition-all ${
                  pkg.highlight
                    ? "border-primary/60 bg-primary/5 ring-1 ring-primary/20"
                    : "border-border/60 bg-card/60 hover:border-border"
                }`}
                data-testid={`card-package-${pkg.id}`}
              >
                {pkg.highlight && (
                  <div className="absolute top-0 left-8 -translate-y-1/2">
                    <span className="bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="font-display text-2xl tracking-wide mb-2">{pkg.name.toUpperCase()}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{pkg.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {pkg.eventTypes.map((type) => (
                    <span
                      key={type}
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-current/30 bg-current/5 ${EVENT_TYPE_COLORS[type] ?? "text-muted-foreground"}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <div className="flex-1 space-y-2.5 mb-8">
                  {pkg.includes.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground leading-snug">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/40 pt-6 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Starting from</div>
                    <div className="font-display text-3xl text-primary">{formatJMD(pkg.startingFrom)}</div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">JMD · per event</div>
                  </div>
                  <Link href={`/?package=${pkg.id}`}>
                    <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-sm tracking-wide hover:bg-primary/90 transition-colors text-sm">
                      Book This <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Custom */}
      <section className="border-t border-border/40 bg-card/20">
        <div className="container mx-auto px-4 py-16 max-w-7xl text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-4">Custom Builds</div>
          <h2 className="text-4xl font-display tracking-wide mb-4">YOUR EVENT. YOUR SPEC.</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
            None of the packages above match your exact needs? Tell us what you're planning and we'll put together
            a custom quote within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/services">
              <button className="px-6 py-3 border border-border text-foreground font-bold rounded-sm hover:border-primary/60 hover:text-primary transition-colors tracking-wide">
                Browse Equipment Rates
              </button>
            </Link>
            <Link href="/">
              <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-sm tracking-wide hover:bg-primary/90 transition-colors">
                Request Custom Quote <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
