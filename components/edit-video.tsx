"use client";

import Image from "next/image";
import { Dispatch, memo, SetStateAction, useState } from "react";
import { Frame } from "./frame";
import { EditorBar } from "./editor-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FPS_RATE = 30;

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
      <EditorBar videoId={videoId} selectedFrame={selectedFrame} />

      <Frame selectedFrame={selectedFrame} videoId={videoId} />

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
    <Tabs defaultValue="frames">
      <TabsList>
        <TabsTrigger value="frames">frames</TabsTrigger>
        <TabsTrigger value="seconds">seconds</TabsTrigger>
      </TabsList>
      <TabsContent value="frames">
        <div className="w-full p-2 border flex gap-x-4 overflow-x-scroll">
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
      </TabsContent>
      <TabsContent value="seconds">
        <div className="w-full p-2 border flex gap-x-4 overflow-x-scroll">
          {Array.from({ length: frameCount }).map((_, index) => {
            if (index % FPS_RATE !== 0) return;
            return (
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
                {index / FPS_RATE + 1}. Second
              </button>
            );
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
});
