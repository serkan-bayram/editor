import type { Image } from "./frame";
import { useAppSelector, useDraggable } from "@/lib/hooks";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import { useHotkeys } from "react-hotkeys-hook";
export function Images() {
  const images = useAppSelector((state) => state.frame.images);
  const currentTime = useAppSelector((state) => state.frame.currentTime);

  const frameImages = images.filter(
    (image) =>
      image.secondsRange.start <= currentTime &&
      image.secondsRange.end >= currentTime
  );

  return frameImages.map((image) => <Image key={image.id} image={image} />);
}

export function Image({ image }: { image: Image }) {
  const videoId = useAppSelector((state) => state.frame.videoId);

  const { setPosition, setFocus, setSize } = useDraggable(image);

  return (
    <Rnd
      className="z-50"
      size={{ width: image.width / 2, height: image.height / 2 }}
      position={{
        x: image.x,
        y: image.y,
      }}
      bounds={"parent"}
      onDragStop={(_, data) => setPosition(data)}
      onResizeStop={(_, __, ref) => setSize(ref, image)}
      onMouseDown={() => setFocus()}
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
