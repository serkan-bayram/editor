import { useRef } from "react";
import Image from "next/image";
import { Text, Texts } from "./text";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export type Text = {
  id: string;
  text: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  bgTransparent: boolean;
  x: number;
  y: number;
  frames: number[];
};

export function Frame({ videoId }: { videoId: string }) {
  const frameRef = useRef<HTMLDivElement>(null);

  const selectedFrame = useAppSelector((state) => state.frame.selectedFrame);

  return (
    <>
      <div className="flex relative flex-shrink-0 w-[800px] flex-col items-center gap-y-3">
        <div ref={frameRef} className="relative overflow-hidden w-full">
          <div className="w-full h-full absolute">
            <Texts frameRef={frameRef} />
          </div>
          <Image
            alt={`Frame ${selectedFrame}`}
            src={`/api/frames/${videoId}/${selectedFrame}`}
            height={400}
            priority
            width={800}
            className="bg-black rounded-md"
          />
        </div>
        <div className="h-9">Frame {selectedFrame}</div>
      </div>
    </>
  );
}
