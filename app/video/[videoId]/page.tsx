import { EditVideo } from "@/components/edit-video";
import NoSSRWrapper from "@/components/NoSSRWrapper";

export default async function Video({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const videoId = (await params).videoId;

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full flex items-center justify-center">
        <div className="w-[80%] my-24 " data-focus-container="true">
          <NoSSRWrapper>
            <EditVideo videoId={videoId} />
          </NoSSRWrapper>
        </div>
      </div>
    </div>
  );
}
