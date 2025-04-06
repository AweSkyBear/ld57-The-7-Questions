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

export const controlBackground = obsDispCreator(() => {
  const state = {
    bg: null as TileSprite | null,
  };

  return {
    [obsDispEvents.OBS_CREATE]: () => {
      state.bg = TheScenes.Game.add
        .tileSprite(0, 0, GAME_SIZE.width, GAME_SIZE.height, TEXTURES_MAP.bg)
        .setOrigin(0, 0);

      exposeToWindow({ bg: state.bg });
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      TheScenes.Game.scene.scene.children.remove(state.bg);
      state.bg = null;
    },
    [sceneEvents.UPDATE]: () => {
      if (!state.bg) return;

      console.log("up");
      state.bg.tilePositionX = state.bg?.tilePositionX + 1;
    },
  };
});
