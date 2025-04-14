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
import { GameState, resetGameState } from "./common/GameState";
import { getDefaultGamePrando } from "./common/prando";
import QUESTIONS from "./data/questions";
import { defer, repeat, shuffle } from "./common/func";

/**
 * Show Q based on what is next, render the Q and the bar
 */
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
        .setAlpha(0.5)
        .setPipeline("Light2D");

      exposeToWindow({ qBg: state.qBg });

      state.qText = questionTextO({ text: "First question" }).setY(
        midPoint()[1] + offsetY
      );
      exposeToWindow({ qText: state.qText });
    },
    [gameEvents.GAME_START]: () => {
      state.qBg?.setAlpha(0.5);
      state.qText?.setAlpha(1);

      GameState.gameRunning = true;

      GameState.qIndex = -1;

      // prandom init
      GameState.prando = getDefaultGamePrando();

      // set randomized set of questions
      const shuffledQuestions = shuffle([...QUESTIONS], GameState.prando);

      GameState.questionSet = repeat(7).map((_, ind) => shuffledQuestions[ind]);

      ODAPI.dispatchEvent(gameEvents.QUESTION_SHOW_NEXT);
    },
    [gameEvents.QUESTION_SHOW_NEXT]: () => {
      GameState.qIndex++;

      if (GameState.qIndex < 7) {
        const qText = GameState.questionSet[GameState.qIndex][0];
        state.qText?.setText(qText);

        // TODO:EFFECT - if any delay before setting the question / or effect?, maybe delay the next event?
        ODAPI.dispatchEvent(gameEvents.QUESTION_ASKED);
      } else {
        // TODO:EV END GAME
        ODAPI.dispatchEvent(gameEvents.QUESTION_ANSWERED_ALL);
      }
    },
    [gameEvents.QUESTION_ASKED]: () => {
      GameState.currentQuestion = GameState.questionSet[GameState.qIndex];
    },
    [gameEvents.QUESTION_ANSWERED]: (ev) => {
      if (!GameState.gameRunning) return;

      // safety - if quesion already answered / skip it
      const questionAlreadyAnswered =
        ev?.payload?.questionInd &&
        GameState.selectedAnswers.length > ev?.payload?.questionInd;

      if (questionAlreadyAnswered) {
        return;
      }

      //       //

      // //  [1,2,3]
      //     [] [.] [..]
      //     0  0 1 [ ]

      const qAnswerStatement = ev?.payload?.qAnswerStatement as string;
      GameState.selectedAnswers.push(qAnswerStatement);

      // TODO:EFFECT?
      defer(() => ODAPI.dispatchEvent(gameEvents.QUESTION_SHOW_NEXT), 1);
    },
    [gameEvents.QUESTION_ANSWERED_ALL]: () => {
      state.qBg?.setAlpha(0);
      state.qText?.setAlpha(0);
    },
    [sceneEvents.UPDATE]: () => {
      if (!state.qBg) return;
    },
    [gameEvents.GAME_RESTART]: () => {
      TheScenes.Game.scene.pause();
      resetGameState();

      defer(() => {
        TheScenes.Game.scene.resume();
      });
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      state.qBg?.destroy();
      state.qText?.destroy();
      state.qBg = null;
      state.qText = null;
    },
  };
});
