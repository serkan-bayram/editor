import type { Image } from "./video";
import { useAppSelector, useDraggable } from "@/lib/hooks";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import { HandleComponent } from "./ui/handle-component";
import { cn } from "@/lib/utils";

export function Images() {
  const images = useAppSelector((state) => state.feature.images);
  const currentTime = useAppSelector((state) => state.video.currentTime);

  const currentImages = images.filter(
    (image) =>
      image.secondsRange.start <= currentTime &&
      image.secondsRange.end >= currentTime
  );

  return currentImages.map((image) => <Image key={image.id} image={image} />);
}

export function Image({ image }: { image: Image }) {
  const videoId = useAppSelector((state) => state.video.videoId);
  const focusedComponent = useAppSelector(
    (state) => state.feature.focusedComponent
  );

  const { setPosition, setFocus, setSize } = useDraggable(image);

  return (
    <Rnd
      className={cn("z-50", {
        "border-2 border-purple-400": focusedComponent?.id === image.id,
      })}
      size={{ width: image.width, height: image.height }}
      position={{
        x: image.x,
        y: image.y,
      }}
      bounds={"parent"}
      onResizeStop={(_, __, ref, ___, position) => setSize(ref, position)}
      onResizeStart={() => setFocus()}
      onDragStop={(_, data) => setPosition(data)}
      onMouseDown={() => setFocus()}
      resizeHandleComponent={{ bottomRight: <HandleComponent /> }}
    >
      <NextImage
        alt="Added Image"
        fill
        className="pointer-events-none"
        src={`/api/frames/${videoId}/images/${image.imageName}`}
      />
    </Rnd>
  );
}
