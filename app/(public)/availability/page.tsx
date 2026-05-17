"use client";

import { useState } from "react";
import { useGetPublicAvailability } from "@/hooks/api";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Availability() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { data: events, isLoading } = useGetPublicAvailability({ month, year });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getDayEvents = (date: Date) => {
    if (!events) return [];
    const dateStr = format(date, "yyyy-MM-dd");
    return events.filter((e) => e.eventDate.startsWith(dateStr) && e.status === "approved");
  };

  const firstDayOffset = startOfMonth(currentDate).getDay();
  const emptyDays = Array.from({ length: firstDayOffset }, (_, i) => i);

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-5xl font-display mb-4">AVAILABILITY</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Check our schedule below. Dates highlighted in orange are partially or fully booked. We recommend booking
          at least 4 weeks in advance.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-display">{format(currentDate, "MMMM yyyy")}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-4 text-center text-sm font-medium text-muted-foreground font-mono">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-[120px]">
          {emptyDays.map((i) => (
            <div key={`empty-${i}`} className="border-r border-b border-border bg-muted/10 p-2"></div>
          ))}

          {days.map((date) => {
            const dayEvents = getDayEvents(date);
            const hasBookings = dayEvents.length > 0;

            return (
              <div
                key={date.toISOString()}
                className={`border-r border-b border-border p-3 transition-colors ${
                  isSameMonth(date, currentDate) ? "bg-card" : "bg-muted/10 text-muted-foreground"
                } ${hasBookings ? "bg-primary/5" : ""}`}
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
                  {hasBookings && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>

                {isLoading ? (
                  <div className="w-1/2 h-2 bg-muted rounded animate-pulse mt-2" />
                ) : (
                  <div className="space-y-1">
                    {hasBookings && (
                      <div className="text-[10px] uppercase font-mono tracking-wider text-primary px-1.5 py-0.5 rounded bg-primary/10 inline-block">
                        Booked
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
