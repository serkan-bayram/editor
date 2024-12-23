"use client";

import { Frame } from "./frame";
import { SideBar } from "./side-bar";
import { Timeline } from "./timeline";
import { TopBar } from "./top-bar";

export function EditVideo({
  frameCount,
  videoId,
}: {
  frameCount: number;
  videoId: string;
}) {
  return (
    <div className="flex flex-col">
      <TopBar />

      <div className="flex gap-x-1 justify-between">
        <SideBar videoId={videoId} />

        <Frame videoId={videoId} frameCount={frameCount} />
      </div>

      <Timeline frameCount={frameCount} videoId={videoId} />
    </div>
  );
}
