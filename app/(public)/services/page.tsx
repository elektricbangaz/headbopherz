"use client";

import { useGetPublicEquipment, getGetPublicEquipmentQueryKey } from "@/hooks/api";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Clock, Headphones } from "lucide-react";

const CATEGORIES = ["Speakers", "Subwoofers", "Mixers", "CDJ Players", "DJ Systems", "Microphones", "Lighting"];

const CATEGORY_ICONS: Record<string, string> = {
  Speakers: "◈",
  Subwoofers: "◉",
  Mixers: "◫",
  "CDJ Players": "◎",
  "DJ Systems": "◐",
  Microphones: "◌",
  Lighting: "◆",
};

function formatJMD(amount: number) {
  return new Intl.NumberFormat("en-JM", { style: "currency", currency: "JMD", maximumFractionDigits: 0 }).format(amount);
}

const WHY_US = [
  { icon: Zap, title: "Pro-Grade Gear", body: "Every piece of kit is maintained to touring standard. QSC, Pioneer, Shure — only the names that matter." },
  { icon: Shield, title: "Fully Insured", body: "All equipment is comprehensively insured. No surprises, no hidden liability for you." },
  { icon: Clock, title: "On-Time, Every Time", body: "We build extra buffer into every job. Setup is done before your first guest arrives." },
  { icon: Headphones, title: "Technician Included", body: "Most packages include a dedicated sound tech on-site for the duration of your event." },
];

export default function ServicesPage() {
  const { data: equipment, isLoading } = useGetPublicEquipment({
    query: { queryKey: getGetPublicEquipmentQueryKey() },
  });

  const grouped = CATEGORIES.reduce<Record<string, typeof equipment>>((acc, cat) => {
    acc[cat] = equipment?.filter((e) => e.category === cat) ?? [];
    return acc;
  }, {});

  const otherCats = [...new Set(equipment?.map((e) => e.category) ?? [])].filter(
    (c) => !CATEGORIES.includes(c),
  );

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[700px] h-[400px] bg-primary/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-16 max-w-7xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-4">
          ◢ Equipment & Services
        </div>
        <h1 className="text-6xl md:text-8xl font-display leading-[0.9] mb-6">
          THE GEAR.<br />
          <span className="text-primary">THE RATES.</span><br />
          THE TRUTH.
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
          No mystery pricing. Every item listed here is available for daily rental. Rates are in Jamaican dollars
          and cover a standard event window — setup to breakdown.
        </p>
        <Link href="/">
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-sm tracking-wide hover:bg-primary/90 transition-colors" data-testid="link-request-booking">
            Request a Quote <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </section>

      {/* Why Us */}
      <section className="border-t border-border/40 bg-card/30">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map(({ icon: Icon, title, body }) => (
              <div key={title} className="p-6 border border-border/40 rounded-sm bg-card/50">
                <Icon className="w-5 h-5 text-primary mb-4" />
                <div className="font-display tracking-wide text-lg mb-2">{title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Catalog */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-2">Daily Rental Rates</div>
            <h2 className="text-4xl font-display tracking-wide">EQUIPMENT CATALOG</h2>
          </div>
          <p className="text-sm text-muted-foreground hidden md:block">All rates in JMD · per event day</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-36 bg-card border border-border rounded-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {[...CATEGORIES, ...otherCats].map((cat) => {
              const items = grouped[cat] ?? equipment?.filter((e) => e.category === cat) ?? [];
              if (!items.length) return null;
              return (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-primary font-mono text-lg">{CATEGORY_ICONS[cat] ?? "◇"}</span>
                    <h3 className="font-display tracking-wide text-xl">{cat.toUpperCase()}</h3>
                    <div className="flex-1 h-px bg-border/40 ml-2" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="relative p-5 border border-border/60 bg-card/60 rounded-sm hover:border-primary/40 hover:bg-card transition-all group"
                        data-testid={`card-equipment-${item.id}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="font-medium text-foreground leading-tight">{item.name}</div>
                          <span className={`shrink-0 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ring-1 ${
                            item.status === "available"
                              ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                          }`}>
                            {item.status === "available" ? `${item.availableQuantity} avail` : item.status}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{item.description}</p>
                        )}
                        <div className="font-display text-2xl text-primary tracking-tight">
                          {item.dailyRate > 0 ? formatJMD(item.dailyRate) : "POA"}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">per event day</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-primary/5">
        <div className="container mx-auto px-4 py-16 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-display tracking-wide mb-2">NEED SOMETHING CUSTOM?</h2>
            <p className="text-muted-foreground">
              Don't see exactly what you need? We build custom rigs for any event size. Just tell us the details.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/packages">
              <button className="px-6 py-3 border border-border text-foreground font-bold rounded-sm hover:border-primary/60 hover:text-primary transition-colors tracking-wide">
                View Packages
              </button>
            </Link>
            <Link href="/">
              <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-sm tracking-wide hover:bg-primary/90 transition-colors">
                Request Quote <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
