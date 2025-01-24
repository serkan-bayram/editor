import {
  setCurrentTime,
  setFocus,
  setIsHoldingSlider,
  setTimelineSliderPos,
  updateComponent,
} from "@/lib/features/frame/frameSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { Image, Text } from "../frame";

const DEFAULT_WIDTH = 200;

export function TimelineElement({
  thumbnailsContainerWidth,
  children,
  component,
}: {
  thumbnailsContainerWidth: number;
  children: ReactNode;
  component: Text | Image;
}) {
  const dispatch = useAppDispatch();

  const focusedComponent = useAppSelector(
    (state) => state.frame.focusedComponent
  );

  const videoDuration = useAppSelector((state) => state.frame.videoDuration);

  const isFocused = focusedComponent?.id === component.id;

  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [xPos, setXPos] = useState(0);

  useEffect(() => {
    const start = videoDuration / (thumbnailsContainerWidth / xPos);
    const end = videoDuration / (thumbnailsContainerWidth / (xPos + width));

    dispatch(
      updateComponent({
        ...component,
        secondsRange: { start: start, end: end },
      })
    );
  }, [width, xPos]);

  return (
    <div
      className="h-8 relative"
      style={{ width: `${thumbnailsContainerWidth}px` }}
    >
      <Rnd
        onMouseDown={(e) => {
          dispatch(
            setFocus({
              id: component.id,
              component: component.type,
            })
          );
        }}
        onResizeStop={(_, __, ref) => {
          setWidth(ref.clientWidth);
        }}
        onDragStop={(_, data) => {
          setXPos(data.x);
        }}
        className={cn(`bg-secondary/20`, {
          "outline outline-2 outline-white rounded-sm": isFocused,
        })}
        default={{ x: 0, y: 0, width: `${DEFAULT_WIDTH}px`, height: "32px" }}
        minWidth={"40px"}
        enableResizing={{
          top: false,
          bottom: false,
          left: true,
          right: true,
        }}
        bounds={"parent"}
      >
        <div className="absolute w-3 h-full bg-purple-400 top-0 left-0 rounded-tl-sm rounded-bl-sm"></div>
        {children}
        <div className="absolute w-3 h-full bg-purple-400 top-0 right-0 rounded-tr-sm rounded-br-sm"></div>
      </Rnd>
    </div>
  );
}
