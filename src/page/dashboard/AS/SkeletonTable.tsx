import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTable()
{
    return (
        <div className="space-y-4">

            {/* Rows Skeleton */}
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex space-x-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                ))}
            </div>
        </div>
    );
}
