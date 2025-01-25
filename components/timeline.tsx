import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setCurrentTime,
  setIsHoldingSlider,
  setTimelineSliderPos,
} from "@/lib/features/frame/frameSlice";
import { Rnd } from "react-rnd";
import { TimelineElements } from "./timeline-elements";

const THUMBNAIL_ITEM_WIDTH = 112;

export function Timeline() {
  const dispatch = useAppDispatch();

  const videoDuration = useAppSelector((state) => state.frame.videoDuration);
  const timelineSliderPos = useAppSelector(
    (state) => state.frame.timelineSliderPos
  );
  const currentTime = useAppSelector((state) => state.frame.currentTime);
  const isHoldingSlider = useAppSelector(
    (state) => state.frame.isHoldingSlider
  );

  const [thumbnailsContainerWidth, setThumbnailsContainerWidth] = useState(
    8 * THUMBNAIL_ITEM_WIDTH
  );

  const thumbnailsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHoldingSlider) return;

    dispatch(
      setTimelineSliderPos(
        (thumbnailsContainerWidth / videoDuration) * currentTime
      )
    );
  }, [currentTime]);

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
            setCurrentTime(videoDuration / (thumbnailsContainerWidth / data.x))
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
        <div className="flex  flex-col items-center -translate-y-3">
          <div className="w-5 aspect-square rounded-full bg-gray-400"></div>
          <div className="w-1 h-64 bg-gray-400 -translate-y-2 rounded-lg"></div>
        </div>
      </Rnd>

      <div
        // ref={timeIndicatorsContainerRef}
        style={{ width: `${thumbnailsContainerWidth}px` }}
        className="relative select-none opacity-50 z-10 top-0 left-2 h-8   w-full"
      >
        {Array.from({ length: videoDuration / 5 + 2 }).map((_, index) => {
          return (
            <div
              key={index}
              className="absolute h-4 w-2 text-white"
              style={{
                left: `${
                  (thumbnailsContainerWidth / (videoDuration / 5)) * index
                }px`,
              }}
            >
              {index * 5}s
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
