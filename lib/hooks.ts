import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";
import { useEffect, useState } from "react";
import type { Image, Text } from "@/components/frame";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export function useFrameRange(
  focusedComponent: Image | Text,
  updateFramesFunc: any
) {
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
        updateFramesFunc({
          id: focusedComponent.id,
          first: first,
          last: first,
        })
      );
      return;
    }

    dispatch(
      updateFramesFunc({ id: focusedComponent.id, first: first, last: last })
    );
  }, [frameRange]);

  return { frameRange, setFrameRange };
}
