"use server";

import { randomUUID } from "crypto";
import { readdir, writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { redirect } from "next/navigation";
import { divideFrames } from "@/lib/divide-frames";
import ffmpeg from "fluent-ffmpeg";
import { UPLOADS_PATH } from "./paths";
import { FrameState } from "@/lib/features/frame/frameSlice";

export async function uploadVideo(formData: FormData) {
  const videoId = randomUUID();

  const file: File | null = formData.get("video") as unknown as File;

  if (!file) throw new Error("No file uploaded");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const videoDir = join(UPLOADS_PATH, videoId);

  if (!existsSync(videoDir)) {
    mkdirSync(videoDir, { recursive: true });
  }

  // TODO: Save original extension instead of .mp4
  const videoPath = join(videoDir, "original.mp4");

  await writeFile(videoPath, buffer);

  await divideFrames(videoId);

  return redirect(`/video/${videoId}`);
}

export async function makeVideo(videoId: string, frameState: FrameState) {
  const texts = frameState.texts;

  const framesPattern = join(UPLOADS_PATH, videoId, "/frames/", "%d.png");

  const outputVideo = join(UPLOADS_PATH, videoId, "edited_video.mp4");

  const TEXT_PADDING = 10;

  const complexFilters = texts.map((text, index) => {
    let startLabel = `[v${index}]`;
    let endLabel = `[v${index + 1}]`;

    const boxOpacity = text.bgTransparent ? "0.0" : "1.0";

    if (index === 0) {
      startLabel = "[0:v]";
      endLabel = "[v1]";
    }

    return `${startLabel}drawtext=text='${text.text}':fontsize=${
      text.fontSize
    }:x=${text.x}:y=${text.y}:fontcolor=${text.textColor}:box=1:boxcolor=${
      text.backgroundColor
    }@${boxOpacity}:boxborderw=${TEXT_PADDING}:enable='between(n,${
      text.frames[0]
    },${text.frames[text.frames.length - 1]})'${endLabel}`;
  });

  ffmpeg(framesPattern)
    .inputOptions(["-framerate 30"]) // Set input framerate
    .outputOptions(["-pix_fmt yuv420p"]) // Encode video with H264
    .complexFilter(complexFilters)
    .map(`[v${complexFilters.length}]`) // Map the final filtered video stream
    .on("start", () => console.log("Processing started..."))
    .on("progress", (progress) => {
      if (progress.frames) {
        console.log(`Frames processed: ${progress.frames}`);
      }
    })
    .on("end", () => console.log("Video created successfully!"))
    .on("error", (err) => console.error("Error: ", err))
    .save(outputVideo);
}

export async function getFrameCount(videoId: string) {
  const framesDir = join(UPLOADS_PATH, videoId, "/frames/");

  try {
    const dir = await readdir(framesDir);

    return dir.length;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Cannot get frame count");
  }
}
