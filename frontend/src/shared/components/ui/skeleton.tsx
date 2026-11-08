import { cn } from "@/lib/utils"
import type { ReactElement } from "react"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="skeleton"
            className={cn("animate-pulse rounded-md bg-olive-300", className)}
            {...props}
        />
    )
}

export { Skeleton }

export function CardSkeleton(): ReactElement {
    return (
        <div className="w-full max-w-xs border border-stone-300 p-3 mt-3 rounded-lg space-y-1">
            <div className="space-y-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div>
                <Skeleton className="aspect-video w-full" />
            </div>
        </div>
    )
}