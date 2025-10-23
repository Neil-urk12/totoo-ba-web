interface ProductCardSkeletonProps {
    viewMode?: 'grid' | 'list';
}

export default function ProductCardSkeleton({ viewMode = 'grid' }: ProductCardSkeletonProps) {
    if (viewMode === 'list') {
        return (
            <div className="rounded-lg shadow-sm border p-3 sm:p-4 bg-card border-app animate-pulse">
                <div className="flex items-start justify-between gap-4">
                    {/* Left side: Product info stacked vertically */}
                    <div className="flex-1 min-w-0 space-y-1">
                        {/* Product name skeleton */}
                        <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 sm:w-64"></div>
                        {/* Manufacturer skeleton */}
                        <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 sm:w-40"></div>
                        {/* Category skeleton */}
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 sm:w-32"></div>
                    </div>

                    {/* Right side: Badges and button stacked vertically */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            {/* Category badge skeleton */}
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                            {/* Status badge skeleton */}
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 sm:w-20"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Date skeleton */}
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                            {/* Eye button skeleton */}
                            <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Grid view (default)
    return (
        <div className="rounded-lg shadow-sm border p-4 sm:p-6 bg-card border-app animate-pulse">
            {/* Header with name, status, and eye icon button */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    {/* Product name skeleton */}
                    <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 sm:w-64 mb-2"></div>
                    {/* Status badge skeleton */}
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                </div>
                {/* Eye icon button skeleton */}
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
            </div>

            {/* Category skeleton */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
    );
}