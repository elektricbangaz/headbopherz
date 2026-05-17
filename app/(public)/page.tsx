"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateBooking } from "@/hooks/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Music2, Mic2, Volume2, Disc3, Lightbulb, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bookingSchema = z.object({
  clientName: z.string().min(2, "Name is required"),
  clientCompany: z.string().optional(),
  clientEmail: z.string().email("Valid email is required"),
  clientPhone: z.string().min(7, "Phone number is required"),
  eventType: z.string().min(2, "Event type is required"),
  eventDate: z.string().min(10, "Event date is required"),
  venue: z.string().min(2, "Venue is required"),
  guestCount: z.coerce.number().min(1, "Guest count must be at least 1"),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const EVENT_TYPES = [
  "Wedding Reception",
  "Engagement Party",
  "Corporate Launch",
  "Conference / Seminar",
  "Concert / Stage Show",
  "Birthday Party",
  "House Party",
  "Dancehall Event",
  "Festival",
  "Award Ceremony",
  "Other",
];

const SERVICES = [
  { icon: Volume2, title: "Speaker Systems", desc: "QSC K12.2 and EAW SBX220 systems scaled for any venue — intimate lounges to 5,000-capacity stages." },
  { icon: Disc3, title: "DJ Equipment", desc: "Pioneer CDJ-3000 players, DJM-900NXS2 mixers, and XDJ-RX3 all-in-one systems for seamless sets." },
  { icon: Mic2, title: "Wireless Microphones", desc: "Shure SLX-D digital wireless systems. Crisp, interference-free audio for speeches and performances." },
  { icon: Lightbulb, title: "Stage Lighting", desc: "Chauvet moving heads and LED rigs to give your event the look it deserves." },
  { icon: Music2, title: "DJ Services", desc: "Professional DJs available for every genre — from dancehall and reggae to wedding classics and corporate sets." },
  { icon: ShieldCheck, title: "Full-Service Tech", desc: "Our engineers handle setup, operation, and breakdown so you can focus on your event." },
];

const STATS = [
  { value: "200+", label: "Events Completed" },
  { value: "5,000", label: "Max Capacity" },
  { value: "8+", label: "Years Experience" },
  { value: "24hr", label: "Response Time" },
];

export default function Home() {
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const createBooking = useCreateBooking();
  const { toast } = useToast();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      clientName: "",
      clientCompany: "",
      clientEmail: "",
      clientPhone: "",
      eventType: "",
      eventDate: "",
      venue: "",
      guestCount: 0,
      notes: "",
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    createBooking.mutate({ data }, {
      onSuccess: (res) => {
        setSuccessRef(res.bookingRef);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      onError: () => {
        toast({
          title: "Error submitting request",
          description: "Please try again later.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* ── HERO + BOOKING FORM ── */}
      <section className="container mx-auto px-4 py-16 md:py-24 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="max-w-xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-6">
              ◢ Audio Rental + DJ Services / Kingston, Jamaica
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-[108px] leading-[0.9] font-display mb-8">
              SOUND THAT<br />
              <span className="text-primary">MOVES</span> THE<br />
              ROOM.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
              Professional audio rental and DJ services for weddings, corporate events,
              concerts, and private celebrations across Jamaica.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/packages">
                <button className="inline-flex items-center gap-2 border border-border text-foreground font-bold px-5 py-2.5 rounded-sm hover:border-primary/60 hover:text-primary transition-colors tracking-wide text-sm">
                  View Packages <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/services">
                <button className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                  Equipment rates →
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-border/40">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <div className="font-display text-3xl text-primary">{value}</div>
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div className="relative">
            {successRef ? (
              <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-sm p-10 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h2 className="font-display text-2xl tracking-wide mb-2">REQUEST RECEIVED</h2>
                <p className="text-muted-foreground text-sm mb-6">We'll review your details and get back within 24 hours.</p>
                <div className="bg-background border border-border rounded-sm px-6 py-4 inline-block">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">Your Booking Reference</div>
                  <div className="font-display text-2xl text-primary tracking-wide">{successRef}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Save this reference. You'll need it for follow-up queries.</p>
                <button
                  onClick={() => { setSuccessRef(null); form.reset(); }}
                  className="mt-6 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Submit another request →
                </button>
              </div>
            ) : (
              <div className="border border-border/60 bg-card/60 rounded-sm p-6 md:p-8">
                <div className="mb-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-1">Get a Quote</div>
                  <h2 className="font-display text-2xl tracking-wide">REQUEST A BOOKING</h2>
                  <p className="text-sm text-muted-foreground mt-1">Fill in the details and we'll get back to you within 24 hours.</p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="clientName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Full Name *</FormLabel>
                          <FormControl><Input placeholder="Marcus Bennett" {...field} data-testid="input-client-name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="clientCompany" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Company (Optional)</FormLabel>
                          <FormControl><Input placeholder="Luxe Events JM" {...field} data-testid="input-client-company" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="clientEmail" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email Address *</FormLabel>
                          <FormControl><Input type="email" placeholder="marcus@luxe.jm" {...field} data-testid="input-client-email" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="clientPhone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Phone Number *</FormLabel>
                          <FormControl><Input placeholder="+1 876 555 0142" {...field} data-testid="input-client-phone" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="eventType" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Event Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-event-type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EVENT_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="eventDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Event Date *</FormLabel>
                          <FormControl><Input type="date" {...field} data-testid="input-event-date" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="venue" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Venue *</FormLabel>
                          <FormControl><Input placeholder="Hope Botanical Gardens" {...field} data-testid="input-venue" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="guestCount" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Expected Guests *</FormLabel>
                          <FormControl><Input type="number" min={1} placeholder="150" {...field} data-testid="input-guest-count" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your specific equipment or DJ requirements, setup access times, etc."
                            className="min-h-[90px] resize-none"
                            {...field}
                            data-testid="textarea-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button
                      type="submit"
                      className="w-full font-bold tracking-wider mt-2"
                      disabled={createBooking.isPending}
                      data-testid="button-submit-booking"
                    >
                      {createBooking.isPending ? "SUBMITTING..." : "SUBMIT REQUEST"}
                      {!createBooking.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>

                    <p className="text-[11px] text-muted-foreground text-center">
                      By submitting you agree to be contacted about your event.
                      Check{" "}
                      <Link href="/availability" className="text-primary hover:underline">availability</Link>{" "}
                      before booking.
                    </p>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SERVICES OVERVIEW ── */}
      <section className="border-t border-border/40 bg-card/20">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-2">What We Offer</div>
              <h2 className="text-4xl font-display tracking-wide">SERVICES</h2>
            </div>
            <Link href="/services" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
              See all equipment & rates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 border border-border/40 bg-card/40 rounded-sm hover:border-primary/30 hover:bg-card/60 transition-all group">
                <Icon className="w-5 h-5 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <div className="font-display tracking-wide text-lg mb-2">{title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES TEASER ── */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-2">Event Packages</div>
            <h2 className="text-4xl font-display tracking-wide">BUILT FOR YOUR EVENT</h2>
          </div>
          <Link href="/packages" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
            See all packages <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "House Party", from: "J$85,000", types: "Up to 100 guests", href: "/packages" },
            { name: "Wedding", from: "J$220,000", types: "Full ceremony + reception", href: "/packages", highlight: true },
            { name: "Corporate", from: "J$180,000", types: "Launches + conferences", href: "/packages" },
            { name: "Concert", from: "J$800,000", types: "Up to 5,000 guests", href: "/packages" },
          ].map(({ name, from, types, href, highlight }) => (
            <Link key={name} href={href}>
              <div className={`p-6 border rounded-sm cursor-pointer transition-all hover:border-primary/50 ${
                highlight ? "border-primary/50 bg-primary/5" : "border-border/50 bg-card/40 hover:bg-card/60"
              }`}>
                {highlight && (
                  <span className="inline-block mb-3 text-[10px] font-mono uppercase tracking-widest bg-primary/20 text-primary px-2 py-0.5 rounded-full">Popular</span>
                )}
                <div className="font-display text-xl tracking-wide mb-1">{name.toUpperCase()}</div>
                <div className="text-sm text-muted-foreground mb-4">{types}</div>
                <div className="font-display text-2xl text-primary">{from}</div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">starting from</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-t border-border/40 bg-card/20">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center mb-12">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-2">Simple Process</div>
            <h2 className="text-4xl font-display tracking-wide">HOW IT WORKS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { step: "01", title: "Submit Request", desc: "Fill in the form above with your event details. Takes under 3 minutes." },
              { step: "02", title: "We Review", desc: "Our team reviews availability and your requirements. Response within 24 hours." },
              { step: "03", title: "Get Your Quote", desc: "We send a detailed quote with equipment breakdown and final pricing in JMD." },
              { step: "04", title: "Book & Relax", desc: "Confirm the booking. We handle setup, tech, and breakdown on the day." },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="relative text-center">
                {i < 3 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-border/40" />
                )}
                <div className="font-display text-5xl text-primary/20 mb-3">{step}</div>
                <div className="font-display tracking-wide text-lg mb-2">{title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container mx-auto px-4 py-20 max-w-7xl text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-4">Ready?</div>
        <h2 className="text-5xl md:text-7xl font-display leading-[0.9] mb-6">
          LET'S MAKE<br />
          <span className="text-primary">SOME NOISE.</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
          Kingston to Montego Bay, weddings to concerts — we bring the sound.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-sm tracking-wide hover:bg-primary/90 transition-colors text-lg"
          >
            Request a Booking <ArrowRight className="w-5 h-5" />
          </button>
          <Link href="/availability">
            <button className="px-8 py-4 border border-border text-foreground font-bold rounded-sm hover:border-primary/60 hover:text-primary transition-colors tracking-wide text-lg">
              Check Availability
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
