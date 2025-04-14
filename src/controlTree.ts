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
import { gameEvents } from "./common/gameEvents";

export const controlTree = obsDispCreator(() => {
  const state = {
    tree: null as Image | null,
  };

  return {
    [obsDispEvents.OBS_CREATE]: () => {
      state.tree = TheScenes.Game.add
        .image(midPoint()[0], midPoint()[1] - 100, TEXTURES_MAP.tree)
        .setAlpha(1)
        .setPipeline("Light2D");

      exposeToWindow({ tree: state.tree });
    },
    [gameEvents.GAME_START]: () => {
      state.tree?.setAlpha(1);
    },
    [gameEvents.GAME_STORY_SHOWN]: () => {
      state.tree?.setAlpha(0.5);
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      state.tree?.destroy();
      state.tree = null;
    },
  };
});
