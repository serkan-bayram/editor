"use client";

import { useEffect } from "react";
import { Video } from "./video";
import { SideBar } from "./side-bar";
import { Timeline } from "./timeline";
import { TopBar } from "./top-bar";
import { useAppDispatch } from "@/lib/hooks";
import { setVideoId } from "@/lib/features/video/videoSlice";

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

        <Video />
      </div>

      <Timeline />
    </div>
  );
}
