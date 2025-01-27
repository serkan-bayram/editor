import { useAppSelector } from "@/lib/hooks";
import { THUMBNAILS_COUNT } from "./timeline";

export function TimeIndicators() {
  const thumbnailsContainerWidth = useAppSelector(
    (state) => state.timeline.thumbnailsContainerWidth
  );

  const videoDuration = useAppSelector((state) => state.video.videoDuration);

  return (
    <div
      style={{ width: `${thumbnailsContainerWidth}px` }}
      className="relative select-none opacity-50 z-10 top-0 left-2 h-8   w-full"
    >
      {Array.from({ length: THUMBNAILS_COUNT + 1 }).map((_, index) => {
        const leftPos = (thumbnailsContainerWidth / THUMBNAILS_COUNT) * index;

        return (
          <div
            key={index}
            className="absolute h-full w-full   text-white"
            style={{
              left: `${leftPos}px`,
            }}
          >
            {index * Math.ceil(videoDuration / THUMBNAILS_COUNT)}s
          </div>
        );
      })}
    </div>
  );
}
