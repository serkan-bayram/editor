import { makeVideo } from "@/app/actions";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addText,
  FocusedComponent,
  setFocus,
  updateText,
  updateTextFrames,
} from "@/lib/features/frame/frameSlice";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

export function EditorBar({
  videoId,
  selectedFrame,
}: {
  videoId: string;
  selectedFrame: number;
}) {
  const focusedComponent = useAppSelector(
    (state) => state.frame.focusedComponent
  );

  return (
    <div className="w-full h-10 bg-primary rounded-md flex items-center p-2">
      {focusedComponent ? (
        <EditComponent />
      ) : (
        <Features videoId={videoId} selectedFrame={selectedFrame} />
      )}
    </div>
  );
}

function EditComponent() {
  const focusedComponent = useAppSelector(
    (state) => state.frame.focusedComponent
  );

  if (!focusedComponent) return null;

  switch (focusedComponent.component) {
    case "text":
      return <EditText focusedComponent={focusedComponent} />;
    default:
      return null;
  }
}

function EditText({
  focusedComponent,
}: {
  focusedComponent: FocusedComponent;
}) {
  const texts = useAppSelector((state) => state.frame.texts);
  const focusedText = texts.find((text) => text.id === focusedComponent?.id);

  const dispatch = useAppDispatch();

  const [frameRange, setFrameRange] = useState({ first: "", last: "" });

  useEffect(() => {
    if (!focusedText) return;

    const { first, last } = frameRange;

    if (parseInt(first) > parseInt(last)) {
      // TODO: Notify user to say this is invalid
      setFrameRange({ first: first, last: first });

      dispatch(
        updateTextFrames({ id: focusedText.id, first: first, last: first })
      );
      return;
    }

    dispatch(
      updateTextFrames({ id: focusedText.id, first: first, last: last })
    );
  }, [frameRange]);

  if (!focusedText) return null;

  return (
    <>
      <Button
        className="text-secondary"
        onClick={() =>
          dispatch(
            updateText({ ...focusedText, fontSize: focusedText.fontSize - 1 })
          )
        }
        size={"sm"}
      >
        Decrease Font Size
      </Button>
      <Button
        className="text-secondary"
        onClick={() =>
          dispatch(
            updateText({ ...focusedText, fontSize: focusedText.fontSize + 1 })
          )
        }
        size={"sm"}
      >
        Increase Font Size
      </Button>
      <Input
        className="text-secondary max-w-48 h-6"
        placeholder="Edit Text"
        defaultValue={focusedText.text}
        onChange={(ev) =>
          dispatch(updateText({ ...focusedText, text: ev.currentTarget.value }))
        }
      />

      <Input
        className="text-secondary max-w-48 h-6"
        placeholder="First Frame"
        type="number"
        value={frameRange.first}
        onChange={(ev) =>
          setFrameRange({
            first: ev.currentTarget.value,
            last: frameRange.last,
          })
        }
      />

      <Input
        className="text-secondary max-w-48 h-6"
        placeholder="First Frame"
        type="number"
        value={frameRange.last}
        onChange={(ev) =>
          setFrameRange({
            first: frameRange.first,
            last: ev.currentTarget.value,
          })
        }
      />

      {/* Temporary solution */}
      <Button onClick={() => dispatch(setFocus(undefined))}>
        Stop Editing
      </Button>
    </>
  );
}

function Features({
  videoId,
  selectedFrame,
}: {
  videoId: string;
  selectedFrame: number;
}) {
  const dispatch = useAppDispatch();

  async function handleAddText() {
    dispatch(
      addText({
        id: window.crypto.randomUUID(),
        text: "Hello world",
        x: 20,
        y: 20,
        fontSize: 20,
        frames: [selectedFrame],
      })
    );
  }

  async function handleMakeVideo() {
    await makeVideo(videoId);
  }

  return (
    <>
      <Button onClick={handleAddText} className="text-secondary" size={"sm"}>
        Add Text
      </Button>

      <Button onClick={handleMakeVideo} className="text-secondary" size={"sm"}>
        Make Video
      </Button>
    </>
  );
}
