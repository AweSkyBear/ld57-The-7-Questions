import {
  constructEvents,
  createThrottledDispatch,
  dispatchEvent,
  IEvent,
  obsDispCreator,
  obsDispEvents,
  TEventTarget,
} from "./OD";
import { TEventDispatchOptions } from "obs-disp/dist/obs-disp";
import { Image, TileSprite } from "./common/types";
import { TheScenes } from "./scenes/TheScenes";
import { GAME_SIZE } from "./main";
import { TEXTURES_MAP } from "./common/textures";
import { sceneEvents } from "./common/sceneEvents";
import { exposeToWindow } from "./common/debug";
import { midPoint } from "./common/point";

export const controlTree = obsDispCreator(() => {
  const state = {
    tree: null as Image | null,
  };

  return {
    [obsDispEvents.OBS_CREATE]: () => {
      state.tree = TheScenes.Game.add
        .image(midPoint()[0], midPoint()[1], TEXTURES_MAP.tree)
        .setAlpha(1);

      exposeToWindow({ tree: state.tree });
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      TheScenes.Game.scene.scene.children.remove(state.tree);
      state.tree = null;
    },
    [sceneEvents.UPDATE]: () => {
      if (!state.tree) return;
    },
  };
});
