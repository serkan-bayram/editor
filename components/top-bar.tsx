import { TrashIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  deleteText,
  setFocus,
  updateText,
} from "@/lib/features/frame/frameSlice";

export function TopBar() {
  const dispatch = useAppDispatch();

  const { texts, selectedFrame, focusedComponent } = useAppSelector(
    (state) => state.frame
  );

  const focusedText = texts.find((text) => text.id === focusedComponent?.id);

  if (!focusedText) return <div className="h-10 mb-1"></div>;

  return (
    <div className="bg-primary mb-1 rounded-md flex h-10 items-center justify-end gap-x-4 px-2">
      <div className="capitalize mr-auto text-secondary">
        {focusedComponent?.component}
      </div>

      {/* Temporary solution */}
      <Button
        className="text-secondary"
        variant={"ghost"}
        size={"sm"}
        onClick={() => dispatch(setFocus(undefined))}
      >
        Deselect Item
      </Button>

      <Button
        className="text-secondary"
        variant={"ghost"}
        size={"sm"}
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
        <XIcon /> Remove From This Frame
      </Button>

      <Button
        className="bg-red-700 hover:bg-red-900 "
        size={"sm"}
        onClick={() => {
          dispatch(
            deleteText({
              id: focusedText.id,
            })
          );
          dispatch(setFocus(undefined));
        }}
      >
        <TrashIcon />
        Remove From Every Frame
      </Button>
    </div>
  );
}
