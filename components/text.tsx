import { FocusEvent, RefObject, useEffect, useRef, useState } from "react";
import type { Text } from "./frame";
import { cn } from "@/lib/utils";
import { setFocus, updateText } from "@/lib/features/frame/frameSlice";
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
  const textRef = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dispatch = useAppDispatch();
  const position = { x: text.x, y: text.y };

  const isFocused = useAppSelector(
    (state) => state.frame.focusedComponent?.id === text.id
  );

  useEffect(() => {
    if (!frameRef.current) return;

    function handleMouseMove(ev: MouseEvent) {
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
    dispatch(setFocus({ component: "text", id: text.id }));
  }

  return (
    <button
      onFocus={handleFocus}
      ref={textRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        fontSize: `${text.fontSize}px`,
      }}
      className={cn(
        "text-white px-2 text-nowrap absolute select-none cursor-grab",
        {
          "cursor-grabbing": isDragging,
          "opacity-50": isDragging,
          "border border-white": isFocused,
        }
      )}
      onMouseDown={handleMouseDown}
    >
      {text.text}
    </button>
  );
}
