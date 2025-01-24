import { useAppSelector } from "@/lib/hooks";
import { TimelineElement } from "./ui/timeline-element";
import { useHotkeys } from "react-hotkeys-hook";

export function TimelineElements({
  thumbnailsContainerWidth,
}: {
  thumbnailsContainerWidth: number;
}) {
  const texts = useAppSelector((state) => state.frame.texts);
  const images = useAppSelector((state) => state.frame.images);
  const videoId = useAppSelector((state) => state.frame.videoId);

  return (
    <div
      className="flex mt-20 flex-col gap-y-2 mb-2"
      style={{ width: `${thumbnailsContainerWidth}px` }}
    >
      {texts.map((text) => (
        <TimelineElement
          key={text.id}
          thumbnailsContainerWidth={thumbnailsContainerWidth}
          component={text}
        >
          <div className=" w-full max-w-full overflow-hidden text-center absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-white">
            {text.text}
          </div>
        </TimelineElement>
      ))}

      {images.map((image) => (
        <TimelineElement
          key={image.id}
          component={image}
          thumbnailsContainerWidth={thumbnailsContainerWidth}
        >
          <div className="h-full overflow-hidden absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-white">
            <div className="flex gap-x-2 items-center">
              <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                <img
                  alt="Added Image"
                  className="pointer-events-none"
                  src={`/api/frames/${videoId}/images/${image.imageName}`}
                />
              </div>
              Image
            </div>
          </div>
        </TimelineElement>
      ))}
    </div>
  );
}
