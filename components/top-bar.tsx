import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  deleteImage,
  deleteText,
  setFocus,
  updateImage,
  updateText,
} from "@/lib/features/frame/frameSlice";
import { Separator } from "./ui/separator";

export function TopBar() {
  const dispatch = useAppDispatch();

  const { texts, images, selectedFrame, focusedComponent } = useAppSelector(
    (state) => state.frame
  );

  if (!focusedComponent) return <div className="h-10 mb-1"></div>;

  const focusedText = texts.find((text) => text.id === focusedComponent.id);
  const focusedImage = images.find((image) => image.id === focusedComponent.id);

  return (
    <div className="bg-primary mb-1 rounded-md flex h-10 items-center justify-end gap-x-4 px-2">
      <div
        title="Selected item"
        className="capitalize mr-auto text-sm text-secondary"
      >
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

      <Separator className="bg-secondary/25 h-2/3" orientation="vertical" />

      <Button
        className="text-secondary"
        variant={"ghost"}
        size={"sm"}
        onClick={() => {
          if (focusedText) {
            dispatch(
              updateText({
                ...focusedText,
                frames: focusedText.frames.filter(
                  (frame) => frame !== selectedFrame
                ),
              })
            );
          } else if (focusedImage) {
            dispatch(
              updateImage({
                ...focusedImage,
                frames: focusedImage.frames.filter(
                  (frame) => frame !== selectedFrame
                ),
              })
            );
          }
          dispatch(setFocus(undefined));
        }}
      >
        Remove From This Frame
      </Button>

      <Separator className="bg-secondary/25 h-2/3" orientation="vertical" />

      <Button
        className="bg-red-700 hover:bg-red-900 "
        size={"sm"}
        onClick={() => {
          if (focusedText) {
            dispatch(
              deleteText({
                id: focusedText.id,
              })
            );
          } else if (focusedImage) {
            dispatch(
              deleteImage({
                id: focusedImage.id,
              })
            );
          }
          dispatch(setFocus(undefined));
        }}
      >
        Remove From Every Frame
      </Button>
    </div>
  );
}
