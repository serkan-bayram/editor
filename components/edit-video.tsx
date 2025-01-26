"use client";

import { useEffect } from "react";
import { Video } from "./video";
import { SideBar } from "./side-bar";
import { Timeline } from "./timeline";
import { TopBar } from "./top-bar";
import { useAppDispatch } from "@/lib/hooks";
import { setFocus, setVideoId } from "@/lib/features/video/videoSlice";

export function EditVideo({ videoId }: { videoId: string }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setVideoId(videoId));
  }, [videoId]);

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
  }, []);

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
