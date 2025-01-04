import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import type { Text, Image } from "@/components/frame";

// Define a type for the slice state
export interface FrameState {
  videoId: string;
  selectedFrame: number;
  focusedComponent: FocusedComponent | undefined;
  texts: Text[];
  images: Image[];
}

export type FocusedComponent = {
  component: "text" | "image";
  id: string;
};

// Define the initial state using that type
const initialState: FrameState = {
  videoId: "",
  selectedFrame: 1,
  focusedComponent: undefined,
  texts: [],
  images: [],
};

export const frameSlice = createSlice({
  name: "frame",
  initialState,
  reducers: {
    setVideoId: (state, action: PayloadAction<string>) => {
      state.videoId = action.payload;
    },
    addText: (state, action: PayloadAction<Text>) => {
      state.texts.push(action.payload);
    },
    updateText: (state, action: PayloadAction<Text>) => {
      const texts = state.texts.filter((text) => text.id !== action.payload.id);

      texts.push(action.payload);

      state.texts = texts;
    },
    deleteText: (state, action: PayloadAction<{ id: string }>) => {
      const texts = state.texts.filter((text) => text.id !== action.payload.id);

      state.texts = texts;
    },
    updateTextFrames: (
      state,
      action: PayloadAction<{
        id: String;
        first: string;
        last: string;
      }>
    ) => {
      const { first, last, id } = action.payload;

      const text = state.texts.find((text) => text.id === id);

      if (!text) return;

      if (!first.length || !last.length) return;

      text.frames = Array.from(
        { length: parseInt(last) + 1 - parseInt(first) },
        (_, i) => parseInt(first) + i
      );
    },
    addImage: (state, action: PayloadAction<Image>) => {
      state.images.push(action.payload);
    },
    updateImage: (state, action: PayloadAction<Image>) => {
      const images = state.images.filter(
        (text) => text.id !== action.payload.id
      );

      images.push(action.payload);

      state.images = images;
    },
    deleteImage: (state, action: PayloadAction<{ id: string }>) => {
      const images = state.images.filter(
        (image) => image.id !== action.payload.id
      );

      state.images = images;
    },
    updateImageFrames: (
      state,
      action: PayloadAction<{
        id: String;
        first: string;
        last: string;
      }>
    ) => {
      const { first, last, id } = action.payload;

      const image = state.images.find((image) => image.id === id);

      if (!image) return;

      if (!first.length || !last.length) return;

      image.frames = Array.from(
        { length: parseInt(last) + 1 - parseInt(first) },
        (_, i) => parseInt(first) + i
      );
    },
    setFocus(state, action: PayloadAction<FocusedComponent | undefined>) {
      state.focusedComponent = action.payload;
    },
    setSelectedFrame(state, action: PayloadAction<number>) {
      state.selectedFrame = action.payload;
    },
  },
});

export const {
  setVideoId,
  addText,
  updateText,
  updateTextFrames,
  deleteText,
  addImage,
  updateImage,
  deleteImage,
  updateImageFrames,
  setFocus,
  setSelectedFrame,
} = frameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.frame.texts;

export default frameSlice.reducer;
