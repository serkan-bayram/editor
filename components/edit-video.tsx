import Image from "next/image";

export function EditVideo({
  frameCount,
  videoId,
}: {
  frameCount: number;
  videoId: string;
}) {
  return (
    <div className="h-32 p-2 border flex gap-x-4 overflow-x-scroll">
      {Array.from({ length: frameCount }).map((_, index) => (
        <Image
          loading="lazy"
          alt={`Frame ${index + 1}`}
          src={`/api/frames/${videoId}/${index + 1}`}
          width={192}
          height={96}
          className="flex-shrink-0 bg-black rounded-md"
        />
      ))}
    </div>
  );
}
