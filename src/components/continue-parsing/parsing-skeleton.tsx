import { Skeleton } from "@shadcn/components/ui/skeleton"

export function ParsingSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="w-1/2 h-4" />
      <Skeleton className="w-1/4 h-4" />
      <Skeleton className="w-1/4 h-4" />
    </div>
  )
}
