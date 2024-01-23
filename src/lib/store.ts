import { configureStore } from "@reduxjs/toolkit";
import backdropReducer from './features/backdrop/backdropSlice';


export const makeStore = () => {
    return configureStore({
        reducer: {
            backdrop: backdropReducer,
        }
    });
};


export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];