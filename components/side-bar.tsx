import { useAppSelector } from "@/lib/hooks";
import { EditText } from "./ui/edit-text";
import { Features } from "./ui/editor-bar-features";
import { EditImage } from "./ui/edit-image";

export function SideBar() {
  const focusedComponent = useAppSelector(
    (state) => state.feature.focusedComponent
  );

  return (
    <div className="self-stretch md:w-[450px] bg-primary rounded-md p-2 ">
      {focusedComponent ? <EditComponent /> : <Features />}
    </div>
  );
}

function EditComponent() {
  const focusedComponent = useAppSelector(
    (state) => state.feature.focusedComponent!
  );

  switch (focusedComponent.component) {
    case "text":
      return <EditText focusedComponent={focusedComponent} />;
    case "image":
      return <EditImage focusedComponent={focusedComponent} />;
    default:
      return null;
  }
}
