"use client";

import { useEffect } from "react";
import { Frame } from "./frame";
import { SideBar } from "./side-bar";
import { Timeline } from "./timeline";
import { TopBar } from "./top-bar";
import { useAppDispatch } from "@/lib/hooks";
import { setVideoId } from "@/lib/features/frame/frameSlice";

export function EditVideo({
  frameCount,
  videoId,
}: {
  frameCount: number;
  videoId: string;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setVideoId(videoId));
  }, [videoId]);

  return (
    <div className="flex flex-col">
      <TopBar />

      <div className="flex gap-x-1 justify-between">
        <SideBar />

        <Frame frameCount={frameCount} />
      </div>

      <Timeline frameCount={frameCount} />
    </div>
  );
}
