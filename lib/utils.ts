import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { clsx, type ClassValue } from "clsx";
import { RefObject } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateCurrentTimeWithSliderPos(
  thumbnailsContainerWidth: number,
  videoDuration: number,
  sliderPos: number
) {
  return videoDuration / (thumbnailsContainerWidth / sliderPos);
}

export function calculateSliderPosWithCurrentTime(
  thumbnailsContainerWidth: number,
  videoDuration: number,
  currentTime: number
) {
  return (thumbnailsContainerWidth / videoDuration) * currentTime;
}

export function calculateTimelineElementWidth(
  thumbnailsContainerWidth: number,
  start: number,
  end: number,
  videoDuration: number
) {
  return (thumbnailsContainerWidth * (end - start)) / videoDuration;
}

export async function loadFFmpeg(ffmpegRef: RefObject<FFmpeg>) {
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  const ffmpeg = ffmpegRef.current;

  ffmpeg.on("log", ({ message }) => {
    console.log(message);
  });

  // toBlobURL is used to bypass CORS issue, urls with the same
  // domain can be used directly.
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });
}

export async function loadFont(ffmpeg: FFmpeg) {
  const fontResponse = await fetch("/fonts/font.ttf");
  const fontData = await fontResponse.arrayBuffer();
  await ffmpeg.writeFile("font.ttf", new Uint8Array(fontData));
}
