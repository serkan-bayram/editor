import { THUMBNAIL_ITEM_WIDTH, THUMBNAILS_COUNT } from "./timeline";
import { TimelineElements } from "./timeline-elements";

export function ThumbnailsContainer() {
  return (
    <div className="h-full overflow-y-auto flex gap-y-2 px-2 flex-col relative">
      <div className="absolute left-2 top-2 flex justify-start">
        {Array.from({ length: THUMBNAILS_COUNT }).map((_, index) => (
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
