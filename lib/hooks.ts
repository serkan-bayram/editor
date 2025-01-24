import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";
import { useEffect, useState } from "react";
import type { Image, Text } from "@/components/frame";
import {
  setFocus as setComponentFocus,
  updateComponent,
  updateComponentFrames,
} from "./features/frame/frameSlice";
import { DraggableData, ResizableDelta } from "react-rnd";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export function useDraggable(focusedComponent: Text | Image) {
  const dispatch = useAppDispatch();

  function setFocus() {
    dispatch(
      setComponentFocus({
        component: focusedComponent.type,
        id: focusedComponent.id,
      })
    );
  }

  function setPosition(data: DraggableData) {
    dispatch(
      updateComponent({
        ...focusedComponent,
        x: data.lastX,
        y: data.lastY,
      })
    );
  }

  function setSize(ref: HTMLElement, focusedComponent: Image) {
    dispatch(
      updateComponent({
        ...focusedComponent,
        width: parseFloat(ref.style.width),
        height: parseFloat(ref.style.height),
      })
    );
  }

  return {
    setFocus,
    setPosition,
    setSize,
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
