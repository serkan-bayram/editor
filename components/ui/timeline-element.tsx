import { setFocus, updateComponent } from "@/lib/features/featureSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  calculateCurrentTimeWithSliderPos,
  calculateSliderPosWithCurrentTime,
  calculateTimelineElementWidth,
  cn,
} from "@/lib/utils";
import { ReactNode } from "react";
import { Rnd } from "react-rnd";
import { Image, Text } from "../video";

export function TimelineElement({
  children,
  component,
}: {
  children: ReactNode;
  component: Text | Image;
}) {
  const dispatch = useAppDispatch();

  const thumbnailsContainerWidth = useAppSelector(
    (state) => state.timeline.thumbnailsContainerWidth
  );
  const focusedComponent = useAppSelector(
    (state) => state.feature.focusedComponent
  );
  const videoDuration = useAppSelector((state) => state.video.videoDuration);

  const isFocused = focusedComponent?.id === component.id;

  const { secondsRange } = component;

  return (
    <div
      className="h-[40px] relative"
      style={{ width: `${thumbnailsContainerWidth}px` }}
    >
      <Rnd
        onMouseDown={() => {
          dispatch(
            setFocus({
              id: component.id,
              component: component.type,
            })
          );
        }}
        onResize={(_, __, ref, ___, position) => {
          const start = calculateCurrentTimeWithSliderPos(
            thumbnailsContainerWidth,
            videoDuration,
            position.x
          );
          const end = calculateCurrentTimeWithSliderPos(
            thumbnailsContainerWidth,
            videoDuration,
            position.x + ref.clientWidth
          );

          dispatch(
            updateComponent({
              ...component,
              secondsRange: { start: start, end: end },
            })
          );
        }}
        onDrag={(_, data) => {
          const start = calculateCurrentTimeWithSliderPos(
            thumbnailsContainerWidth,
            videoDuration,
            data.x
          );
          const end = calculateCurrentTimeWithSliderPos(
            thumbnailsContainerWidth,
            videoDuration,
            data.x + data.node.clientWidth
          );

          dispatch(
            updateComponent({
              ...component,
              secondsRange: { start: start, end: end },
            })
          );
        }}
        className={cn(`bg-secondary/20 overflow-hidden`, {
          "outline outline-2 outline-white rounded-sm": isFocused,
        })}
        default={{
          x: calculateSliderPosWithCurrentTime(
            thumbnailsContainerWidth,
            videoDuration,
            secondsRange.start
          ),
          y: 0,
          width: calculateTimelineElementWidth(
            thumbnailsContainerWidth,
            secondsRange.start,
            secondsRange.end,
            videoDuration
          ),
          height: "40px",
        }}
        minWidth={"1px"}
        enableResizing={{
          top: false,
          bottom: false,
          left: true,
          right: true,
        }}
        bounds={"parent"}
        resizeHandleClasses={{ left: "z-50", right: "z-50" }}
      >
        <div className="flex  w-full overflow-hidden h-full justify-between items-center">
          <div className="w-3 z-20 h-full flex items-center justify-center bg-purple-400 rounded-tl-sm rounded-bl-sm">
            <div className="w-[2px] h-[50%] rounded-full bg-white"></div>
          </div>
          {children}
          <div className="w-3 z-20 h-full bg-purple-400 rounded-tr-sm rounded-br-sm flex items-center justify-center ">
            <div className="w-[2px] h-[50%] rounded-full bg-white"></div>
          </div>
        </div>
      </Rnd>
    </div>
  );
}
