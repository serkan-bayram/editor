import type { Text } from "./video";
import { cn } from "@/lib/utils";
import { useAppSelector, useDraggable } from "@/lib/hooks";
import { Rnd } from "react-rnd";
import { HandleComponent } from "./ui/handle-component";

export function Texts() {
  const texts = useAppSelector((state) => state.feature.texts);
  const currentTime = useAppSelector((state) => state.video.currentTime);

  const currentTexts = texts.filter(
    (text) =>
      text.secondsRange.start <= currentTime &&
      text.secondsRange.end >= currentTime
  );

  return currentTexts.map((text) => <Text key={text.id} text={text} />);
}

export function Text({ text }: { text: Text }) {
  const { setPosition, setFocus, setSize } = useDraggable(text);

  const focusedComponent = useAppSelector(
    (state) => state.feature.focusedComponent
  );

  return (
    <Rnd
      className={cn("px-2 z-50 text-center text-nowrap", {
        "border-2 border-purple-400": focusedComponent?.id === text.id,
      })}
      style={{
        fontSize: `${text.fontSize}px`,
        color: `${text.textColor}`,
        backgroundColor: `${
          text.bgTransparent ? "#FFFFFF00" : text.backgroundColor
        }`,
      }}
      position={{
        x: text.x,
        y: text.y,
      }}
      size={{ width: text.width, height: text.height }}
      bounds={"parent"}
      onResizeStart={() => setFocus()}
      onResizeStop={(_, __, ref, ___, position) => setSize(ref, position)}
      onDragStop={(_, data) => setPosition(data)}
      onMouseDown={() => setFocus()}
      resizeHandleComponent={{ bottomRight: <HandleComponent /> }}
    >
      <div className="h-full flex items-center justify-center">{text.text}</div>
    </Rnd>
  );
}
