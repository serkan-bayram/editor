import { useRef } from "react";
import Image from "next/image";
import { Text, Texts } from "./text";
import { useAppSelector } from "@/lib/hooks";

export type Text = {
  id: string;
  text: string;
  fontSize: number;
  x: number;
  y: number;
  frames: number[];
};

export function Frame({ videoId }: { videoId: string }) {
  const frameRef = useRef<HTMLDivElement>(null);

  const selectedFrame = useAppSelector((state) => state.frame.selectedFrame);

  return (
    <>
      <div className="flex flex-col items-center gap-y-3">
        <div
          ref={frameRef}
          className="relative overflow-hidden w-[800px] h-[400px] mx-auto flex justify-center border"
        >
          <div className="w-full h-full absolute">
            <Texts frameRef={frameRef} />
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
        <div>Frame {selectedFrame}</div>
      </div>
    </>
  );
}
