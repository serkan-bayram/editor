import { setFocus, updateComponent } from "@/lib/features/frame/frameSlice";
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
  const [xPos, setXPos] = useState(
    (component.secondsRange.start / videoDuration) * thumbnailsContainerWidth
  );

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
      className="h-[40px] relative"
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
        onResize={(_, __, ref) => {
          setWidth(ref.clientWidth);
        }}
        onDrag={(_, data) => {
          setXPos(data.x);
        }}
        className={cn(`bg-secondary/20 overflow-hidden`, {
          "outline outline-2 outline-white rounded-sm": isFocused,
        })}
        default={{
          // This formula gives xPos
          x:
            (component.secondsRange.start / videoDuration) *
            thumbnailsContainerWidth,
          y: 0,
          width: `${DEFAULT_WIDTH}px`,
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
