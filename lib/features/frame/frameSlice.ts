import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import type { Text } from "@/components/frame";

// Define a type for the slice state
export interface FrameState {
  texts: Text[];
}

// Define the initial state using that type
const initialState: FrameState = {
  texts: [],
};

export const frameSlice = createSlice({
  name: "frame",
  initialState,
  reducers: {
    addText: (state, action: PayloadAction<Text>) => {
      state.texts.push(action.payload);
    },
    updateText: (state, action: PayloadAction<Text>) => {
      const texts = state.texts.filter((text) => text.id !== action.payload.id);

      texts.push(action.payload);

      state.texts = texts;
    },
  },
});

export const { addText, updateText } = frameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.frame.texts;

export default frameSlice.reducer;
