import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import { type Text, type Image, CLIENT_DIMENSIONS } from "@/components/video";

// Define a type for the slice state
export interface VideoState {
  videoId: string;
  realVideoDimensions: { width: number; height: number };
  clientVideoDimensions: { width: number; height: number };
  focusedComponent: FocusedComponent | undefined;
  texts: Text[];
  images: Image[];
  currentTime: number;
  timelineSliderPos: number;
  videoDuration: number;
  isHoldingSlider: boolean;
  thumbnailsContainerWidth: number;
}

export type FocusedComponent = {
  component: "text" | "image";
  id: string;
};

// Define the initial state using that type
const initialState: VideoState = {
  videoId: "",
  realVideoDimensions: { width: 0, height: 0 },
  clientVideoDimensions: {
    width: CLIENT_DIMENSIONS.width,
    height: CLIENT_DIMENSIONS.height,
  },
  currentTime: 1,
  videoDuration: 1,
  focusedComponent: undefined,
  texts: [],
  images: [],
  timelineSliderPos: 0,
  isHoldingSlider: false,
  thumbnailsContainerWidth: 1,
};

export const videoSlice = createSlice({
  name: "video",
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
          const texts = state.texts.map((text) =>
            text.id === action.payload.id ? action.payload : text
          );

          state.texts = texts as Text[];
          break;
        case "image":
          const images = state.images.map((image) =>
            image.id === action.payload.id ? action.payload : image
          );

          state.images = images as Image[];
          break;
        default:
          break;
      }
    },
    deleteComponent: (state, action: PayloadAction<Text | Image>) => {
      state.focusedComponent = undefined;

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
    setVideoId: (state, action: PayloadAction<string>) => {
      state.videoId = action.payload;
    },
    setFocus(state, action: PayloadAction<FocusedComponent | undefined>) {
      state.focusedComponent = action.payload;
    },
    setTimelineSliderPos: (state, action: PayloadAction<number>) => {
      state.timelineSliderPos = action.payload;
    },
    setVideoDuration: (state, action: PayloadAction<number>) => {
      state.videoDuration = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setIsHoldingSlider: (state, action: PayloadAction<boolean>) => {
      state.isHoldingSlider = action.payload;
    },
    setRealVideoDimensions: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      state.realVideoDimensions = action.payload;
    },
    setClientVideoDimensions: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      state.clientVideoDimensions = action.payload;
    },
    setThumbnailsContainerWidth: (state, action: PayloadAction<number>) => {
      state.thumbnailsContainerWidth = action.payload;
    },
  },
});

export const {
  addComponent,
  updateComponent,
  deleteComponent,
  setVideoId,
  setFocus,
  setTimelineSliderPos,
  setVideoDuration,
  setCurrentTime,
  setIsHoldingSlider,
  setRealVideoDimensions,
  setClientVideoDimensions,
  setThumbnailsContainerWidth,
} = videoSlice.actions;

export default videoSlice.reducer;
