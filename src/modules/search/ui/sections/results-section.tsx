"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import FilterCarousel from "@/components/filter-carousel";
import { useRouter } from "next/navigation";
import { DEFAULT_LIMIT } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";

import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";

interface ResultsSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
};

export const ResultsSection = ({ 
  query, 
  categoryId 
}: ResultsSectionProps) => {
  const isMobile = useIsMobile();

  const [results, resultsQuery] = trpc.search.getMany.useSuspenseInfiniteQuery({
    query, categoryId, limit: DEFAULT_LIMIT
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
            ))
          }
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} />
            ))
          }
        </div>
      )}
      <InfiniteScroll 
        hasNextPage={resultsQuery.hasNextPage}
        isFetchingNextPage={resultsQuery.isFetchingNextPage}
        fetchNextPage={resultsQuery.fetchNextPage}
      />
    </>
  )
}

// const CategoriesSkeleton = () => {
//   return <FilterCarousel isLoading data={[]} onSelect={() => {}} />
// }

// const CategoriesSectionSuspense = ({ categoryId }:CategoriesSectionProps) => {
//   const router = useRouter();
//   const [categories] = trpc.categories.getMany.useSuspenseQuery();

//   const data = categories.map((category) => ({
//     value: category.id,
//     label: category.name,
//   }));

//   const onSelect = (value: string | null) => {
//     const url = new URL(window.location.href);

//     if (value) {
//       url.searchParams.set("categoryId", value);
//     } else {
//       url.searchParams.delete("categoryId");
//     }

//     router.push(url.toString());
//   };

//   return <FilterCarousel onSelect={onSelect} value={categoryId} data={data} />
// };