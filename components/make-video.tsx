import { ClapperboardIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useAppSelector } from "@/lib/hooks";
import { AppState } from "@/lib/features/videoSlice";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { RefObject, useRef, useState } from "react";
import { fetchFile } from "@ffmpeg/util";
import { loadFFmpeg, loadFont } from "@/lib/utils";

export function MakeVideo() {
  const { video, feature, timeline } = useAppSelector((state) => state);

  const ffmpegRef = useRef(new FFmpeg());

  const [isPending, setIsPending] = useState(false);

  async function handleMakeVideo() {
    setIsPending(true);
    await makeVideo(
      video.videoId,
      { ...video, ...feature, ...timeline },
      ffmpegRef
    );
    setIsPending(false);
  }

  return (
    <Button
      variant={"secondary"}
      disabled={isPending}
      className="mt-auto"
      onClick={handleMakeVideo}
    >
      <ClapperboardIcon />
      {isPending ? "Yükleniyor..." : "Make Video"}
    </Button>
  );
}

export async function makeVideo(
  videoId: string,
  appState: AppState,
  ffmpegRef: RefObject<FFmpeg>
) {
  await loadFFmpeg(ffmpegRef);

  const ffmpeg = ffmpegRef.current;

  await loadFont(ffmpeg);

  const { texts, images } = appState;

  const inputVideo = "original.mp4";
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

  if (filters.length === 0) {
    return;
  }

  // Prepare FFmpeg command
  const filterComplex = filters.join(";");

  try {
    await ffmpeg.writeFile(
      "original.mp4",
      await fetchFile(`blob:${process.env.NEXT_PUBLIC_URL}/${videoId}`)
    );

    for await (const image of images) {
      await ffmpeg.writeFile(
        `${image.imageName}.jpg`,
        await fetchFile(`blob:${process.env.NEXT_PUBLIC_URL}/${image.imageSrc}`)
      );
    }

    await ffmpeg.exec([
      "-i",
      inputVideo,
      ...images.flatMap((image) => ["-i", `${image.imageName}.jpg`]),
      "-filter_complex",
      filterComplex,
      "-map",
      currentLabel,
      "-map",
      "0:a", // Maps the audio stream from the input video
      "-c:v",
      "libx264", // Specify the video codec
      "-c:a",
      "aac", // Specify the audio codec
      "-pix_fmt",
      "yuv420p",
      outputVideo,
    ]);

    const data = await ffmpeg.readFile(outputVideo);

    const url = URL.createObjectURL(new Blob([data], { type: "video/mp4" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = outputVideo;
    link.click();
  } catch (error) {
    console.error("Error processing video:", error);
  }
}
