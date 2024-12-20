import "server-only";
import { FrameState } from "./features/frame/frameSlice";
import { join } from "path";
import { UPLOADS_PATH } from "@/app/paths";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import sharp from "sharp";

export async function editVideo(frameState: FrameState, videoId: string) {
  const texts = frameState.texts;

  for (const text of texts) {
    for (const frame of text.frames) {
      const inputPath = join(UPLOADS_PATH, videoId, "/frames/");
      const inputFrame = join(inputPath, `${frame}.png`);

      const outputPath = join(UPLOADS_PATH, videoId, "/edited_frames/");

      if (!existsSync(outputPath)) {
        mkdirSync(outputPath);
      }

      const outputFrame = join(outputPath, `${frame}.png`);

      // Add texts to frames
      const image = sharp(inputFrame);

      // Add text overlay using sharp
      // TODO: Change width and height dynamically
      await image
        .composite([
          {
            input: Buffer.from(`
              <svg width="640" height="360">
                <text x="${text.x}" y="${text.y}" font-size="${text.fontSize}" fill="white">${text.text}</text>
              </svg>
            `),
            gravity: "northwest",
          },
        ])
        .toFile(outputFrame);

      console.log(`Frame ${frame} edited and saved.`);

      // Copy editedFrames to frames directory
      // Because we use that when we make the video
      copyFileSync(outputFrame, inputFrame);
    }
  }
}
