import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeatureState } from "./featureSlice";
import { TimelineState } from "./timelineSlice";

export interface AppState extends VideoState, FeatureState, TimelineState {}

// Define a type for the slice state
export interface VideoState {
  videoSrc: string;
  videoId: string;
  videoDuration: number;
  currentTime: number;
  videoDimensions: {
    client: { width: number; height: number };
    real: { width: number; height: number };
  };
}

// Define the initial state using that type
const initialState: VideoState = {
  videoSrc: "",
  videoId: "",
  currentTime: 0,
  videoDuration: 0,
  videoDimensions: {
    client: { width: 800, height: 400 },
    real: { width: 800, height: 400 },
  },
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideoId: (state, action: PayloadAction<string>) => {
      state.videoId = action.payload;
    },
    setVideoSrc: (state, action: PayloadAction<string>) => {
      state.videoId = action.payload;
    },
    setVideoDuration: (state, action: PayloadAction<number>) => {
      state.videoDuration = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setRealVideoDimensions: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      state.videoDimensions.real = action.payload;
    },
    setClientVideoDimensions: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      state.videoDimensions.client = action.payload;
    },
  },
});

export const {
  setVideoId,
  setVideoSrc,
  setVideoDuration,
  setCurrentTime,
  setRealVideoDimensions,
  setClientVideoDimensions,
} = videoSlice.actions;

export default videoSlice.reducer;
