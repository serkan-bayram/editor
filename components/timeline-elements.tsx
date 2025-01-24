import { useAppSelector } from "@/lib/hooks";
import { TimelineElement } from "./ui/timeline-element";
import Image from "next/image";

export function TimelineElements({
  thumbnailsContainerWidth,
}: {
  thumbnailsContainerWidth: number;
}) {
  const texts = useAppSelector((state) => state.frame.texts);
  const images = useAppSelector((state) => state.frame.images);

  const videoId = useAppSelector((state) => state.frame.videoId);

  const focusedComponent = useAppSelector(
    (state) => state.frame.focusedComponent
  );

  return (
    <div
      className="flex mt-20 flex-col gap-y-2 mb-2"
      style={{ width: `${thumbnailsContainerWidth}px` }}
    >
      {texts.map((text) => (
        <TimelineElement
          key={text.id}
          isFocused={text.id === focusedComponent?.id}
          thumbnailsContainerWidth={thumbnailsContainerWidth}
          focusedComponent={{ id: text.id, component: text.type }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-white">
            {text.text}
          </div>
        </TimelineElement>
      ))}

      {images.map((image) => (
        <TimelineElement
          key={image.id}
          isFocused={image.id === focusedComponent?.id}
          focusedComponent={{ id: image.id, component: image.type }}
          thumbnailsContainerWidth={thumbnailsContainerWidth}
        >
          <div className="h-full overflow-hidden absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-white">
            <div className="flex gap-x-2 items-center">
              <Image
                alt="Added Image"
                width={25}
                height={25}
                className="pointer-events-none"
                src={`/api/frames/${videoId}/images/${image.imageName}`}
              />
              Image
            </div>
          </div>
        </TimelineElement>
      ))}
    </div>
  );
}
