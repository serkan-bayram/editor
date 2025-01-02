import Image from "next/image";
import { memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "./ui/input";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSelectedFrame } from "@/lib/features/frame/frameSlice";

const FPS_RATE = 30;

export const Timeline = memo(function Timeline({
  frameCount,
}: {
  frameCount: number;
}) {
  const dispatch = useAppDispatch();
  const videoId = useAppSelector((state) => state.frame.videoId);

  return (
    <Tabs defaultValue="frames">
      <div className="flex items-center justify-between w-full">
        <TabsList>
          <TabsTrigger value="frames">Frames</TabsTrigger>
          <TabsTrigger value="seconds">Seconds</TabsTrigger>
        </TabsList>

        <div className="flex gap-x-2 items-center">
          <div>(Total {frameCount} frames)</div>

          <Input
            onChange={(ev) => {
              const value = ev.currentTarget.value;

              if (parseInt(value)) {
                const frame = parseInt(value);

                const frameDOM = document.querySelector(`#frame-${frame}`);

                if (frameDOM) {
                  frameDOM.scrollIntoView(false);
                  dispatch(setSelectedFrame(frame));
                }
              }
            }}
            className="w-36"
            placeholder="Go to frame"
            type="number"
          />
        </div>
      </div>
      <TabsContent value="frames">
        <div className="w-full p-2 flex gap-x-4 overflow-x-scroll">
          {Array.from({ length: frameCount }).map((_, index) => (
            <button
              id={`frame-${index + 1}`}
              className="flex-shrink-0 rounded-md hover:opacity-75 transition-opacity"
              key={index}
              onClick={() => dispatch(setSelectedFrame(index + 1))}
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
        <div className="w-full p-2 flex gap-x-4 overflow-x-scroll">
          {Array.from({ length: frameCount }).map((_, index) => {
            if (index % FPS_RATE !== 0) return;

            return (
              <button
                className="flex-shrink-0 rounded-md hover:opacity-75 transition-opacity"
                key={index}
                onClick={() => dispatch(setSelectedFrame(index + 1))}
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
