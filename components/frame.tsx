import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Text } from "./text";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import { addText, frameSlice } from "@/lib/features/frame/frameSlice";

export type Text = {
  text: string;
  x: number;
  y: number;
  frames: number[];
};

export function Frame({
  selectedFrame,
  videoId,
}: {
  selectedFrame: number;
  videoId: string;
}) {
  const dispatch = useAppDispatch();

  const texts = useAppSelector((state) =>
    state.frame.texts.filter((text) => text.frames.includes(selectedFrame))
  );

  function handleAddText() {
    const lastText =
      texts[texts.length - 1] ??
      ({
        text: "",
        x: 0,
        y: 0,
        frames: [],
      } as Text);

    dispatch(
      addText({
        text: "Hello world",
        x: lastText.x + 10,
        y: lastText.y + 10,
        frames: [selectedFrame],
      })
    );
  }

  return (
    <>
      <div className="w-full h-10 bg-primary rounded-md flex items-center p-2">
        <Button onClick={handleAddText} className="text-secondary" size={"sm"}>
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
    </>
  );
}
