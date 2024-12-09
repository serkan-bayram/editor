import { uploadVideo } from "@/app/actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function UploadVideo() {
  const isPending = false;

  return (
    <form action={uploadVideo} className="flex flex-col gap-2">
      <Label htmlFor="video">Upload Video</Label>
      <Input id="video" name="video" type="file" accept="video/*" />

      <Button type="submit" disabled={isPending}>
        {isPending ? "Loading..." : "Submit"}
      </Button>
    </form>
  );
}
