import store from "@store/store.js";
import { setAllParams } from "@store/values/ContextMenu.js";

export default function useContextMenu() {
  const openContextMenu = (category, list, coords) => {
    store.dispatch(
      setAllParams({
        category,
        list,
        coords: { x: coords.x, y: coords.y },
        clicked: true,
      }),
    );
  };

  return {
    openContextMenu,
  };
}
