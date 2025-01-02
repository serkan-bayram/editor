import { RefObject, useEffect, useRef, useState } from "react";
import type { Image, Text } from "./frame";
import { cn } from "@/lib/utils";
import {
  setFocus,
  updateImage,
  updateText,
} from "@/lib/features/frame/frameSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import NextImage from "next/image";

export function Images({
  frameRef,
}: {
  frameRef: RefObject<HTMLDivElement | null>;
}) {
  const images = useAppSelector((state) => state.frame.images);
  const selectedFrame = useAppSelector((state) => state.frame.selectedFrame);

  const frameImages = images.filter((image) =>
    image.frames.includes(selectedFrame)
  );

  return frameImages.map((image) => (
    <Image key={image.id} image={image} frameRef={frameRef} />
  ));
}

export function Image({
  image,
  frameRef,
}: {
  image: Image;
  frameRef: RefObject<HTMLDivElement | null>;
}) {
  const imageRef = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dispatch = useAppDispatch();
  const position = { x: image.x, y: image.y };

  const isFocused = useAppSelector(
    (state) => state.frame.focusedComponent?.id === image.id
  );

  const videoId = useAppSelector((state) => state.frame.videoId);

  useEffect(() => {
    if (!frameRef.current) return;

    function handleMouseMove(ev: MouseEvent) {
      if (!frameRef.current) return;

      if (isDragging) {
        const rect = frameRef.current.getBoundingClientRect();

        dispatch(
          updateImage({
            ...image,
            x: ev.clientX - rect.left,
            y: ev.clientY - rect.top,
          })
        );
      }
    }

    function handleMouseUp() {
      setIsDragging(false);
    }

    frameRef.current.addEventListener("mousemove", handleMouseMove);
    frameRef.current.addEventListener("mouseup", handleMouseUp);

    return () => {
      frameRef.current?.removeEventListener("mousemove", handleMouseMove);
      frameRef.current?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, position]);

  function handleMouseDown() {
    setIsDragging(true);
  }

  function handleFocus() {
    dispatch(setFocus({ component: "image", id: image.id }));
  }

  return (
    <button
      onFocus={handleFocus}
      ref={imageRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      className={cn("px-2 text-nowrap absolute select-none cursor-grab", {
        "cursor-grabbing": isDragging,
        "opacity-50": isDragging,
        "border border-white": isFocused,
      })}
      onMouseDown={handleMouseDown}
    >
      <NextImage
        alt="Added Image"
        width={image.width}
        height={image.height}
        src={`/api/frames/${videoId}/images/${image.imageId}`}
      />
    </button>
  );
}
