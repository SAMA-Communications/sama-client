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
      const list = JSON.parse(JSON.stringify(state.list))?.filter((el) => !!el);
      const popUpHeight = 25 + list.length * 40;

      state.coords = {
        x: x + 240 > innerWidth ? innerWidth - 245 : x,
        y: y + popUpHeight > innerHeight ? innerHeight - popUpHeight : y,
      };
    },
    setClicked: (state, { payload }) => {
      state.clicked = payload;
    },
    setList: (state, { payload }) => {
      state.list = payload;
    },
    setExternalProps: (state, { payload }) => {
      state.externalProps = payload;
    },
  },
});

export const getIsClicked = (state) => {
  return state.contextMenu.clicked;
};

export const getCoords = (state) => {
  return state.contextMenu.coords;
};

export const getContextList = (state) => {
  return state.contextMenu.list;
};

export const getContextExternalProps = (state) => {
  return state.contextMenu.externalProps;
};

export const { setCoords, setClicked, setList, setExternalProps } =
  contextMenu.actions;

export default contextMenu.reducer;
