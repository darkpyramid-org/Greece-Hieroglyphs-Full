export default function ProductSkeleton() {
  return (
    <div className="greece-card overflow-hidden">
      {/* Image skeleton with Egyptian pattern */}
      <div className="aspect-[4/5] bg-gradient-to-br from-[#E4D5B7] via-[#D6C99A] to-[#E4D5B7] dark:from-[#2A1E14] dark:via-[#3A2E24] dark:to-[#2A1E14] relative overflow-hidden">
        <div className="absolute inset-0 animate-pulse">
          {/* Subtle hieroglyph pattern */}
          <div className="absolute top-4 left-4 text-3xl text-[#C89D29]/10 select-none">𓋹</div>
          <div className="absolute bottom-4 right-4 text-3xl text-[#C89D29]/10 select-none">𓂀</div>
        </div>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      
      <div className="p-4 space-y-3">
        {/* Category badge skeleton */}
        <div className="h-3 bg-[#C89D29]/20 dark:bg-[#C89D29]/10 rounded w-1/4 animate-pulse" />
        
        {/* Product name skeleton */}
        <div className="h-4 bg-[#1B1B1B]/10 dark:bg-[#FDF8EF]/10 rounded w-3/4 animate-pulse" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-[#1B1B1B]/8 dark:bg-[#FDF8EF]/8 rounded w-full animate-pulse" />
          <div className="h-3 bg-[#1B1B1B]/8 dark:bg-[#FDF8EF]/8 rounded w-2/3 animate-pulse" />
        </div>
        
        {/* Price and button skeleton */}
        <div className="flex justify-between items-center mt-4 pt-2">
          <div className="h-6 bg-[#C89D29]/20 dark:bg-[#C89D29]/15 rounded w-1/3 animate-pulse" />
          <div className="h-9 bg-[#1B1B1B]/10 dark:bg-[#FDF8EF]/10 rounded-lg w-24 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
