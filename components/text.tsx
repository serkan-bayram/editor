import type { Text } from "./video";
import { cn } from "@/lib/utils";
import { useAppSelector, useDraggable } from "@/lib/hooks";
import { Rnd } from "react-rnd";

export function Texts() {
  const texts = useAppSelector((state) => state.video.texts);
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

  return (
    <Rnd
      className={cn("px-2 z-50 text-center text-nowrap ")}
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
      onResizeStop={(_, __, ref) => setSize(ref)}
      onDragStop={(_, data) => setPosition(data)}
      onMouseDown={() => setFocus()}
    >
      <div className="h-full flex items-center justify-center">{text.text}</div>
    </Rnd>
  );
}
