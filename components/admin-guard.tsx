"use client";

import { useGetMe, getGetMeQueryKey } from "@/hooks/api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
    data: user,
    isLoading,
    error,
  } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } });

  useEffect(() => {
    if (!isLoading && (error || !user)) {
      router.push("/admin/login");
    }
  }, [user, isLoading, error, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (error || !user) return null;
  return <>{children}</>;
}
