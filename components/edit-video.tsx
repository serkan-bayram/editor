"use client";

import { Frame } from "./frame";
import { EditorBar } from "./editor-bar";
import { Timeline } from "./timeline";

export function EditVideo({
  frameCount,
  videoId,
}: {
  frameCount: number;
  videoId: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-x-4 justify-between">
        <EditorBar videoId={videoId} />

        <Frame videoId={videoId} />
      </div>

      <Timeline frameCount={frameCount} videoId={videoId} />
    </div>
  );
}
