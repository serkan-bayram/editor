import { makeVideo, uploadImage } from "@/app/actions";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ClapperboardIcon, ImageIcon, TextCursorInputIcon } from "lucide-react";
import { Button } from "./button";
import { ChangeEvent, useRef } from "react";
import { addComponent } from "@/lib/features/featureSlice";

export function Features() {
  const dispatch = useAppDispatch();

  const videoId = useAppSelector((state) => state.video.videoId);
  const currentTime = useAppSelector((state) => state.video.currentTime);

  const imageInputRef = useRef<HTMLInputElement>(null);

  async function handleAddText() {
    dispatch(
      addComponent({
        type: "text",
        id: window.crypto.randomUUID(),
        text: "Hello world",
        x: 20,
        y: 20,
        realX: 20,
        realY: 20,
        width: 200,
        height: 40,
        realWidth: 200,
        realHeight: 40,
        textColor: `#ffffff`,
        backgroundColor: `#000000`,
        bgTransparent: false,
        fontSize: 20,
        secondsRange: {
          start: currentTime,
          end: currentTime + 10,
        },
      })
    );
  }

  async function handleAddImage(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files) {
      console.log("No images selected.");
      return;
    }

    if (files.length > 1) {
      console.log("You can only pick one image at a time.");
      return;
    }

    const imageName = await uploadImage(files[0], videoId);

    dispatch(
      addComponent({
        type: "image",
        id: window.crypto.randomUUID(),
        imageName: imageName,
        width: 200,
        height: 200,
        x: 20,
        y: 20,
        realX: 20,
        realY: 20,
        realWidth: 200,
        realHeight: 40,
        secondsRange: {
          start: currentTime,
          end: currentTime + 10,
        },
      })
    );
  }

  return (
    <div className="flex md:*:flex-1 *:flex-shrink  flex-wrap gap-x-4 w-full h-full">
      <Button variant={"secondary"} onClick={handleAddText}>
        <TextCursorInputIcon />
        Add Text
      </Button>

      <Button
        variant={"secondary"}
        onClick={() => imageInputRef.current?.click()}
      >
        <input
          onChange={handleAddImage}
          ref={imageInputRef}
          className="hidden"
          id="image"
          name="image"
          type="file"
          accept="image/*"
        />
        <ImageIcon />
        Add Image
      </Button>

      <MakeVideo />
    </div>
  );
}

function MakeVideo() {
  const { video, feature, timeline } = useAppSelector((state) => state);

  async function handleMakeVideo() {
    await makeVideo(video.videoId, { ...video, ...feature, ...timeline });
  }

  return (
    <Button variant={"secondary"} className="mt-auto" onClick={handleMakeVideo}>
      <ClapperboardIcon />
      Make Video
    </Button>
  );
}
