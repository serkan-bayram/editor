import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Separator } from "./ui/separator";
import { deleteComponent, setFocus } from "@/lib/features/featureSlice";

export function TopBar() {
  const dispatch = useAppDispatch();

  const focusedComponent = useAppSelector(
    (state) => state.feature.focusedComponent
  );
  const texts = useAppSelector((state) => state.feature.texts);
  const images = useAppSelector((state) => state.feature.images);

  if (!focusedComponent) return <div className="h-10 mb-1"></div>;

  const focusedElement = [...texts, ...images].find(
    (element) => element.id === focusedComponent.id
  );

  return (
    <div className="bg-primary mb-1 rounded-md flex h-10 items-center justify-end gap-x-4 px-2">
      <div
        title="Selected item"
        className="capitalize mr-auto text-sm text-secondary"
      >
        {focusedComponent?.component}
      </div>

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
        className="bg-red-700 hover:bg-red-900 "
        size={"sm"}
        onClick={() => {
          if (focusedElement) {
            dispatch(deleteComponent(focusedElement));
          }

          dispatch(setFocus(undefined));
        }}
      >
        Remove
      </Button>
    </div>
  );
}
