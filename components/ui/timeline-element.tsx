import { FocusedComponent, setFocus } from "@/lib/features/frame/frameSlice";
import { useAppDispatch } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Rnd } from "react-rnd";

export function TimelineElement({
  thumbnailsContainerWidth,
  children,
  focusedComponent,
  isFocused,
}: {
  thumbnailsContainerWidth: number;
  children: ReactNode;
  focusedComponent: FocusedComponent;
  isFocused: boolean;
}) {
  const dispatch = useAppDispatch();

  return (
    <div
      className="h-8 relative"
      style={{ width: `${thumbnailsContainerWidth}px` }}
    >
      <Rnd
        onMouseDown={() =>
          dispatch(
            setFocus({
              id: focusedComponent.id,
              component: focusedComponent.component,
            })
          )
        }
        className={cn(`bg-secondary/20`, {
          "outline outline-2 outline-white rounded-sm": isFocused,
        })}
        default={{ x: 0, y: 0, width: "30%", height: "32px" }}
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
