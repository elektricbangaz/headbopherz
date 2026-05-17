"use client";

import { AdminGuard } from "@/components/admin-guard";
import AdminLayout from "@/components/layout/admin-layout";
import {
  useGetBooking,
  getGetBookingQueryKey,
  useUpdateBookingStatus,
  getListBookingsQueryKey,
  useUpdateBooking,
} from "@/hooks/api";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, use } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function BookingDetailContent({ id }: { id: number }) {
  const { data: booking, isLoading } = useGetBooking(id, {
    query: { enabled: !!id, queryKey: getGetBookingQueryKey(id) },
  });
  const updateStatus = useUpdateBookingStatus();
  const updateBooking = useUpdateBooking();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [adminNote, setAdminNote] = useState("");
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (booking) {
      setAdminNote(booking.adminNote || "");
      setValue(booking.estimatedValue ? booking.estimatedValue.toString() : "");
    }
  }, [booking]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-32 bg-muted rounded"></div>
        <div className="h-32 bg-card border border-border rounded-lg"></div>
      </div>
    );
  }

  if (!booking) return <div className="text-muted-foreground">Booking not found.</div>;

  const handleStatusChange = (newStatus: "approved" | "rejected") => {
    updateStatus.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast({ title: `Booking ${newStatus}` });
          queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(id) });
          queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        },
        onError: () => {
          toast({ title: "Failed to update status", variant: "destructive" });
        },
      },
    );
  };

  const handleSaveDetails = () => {
    updateBooking.mutate(
      {
        id,
        data: {
          adminNote,
          estimatedValue: value ? parseInt(value, 10) : undefined,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Booking details saved" });
          queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(id) });
        },
        onError: () => {
          toast({ title: "Failed to save details", variant: "destructive" });
        },
      },
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/bookings">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display tracking-wide flex items-center gap-4">
            {booking.bookingRef}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium font-mono uppercase tracking-wider ring-1
              ${booking.status === "approved" ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" :
                booking.status === "rejected" ? "bg-rose-500/10 text-rose-400 ring-rose-500/20" :
                "bg-amber-500/10 text-amber-400 ring-amber-500/20"}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${booking.status === "approved" ? "bg-emerald-400" : booking.status === "rejected" ? "bg-rose-400" : "bg-amber-400"}`}
              />
              {booking.status}
            </span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Submitted on {format(new Date(booking.submittedAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>

      {booking.status === "pending" && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-display tracking-wide text-lg text-amber-500 mb-1">ACTION REQUIRED</h3>
              <p className="text-amber-500/80 text-sm">Review the request details and approve or reject.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-rose-500/50 text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 font-bold"
                onClick={() => handleStatusChange("rejected")}
                disabled={updateStatus.isPending}
              >
                <XCircle className="w-4 h-4 mr-2" /> REJECT
              </Button>
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
                onClick={() => handleStatusChange("approved")}
                disabled={updateStatus.isPending}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> APPROVE
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg font-display tracking-wide">EVENT DETAILS</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                <div>
                  <dt className="text-xs uppercase tracking-wider font-mono text-muted-foreground mb-1">Event Type</dt>
                  <dd className="font-medium text-lg">{booking.eventType}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider font-mono text-muted-foreground mb-1">Date</dt>
                  <dd className="font-medium text-lg text-primary">{format(new Date(booking.eventDate), "MMMM d, yyyy")}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider font-mono text-muted-foreground mb-1">Venue</dt>
                  <dd className="font-medium text-lg">{booking.venue}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider font-mono text-muted-foreground mb-1">Expected Guests</dt>
                  <dd className="font-medium text-lg">{booking.guestCount}</dd>
                </div>
                {booking.notes && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs uppercase tracking-wider font-mono text-muted-foreground mb-2">Client Notes</dt>
                    <dd className="bg-muted/30 p-4 rounded-md text-sm leading-relaxed border border-border/50">
                      {booking.notes}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-display tracking-wide">ADMIN CONTROLS</CardTitle>
              <Button size="sm" onClick={handleSaveDetails} disabled={updateBooking.isPending}>
                <Save className="w-4 h-4 mr-2" /> Save Details
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider font-mono text-muted-foreground">
                  Estimated Value (JMD)
                </Label>
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-2.5 text-muted-foreground font-mono">$</span>
                  <Input
                    type="number"
                    className="pl-8 font-mono"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider font-mono text-muted-foreground">
                  Internal Notes (Not visible to client)
                </Label>
                <Textarea
                  className="min-h-[120px]"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Add equipment lists, crew assignments, etc..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg font-display tracking-wide">CLIENT INFO</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="text-xl font-bold mb-1">{booking.clientName}</div>
                {booking.clientCompany && (
                  <div className="text-muted-foreground text-sm">{booking.clientCompany}</div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs uppercase tracking-wider font-mono text-muted-foreground mb-1">Email</div>
                  <a href={`mailto:${booking.clientEmail}`} className="text-primary hover:underline font-medium break-all">
                    {booking.clientEmail}
                  </a>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider font-mono text-muted-foreground mb-1">Phone</div>
                  <a href={`tel:${booking.clientPhone}`} className="text-foreground hover:text-primary font-mono transition-colors">
                    {booking.clientPhone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id, 10);

  return (
    <AdminGuard>
      <AdminLayout>
        <BookingDetailContent id={id} />
      </AdminLayout>
    </AdminGuard>
  );
}
