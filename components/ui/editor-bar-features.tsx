import { makeVideo } from "@/app/actions";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addText } from "@/lib/features/frame/frameSlice";
import { ClapperboardIcon, TextCursorInputIcon } from "lucide-react";
import { Button } from "./button";

export function Features({ videoId }: { videoId: string }) {
  const dispatch = useAppDispatch();

  const frameState = useAppSelector((state) => state.frame);

  async function handleAddText() {
    dispatch(
      addText({
        id: window.crypto.randomUUID(),
        text: "Hello world",
        x: 20,
        y: 20,
        textColor: `#ffffff`,
        backgroundColor: `#000000`,
        bgTransparent: false,
        fontSize: 20,
        frames: [frameState.selectedFrame],
      })
    );
  }

  async function handleMakeVideo() {
    await makeVideo(videoId, frameState);
  }

  return (
    <div className="flex *:flex-1 flex-wrap gap-x-4 w-full h-full">
      <Button variant={"secondary"} onClick={handleAddText}>
        <TextCursorInputIcon />
        Add Text
      </Button>

      <Button variant={"secondary"} onClick={handleMakeVideo}>
        <ClapperboardIcon />
        Make Video
      </Button>
    </div>
  );
}
