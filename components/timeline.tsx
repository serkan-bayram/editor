import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setCurrentTime,
  setIsHoldingSlider,
  setTimelineSliderPos,
} from "@/lib/features/frame/frameSlice";
import { Rnd } from "react-rnd";

const FPS_RATE = 30;

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

  const [thumbnailsContainerWidth, setThumbnailsContainerWidth] = useState(0);

  const thumbnailsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHoldingSlider) return;

    dispatch(
      setTimelineSliderPos(
        (thumbnailsContainerWidth / videoDuration) * currentTime
      )
    );
  }, [currentTime]);

  useEffect(() => {
    if (!thumbnailsContainerRef.current) return;

    setThumbnailsContainerWidth(thumbnailsContainerRef.current.clientWidth);
  }, [thumbnailsContainerRef.current]);

  return (
    <div className="py-8 mt-9 relative flex justify-center flex-col bg-primary rounded-md w-full">
      <Rnd
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
        <div className="flex flex-col items-center -translate-y-3">
          <div className="w-5 aspect-square rounded-full bg-gray-400"></div>
          <div className="h-[168px] w-2 bg-gray-400 -translate-y-2 rounded-lg"></div>
        </div>
      </Rnd>

      <div ref={thumbnailsContainerRef} className="flex px-2 justify-center">
        <div className="w-36 aspect-video border"></div>
        <div className="w-36 aspect-video border"></div>
        <div className="w-36 aspect-video border"></div>
        <div className="w-36 aspect-video border"></div>
        <div className="w-36 aspect-video border"></div>
        <div className="w-36 aspect-video border"></div>
        <div className="w-36 aspect-video border"></div>
        <div className="w-36 aspect-video border"></div>
      </div>
    </div>
  );
}
