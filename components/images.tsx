import { RefObject, useEffect, useRef, useState } from "react";
import type { Image } from "./frame";
import { cn } from "@/lib/utils";
import { setFocus, updateComponent } from "@/lib/features/frame/frameSlice";
import { useAppDispatch, useAppSelector, useDraggable } from "@/lib/hooks";
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

  const videoId = useAppSelector((state) => state.frame.videoId);

  const { position, handleFocus, handleMouseDown, isDragging, isFocused } =
    useDraggable(image, frameRef);

  return (
    <button
      onFocus={handleFocus}
      ref={imageRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${image.width}px`,
        height: `${image.height}px`,
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
        fill
        className="select-none"
        src={`/api/frames/${videoId}/images/${image.imageName}`}
      />
    </button>
  );
}
