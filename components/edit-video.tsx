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
      <EditorBar videoId={videoId} />

      <Frame videoId={videoId} />

      <Timeline frameCount={frameCount} videoId={videoId} />
    </div>
  );
}
