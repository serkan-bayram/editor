import { useAppSelector } from "@/lib/hooks";

export const TIME_SKIP = 10;

export function TimeIndicators() {
  const thumbnailsContainerWidth = useAppSelector(
    (state) => state.timeline.thumbnailsContainerWidth
  );

  const videoDuration = useAppSelector((state) => state.video.videoDuration);

  const thumbnailsCount = Math.ceil(videoDuration / TIME_SKIP);

  return (
    <div
      style={{ width: `${thumbnailsContainerWidth}px` }}
      className="cursor-pointer relative select-none opacity-50 z-10 top-0 left-2 h-8   w-full"
    >
      {Array.from({ length: thumbnailsCount }).map((_, index) => {
        const leftPos = (thumbnailsContainerWidth / thumbnailsCount) * index;

        return (
          <div
            key={index}
            className="absolute h-full w-full   text-white"
            style={{
              left: `${leftPos}px`,
            }}
          >
            {index * 10}s
          </div>
        );
      })}
    </div>
  );
}
