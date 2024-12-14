import { RefObject, useEffect, useRef, useState } from "react";
import type { Text } from "./frame";
import { cn } from "@/lib/utils";
import { updateText } from "@/lib/features/frame/frameSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export function Texts({
  selectedFrame,
  frameRef,
}: {
  selectedFrame: number;
  frameRef: RefObject<HTMLDivElement | null>;
}) {
  const texts = useAppSelector((state) => state.frame.texts);

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
  const textRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dispatch = useAppDispatch();
  const position = { x: text.x, y: text.y };

  useEffect(() => {
    if (!frameRef.current) return;

    const handleMouseMove = (ev: MouseEvent) => {
      if (!frameRef.current) return;

      if (isDragging) {
        const rect = frameRef.current.getBoundingClientRect();

        dispatch(
          updateText({
            ...text,
            x: ev.clientX - rect.left,
            y: ev.clientY - rect.top,
          })
        );
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    frameRef.current.addEventListener("mousemove", handleMouseMove);
    frameRef.current.addEventListener("mouseup", handleMouseUp);

    return () => {
      frameRef.current?.removeEventListener("mousemove", handleMouseMove);
      frameRef.current?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, position]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  return (
    <div
      ref={textRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      className={cn("text-white text-nowrap absolute select-none cursor-grab", {
        "cursor-grabbing": isDragging,
        "opacity-50": isDragging,
      })}
      onMouseDown={handleMouseDown}
    >
      {text.text}
    </div>
  );
}
