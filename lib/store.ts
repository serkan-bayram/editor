import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "./features/videoSlice";
import featureReducer from "./features/featureSlice";
import timelineReducer from "./features/timelineSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      video: videoReducer,
      feature: featureReducer,
      timeline: timelineReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
