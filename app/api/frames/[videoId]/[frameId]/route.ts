import { readFileSync } from "fs";
import { join } from "path";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ videoId: string; frameId: string }> }
) {
  const { videoId, frameId } = await params;

  const framesDirPath = join(process.cwd(), `/frames/${videoId}`);

  const imgPath = join(framesDirPath, `${frameId}.png`);

  const imgBuffer = readFileSync(imgPath);

  return new Response(imgBuffer, { headers: { "Content-Type": "image/png" } });
}
