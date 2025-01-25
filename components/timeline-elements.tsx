import { useAppSelector } from "@/lib/hooks";
import { TimelineElement } from "./ui/timeline-element";

export function TimelineElements({
  thumbnailsContainerWidth,
}: {
  thumbnailsContainerWidth: number;
}) {
  const texts = useAppSelector((state) => state.video.texts);
  const images = useAppSelector((state) => state.video.images);
  const videoId = useAppSelector((state) => state.video.videoId);

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
          <div className="text-nowrap absolute left-6 text-center text-white">
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
          <div className="absolute left-6 text-white text-center">
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
