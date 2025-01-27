import { useAppSelector } from "@/lib/hooks";
import { THUMBNAIL_ITEM_WIDTH } from "./timeline";
import { TimelineElements } from "./timeline-elements";
import { TIME_SKIP } from "./time-indicators";

export function ThumbnailsContainer() {
  const videoDuration = useAppSelector((state) => state.video.videoDuration);

  const thumbnailsCount = Math.ceil(videoDuration / TIME_SKIP);

  return (
    <div className="h-full overflow-y-auto flex gap-y-2 px-2 flex-col relative">
      <div className="absolute left-2 top-2 flex justify-start">
        {Array.from({ length: thumbnailsCount }).map((_, index) => (
          <Thumbnail key={index} />
        ))}
      </div>

      <TimelineElements />
    </div>
  );
}

function Thumbnail() {
  return (
    <div
      style={{ width: `${THUMBNAIL_ITEM_WIDTH}px` }}
      className="aspect-video border"
    ></div>
  );
}
