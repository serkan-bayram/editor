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
  const { setPosition, setFocus } = useDraggable(text);

  return (
    <Rnd
      className={cn("px-2 z-50 text-nowrap flex items-center justify-center")}
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
      bounds={"parent"}
      enableResizing={false}
      onDragStop={(_, data) => setPosition(data)}
      onMouseDown={() => setFocus()}
    >
      {text.text}
    </Rnd>
  );
}
