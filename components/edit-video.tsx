"use client";

import Image from "next/image";
import { Dispatch, memo, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Text } from "./text";
import { useAppSelector } from "@/lib/hooks";

export type Text = {
  text: string;
  x: number;
  y: number;
};

export function EditVideo({
  frameCount,
  videoId,
}: {
  frameCount: number;
  videoId: string;
}) {
  const count = useAppSelector((state) => state.frame.value);

  const [selectedFrame, setSelectedFrame] = useState<number>(1);

  const [texts, setTexts] = useState<Text[]>([]);

  function addText() {
    const lastText = texts[texts.length - 1] ?? { x: 0, y: 0 };

    setTexts((prevValues) => [
      ...prevValues,
      { text: "Hello world", x: lastText.x + 15, y: lastText.y + 15 },
    ]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full h-10 bg-primary rounded-md flex items-center p-2">
        <Button onClick={addText} className="text-secondary" size={"sm"}>
          Add Text
        </Button>
      </div>

      <div className="relative flex justify-center border">
        <div className="w-[600px] absolute">
          {texts.map((text, index) => (
            <Text key={index} text={text} />
          ))}
        </div>
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
