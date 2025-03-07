import NoSSRWrapper from "@/components/NoSSRWrapper";
import { UploadVideo } from "@/components/upload-video";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <main>
        <NoSSRWrapper>
          <UploadVideo />
        </NoSSRWrapper>
      </main>
    </div>
  );
}
