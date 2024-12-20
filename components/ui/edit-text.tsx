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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./button";
import { Separator } from "./separator";
import { Input } from "./input";

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
    <>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                className="text-secondary"
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
              <Button
                className="text-secondary "
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
          </TooltipTrigger>
          <TooltipContent sideOffset={10}>
            <p>Font Size</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator className="bg-secondary mx-2" orientation="vertical" />

      <Input
        className="text-secondary max-w-48 "
        placeholder="Text"
        defaultValue={focusedText.text}
        onChange={(ev) =>
          dispatch(updateText({ ...focusedText, text: ev.currentTarget.value }))
        }
      />

      <Separator className="bg-secondary mx-2" orientation="vertical" />

      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-x-2">
              <Input
                className="text-secondary w-32"
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
                className="text-secondary w-32"
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
          </TooltipTrigger>
          <TooltipContent sideOffset={10}>
            <p>Frame Range</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator className="bg-secondary mx-2" orientation="vertical" />

      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="text-secondary"
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
              size={"icon"}
            >
              <XIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={10}>
            <p>Remove From This Frame</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex items-center ml-auto h-full ">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="text-secondary"
                onClick={() => {
                  dispatch(
                    deleteText({
                      id: focusedText.id,
                    })
                  );

                  dispatch(setFocus(undefined));
                }}
                size={"icon"}
              >
                <TrashIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={10}>
              <p>Remove From Every Frame</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator className="bg-secondary mx-2" orientation="vertical" />

        {/* Temporary solution */}
        <Button onClick={() => dispatch(setFocus(undefined))}>
          Deselect Item
        </Button>
      </div>
    </>
  );
}
