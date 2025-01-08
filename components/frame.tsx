import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Text, Texts } from "./text";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSelectedFrame } from "@/lib/features/frame/frameSlice";
import { PauseIcon, PlayIcon } from "lucide-react";
import { Images } from "./images";

export interface FrameComponent {
  id: string;
  x: number;
  y: number;
  frames: number[];
}

export interface Text extends FrameComponent {
  type: "text";
  text: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  bgTransparent: boolean;
}

export interface Image extends FrameComponent {
  type: "image";
  imageName: string;
  width: number;
  height: number;
}

export function Frame({ frameCount }: { frameCount: number }) {
  const [video, setVideo] = useState<"paused" | "playing">("paused");

  const frameRef = useRef<HTMLDivElement>(null);

  const selectedFrame = useAppSelector((state) => state.frame.selectedFrame);
  const videoId = useAppSelector((state) => state.frame.videoId);

  const dispatch = useAppDispatch();

  // TODO: Use sprite sheets to increase performance
  useEffect(() => {
    let i = selectedFrame === frameCount ? 1 : selectedFrame;

    if (video === "paused") return;

    const interval = setInterval(() => {
      if (i >= frameCount) {
        setVideo("paused");
        clearInterval(interval);
      }

      // TODO: Looks pretty dope but check performance
      document.querySelector(`#frame-${i}`)?.scrollIntoView();

      dispatch(setSelectedFrame(i++));
    }, 30);

    return () => {
      clearInterval(interval);
    };
  }, [video]);

  return (
    <>
      <div className="flex relative flex-shrink-0 w-[800px] flex-col items-center">
        <div ref={frameRef} className="relative overflow-hidden w-full">
          <div className="w-full h-full absolute">
            <Texts />
            <Images />
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
        <div className="h-9 grid-cols-3 grid grid-flow-col items-center w-full">
          <div>Frame {selectedFrame}</div>

          <div className="flex items-center justify-self-center">
            <button onClick={() => setVideo("playing")}>
              <PlayIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setVideo("paused")}>
              <PauseIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="justify-self-end">
            {(selectedFrame / 30).toFixed(1)}s
          </div>
        </div>
      </div>
    </>
  );
}
