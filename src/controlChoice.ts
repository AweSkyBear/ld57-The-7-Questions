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
import { GameState } from "./common/GameState";

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
          Math.floor(midPoint()[0] + (ind - 1) * 90),
          Math.floor(midPoint()[1] + 200),
          TEXTURES_MAP.cube
        )
        .setAlpha(1)
        // .setBlendMode(Phaser.BlendModes.ADD)
        .setAlpha(1)
        .setTint(tint)
        .setInteractive()
        .on(Phaser.Input.Events.POINTER_DOWN, onClick)
        .on(Phaser.Input.Events.POINTER_OVER, function () {
          // @ts-ignore
          this.setScale(1.3);
          // @ts-ignore
          this.setAlpha(0.8);
        })
        .on(Phaser.Input.Events.POINTER_OUT, function () {
          // @ts-ignore
          this.setScale(1);
          // @ts-ignore
          this.setAlpha(1);
        })
        .setBlendMode(Phaser.BlendModes.SCREEN)
    );
  };

  return {
    [obsDispEvents.OBS_CREATE]: () => {
      const createClickHandler = (choiceInd: 0 | 1 | 2) => () => {
        if (!GameState.currentQuestion) {
          // TODO: EFFECT or nothing
          return;
        }

        // TODO:BRANCH - if has NO MORE choices left for this color: just tween the thing
        //// maybe use `this`

        const answerBehindQuestion = GameState.currentQuestion[choiceInd + 1];
        ODAPI.dispatchEvent(gameEvents.QUESTION_ANSWERED, {
          payload: {
            questionInd: GameState.qIndex,
            qAnswerInd: choiceInd,
            qIndex: GameState.qIndex,
            qAnswerStatement: answerBehindQuestion,
          },
        });
      };

      state.chGreen = createChoiceCube(0, 0x00ff00, createClickHandler(0));
      state.chRed = createChoiceCube(1, 0xff0000, createClickHandler(1));
      state.chGrey = createChoiceCube(2, 0x999999, createClickHandler(2));

      exposeToWindow({ ...state });
    },
    [gameEvents.GAME_START]: () => {
      state.chGreen?.setAlpha(1);
      state.chRed?.setAlpha(1);
      state.chGrey?.setAlpha(1);
    },
    [gameEvents.QUESTION_ANSWERED_ALL]: () => {
      state.chGreen?.setAlpha(0);
      state.chRed?.setAlpha(0);
      state.chGrey?.setAlpha(0);
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
