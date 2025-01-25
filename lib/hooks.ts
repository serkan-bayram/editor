import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";
import type { Image, Text } from "@/components/video";
import {
  setFocus as setComponentFocus,
  updateComponent,
} from "./features/video/videoSlice";
import { DraggableData } from "react-rnd";

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
