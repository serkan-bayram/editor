import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  FocusedComponent,
  updateText,
  updateTextFrames,
} from "@/lib/features/frame/frameSlice";
import { useEffect, useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";

export function EditText({
  focusedComponent,
}: {
  focusedComponent: FocusedComponent;
}) {
  const texts = useAppSelector((state) => state.frame.texts);
  const focusedText = texts.find((text) => text.id === focusedComponent?.id);

  const dispatch = useAppDispatch();

  const firstFrame = focusedText?.frames[0]?.toString() ?? "";
  const lastFrame =
    focusedText?.frames[focusedText.frames.length - 1]?.toString() ?? "";

  const [frameRange, setFrameRange] = useState({
    first: firstFrame,
    last: lastFrame,
  });

  useEffect(() => {
    if (!focusedText) return;

    const { first, last } = frameRange;

    if (parseInt(first) > parseInt(last)) {
      // TODO: Notify user to say this is invalid
      setFrameRange({ first: first, last: first });

      dispatch(
        updateTextFrames({ id: focusedText.id, first: first, last: first })
      );
      return;
    }

    dispatch(
      updateTextFrames({ id: focusedText.id, first: first, last: last })
    );
  }, [frameRange]);

  if (!focusedText) return null;

  return (
    <div className="flex flex-col gap-y-3">
      <div className="text-secondary flex flex-col gap-y-1">
        <div className="text-sm flex items-center justify-between">
          <div>Font Size</div>
          {focusedText.fontSize} px
        </div>
        <div className="flex *:flex-1 gap-x-2">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() =>
              dispatch(
                updateText({
                  ...focusedText,
                  fontSize: focusedText.fontSize - 1,
                })
              )
            }
          >
            <MinusIcon /> Decrease
          </Button>
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() =>
              dispatch(
                updateText({
                  ...focusedText,
                  fontSize: focusedText.fontSize + 1,
                })
              )
            }
          >
            <PlusIcon /> Increase
          </Button>
        </div>
      </div>

      <Separator className="bg-secondary/25" orientation="horizontal" />

      <div className="text-secondary text-sm flex flex-col gap-y-1">
        Text
        <Input
          className="bg-secondary text-primary"
          placeholder="Text"
          defaultValue={focusedText.text}
          onChange={(ev) =>
            dispatch(
              updateText({ ...focusedText, text: ev.currentTarget.value })
            )
          }
        />
      </div>

      <Separator className="bg-secondary/25" orientation="horizontal" />

      <div className="text-secondary text-sm flex flex-col gap-y-1">
        Frame Range
        <div className="flex items-center gap-x-2">
          <Input
            className="bg-secondary text-primary"
            placeholder="First Frame"
            type="number"
            value={frameRange.first}
            onChange={(ev) =>
              setFrameRange({
                first: ev.currentTarget.value,
                last: frameRange.last,
              })
            }
          />
          <div className="text-secondary text-xl">-</div>
          <Input
            className="bg-secondary text-primary"
            placeholder="Last Frame"
            type="number"
            value={frameRange.last}
            onChange={(ev) =>
              setFrameRange({
                first: frameRange.first,
                last: ev.currentTarget.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
