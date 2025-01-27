import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAppSelector } from "./hooks";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateCurrentTimeViaSliderPos(
  thumbnailsContainerWidth: number,
  videoDuration: number,
  sliderPos: number
) {
  return videoDuration / (thumbnailsContainerWidth / sliderPos);
}
