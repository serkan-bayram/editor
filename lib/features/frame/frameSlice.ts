import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import type { Text, Image } from "@/components/frame";

// Define a type for the slice state
export interface FrameState {
  videoId: string;
  selectedFrame: number;
  excludedFrames: number[];
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
  excludedFrames: [],
  focusedComponent: undefined,
  texts: [],
  images: [],
};

export const frameSlice = createSlice({
  name: "frame",
  initialState,
  reducers: {
    addComponent: (state, action: PayloadAction<Text | Image>) => {
      switch (action.payload.type) {
        case "text":
          state.texts.push(action.payload);
          break;
        case "image":
          state.images.push(action.payload);
          break;
        default:
          break;
      }
    },
    updateComponent: (state, action: PayloadAction<Text | Image>) => {
      switch (action.payload.type) {
        case "text":
          const texts = state.texts.filter(
            (text) => text.id !== action.payload.id
          );

          texts.push(action.payload);

          state.texts = texts;
          break;
        case "image":
          const images = state.images.filter(
            (text) => text.id !== action.payload.id
          );

          images.push(action.payload);

          state.images = images;
          break;
        default:
          break;
      }
    },
    deleteComponent: (state, action: PayloadAction<Text | Image>) => {
      switch (action.payload.type) {
        case "text":
          const texts = state.texts.filter(
            (text) => text.id !== action.payload.id
          );

          state.texts = texts;
          break;
        case "image":
          const images = state.images.filter(
            (image) => image.id !== action.payload.id
          );

          state.images = images;
          break;
        default:
          break;
      }
    },
    updateComponentFrames: (
      state,
      action: PayloadAction<(Text | Image) & { first: string; last: string }>
    ) => {
      const { first, last, id, type } = action.payload;

      switch (type) {
        case "text":
          const text = state.texts.find((text) => text.id === id);

          if (!text) return;

          if (!first.length || !last.length) return;

          text.frames = Array.from(
            { length: parseInt(last) + 1 - parseInt(first) },
            (_, i) => parseInt(first) + i
          );
          break;
        case "image":
          const image = state.images.find((image) => image.id === id);

          if (!image) return;

          if (!first.length || !last.length) return;

          image.frames = Array.from(
            { length: parseInt(last) + 1 - parseInt(first) },
            (_, i) => parseInt(first) + i
          );
          break;

        default:
          break;
      }
    },
    setVideoId: (state, action: PayloadAction<string>) => {
      state.videoId = action.payload;
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
  addComponent,
  updateComponent,
  deleteComponent,
  updateComponentFrames,
  setVideoId,
  setFocus,
  setSelectedFrame,
} = frameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.frame.texts;

export default frameSlice.reducer;
