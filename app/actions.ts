"use server";

import { randomUUID } from "crypto";
import { readdir, writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { redirect } from "next/navigation";
import { divideFrames } from "@/lib/divide-frames";

export async function uploadVideo(formData: FormData) {
  const videoId = randomUUID();

  const file: File | null = formData.get("video") as unknown as File;

  if (!file) throw new Error("No file uploaded");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsPath = join(process.cwd(), `/uploads/`);

  if (!existsSync(uploadsPath)) {
    mkdirSync(uploadsPath);
  }

  const path = join(uploadsPath, videoId);
  await writeFile(path, buffer);

  await divideFrames(videoId);

  return redirect(`/video/${videoId}`);
}

export async function getFrameCount(videoId: string) {
  const videoPath = join(process.cwd(), `/frames/`, videoId);

  try {
    const dir = await readdir(videoPath);

    return dir.length;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Cannot get frame count");
  }
}
