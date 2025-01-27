import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setCurrentTime,
  setIsHoldingSlider,
  setThumbnailsContainerWidth,
  setTimelineSliderPos,
} from "@/lib/features/video/videoSlice";
import { Rnd } from "react-rnd";
import { TimelineElements } from "./timeline-elements";
import { calculateCurrentTimeViaSliderPos } from "@/lib/utils";

const THUMBNAIL_ITEM_WIDTH = 112;

export function Timeline() {
  const dispatch = useAppDispatch();

  const videoDuration = useAppSelector((state) => state.video.videoDuration);
  const timelineSliderPos = useAppSelector(
    (state) => state.video.timelineSliderPos
  );
  const currentTime = useAppSelector((state) => state.video.currentTime);
  const isHoldingSlider = useAppSelector(
    (state) => state.video.isHoldingSlider
  );

  const [thumbnailsContainerWidth, _] = useState<number>(
    8 * THUMBNAIL_ITEM_WIDTH
  );

  const thumbnailsContainerRef = useRef<HTMLDivElement>(null);

  // TODO: This is mostly done but I need to tidy the up codebase a bit to make it work
  function handleTimelineIndicatorsClick(
    e: React.MouseEvent<HTMLDivElement | React.MouseEvent>
  ) {
    // const target = e.currentTarget as HTMLDivElement;
    // const xPos = e.clientX - target.getBoundingClientRect().left;
    // dispatch(setIsHoldingSlider(true));
    // dispatch(setCurrentTime(videoDuration / (thumbnailsContainerWidth / xPos)));
    // dispatch(setTimelineSliderPos(xPos));
    // dispatch(setIsHoldingSlider(false));
  }

  useEffect(() => {
    dispatch(setThumbnailsContainerWidth(thumbnailsContainerWidth));
  }, [thumbnailsContainerWidth]);

  useEffect(() => {
    if (isHoldingSlider) return;

    dispatch(
      setTimelineSliderPos(
        (thumbnailsContainerWidth / videoDuration) * currentTime
      )
    );
  }, [currentTime, isHoldingSlider]);

  // useEffect(() => {
  //   if (!thumbnailsContainerRef.current) return;

  //   setThumbnailsContainerWidth(thumbnailsContainerRef.current.clientWidth);
  // }, [thumbnailsContainerRef.current]);

  return (
    <div className="h-60  mt-6 relative flex justify-center flex-col bg-primary rounded-md w-full ">
      <Rnd
        className="z-20"
        position={{ x: timelineSliderPos, y: 0 }}
        onDrag={(_, data) => {
          dispatch(setTimelineSliderPos(data.x));

          dispatch(
            setCurrentTime(
              calculateCurrentTimeViaSliderPos(
                thumbnailsContainerWidth,
                videoDuration,
                data.x
              )
            )
          );
        }}
        onDragStart={() => {
          dispatch(setIsHoldingSlider(true));
        }}
        onDragStop={() => {
          dispatch(setIsHoldingSlider(false));
        }}
        dragAxis="x"
        bounds={"parent"}
        enableResizing={false}
      >
        <div className="flex flex-col items-center -translate-y-3">
          <div className="w-5 aspect-square rounded-full bg-gray-400"></div>
          <div className="w-1 h-64 bg-gray-400 -translate-y-2 rounded-lg"></div>
        </div>
      </Rnd>

      <div
        onClick={(e) => handleTimelineIndicatorsClick(e)}
        // ref={timeIndicatorsContainerRef}
        style={{ width: `${thumbnailsContainerWidth}px` }}
        className="cursor-pointer relative select-none opacity-50 z-10 top-0 left-2 h-8   w-full"
      >
        {Array.from({ length: videoDuration / 10 + 2 }).map((_, index) => {
          const leftPos =
            (thumbnailsContainerWidth / (videoDuration / 10)) * index;

          return (
            <div
              key={index}
              className="absolute h-full w-full   text-white"
              style={{
                left: `${leftPos}px`,
              }}
            >
              {index * 10}s
            </div>
          );
        })}
      </div>

      <div className="h-full overflow-y-auto flex gap-y-2 px-2 flex-col relative">
        <div
          ref={thumbnailsContainerRef}
          className="absolute left-2 top-2 flex justify-start"
        >
          <div
            style={{ width: `${THUMBNAIL_ITEM_WIDTH}px` }}
            className="aspect-video border"
          ></div>
          <div
            style={{ width: `${THUMBNAIL_ITEM_WIDTH}px` }}
            className="aspect-video border"
          ></div>
          <div
            style={{ width: `${THUMBNAIL_ITEM_WIDTH}px` }}
            className="aspect-video border"
          ></div>
          <div
            style={{ width: `${THUMBNAIL_ITEM_WIDTH}px` }}
            className="aspect-video border"
          ></div>
          <div
            style={{ width: `${THUMBNAIL_ITEM_WIDTH}px` }}
            className="aspect-video border"
          ></div>
          <div
            style={{ width: `${THUMBNAIL_ITEM_WIDTH}px` }}
            className="aspect-video border"
          ></div>
          <div
            style={{ width: `${THUMBNAIL_ITEM_WIDTH}px` }}
            className="aspect-video border"
          ></div>
          <div
            style={{ width: `${THUMBNAIL_ITEM_WIDTH}px` }}
            className="aspect-video border"
          ></div>
        </div>

        <TimelineElements thumbnailsContainerWidth={thumbnailsContainerWidth} />
      </div>
    </div>
  );
}
