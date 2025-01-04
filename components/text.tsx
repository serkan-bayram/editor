import { RefObject, useEffect, useRef, useState } from "react";
import type { Text } from "./frame";
import { cn } from "@/lib/utils";
import { setFocus, updateComponent } from "@/lib/features/frame/frameSlice";
import { useAppDispatch, useAppSelector, useDraggable } from "@/lib/hooks";

export function Texts({
  frameRef,
}: {
  frameRef: RefObject<HTMLDivElement | null>;
}) {
  const texts = useAppSelector((state) => state.frame.texts);
  const selectedFrame = useAppSelector((state) => state.frame.selectedFrame);

  const frameTexts = texts.filter((text) =>
    text.frames.includes(selectedFrame)
  );

  return frameTexts.map((text) => (
    <Text key={text.id} text={text} frameRef={frameRef} />
  ));
}

export function Text({
  text,
  frameRef,
}: {
  text: Text;
  frameRef: RefObject<HTMLDivElement | null>;
}) {
  const textRef = useRef<HTMLButtonElement>(null);

  const { position, handleFocus, handleMouseDown, isDragging, isFocused } =
    useDraggable(text, frameRef);

  return (
    <button
      onFocus={handleFocus}
      ref={textRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        fontSize: `${text.fontSize}px`,
        color: `${text.textColor}`,
        backgroundColor: `${
          text.bgTransparent ? "#FFFFFF00" : text.backgroundColor
        }`,
      }}
      className={cn("px-2 text-nowrap absolute select-none cursor-grab", {
        "cursor-grabbing": isDragging,
        "opacity-50": isDragging,
        "border border-white": isFocused,
      })}
      onMouseDown={handleMouseDown}
    >
      {text.text}
    </button>
  );
}
