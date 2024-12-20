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
        fontSize: 20,
        frames: [frameState.selectedFrame],
      })
    );
  }

  async function handleMakeVideo() {
    await makeVideo(videoId, frameState);
  }

  return (
    <>
      <Button
        onClick={handleAddText}
        className="hover:bg-secondary/20 text-secondary"
      >
        <TextCursorInputIcon />
        Add Text
      </Button>

      <Button
        onClick={handleMakeVideo}
        className="ml-auto hover:bg-secondary/20 text-secondary"
      >
        <ClapperboardIcon />
        Make Video
      </Button>
    </>
  );
}
