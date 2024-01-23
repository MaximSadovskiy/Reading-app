import { createSlice } from "@reduxjs/toolkit/react";

interface InitialState {
    isBackdropOpen: boolean;
}

const initialState: InitialState = {
    isBackdropOpen: false,
};

const backdropSlice = createSlice({
    name: 'backdrop',
    initialState,
    reducers: {
        openBackdrop(state) {
            if (state.isBackdropOpen == false) {
                state.isBackdropOpen = true;
            }
        },
        closeBackdrop(state) {
            if (state.isBackdropOpen == true) {
                state.isBackdropOpen = false;
            }
        }
    }
});

export const { openBackdrop, closeBackdrop } = backdropSlice.actions;
export default backdropSlice.reducer; 