import {
  setIsHoldingSlider,
  setTimelineSliderPos,
} from "@/lib/features/timelineSlice";
import { setCurrentTime } from "@/lib/features/videoSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { calculateCurrentTimeWithSliderPos } from "@/lib/utils";
import { Rnd } from "react-rnd";

export function TimelineSlider() {
  const dispatch = useAppDispatch();

  const timelineSliderPos = useAppSelector(
    (state) => state.timeline.timelineSliderPos
  );

  const thumbnailsContainerWidth = useAppSelector(
    (state) => state.timeline.thumbnailsContainerWidth
  );

  const videoDuration = useAppSelector((state) => state.video.videoDuration);

  return (
    <Rnd
      className="z-20"
      position={{ x: timelineSliderPos || 0, y: 0 }}
      onDrag={(_, data) => {
        dispatch(setTimelineSliderPos(data.x));

        dispatch(
          setCurrentTime(
            calculateCurrentTimeWithSliderPos(
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
  );
}
