"use client";

import { AdminGuard } from "@/components/admin-guard";
import AdminLayout from "@/components/layout/admin-layout";
import { useListBookings, getListBookingsQueryKey } from "@/hooks/api";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus } from "lucide-react";
import { format } from "date-fns";

function BookingsContent() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: bookings, isLoading } = useListBookings(
    statusFilter !== "all" ? { status: statusFilter } : {},
    {
      query: {
        queryKey: getListBookingsQueryKey(
          statusFilter !== "all" ? { status: statusFilter } : {},
        ),
      },
    },
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display tracking-wide">BOOKINGS</h1>
          <p className="text-muted-foreground">Manage and track all event requests.</p>
        </div>
        <Button className="font-bold tracking-wide">
          <Plus className="w-4 h-4 mr-2" /> NEW BOOKING
        </Button>
      </div>

      <Card className="border-border">
        <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter} className="w-full">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <TabsList className="bg-transparent h-auto p-0 gap-6 w-full justify-start overflow-x-auto rounded-none border-b-0">
              <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-2">
                All Requests
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-2 text-amber-500 data-[state=active]:text-amber-500">
                Pending
              </TabsTrigger>
              <TabsTrigger value="approved" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-2 text-emerald-500 data-[state=active]:text-emerald-500">
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-2 text-rose-500 data-[state=active]:text-rose-500">
                Rejected
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search ref or client..." className="pl-9 bg-background/50 border-border font-mono text-sm" />
              </div>
              <Button variant="outline" size="icon" className="shrink-0 border-border">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 font-mono tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Ref</th>
                  <th className="px-6 py-4 font-medium">Client Details</th>
                  <th className="px-6 py-4 font-medium">Event Info</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 w-24 bg-muted rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-32 bg-muted rounded mb-2"></div><div className="h-3 w-24 bg-muted rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-28 bg-muted rounded mb-2"></div><div className="h-3 w-32 bg-muted rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-20 bg-muted rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-6 w-20 bg-muted rounded-full"></div></td>
                      <td className="px-6 py-4"><div className="h-8 w-16 bg-muted rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : bookings?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No bookings found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  bookings?.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4 font-mono text-primary font-medium">{b.bookingRef}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{b.clientName}</div>
                        {b.clientCompany && <div className="text-xs text-muted-foreground mt-1">{b.clientCompany}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-foreground">{b.eventType}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{b.venue}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-foreground">{format(new Date(b.eventDate), "MMM d, yyyy")}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium font-mono uppercase tracking-wider ring-1
                          ${b.status === "approved" ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" :
                            b.status === "rejected" ? "bg-rose-500/10 text-rose-400 ring-rose-500/20" :
                            "bg-amber-500/10 text-amber-400 ring-amber-500/20"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${b.status === "approved" ? "bg-emerald-400" : b.status === "rejected" ? "bg-rose-400" : "bg-amber-400"}`}
                          />
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/bookings/${b.id}`}>
                          <Button variant="outline" size="sm" className="border-border hover:border-primary hover:text-primary transition-colors">
                            Manage
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}

export default function AdminBookingsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <BookingsContent />
      </AdminLayout>
    </AdminGuard>
  );
}
