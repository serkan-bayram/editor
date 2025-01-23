import { EditVideo } from "@/components/edit-video";

export default async function Video({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const videoId = (await params).videoId;

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full flex items-center justify-center">
        <div className="w-[80%]">
          <EditVideo videoId={videoId} />
        </div>
      </div>
    </div>
  );
}
