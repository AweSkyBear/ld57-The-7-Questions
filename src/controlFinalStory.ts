import {
  constructEvents,
  createThrottledDispatch,
  dispatchEvent,
  IEvent,
  obsDispCreator,
  obsDispEvents,
  TEventTarget,
} from "./OD";
import { Image, Text, TileSprite } from "./common/types";
import { TheScenes } from "./scenes/TheScenes";
import { GAME_SIZE } from "./main";
import { storyTextO } from "./common/text";
import { gameEvents } from "./common/gameEvents";
import { GameState } from "./common/GameState";
import { exposeToWindow } from "./common/debug";
import { splitStringBySegmentLength } from "./common/func";

export const controlFinalStory = obsDispCreator(() => {
  const state = {
    storyText: null as Text | null,
  };

  return {
    [obsDispEvents.OBS_CREATE]: () => {},
    [gameEvents.QUESTION_ANSWERED_ALL]: () => {
      const finalStory = GameState.selectedAnswers.join("");

      // split by every 20 words
      const finalStoryFormatted = finalStory
        .split(/((?:(?:\S+\s){10})|(?:.+)(?=\n|$))/)
        .filter((a) => a)
        .join("\n");

      state.storyText =
        (state.storyText && state.storyText.setText(finalStoryFormatted)) ||
        storyTextO({ scene: TheScenes.Game, text: finalStoryFormatted });

      // restyle
      state.storyText
        .setPadding(5, 35, 5, 35)
        // .setBackgroundColor("rgba(255,255,255,0.5)")
        .setBlendMode(1)
        .setFontSize("22px");

      exposeToWindow({ ...state });
      // TODO:EFFECT positioning to be proper / maybe scale up from very small, maybe add a background, etc.

      GameState.gameRunning = false;
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      TheScenes.Game.scene.scene.children.remove(state.storyText);
      state.storyText = null;
    },
  };
});
