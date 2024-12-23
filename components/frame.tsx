import { useRef } from "react";
import Image from "next/image";
import { Text, Texts } from "./text";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";
import { deleteText, setFocus } from "@/lib/features/frame/frameSlice";

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

  const focusedText = useAppSelector((state) => state.frame.focusedComponent);

  const dispatch = useAppDispatch();

  return (
    <>
      <div className="flex relative flex-shrink-0 w-[800px] flex-col items-center gap-y-3">
        {focusedText && (
          <Button
            className="bg-red-700 hover:bg-red-900 absolute -top-1 -translate-y-full right-0 text-secondary"
            onClick={() => {
              dispatch(
                deleteText({
                  id: focusedText.id,
                })
              );
              dispatch(setFocus(undefined));
            }}
          >
            Remove From Every Frame
            <TrashIcon />
          </Button>
        )}
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
        <div>Frame {selectedFrame}</div>
      </div>
    </>
  );
}
