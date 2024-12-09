import "server-only";

import { PassThrough } from "stream";
import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs";
import { join } from "path";
import { readFile } from "fs/promises";

export async function divideFrames(videoId: string) {
  const uploadsPath = join(process.cwd(), `/uploads/`);

  try {
    const videoBuffer = await readFile(join(uploadsPath, videoId));

    const videoStream = new PassThrough();
    videoStream.end(videoBuffer);

    const outputDir = join(process.cwd(), `/frames/${videoId}`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Extract frames using FFmpeg
    ffmpeg(videoStream)
      .inputOptions("-f", "mp4") // Specify input format if necessary
      .output(`${outputDir}/%d.png`)
      .outputOptions("-vf", "fps=1") // Adjust FPS as needed
      .on("end", () => console.log("Frame extraction complete."))
      .on("error", (err: Error) =>
        console.error("Error extracting frames:", err)
      )
      .run();
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}
