import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type Text, type Image } from "@/components/video";

export interface FeatureState {
  focusedComponent: FocusedComponent | undefined;
  texts: Text[];
  images: Image[];
}

export type FocusedComponent = {
  component: "text" | "image";
  id: string;
};

const initialState: FeatureState = {
  focusedComponent: undefined,
  texts: [],
  images: [],
};

export const featureSlice = createSlice({
  name: "feature",
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

      state.focusedComponent = {
        id: action.payload.id,
        component: action.payload.type,
      };
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

      state.focusedComponent = undefined;
    },
    setFocus(state, action: PayloadAction<FocusedComponent | undefined>) {
      state.focusedComponent = action.payload;
    },
  },
});

export const { addComponent, updateComponent, deleteComponent, setFocus } =
  featureSlice.actions;

export default featureSlice.reducer;
