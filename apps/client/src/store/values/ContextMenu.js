import { createSlice } from "@reduxjs/toolkit";

export const contextMenu = createSlice({
  name: "ContextMenu",
  initialState: {
    list: [],
    category: null,
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
    addExternalProps: (state, { payload }) => {
      state.externalProps = { ...state.externalProps, ...payload };
    },
    setAllParams: (state, { payload }) => {
      const { list, category, coords, clicked, externalProps } = payload;

      list && (state.list = list);
      category && (state.category = category);
      if (coords) {
        const { x, y } = coords;
        const { innerHeight, innerWidth } = window;
        const popUpHeight = 25 + state.list.filter((el) => !!el).length * 40;

        state.coords = {
          x: x + 240 > innerWidth ? innerWidth - 245 : x,
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
export const selectContextListCategory = (state) => state.contextMenu.category;
export const selectContextExternalProps = (state) =>
  state.contextMenu.externalProps;

export const {
  setCoords,
  setClicked,
  setList,
  setExternalProps,
  addExternalProps,
  setAllParams,
} = contextMenu.actions;

export default contextMenu.reducer;
