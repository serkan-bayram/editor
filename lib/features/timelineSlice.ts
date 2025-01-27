import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TimelineState {
  timelineSliderPos: number;
  isHoldingSlider: boolean;
  thumbnailsContainerWidth: number;
}

const initialState: TimelineState = {
  timelineSliderPos: 0,
  isHoldingSlider: false,
  thumbnailsContainerWidth: 0,
};

export const timelineSlice = createSlice({
  name: "timeline",
  initialState,
  reducers: {
    setTimelineSliderPos: (state, action: PayloadAction<number>) => {
      state.timelineSliderPos = action.payload;
    },
    setIsHoldingSlider: (state, action: PayloadAction<boolean>) => {
      state.isHoldingSlider = action.payload;
    },
    setThumbnailsContainerWidth: (state, action: PayloadAction<number>) => {
      state.thumbnailsContainerWidth = action.payload;
    },
  },
});

export const {
  setTimelineSliderPos,
  setIsHoldingSlider,
  setThumbnailsContainerWidth,
} = timelineSlice.actions;

export default timelineSlice.reducer;
