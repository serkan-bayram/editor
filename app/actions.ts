"use server";

import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { redirect } from "next/navigation";
import ffmpeg from "fluent-ffmpeg";
import { UPLOADS_PATH } from "./paths";
import { AppState } from "@/lib/features/videoSlice";

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

  return redirect(`/video/${videoId}`);
}

export async function makeVideo(videoId: string, appState: AppState) {
  const { texts, images } = appState;

  const videoInputPath = join(UPLOADS_PATH, videoId, "original.mp4");
  const outputVideo = join(UPLOADS_PATH, videoId, "edited_video.mp4");

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

    // Add background box filter
    filters.push(
      `${currentLabel}drawbox=x=${backgroundX}:y=${backgroundY}:w=${realWidth}:h=${realHeight}:color=${text.backgroundColor}@${boxOpacity}:t=fill:enable='between(t,${secondsRange.start},${secondsRange.end})'[bg${index}];[bg${index}]drawtext=text='${text.text}':fontsize=${text.fontSize}:x=${textX}:y=${textY}:fontcolor=${text.textColor}:enable='between(t,${secondsRange.start},${secondsRange.end})'${nextLabel}`
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
