import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface PageSkeletonProps {
  className?: string;
  variant?: "default" | "dashboard" | "table" | "form";
}

export function PageSkeleton({ className, variant = "default" }: PageSkeletonProps) {
  return (
    <div className={cn("flex-1 p-4 md:p-6 space-y-6 animate-in fade-in duration-300", className)}>
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 bg-gradient-to-r from-muted to-muted/50" />
        <Skeleton className="h-4 w-72 bg-muted/60" />
      </div>
      
      {variant === "dashboard" && <DashboardSkeleton />}
      {variant === "table" && <TableSkeleton />}
      {variant === "form" && <FormSkeleton />}
      {variant === "default" && <DefaultSkeleton />}
    </div>
  );
}

function DefaultSkeleton() {
  return (
    <>
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl bg-gradient-to-br from-muted to-muted/30" />
        ))}
      </div>
      
      {/* Content area */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 flex-1 max-w-xs rounded-lg" />
        </div>
        
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl bg-muted/50" />
          ))}
        </div>
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <>
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl bg-gradient-to-br from-muted to-muted/30" />
        ))}
      </div>
      
      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      
      {/* Activity list */}
      <Skeleton className="h-48 rounded-xl" />
    </>
  );
}

function TableSkeleton() {
  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      
      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <Skeleton className="h-12 bg-muted/80" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 border-t" />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center gap-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-10 rounded-lg" />
        ))}
      </div>
    </>
  );
}

function FormSkeleton() {
  return (
    <div className="max-w-2xl space-y-6">
      {/* Form sections */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4 p-6 border rounded-xl">
          <Skeleton className="h-6 w-32" />
          <div className="grid gap-4">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
        </div>
      ))}
      
      {/* Submit button */}
      <Skeleton className="h-12 w-32 rounded-lg" />
    </div>
  );
}

export default PageSkeleton;
