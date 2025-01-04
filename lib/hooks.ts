import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";
import { RefObject, useEffect, useState } from "react";
import type { Image, Text } from "@/components/frame";
import {
  setFocus,
  updateComponent,
  updateComponentFrames,
} from "./features/frame/frameSlice";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export function useDraggable(
  focusedComponent: Image | Text,
  frameRef: RefObject<HTMLDivElement | null>
) {
  const [isDragging, setIsDragging] = useState(false);

  const dispatch = useAppDispatch();
  const position = { x: focusedComponent.x, y: focusedComponent.y };

  const isFocused = useAppSelector(
    (state) => state.frame.focusedComponent?.id === focusedComponent.id
  );

  useEffect(() => {
    if (!frameRef.current) return;

    function handleMouseMove(ev: MouseEvent) {
      if (!frameRef.current) return;

      if (isDragging) {
        const rect = frameRef.current.getBoundingClientRect();

        dispatch(
          updateComponent({
            ...focusedComponent,
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
    dispatch(
      setFocus({ component: focusedComponent.type, id: focusedComponent.id })
    );
  }

  return {
    isFocused,
    isDragging,
    setIsDragging,
    handleMouseDown,
    handleFocus,
    position,
  };
}

export function useFrameRange(focusedComponent: Image | Text) {
  const dispatch = useAppDispatch();

  const firstFrame = focusedComponent?.frames[0]?.toString() ?? "";
  const lastFrame =
    focusedComponent?.frames[focusedComponent.frames.length - 1]?.toString() ??
    "";

  const [frameRange, setFrameRange] = useState({
    first: firstFrame,
    last: lastFrame,
  });
  console.log(frameRange);

  useEffect(() => {
    if (!focusedComponent) return;

    const { first, last } = frameRange;

    if (parseInt(first) > parseInt(last)) {
      // TODO: Notify user to say this is invalid
      setFrameRange({ first: first, last: first });

      dispatch(
        updateComponentFrames({ ...focusedComponent, first: first, last: last })
      );
      return;
    }

    dispatch(
      updateComponentFrames({ ...focusedComponent, first: first, last: last })
    );
  }, [frameRange]);

  return { frameRange, setFrameRange };
}
