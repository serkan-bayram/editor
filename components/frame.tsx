import { useRef } from "react";
import Image from "next/image";
import { Text, Texts } from "./text";

export type Text = {
  id: string;
  text: string;
  fontSize: number;
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
  const frameRef = useRef<HTMLDivElement>(null);

  return (
    <>
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
