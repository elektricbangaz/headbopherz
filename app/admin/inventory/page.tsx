"use client";

import { AdminGuard } from "@/components/admin-guard";
import AdminLayout from "@/components/layout/admin-layout";
import {
  useListInventory,
  getListInventoryQueryKey,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
} from "@/hooks/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type InventoryStatus = "available" | "reserved" | "maintenance";

interface ItemFormState {
  name: string;
  category: string;
  description: string;
  totalQuantity: string;
  status: InventoryStatus;
}

const EMPTY_FORM: ItemFormState = {
  name: "",
  category: "",
  description: "",
  totalQuantity: "1",
  status: "available",
};

function InventoryContent() {
  const { data: items, isLoading } = useListInventory({ query: { queryKey: getListInventoryQueryKey() } });
  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const deleteItem = useDeleteInventoryItem();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ItemFormState>(EMPTY_FORM);

  const filteredItems = items?.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()),
  );

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListInventoryQueryKey() });

  const handleCreate = () => {
    createItem.mutate(
      {
        data: {
          name: form.name,
          category: form.category,
          description: form.description || undefined,
          totalQuantity: parseInt(form.totalQuantity, 10),
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Item added" });
          setAddOpen(false);
          setForm(EMPTY_FORM);
          invalidate();
        },
        onError: () => toast({ title: "Failed to add item", variant: "destructive" }),
      },
    );
  };

  const openEdit = (item: NonNullable<typeof items>[number]) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description ?? "",
      totalQuantity: item.totalQuantity.toString(),
      status: item.status as InventoryStatus,
    });
  };

  const handleUpdate = () => {
    if (!editId) return;
    updateItem.mutate(
      {
        id: editId,
        data: {
          name: form.name,
          category: form.category,
          description: form.description || undefined,
          totalQuantity: parseInt(form.totalQuantity, 10),
          status: form.status,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Item updated" });
          setEditId(null);
          setForm(EMPTY_FORM);
          invalidate();
        },
        onError: () => toast({ title: "Failed to update item", variant: "destructive" }),
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteItem.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Item removed" });
          invalidate();
        },
        onError: () => toast({ title: "Failed to delete item", variant: "destructive" }),
      },
    );
  };

  const ItemForm = () => (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Item Name *</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. QSC K12.2 Active Speaker"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Category *</Label>
        <Input
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          placeholder="e.g. Speakers, Mixers, Lighting"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Description</Label>
        <Input
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Optional description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Total Quantity *</Label>
          <Input
            type="number"
            min="1"
            value={form.totalQuantity}
            onChange={(e) => setForm((f) => ({ ...f, totalQuantity: e.target.value }))}
          />
        </div>
        {editId && (
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((f) => ({ ...f, status: v as InventoryStatus }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display tracking-wide">INVENTORY</h1>
          <p className="text-muted-foreground">Manage sound and lighting equipment.</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              className="font-bold tracking-wide"
              onClick={() => setForm(EMPTY_FORM)}
              data-testid="button-add-item"
            >
              <Plus className="w-4 h-4 mr-2" /> ADD ITEM
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display tracking-wide">ADD INVENTORY ITEM</DialogTitle>
            </DialogHeader>
            <ItemForm />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createItem.isPending || !form.name || !form.category}
              >
                {createItem.isPending ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              className="pl-9 bg-background/50 border-border font-mono text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-inventory"
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground ml-4 whitespace-nowrap">
            {filteredItems?.length ?? 0} items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 font-mono tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Item Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-right">Total Qty</th>
                <th className="px-6 py-4 font-medium text-right">Available</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-muted rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-muted rounded" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-8 bg-muted rounded ml-auto" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-8 bg-muted rounded ml-auto" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-muted rounded-full" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 w-16 bg-muted rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredItems?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                filteredItems?.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/20 transition-colors"
                    data-testid={`row-inventory-${item.id}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{item.category}</td>
                    <td className="px-6 py-4 text-right font-mono">{item.totalQuantity}</td>
                    <td className="px-6 py-4 text-right font-mono text-primary font-bold">
                      {item.availableQuantity}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium font-mono uppercase tracking-wider ring-1
                        ${item.status === "available" ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" :
                          item.status === "maintenance" ? "bg-rose-500/10 text-rose-400 ring-rose-500/20" :
                          "bg-amber-500/10 text-amber-400 ring-amber-500/20"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${item.status === "available" ? "bg-emerald-400" : item.status === "maintenance" ? "bg-rose-400" : "bg-amber-400"}`}
                        />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Dialog
                          open={editId === item.id}
                          onOpenChange={(open) => {
                            if (!open) setEditId(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => openEdit(item)}
                              data-testid={`button-edit-item-${item.id}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="font-display tracking-wide">EDIT ITEM</DialogTitle>
                            </DialogHeader>
                            <ItemForm />
                            <div className="flex justify-end gap-3 pt-2">
                              <Button variant="outline" onClick={() => setEditId(null)}>
                                Cancel
                              </Button>
                              <Button
                                onClick={handleUpdate}
                                disabled={updateItem.isPending || !form.name || !form.category}
                              >
                                {updateItem.isPending ? "Saving..." : "Save Changes"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                              data-testid={`button-delete-item-${item.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-display tracking-wide">REMOVE ITEM?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete <strong>{item.name}</strong> from inventory. This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-rose-600 hover:bg-rose-700"
                                onClick={() => handleDelete(item.id)}
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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

export default function AdminInventoryPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <InventoryContent />
      </AdminLayout>
    </AdminGuard>
  );
}
