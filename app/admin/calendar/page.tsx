"use client";

import { AdminGuard } from "@/components/admin-guard";
import AdminLayout from "@/components/layout/admin-layout";
import { useState } from "react";
import { useGetBookingCalendar, getGetBookingCalendarQueryKey } from "@/hooks/api";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

function CalendarContent() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { data: events } = useGetBookingCalendar(
    { month, year },
    { query: { queryKey: getGetBookingCalendarQueryKey({ month, year }) } },
  );

  const prevMonth = () => setCurrentDate(new Date(year, month - 2, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month, 1));

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getDayEvents = (date: Date) => {
    if (!events) return [];
    const dateStr = format(date, "yyyy-MM-dd");
    return events.filter((e) => e.eventDate.startsWith(dateStr));
  };

  const firstDayOffset = startOfMonth(currentDate).getDay();
  const emptyDays = Array.from({ length: firstDayOffset }, (_, i) => i);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display tracking-wide">CALENDAR</h1>
          <p className="text-muted-foreground">Monthly overview of all events.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="font-display tracking-wide text-xl min-w-[160px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </div>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="border-border">
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-4 text-center text-sm font-medium text-muted-foreground font-mono">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-[140px]">
          {emptyDays.map((i) => (
            <div key={`empty-${i}`} className="border-r border-b border-border bg-muted/10 p-2"></div>
          ))}

          {days.map((date) => {
            const dayEvents = getDayEvents(date);

            return (
              <div
                key={date.toISOString()}
                className={`border-r border-b border-border p-2 flex flex-col transition-colors ${
                  isSameMonth(date, currentDate) ? "bg-card" : "bg-muted/10 text-muted-foreground"
                }`}
              >
                <div
                  className={`text-sm font-mono mb-2 flex items-center justify-between ${
                    isToday(date) ? "text-primary font-bold" : ""
                  }`}
                >
                  <span
                    className={
                      isToday(date)
                        ? "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center"
                        : ""
                    }
                  >
                    {format(date, "d")}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin">
                  {dayEvents.map((event) => (
                    <Link key={event.id} href={`/admin/bookings/${event.id}`}>
                      <div
                        className={`text-xs px-2 py-1.5 rounded cursor-pointer truncate border transition-colors
                        ${event.status === "approved" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20" :
                          event.status === "rejected" ? "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20" :
                          "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"}`}
                      >
                        <span className="font-semibold block truncate">{event.clientName}</span>
                        <span className="opacity-80 truncate block">{event.eventType}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export default function AdminCalendarPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <CalendarContent />
      </AdminLayout>
    </AdminGuard>
  );
}
