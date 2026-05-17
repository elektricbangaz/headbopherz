"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/api";
import { Calendar, LayoutDashboard, List, Package, Users, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = usePathname();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/admin/login";
      },
    });
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings", icon: List },
    { href: "/admin/calendar", label: "Calendar", icon: Calendar },
    { href: "/admin/inventory", label: "Inventory", icon: Package },
    { href: "/admin/clients", label: "Clients", icon: Users },
  ];

  return (
    <div className="flex min-h-[100dvh] bg-background text-foreground font-sans">
      <aside className="w-64 border-r bg-sidebar shrink-0 flex flex-col sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <Link href="/admin" className="font-display text-2xl tracking-wide text-primary">
            BOPHERZ <span className="text-muted-foreground text-sm tracking-normal font-sans ml-2">ADMIN</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              location === item.href ||
              (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border/40">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-background/50">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
