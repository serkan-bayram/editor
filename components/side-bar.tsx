import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { EditText } from "./ui/edit-text";
import { Features } from "./ui/editor-bar-features";
import { EditImage } from "./ui/edit-image";
import { useHotkeys } from "react-hotkeys-hook";
import { addComponent } from "@/lib/features/video/videoSlice";

export function SideBar() {
  const focusedComponent = useAppSelector(
    (state) => state.video.focusedComponent
  );
  const texts = useAppSelector((state) => state.video.texts);
  const images = useAppSelector((state) => state.video.images);

  const dispatch = useAppDispatch();

  useHotkeys(
    ["ctrl+v"],
    () => {
      if (!focusedComponent) return;
      console.log(focusedComponent);

      switch (focusedComponent.component) {
        case "image":
          const image = images.find(
            (image) => image.id === focusedComponent.id
          );
          if (!image) return;
          dispatch(
            addComponent({
              ...image,
              id: window.crypto.randomUUID(),
              secondsRange: {
                start: image.secondsRange.end,
                end: image.secondsRange.end + 0.1,
              },
            })
          );
          break;
        case "text":
          const text = texts.find((text) => text.id === focusedComponent.id);
          if (!text) return;
          dispatch(
            addComponent({
              ...text,
              id: window.crypto.randomUUID(),
              secondsRange: {
                start: text.secondsRange.end,
                end: text.secondsRange.end + 0.1,
              },
            })
          );
          break;
        default:
          break;
      }
    },
    [focusedComponent]
  );

  return (
    <div className="self-stretch md:w-[450px] bg-primary rounded-md p-2 ">
      {focusedComponent ? <EditComponent /> : <Features />}
    </div>
  );
}

function EditComponent() {
  const focusedComponent = useAppSelector(
    (state) => state.video.focusedComponent
  );

  if (!focusedComponent) return null;

  switch (focusedComponent.component) {
    case "text":
      return <EditText focusedComponent={focusedComponent} />;
    case "image":
      return <EditImage focusedComponent={focusedComponent} />;
    default:
      return null;
  }
}
