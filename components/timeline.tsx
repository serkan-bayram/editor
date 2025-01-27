import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setThumbnailsContainerWidth } from "@/lib/features/timelineSlice";
import { TimelineSlider } from "./timeline-slider";
import { ThumbnailsContainer } from "./thumbnails-container";
import { TIME_SKIP, TimeIndicators } from "./time-indicators";

export const THUMBNAIL_ITEM_WIDTH = 112;

export function Timeline() {
  const dispatch = useAppDispatch();

  const videoDuration = useAppSelector((state) => state.video.videoDuration);

  const thumbnailsCount = Math.ceil(videoDuration / TIME_SKIP);

  useEffect(() => {
    dispatch(
      setThumbnailsContainerWidth(thumbnailsCount * THUMBNAIL_ITEM_WIDTH)
    );
  }, [videoDuration]);

  // Kind of loading screen
  if (videoDuration === 0)
    return (
      <div className="h-60 mt-6 relative flex justify-center flex-col bg-primary rounded-md w-full "></div>
    );

  return (
    <div className="h-60  mt-6 relative flex justify-center flex-col bg-primary rounded-md w-full ">
      <TimelineSlider />

      <TimeIndicators />

      <ThumbnailsContainer />
    </div>
  );
}
