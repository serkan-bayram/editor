import { clsx, type ClassValue } from "clsx";
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
