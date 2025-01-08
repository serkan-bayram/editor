import { useAppSelector } from "@/lib/hooks";
import { FocusedComponent } from "@/lib/features/frame/frameSlice";
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
      <FrameRange focusedComponent={focusedImage} />
    </div>
  );
}
