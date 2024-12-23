import { useAppSelector } from "@/lib/hooks";
import { EditText } from "./ui/edit-text";
import { Features } from "./ui/editor-bar-features";

export function SideBar({ videoId }: { videoId: string }) {
  const focusedComponent = useAppSelector(
    (state) => state.frame.focusedComponent
  );

  return (
    <div className="self-stretch mb-9 w-full bg-primary rounded-md p-2 ">
      {focusedComponent ? <EditComponent /> : <Features videoId={videoId} />}
    </div>
  );
}

function EditComponent() {
  const focusedComponent = useAppSelector(
    (state) => state.frame.focusedComponent
  );

  if (!focusedComponent) return null;

  switch (focusedComponent.component) {
    case "text":
      return <EditText focusedComponent={focusedComponent} />;
    default:
      return null;
  }
}
