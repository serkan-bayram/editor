import { ClapperboardIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useAppSelector } from "@/lib/hooks";
import { AppState } from "@/lib/features/videoSlice";
import { join } from "path";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { RefObject, useRef } from "react";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import localFont from "@next/font/local";

export function MakeVideo() {
  const { video, feature, timeline } = useAppSelector((state) => state);

  const ffmpegRef = useRef(new FFmpeg());

  async function handleMakeVideo() {
    await makeVideo(
      video.videoId,
      { ...video, ...feature, ...timeline },
      ffmpegRef
    );
  }

  return (
    <Button variant={"secondary"} className="mt-auto" onClick={handleMakeVideo}>
      <ClapperboardIcon />
      Make Video
    </Button>
  );
}

export async function makeVideo(
  videoId: string,
  appState: AppState,
  ffmpegRef: RefObject<FFmpeg>
) {
  const loadFFmpeg = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  };

  await loadFFmpeg();

  const ffmpeg = ffmpegRef.current;

  //   const myFont = localFont({
  //     src: "./font.ttf",
  //     variable: "--font-my-font",
  //   });

  const loadFont = async () => {
    // const fontPath = myFont.src,

    const fontResponse = await fetch("/fonts/font.ttf");
    const fontData = await fontResponse.arrayBuffer();
    await ffmpeg.writeFile("font.ttf", new Uint8Array(fontData));
  };

  await loadFont();

  const { texts, images } = appState;

  const videoInputPath = "original.mp4";
  const outputVideo = "edited_video.mp4";

  let currentLabel = "[0:v]";
  const filters: string[] = [];

  // Add image scaling filters first
  const scaledImageLabels = images.map((_, index) => `[scaled${index}]`);
  images.forEach((image, index) => {
    filters.push(
      `[${index + 1}:v]scale=${image.realWidth}:${image.realHeight}${
        scaledImageLabels[index]
      }`
    );
  });

  // Then add overlay filters for each image
  images.forEach((image, index) => {
    const nextLabel = `[v${index + 1}]`;
    const { start, end } = image.secondsRange;
    filters.push(
      `${currentLabel}${scaledImageLabels[index]}overlay=${image.realX}:${image.realY}:enable='between(t,${start},${end})'${nextLabel}`
    );
    currentLabel = nextLabel;
  });

  texts.forEach((text, index) => {
    const nextLabel = `[v${images.length + index + 1}]`;
    const boxOpacity = text.bgTransparent ? "0.0" : "1.0";
    const { realWidth, realHeight, secondsRange } = text; // Assuming `width` and `height` are provided in the text object

    // Calculate the box position to center the text
    const backgroundX = text.realX;
    const backgroundY = text.realY;
    const textX = `(${backgroundX} + (${realWidth} - text_w) / 2)`;
    const textY = `(${backgroundY} + (${realHeight} - text_h) / 2)`;

    filters.push(
      `${currentLabel}drawbox=x=${backgroundX}:y=${backgroundY}:w=${realWidth}:h=${realHeight}:color=${text.backgroundColor}@${boxOpacity}:t=fill:enable='between(t,${secondsRange.start},${secondsRange.end})'[bg${index}];[bg${index}]drawtext=text='${text.text}':fontfile=font.ttf:fontsize=${text.fontSize}:x=${textX}:y=${textY}:fontcolor=${text.textColor}:enable='between(t,${secondsRange.start},${secondsRange.end})'${nextLabel}`
    );

    currentLabel = nextLabel;
  });

  // Prepare FFmpeg command
  const filterComplex = filters.join(";");

  try {
    await ffmpeg.writeFile(
      "original.mp4",
      await fetchFile(`blob:http://localhost:3000/${videoId}`)
    );

    await ffmpeg.exec([
      "-i",
      videoInputPath,
      ...images.flatMap((image) => ["-i", image.imageName]),
      "-filter_complex",
      filterComplex,
      "-map",
      currentLabel,
      "-pix_fmt",
      "yuv420p",
      outputVideo,
    ]);

    const data = await ffmpeg.readFile("edited_video.mp4");

    const url = URL.createObjectURL(new Blob([data], { type: "video/mp4" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "edited_video.mp4";
    link.click();
  } catch (error) {
    console.error("Error processing video:", error);
    throw error;
  }
}
