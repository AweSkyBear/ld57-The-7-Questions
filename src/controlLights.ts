import { Func, Point } from "~/common/types";
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
import { TheScenes } from "./scenes/TheScenes";
import { GAME_SIZE } from "./main";
import { midPoint } from "./common/point";
import { exposeToWindow } from "./common/debug";
import { gameEvents } from "./common/gameEvents";
import { sceneEvents } from "./common/sceneEvents";

/** Add lights to the scene (e.g. the Tree is lit) */
export const controlLights = obsDispCreator(() => {
  const state = {
    mouseLight: null as Phaser.GameObjects.Light | null,
    light: null as Phaser.GameObjects.Light | null,
    lightTween: null as Phaser.Tweens.Tween | null,
  };

  return {
    [obsDispEvents.OBS_CREATE]: () => {
      // configure the lights in general
      TheScenes.Game.lights.enable().setAmbientColor(0xffffff);

      /// the point light

      state.mouseLight = TheScenes.Game.lights.addLight(
        midPoint()[0],
        midPoint()[1],
        100,
        0x00ff00,
        1
      );

      state.light = TheScenes.Game.lights.addLight(
        midPoint()[0],
        midPoint()[1],
        300,
        0xffffff,
        3
      );

      exposeToWindow({ ...state });

      const lightOffset = 200;
      state.lightTween = TheScenes.Game.add.tween({
        x: { from: 0 - lightOffset, to: GAME_SIZE.width + lightOffset },
        duration: 10000,
        targets: [state.light],
        yoyo: true,
        repeat: -1,
      });
    },
    [sceneEvents.UPDATE]: () => {
      if (TheScenes.Game.input.activePointer && state.mouseLight) {
        state.mouseLight.x = TheScenes.Game.input.activePointer.x;
        state.mouseLight.y = TheScenes.Game.input.activePointer.y;
      }
      // TODO: rotate it in a circle
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      state.mouseLight = null;
      state.light = null;
    },
  };
});
