import { useAppSelector } from "@/lib/hooks";
import { TimelineElement } from "./ui/timeline-element";

export function TimelineElements() {
  const texts = useAppSelector((state) => state.feature.texts);
  const images = useAppSelector((state) => state.feature.images);
  const thumbnailsContainerWidth = useAppSelector(
    (state) => state.timeline.thumbnailsContainerWidth
  );

  return (
    <div
      className="flex mt-20 flex-col gap-y-2 mb-2"
      style={{ width: `${thumbnailsContainerWidth}px` }}
    >
      {texts.map((text) => (
        <TimelineElement key={text.id} component={text}>
          <div className="text-nowrap absolute left-6 text-center text-white">
            {text.text}
          </div>
        </TimelineElement>
      ))}

      {images.map((image) => (
        <TimelineElement key={image.id} component={image}>
          <div className="absolute left-6 text-white text-center">
            <div className="flex gap-x-2 items-center">
              <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                <img
                  alt="Added Image"
                  className="pointer-events-none"
                  src={`blob:${process.env.NEXT_PUBLIC_URL}/${image.imageSrc}`}
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
