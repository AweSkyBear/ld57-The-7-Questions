import {
  constructEvents,
  createThrottledDispatch,
  dispatchEvent,
  IEvent,
  obsDispCreator,
  obsDispEvents,
  ODAPI,
  TEventTarget,
} from "./OD";
import { TEventDispatchOptions } from "obs-disp/dist/obs-disp";
import { Image, Text, TileSprite } from "./common/types";
import { TheScenes } from "./scenes/TheScenes";
import { GAME_SIZE } from "./main";
import { TEXTURES_MAP } from "./common/textures";
import { sceneEvents } from "./common/sceneEvents";
import { exposeToWindow } from "./common/debug";
import { midPoint } from "./common/point";
import { questionTextO } from "./common/text";
import { gameEvents } from "./common/gameEvents";

export const controlChoice = obsDispCreator(() => {
  const state = {
    chGreen: null as Image | null,
    chRed: null as Image | null,
    chGrey: null as Image | null,
  };

  const createChoiceCube = (ind: number, tint: number, onClick: () => void) => {
    return (
      TheScenes.Game.add
        .image(
          midPoint()[0] + (ind - 1) * 90,
          midPoint()[1] + 200,
          TEXTURES_MAP.cube
        )
        .setAlpha(1)
        // .setBlendMode(Phaser.BlendModes.ADD)
        .setAlpha(1)
        .setTint(tint)
    );
  };

  return {
    [obsDispEvents.OBS_CREATE]: () => {
      state.chGreen = createChoiceCube(0, 0x00ff00, () => {
        ODAPI.dispatchEvent(gameEvents.QUESTION_ANSWER, {
          payload: { value: "green" },
        });
      });
      state.chRed = createChoiceCube(1, 0xff0000, () => {
        ODAPI.dispatchEvent(gameEvents.QUESTION_ANSWER, {
          payload: { value: "red" },
        });
      });
      state.chGrey = createChoiceCube(2, 0x999999, () => {
        ODAPI.dispatchEvent(gameEvents.QUESTION_ANSWER, {
          payload: { value: "grey" },
        });
      });

      exposeToWindow({ ...state });
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      [state.chGreen, state.chGrey, state.chRed].forEach((o) =>
        TheScenes.Game.scene.scene.children.remove(o)
      );
      Object.keys(state).forEach((k: any) => ((state as any)[k] = null));
    },
    [sceneEvents.UPDATE]: () => {
      if (!state.chGreen) return;
    },
  };
});
