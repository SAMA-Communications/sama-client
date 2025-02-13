import { createSlice } from "@reduxjs/toolkit";

export const contextMenu = createSlice({
  name: "ContextMenu",
  initialState: {
    list: [],
    externalProps: {},
    clicked: false,
    coords: { x: null, y: null },
  },
  reducers: {
    setCoords: (state, { payload: { x, y } }) => {
      const { innerHeight, innerWidth } = window;
      const popUpHeight = 25 + state.list.filter((el) => !!el).length * 40;

      state.coords = {
        x: x + 240 > innerWidth ? innerWidth - 245 : x,
        y: y + popUpHeight > innerHeight ? innerHeight - popUpHeight : y,
      };
    },
    setClicked: (state, { payload }) => void (state.clicked = payload),
    setList: (state, { payload }) => void (state.list = payload),
    setExternalProps: (state, { payload }) =>
      void (state.externalProps = payload),
    setAllParams: (state, { payload }) => {
      const { list, coords, clicked, externalProps } = payload;

      list && (state.list = list);
      if (coords) {
        const { x, y } = coords;
        const { innerHeight, innerWidth } = window;
        const popUpHeight = 25 + state.list.filter((el) => !!el).length * 40;
        const popUpWidth = state.list.includes("createEncryptedChat")
          ? 355
          : 245;

        state.coords = {
          x: x + popUpWidth > innerWidth ? innerWidth - popUpWidth : x,
          y: y + popUpHeight > innerHeight ? innerHeight - popUpHeight : y,
        };
      }
      externalProps && (state.externalProps = externalProps);
      clicked && (state.clicked = clicked);
    },
  },
});

export const selectIsClicked = (state) => state.contextMenu.clicked;
export const selectCoords = (state) => state.contextMenu.coords;
export const selectContextList = (state) => state.contextMenu.list;
export const selectContextExternalProps = (state) =>
  state.contextMenu.externalProps;

export const {
  setCoords,
  setClicked,
  setList,
  setExternalProps,
  setAllParams,
} = contextMenu.actions;

export default contextMenu.reducer;
