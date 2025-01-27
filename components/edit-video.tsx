"use client";

import { useEffect } from "react";
import { Video } from "./video";
import { SideBar } from "./side-bar";
import { Timeline } from "./timeline";
import { TopBar } from "./top-bar";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setVideoId } from "@/lib/features/videoSlice";
import {
  addComponent,
  deleteComponent,
  setFocus,
} from "@/lib/features/featureSlice";
import { useHotkeys } from "react-hotkeys-hook";

export function EditVideo({ videoId }: { videoId: string }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setVideoId(videoId));
  }, [dispatch, videoId]);

  useHandleLoseFocus();
  useHandleHotKeys();

  return (
    <div className="flex flex-col">
      <TopBar />

      <div className="flex gap-x-1 justify-between">
        <SideBar />

        <Video />
      </div>

      <Timeline />
    </div>
  );
}

function useHandleHotKeys() {
  const focusedComponent = useAppSelector(
    (state) => state.feature.focusedComponent
  );
  const texts = useAppSelector((state) => state.feature.texts);
  const images = useAppSelector((state) => state.feature.images);

  const dispatch = useAppDispatch();

  useHotkeys(
    ["ctrl+v, delete", "escape"],
    (_, handler) => {
      const focusedElement = [...texts, ...images].find(
        (element) => element.id === focusedComponent?.id
      );

      if (!focusedElement) return;

      switch (handler.keys?.join("")) {
        case "v":
          const id = window.crypto.randomUUID();
          dispatch(
            addComponent({
              ...focusedElement,
              id: id,
              secondsRange: {
                start: focusedElement.secondsRange.end,
                end: focusedElement.secondsRange.end + 10,
              },
            })
          );
          break;
        case "delete":
          dispatch(deleteComponent(focusedElement));
          break;
        case "escape":
          dispatch(setFocus(undefined));
          break;
        default:
          break;
      }
    },
    [dispatch, focusedComponent, texts, images]
  );
}

// This decides whick element clicks should lose focus
function useHandleLoseFocus() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;

      const focusContainer = document.querySelector(
        "[data-focus-container='true']"
      );

      if (target.contains(focusContainer)) {
        dispatch(setFocus(undefined));
      }
    }

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, [dispatch]);
}
