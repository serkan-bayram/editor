import { useRef } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Text, Texts } from "./text";
import { useAppDispatch } from "@/lib/hooks";
import { addText } from "@/lib/features/frame/frameSlice";

export type Text = {
  id: string;
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

  function handleAddText() {
    dispatch(
      addText({
        id: window.crypto.randomUUID(),
        text: "Hello world",
        x: 20,
        y: 20,
        frames: [selectedFrame],
      })
    );
  }

  const frameRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="w-full h-10 bg-primary rounded-md flex items-center p-2">
        <Button onClick={handleAddText} className="text-secondary" size={"sm"}>
          Add Text
        </Button>
      </div>

      <div
        ref={frameRef}
        className="relative overflow-hidden w-[800px] h-[400px] mx-auto flex justify-center border"
      >
        <div className="w-full h-full absolute">
          <Texts frameRef={frameRef} selectedFrame={selectedFrame} />
        </div>
        <Image
          alt={`Frame ${selectedFrame}`}
          src={`/api/frames/${videoId}/${selectedFrame}`}
          height={400}
          priority
          width={800}
          className="flex-shrink-0 bg-black rounded-md"
        />
      </div>
    </>
  );
}
