import { useFrameRange } from "@/lib/hooks";
import { Input } from "./input";
import type { Image, Text } from "../frame";

export function FrameRange({
  focusedComponent,
  updateFramesFunc,
}: {
  focusedComponent: Image | Text;
  updateFramesFunc: any;
}) {
  const { frameRange, setFrameRange } = useFrameRange(
    focusedComponent,
    updateFramesFunc
  );

  return (
    <div className="text-secondary text-sm flex flex-col gap-y-1">
      Frame Range
      <div className="flex items-center gap-x-2">
        <Input
          className="bg-secondary text-primary"
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
          className="bg-secondary text-primary"
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
    </div>
  );
}
