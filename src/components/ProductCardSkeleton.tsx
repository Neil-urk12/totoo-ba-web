interface ProductCardSkeletonProps {
    viewMode?: 'grid' | 'list';
}

export default function ProductCardSkeleton({ viewMode = 'grid' }: ProductCardSkeletonProps) {
    if (viewMode === 'list') {
        return (
            <div className="rounded-lg shadow-sm border p-3 sm:p-4 bg-card border-app animate-pulse">
                <div className="flex flex-col gap-2">
                    {/* Row 1: Name and badges */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            {/* Product name skeleton */}
                            <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 sm:w-64"></div>
                            {/* Status badge skeleton */}
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 flex-shrink-0"></div>
                        </div>
                        <div className="flex gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">
                            {/* Compliance badge skeleton */}
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                            {/* Action badge skeleton */}
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
                        </div>
                    </div>

                    {/* Row 2: Details skeleton */}
                    <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 flex-shrink-0"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 flex-shrink-0"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 flex-shrink-0"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 flex-shrink-0"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-18 flex-shrink-0"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Grid view (default)
    return (
        <div className="rounded-lg shadow-sm border p-6 bg-card border-app animate-pulse">
            {/* Header with name and status */}
            <div className="flex items-start justify-between mb-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
            </div>

            {/* Category */}
            <div className="mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>

            {/* Details section */}
            <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
                <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                </div>
                <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-18"></div>
                </div>
                <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
            </div>

            {/* Bottom badges */}
            <div className="flex gap-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-18"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
            </div>
        </div>
    );
}