"use client";

import { useEffect } from "react";
import { Frame } from "./frame";
import { SideBar } from "./side-bar";
import { Timeline } from "./timeline";
import { TopBar } from "./top-bar";
import { useAppDispatch } from "@/lib/hooks";
import { setVideoId } from "@/lib/features/frame/frameSlice";

export function EditVideo({ videoId }: { videoId: string }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setVideoId(videoId));
  }, [videoId]);

  return (
    <div className="flex flex-col">
      <TopBar />

      <div className="flex gap-x-1 justify-between">
        <SideBar />

        <Frame />
      </div>

      <Timeline />
    </div>
  );
}
