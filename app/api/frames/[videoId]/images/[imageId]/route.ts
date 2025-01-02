import { UPLOADS_PATH } from "@/app/paths";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ videoId: string; imageId: string }> }
) {
  const { videoId, imageId } = await params;

  const imagesDir = join(UPLOADS_PATH, videoId, "/images/");

  const imgPath = join(imagesDir, `${imageId}`);

  const imgBuffer = readFileSync(imgPath);

  return new Response(imgBuffer, { headers: { "Content-Type": "image/png" } });
}
