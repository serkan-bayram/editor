import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { EditText } from "./ui/edit-text";
import { Features } from "./ui/editor-bar-features";
import { EditImage } from "./ui/edit-image";
import { useHotkeys } from "react-hotkeys-hook";
import {
  addComponent,
  deleteComponent,
  setFocus,
} from "@/lib/features/video/videoSlice";

export function SideBar() {
  const focusedComponent = useAppSelector(
    (state) => state.video.focusedComponent
  );
  const texts = useAppSelector((state) => state.video.texts);
  const images = useAppSelector((state) => state.video.images);

  const wholeArray = [...texts, ...images];

  const dispatch = useAppDispatch();

  useHotkeys(
    ["ctrl+v, delete", "escape"],
    (_, handler) => {
      const component = wholeArray.find(
        (comp) => comp.id === focusedComponent?.id
      );

      if (!component) return;

      switch (handler.keys?.join("")) {
        case "v":
          const id = window.crypto.randomUUID();
          dispatch(
            addComponent({
              ...component,
              id: id,
              secondsRange: {
                start: component.secondsRange.end,
                end: component.secondsRange.end + 0.1,
              },
            })
          );
          dispatch(setFocus({ component: component.type, id: id }));
          break;
        case "delete":
          dispatch(deleteComponent(component));
          break;
        case "escape":
          dispatch(setFocus(undefined));
          break;
        default:
          break;
      }
    },
    [focusedComponent, wholeArray]
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
