import type { Image } from "./video";
import { useAppSelector, useDraggable } from "@/lib/hooks";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import { HandleComponent } from "./ui/handle-component";

export function Images() {
  const images = useAppSelector((state) => state.video.images);
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

  const { setPosition, setFocus, setSize } = useDraggable(image);

  return (
    <Rnd
      className="z-50"
      size={{ width: image.width, height: image.height }}
      position={{
        x: image.x,
        y: image.y,
      }}
      bounds={"parent"}
      onDragStop={(_, data) => setPosition(data)}
      onResizeStop={(_, __, ref, ___, position) => setSize(ref, position)}
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
