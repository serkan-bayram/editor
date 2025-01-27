import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ImageIcon, TextCursorInputIcon } from "lucide-react";
import { Button } from "./button";
import { ChangeEvent, useRef } from "react";
import { addComponent } from "@/lib/features/featureSlice";
import { MakeVideo } from "../make-video";
import { loadFFmpeg } from "@/lib/utils";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export function Features() {
  const dispatch = useAppDispatch();

  const currentTime = useAppSelector((state) => state.video.currentTime);

  const ffmpegRef = useRef(new FFmpeg());

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

    await loadFFmpeg(ffmpegRef);

    const imageData = await fetchFile(files[0]);

    const imageId = window.crypto.randomUUID();

    await ffmpegRef.current.writeFile(`${imageId}.jpg`, imageData);

    const data = await ffmpegRef.current.readFile(`${imageId}.jpg`);

    const src = URL.createObjectURL(new Blob([data], { type: "image/jpeg" }));

    const arr = src.split("/");

    dispatch(
      addComponent({
        type: "image",
        id: imageId,
        imageName: imageId,
        imageSrc: arr[arr.length - 1],
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
