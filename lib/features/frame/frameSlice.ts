import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import type { Text } from "@/components/frame";

// Define a type for the slice state
export interface FrameState {
  focusedComponent: FocusedComponent | undefined;
  texts: Text[];
}

export type FocusedComponent = {
  component: "text";
  id: string;
};

// Define the initial state using that type
const initialState: FrameState = {
  focusedComponent: undefined,
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
    setFocus(state, action: PayloadAction<FocusedComponent | undefined>) {
      state.focusedComponent = action.payload;
    },
  },
});

export const { addText, updateText, updateTextFrames, setFocus } =
  frameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.frame.texts;

export default frameSlice.reducer;
