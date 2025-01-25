import { useEffect, useRef } from "react";
import Image from "next/image";
import { Text, Texts } from "./text";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setClientVideoDimensions,
  setCurrentTime,
  setRealVideoDimensions,
  setVideoDuration,
} from "@/lib/features/video/videoSlice";
import { Images } from "./images";

export interface VideoComponent {
  id: string;
  x: number;
  y: number;
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
  width: number;
  height: number;
}

export function Video() {
  const videoId = useAppSelector((state) => state.video.videoId);
  const currentTime = useAppSelector((state) => state.video.currentTime);
  const isHoldingSlider = useAppSelector(
    (state) => state.video.isHoldingSlider
  );

  const videoRef = useRef<HTMLVideoElement>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!videoRef.current) return;
    if (!isHoldingSlider) return;

    videoRef.current.currentTime = currentTime;
  }, [videoRef.current, currentTime, isHoldingSlider]);

  useEffect(() => {
    if (!videoRef.current) return;

    dispatch(
      setClientVideoDimensions({
        width: videoRef.current.clientWidth,
        height: videoRef.current.clientHeight,
      })
    );
  }, [videoRef.current]);

  return (
    <>
      <div className="flex relative w-full   flex-col items-center">
        <div className="relative overflow-hidden w-full">
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
            }}
            ref={videoRef}
            controls
            className="bg-black rounded-md w-full -z-50 "
            src={`/${videoId}/original.mp4`}
          ></video>
        </div>
      </div>
    </>
  );
}
