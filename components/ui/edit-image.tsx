import { useAppDispatch, useAppSelector, useFrameRange } from "@/lib/hooks";
import {
  FocusedComponent,
  updateText,
  updateImageFrames,
} from "@/lib/features/frame/frameSlice";
import { useEffect, useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FrameRange } from "./frame-range";

export function EditImage({
  focusedComponent,
}: {
  focusedComponent: FocusedComponent;
}) {
  const images = useAppSelector((state) => state.frame.images);
  const focusedImage = images.find(
    (image) => image.id === focusedComponent?.id
  );

  if (!focusedImage) return null;

  return (
    <div className="flex flex-col gap-y-3">
      <FrameRange
        focusedComponent={focusedImage}
        updateFramesFunc={updateImageFrames}
      />
      {/* <div className="text-secondary flex flex-col gap-y-1">
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

      <Separator className="bg-secondary/25" orientation="horizontal" />

      <div className="text-secondary text-sm flex items-center justify-between gap-y-1">
        Text Color
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"secondary"}>
              <div
                style={{ backgroundColor: `${focusedText.textColor}` }}
                className="w-4 h-4 border"
              ></div>
              Open Picker
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <HexColorPicker
              color={focusedText.textColor}
              onChange={(newColor) =>
                dispatch(updateText({ ...focusedText, textColor: newColor }))
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="text-secondary text-sm flex items-center justify-between gap-y-1">
        Background Color
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"secondary"}>
              <div
                style={{ backgroundColor: `${focusedText.backgroundColor}` }}
                className="w-4 h-4 border"
              ></div>
              Open Picker
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <HexColorPicker
              color={focusedText.backgroundColor}
              onChange={(newColor) =>
                dispatch(
                  updateText({
                    ...focusedText,
                    backgroundColor: newColor,
                    bgTransparent: false,
                  })
                )
              }
            />
            <button
              onClick={() =>
                dispatch(updateText({ ...focusedText, bgTransparent: true }))
              }
              className="mt-1"
            >
              Make Transparent
            </button>
          </PopoverContent>
        </Popover>
      </div> */}
    </div>
  );
}
