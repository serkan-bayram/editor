import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setThumbnailsContainerWidth } from "@/lib/features/timelineSlice";
import { TimelineSlider } from "./timeline-slider";
import { ThumbnailsContainer } from "./thumbnails-container";
import { TimeIndicators } from "./time-indicators";

export const THUMBNAIL_ITEM_WIDTH = 112;
export const THUMBNAILS_COUNT = 8;

export function Timeline() {
  const dispatch = useAppDispatch();

  const videoDuration = useAppSelector((state) => state.video.videoDuration);

  // TODO: If thumbnails count and item width will stay same
  // no point to dispatch it
  useEffect(() => {
    dispatch(
      setThumbnailsContainerWidth(THUMBNAILS_COUNT * THUMBNAIL_ITEM_WIDTH)
    );
  }, [dispatch, videoDuration]);

  // Kind of loading screen
  if (videoDuration === 0)
    return (
      <div className="h-60 mt-6 relative flex justify-center flex-col bg-primary rounded-md w-full "></div>
    );

  return (
    <div className="h-60 mt-6 relative flex justify-center flex-col bg-primary rounded-md w-full ">
      <TimelineSlider />

      <TimeIndicators />

      <ThumbnailsContainer />
    </div>
  );
}
