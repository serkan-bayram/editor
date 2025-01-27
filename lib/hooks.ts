import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";
import type { Image, Text } from "@/components/video";
import {
  setFocus as setComponentFocus,
  updateComponent,
} from "./features/featureSlice";
import { DraggableData, Position } from "react-rnd";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export function useDraggable(focusedComponent: Text | Image) {
  const dispatch = useAppDispatch();

  const realDimensions = useAppSelector(
    (state) => state.video.videoDimensions.real
  );
  const clientDimensions = useAppSelector(
    (state) => state.video.videoDimensions.client
  );

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
        realX: (realDimensions.width * data.lastX) / clientDimensions.width,
        realY: (realDimensions.height * data.lastY) / clientDimensions.height,
      })
    );
  }

  function setSize(ref: HTMLElement, position: Position) {
    dispatch(
      updateComponent({
        ...focusedComponent,
        width: ref.clientWidth,
        height: ref.clientHeight,
        x: position.x,
        y: position.y,
        realX: (realDimensions.width * position.x) / clientDimensions.width,
        realY: (realDimensions.height * position.y) / clientDimensions.height,
        realWidth:
          (realDimensions.width * ref.clientWidth) / clientDimensions.width,
        realHeight:
          (realDimensions.height * ref.clientHeight) / clientDimensions.height,
      })
    );
  }

  return {
    setFocus,
    setPosition,
    setSize,
  };
}
