"use client";

import { AdminGuard } from "@/components/admin-guard";
import AdminLayout from "@/components/layout/admin-layout";
import { useListClients, getListClientsQueryKey } from "@/hooks/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

function ClientsContent() {
  const { data: clients, isLoading } = useListClients({ query: { queryKey: getListClientsQueryKey() } });
  const [search, setSearch] = useState("");

  const filteredClients = clients?.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.company?.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display tracking-wide">CLIENTS</h1>
          <p className="text-muted-foreground">Manage customer relationships and history.</p>
        </div>
      </div>

      <Card className="border-border">
        <div className="p-4 border-b border-border flex items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, or email..."
              className="pl-9 bg-background/50 border-border font-mono text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 font-mono tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium text-center">Total Bookings</th>
                <th className="px-6 py-4 font-medium">Added</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 bg-muted rounded mb-2"></div>
                      <div className="h-3 w-24 bg-muted rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-40 bg-muted rounded mb-2"></div>
                      <div className="h-3 w-32 bg-muted rounded"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-4 w-8 bg-muted rounded mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-muted rounded"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-8 w-16 bg-muted rounded ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredClients?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No clients found.
                  </td>
                </tr>
              ) : (
                filteredClients?.map((client) => (
                  <tr key={client.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground text-base">{client.name}</div>
                      {client.company ? (
                        <div className="text-xs text-muted-foreground mt-1">{client.company}</div>
                      ) : (
                        <div className="text-xs text-muted-foreground mt-1 italic">—</div>
                      )}
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                        <Mail className="w-3 h-3" />
                        <span>{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs group-hover:text-foreground transition-colors">
                          <Phone className="w-3 h-3" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-primary font-bold text-lg">
                      {client.totalBookings || 0}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      {format(new Date(client.createdAt), "MMM yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border hover:border-primary hover:text-primary transition-colors"
                      >
                        View History
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function AdminClientsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ClientsContent />
      </AdminLayout>
    </AdminGuard>
  );
}
