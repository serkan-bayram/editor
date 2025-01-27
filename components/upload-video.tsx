"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function UploadVideo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const router = useRouter();

  const ffmpegRef = useRef(new FFmpeg());

  const loadFFmpeg = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });

    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please upload a video file.");
      return;
    }

    setIsProcessing(true);

    try {
      await loadFFmpeg();

      const ffmpeg = ffmpegRef.current;

      const videoData = await fetchFile(selectedFile);

      await ffmpeg.writeFile("original.mp4", videoData);

      const data = await ffmpeg.readFile("original.mp4");

      const src = URL.createObjectURL(new Blob([data], { type: "video/mp4" }));

      const arr = src.split("/");

      router.push(`/video/${arr[arr.length - 1]}`);
    } catch (error) {
      console.error("Error processing video:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Label htmlFor="video">Upload Video</Label>
      <Input
        onChange={handleFileChange}
        id="video"
        name="video"
        type="file"
        accept="video/*"
      />

      <Button type="submit" disabled={isProcessing}>
        {isProcessing ? "Loading..." : "Submit"}
      </Button>
    </form>
  );
}
