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
import { editVideo } from "@/lib/edit-video";

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
  const framesPattern = join(UPLOADS_PATH, videoId, "/frames/", "%d.png");

  await editVideo(frameState, videoId);

  const outputVideo = join(UPLOADS_PATH, videoId, "edited_video.mp4");

  // TODO: Handle errors
  ffmpeg(framesPattern)
    .inputFPS(30) // Set the desired frame rate
    .outputOptions([
      "-pix_fmt yuv420p", // Ensure compatibility with most players
      "-c:v libx264", // Use H.264 encoding
      "-preset fast", // Compression speed
      "-crf 23", // Quality (lower is better; 23 is default)
    ])
    .on("start", () => console.log("Processing started..."))
    .on("progress", (progress) => {
      console.log(`Frames processed: ${progress.frames}`);
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
