import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  FocusedComponent,
  updateComponent,
} from "@/lib/features/frame/frameSlice";
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

export function EditText({
  focusedComponent,
}: {
  focusedComponent: FocusedComponent;
}) {
  const texts = useAppSelector((state) => state.frame.texts);
  const focusedText = texts.find((text) => text.id === focusedComponent?.id);

  const dispatch = useAppDispatch();

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
                updateComponent({
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
                updateComponent({
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
              updateComponent({ ...focusedText, text: ev.currentTarget.value })
            )
          }
        />
      </div>

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
                dispatch(
                  updateComponent({ ...focusedText, textColor: newColor })
                )
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
                  updateComponent({
                    ...focusedText,
                    backgroundColor: newColor,
                    bgTransparent: false,
                  })
                )
              }
            />
            <button
              onClick={() =>
                dispatch(
                  updateComponent({ ...focusedText, bgTransparent: true })
                )
              }
              className="mt-1"
            >
              Make Transparent
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
