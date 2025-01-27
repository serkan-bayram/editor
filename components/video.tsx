import { RefObject, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { Text, Texts } from "./text";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setClientVideoDimensions,
  setCurrentTime,
  setRealVideoDimensions,
  setVideoDuration,
} from "@/lib/features/videoSlice";
import { Images } from "./images";
import { setTimelineSliderPos } from "@/lib/features/timelineSlice";
import { calculateSliderPosWithCurrentTime } from "@/lib/utils";

export interface VideoComponent {
  id: string;
  x: number;
  y: number;
  realX: number; // These are calculated via the real dimensions of video
  realY: number;
  width: number;
  height: number;
  realWidth: number;
  realHeight: number;
  secondsRange: {
    start: number;
    end: number;
  };
}

export interface Text extends VideoComponent {
  type: "text";
  text: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  bgTransparent: boolean;
}

export interface Image extends VideoComponent {
  type: "image";
  imageName: string;
}

export function Video() {
  const videoId = useAppSelector((state) => state.video.videoId);
  const videoDuration = useAppSelector((state) => state.video.videoDuration);
  const currentTime = useAppSelector((state) => state.video.currentTime);
  const client = useAppSelector((state) => state.video.videoDimensions.client);

  const isHoldingSlider = useAppSelector(
    (state) => state.timeline.isHoldingSlider
  );
  const thumbnailsContainerWidth = useAppSelector(
    (state) => state.timeline.thumbnailsContainerWidth
  );

  const videoRef = useRef<HTMLVideoElement>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!videoRef.current) return;
    if (!isHoldingSlider) return;

    videoRef.current.currentTime = currentTime;
  }, [videoRef.current, currentTime]);

  const containerRef = useCallback((node: HTMLDivElement) => {
    if (!node) return;

    const resizeObserver = new ResizeObserver(() => {
      dispatch(
        setClientVideoDimensions({
          width: node.clientWidth,
          height: node.clientHeight,
        })
      );
    });

    resizeObserver.observe(node);
  }, []);

  return (
    <>
      <div className="flex relative w-full flex-col items-center">
        <div
          ref={containerRef}
          style={{
            height: client.height,
          }}
          className="relative w-fit overflow-hidden flex items-center justify-center"
        >
          <div className="w-full h-full absolute">
            <Texts />
            <Images />
          </div>

          <video
            onLoadedMetadata={(e) => {
              dispatch(setVideoDuration(e.currentTarget.duration));

              dispatch(
                setRealVideoDimensions({
                  width: e.currentTarget.videoWidth,
                  height: e.currentTarget.videoHeight,
                })
              );
            }}
            onTimeUpdate={(e) => {
              dispatch(setCurrentTime(e.currentTarget.currentTime));

              dispatch(
                setTimelineSliderPos(
                  calculateSliderPosWithCurrentTime(
                    thumbnailsContainerWidth,
                    videoDuration,
                    e.currentTarget.currentTime
                  )
                )
              );
            }}
            ref={videoRef}
            controls
            className="bg-black rounded-md w-fit h-full object-contain "
            src={`/${videoId}/original.mp4`}
          ></video>
        </div>
      </div>
    </>
  );
}
