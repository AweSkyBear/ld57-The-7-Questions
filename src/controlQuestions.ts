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
import { Image, Text, TileSprite } from "./common/types";
import { TheScenes } from "./scenes/TheScenes";
import { GAME_SIZE } from "./main";
import { TEXTURES_MAP } from "./common/textures";
import { sceneEvents } from "./common/sceneEvents";
import { exposeToWindow } from "./common/debug";
import { midPoint } from "./common/point";
import { questionTextO } from "./common/text";

export const controlQuestions = obsDispCreator(() => {
  const state = {
    qBg: null as Image | null,
    qText: null as Text | null,
  };

  const offsetY = 100;
  return {
    [obsDispEvents.OBS_CREATE]: () => {
      state.qBg = TheScenes.Game.add
        .image(midPoint()[0], midPoint()[1] + offsetY, TEXTURES_MAP.questionBg)
        .setAlpha(1)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setAlpha(0.5);

      exposeToWindow({ qBg: state.qBg });

      state.qText = questionTextO({ text: "First question" }).setY(
        midPoint()[1] + offsetY
      );
      exposeToWindow({ qText: state.qText });
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      TheScenes.Game.scene.scene.children.remove(state.qBg);
      TheScenes.Game.scene.scene.children.remove(state.qText);
      state.qBg = null;
      state.qText = null;
    },
    [sceneEvents.UPDATE]: () => {
      if (!state.qBg) return;
    },
  };
});
