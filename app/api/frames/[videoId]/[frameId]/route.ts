import { UPLOADS_PATH } from "@/app/paths";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ videoId: string; frameId: string }> }
) {
  const { videoId, frameId } = await params;

  const framesDir = join(UPLOADS_PATH, videoId, "/frames/");

  const imgPath = join(framesDir, `${frameId}.png`);

  const imgBuffer = readFileSync(imgPath);

  return new Response(imgBuffer, { headers: { "Content-Type": "image/png" } });
}
