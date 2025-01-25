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

export async function uploadImage(imageFile: File, videoId: string) {
  if (!imageFile) throw new Error("No file uploaded");

  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const imagesDir = join(UPLOADS_PATH, videoId, "images");

  if (!existsSync(imagesDir)) {
    mkdirSync(imagesDir, { recursive: true });
  }

  const imageName = randomUUID();

  const imagePath = join(imagesDir, `${imageName}`);

  await writeFile(imagePath, buffer);

  return imageName;
}

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
  const {
    texts: originalTexts,
    images: originalImages,
    realVideoDimensions,
    clientVideoDimensions,
  } = frameState;

  const { width: clientWidth, height: clientHeight } = clientVideoDimensions;
  const { width: realWidth, height: realHeight } = realVideoDimensions;

  // We scale x and y values to real video
  const texts = originalTexts.map((text) => ({
    ...text,
    x: (realWidth * text.x) / clientWidth,
    y: (realHeight * text.y) / clientHeight,
  }));
  // We can do the max min thing here too but I don't want to calculate text width and heights to do that

  const images = originalImages.map((image) => ({
    ...image,
    // So image won't overflow to sides
    x: Math.max(
      0,
      Math.min(realWidth - image.width, (realWidth * image.x) / clientWidth)
    ),
    y: Math.max(
      0,
      Math.min(realHeight - image.height, (realHeight * image.y) / clientHeight)
    ),
  }));

  const videoInputPath = join(UPLOADS_PATH, videoId, "original.mp4");
  const outputVideo = join(UPLOADS_PATH, videoId, "edited_video.mp4");
  const TEXT_PADDING = 10;

  let currentLabel = "[0:v]";
  const filters: string[] = [];

  // Add image scaling filters first
  const scaledImageLabels = images.map((_, index) => `[scaled${index}]`);
  images.forEach((image, index) => {
    filters.push(
      `[${index + 1}:v]scale=${image.width}:${image.height}${
        scaledImageLabels[index]
      }`
    );
  });

  // Then add overlay filters for each image
  images.forEach((image, index) => {
    const nextLabel = `[v${index + 1}]`;
    const { start, end } = image.secondsRange;
    filters.push(
      `${currentLabel}${scaledImageLabels[index]}overlay=${image.x}:${image.y}:enable='between(t,${start},${end})'${nextLabel}`
    );
    currentLabel = nextLabel;
  });

  // Finally add text filters
  texts.forEach((text, index) => {
    const nextLabel = `[v${images.length + index + 1}]`;
    const boxOpacity = text.bgTransparent ? "0.0" : "1.0";
    const { start, end } = text.secondsRange;
    filters.push(
      `${currentLabel}drawtext=text='${text.text}':fontsize=${text.fontSize}:x=${text.x}:y=${text.y}:fontcolor=${text.textColor}:box=1:boxcolor=${text.backgroundColor}@${boxOpacity}:boxborderw=${TEXT_PADDING}:enable='between(t,${start},${end})'${nextLabel}`
    );
    currentLabel = nextLabel;
  });

  const ffmpegCommand = ffmpeg(videoInputPath); // Removed framerate input option

  // Add image inputs after the main video input
  images.forEach((image) => {
    const imagePath = join(UPLOADS_PATH, videoId, "/images/", image.imageName);
    ffmpegCommand.input(imagePath);
  });

  ffmpegCommand
    .outputOptions(["-pix_fmt yuv420p"]) // Encode video with H264
    .complexFilter(filters)
    .map(currentLabel) // Map the final label from the filter chain
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
