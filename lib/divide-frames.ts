import "server-only";

import { PassThrough } from "stream";
import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs";
import { join } from "path";
import { readFile } from "fs/promises";
import { UPLOADS_PATH } from "@/app/paths";

export async function divideFrames(videoId: string) {
  try {
    const videoBuffer = await readFile(
      join(UPLOADS_PATH, videoId, "original.mp4")
    );

    const videoStream = new PassThrough();
    videoStream.end(videoBuffer);

    const outputDir = join(UPLOADS_PATH, videoId, `/frames/`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await new Promise<void>((resolve, eject) => {
      // Extract frames using FFmpeg
      ffmpeg(videoStream)
        .inputOptions("-f", "mp4") // Specify input format if necessary
        .output(`${outputDir}/%d.png`)
        .outputOptions("-vf", "fps=30") // Adjust FPS as needed
        .on("end", () => {
          console.log("Frame extraction complete.");
          resolve();
        })
        .on("error", (err: Error) => {
          console.error("Error extracting frames:", err);
          eject();
        })
        .run();
    });
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}
