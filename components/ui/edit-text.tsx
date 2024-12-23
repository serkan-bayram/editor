import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  deleteText,
  FocusedComponent,
  setFocus,
  updateText,
  updateTextFrames,
} from "@/lib/features/frame/frameSlice";
import { useEffect, useState } from "react";
import { MinusIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
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

  const selectedFrame = useAppSelector((state) => state.frame.selectedFrame);

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
      <div className="text-secondary flex flex-col gap-1">
        Font Size
        <div className="flex justify-between items-center">
          <Button
            className="hover:bg-secondary/20 text-secondary"
            onClick={() =>
              dispatch(
                updateText({
                  ...focusedText,
                  fontSize: focusedText.fontSize - 1,
                })
              )
            }
            size={"icon"}
          >
            <MinusIcon />
          </Button>
          {focusedText.fontSize} px
          <Button
            className="hover:bg-secondary/20 text-secondary"
            onClick={() =>
              dispatch(
                updateText({
                  ...focusedText,
                  fontSize: focusedText.fontSize + 1,
                })
              )
            }
            size={"icon"}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>

      <Separator className="bg-secondary/25" orientation="horizontal" />

      <div className="text-secondary flex flex-col gap-1">
        Text
        <Input
          className="text-secondary"
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

      <div className="flex flex-col gap-1 text-secondary">
        Frame Range
        <div className="flex items-center gap-x-2">
          <Input
            className="text-secondary "
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
            className="text-secondary "
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

      <Separator className="bg-secondary/25" orientation="horizontal" />

      <Button
        className="hover:bg-secondary/20 text-secondary"
        onClick={() => {
          dispatch(
            updateText({
              ...focusedText,
              frames: focusedText.frames.filter(
                (frame) => frame !== selectedFrame
              ),
            })
          );
          dispatch(setFocus(undefined));
        }}
      >
        Remove From This Frame
      </Button>

      {/* Temporary solution */}
      <Button
        className="hover:bg-secondary/20 text-secondary"
        onClick={() => dispatch(setFocus(undefined))}
      >
        Deselect Item
      </Button>
    </div>
  );
}
