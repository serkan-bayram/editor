"use client";

import Image from "next/image";
import { Dispatch, memo, SetStateAction, useState } from "react";

export function EditVideo({
  frameCount,
  videoId,
}: {
  frameCount: number;
  videoId: string;
}) {
  const [selectedFrame, setSelectedFrame] = useState<number>(1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center border">
        <Image
          alt={`Frame ${selectedFrame}`}
          src={`/api/frames/${videoId}/${selectedFrame}`}
          height={600}
          priority
          width={600}
          className="flex-shrink-0 bg-black rounded-md"
        />
      </div>

      <Timeline
        frameCount={frameCount}
        videoId={videoId}
        setSelectedFrame={setSelectedFrame}
      />
    </div>
  );
}

export const Timeline = memo(function Timeline({
  frameCount,
  videoId,
  setSelectedFrame,
}: {
  frameCount: number;
  videoId: string;
  setSelectedFrame: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="p-2 border flex gap-x-4 overflow-x-scroll">
      {Array.from({ length: frameCount }).map((_, index) => (
        <button
          className="flex-shrink-0 rounded-md hover:opacity-75 transition-opacity"
          key={index}
          onClick={() => setSelectedFrame(index + 1)}
        >
          <Image
            loading="lazy"
            className="rounded-md"
            alt={`Frame ${index + 1}`}
            src={`/api/frames/${videoId}/${index + 1}`}
            width={192}
            height={96}
          />
          Frame {index + 1}
        </button>
      ))}
    </div>
  );
});
