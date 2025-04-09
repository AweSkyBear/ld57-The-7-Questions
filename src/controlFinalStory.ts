import { obsDispCreator, obsDispEvents, ODAPI } from "./OD";
import { Easing, Text, Tween } from "./common/types";
import { TheScenes } from "./scenes/TheScenes";
import { storyTextO } from "./common/text";
import { gameEvents } from "./common/gameEvents";
import { GameState } from "./common/GameState";
import { exposeToWindow } from "./common/debug";
import { defer } from "./common/func";

export const controlFinalStory = obsDispCreator(() => {
  const state = {
    storyText: null as Text | null,
    headlineText: null as Text | null,
    restartBtnText: null as Text | null,
    tweens: [] as Tween[],
  };

  return {
    [obsDispEvents.OBS_CREATE]: () => {},
    [gameEvents.QUESTION_ANSWERED_ALL]: () => {
      const storyRevealedSfx = TheScenes.Game.sound.add("story-reveal");
      storyRevealedSfx.play();
      defer(() => storyRevealedSfx.destroy(), 3000);

      const finalStory = GameState.selectedAnswers.join("♾️ ");

      state.headlineText =
        (state.headlineText && state.headlineText.setText("Your story")) ||
        storyTextO({ scene: TheScenes.Game, text: "Your story" }).setFontSize(
          "30px"
        );
      state.headlineText.setAlpha(0);

      state.restartBtnText =
        (state.restartBtnText && state.restartBtnText.setText("~ restart ~")) ||
        storyTextO({
          scene: TheScenes.Game,
          text: "~ ask me again ~",
        }).setFontSize("30px");
      state.restartBtnText.setAlpha(0);

      const finalStoryFormatted = (finalStory as any)
        .replaceAll("  ", "") // bug fix for the regex to work properly
        .split(/((?:(?:\S+\s){9})|(?:.+)(?=\n|$))/) // split by N number of words
        // .filter((a) => a)
        .join("\n");
      state.storyText =
        (state.storyText && state.storyText.setText(finalStoryFormatted)) ||
        storyTextO({ scene: TheScenes.Game, text: finalStoryFormatted });

      state.storyText.setLineSpacing(-36); // start
      state.tweens.push(
        TheScenes.Game.tweens.addCounter({
          from: -36,
          to: 29,
          yoyo: true,
          repeat: 0,
          duration: 1000,
          ease: Easing.Circular.InOut,
          onUpdate: (tween) => {
            state.storyText?.setLineSpacing(tween.getValue());
          },
          onComplete: () => {
            state.tweens.push(
              TheScenes.Game.tweens.addCounter({
                from: -36,
                to: -10,
                duration: 3000,
                ease: Easing.Circular.InOut,
                onUpdate: (tween) => {
                  state.storyText?.setLineSpacing(tween.getValue());
                },
                onComplete: () => {
                  if (!state.storyText) return;
                  state.storyText.height > 700 &&
                    state.storyText.setFontSize("20px");

                  state.headlineText
                    ?.setY(Math.max(state.storyText!.getBounds().top, 10)) // 10 is at the max top, shouldn't be less
                    .setAlpha(1);

                  ODAPI.dispatchEvent(gameEvents.GAME_STORY_SHOWN);

                  defer(() => {
                    state.restartBtnText
                      ?.setAlpha(1)
                      .setY(Math.min(state.storyText!.getBounds().bottom, 700)) // 700 is at the max bottom, shouldn't be less
                      .setInteractive()
                      .on(Phaser.Input.Events.POINTER_DOWN, () => {
                        ODAPI.dispatchEvent(gameEvents.GAME_RESTART);
                      });
                  }, 5000);
                },
              })
            );
          },
        })
      );

      // restyle
      state.storyText
        .setPadding(5, 35, 5, 35)
        // .setBackgroundColor("rgba(255,255,255,0.5)")
        .setBlendMode(1)
        .setFontSize("21px");

      exposeToWindow({ ...state });
      // TODO:EFFECT positioning to be proper / maybe scale up from very small, maybe add a background, etc.

      GameState.gameRunning = false;
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      state.restartBtnText?.destroy();
      state.storyText?.destroy();
      state.restartBtnText?.destroy();
      state.tweens.forEach((t) => {
        t.stop();
        t.remove();
        t.destroy();
        state.tweens = [];
      });
      state.storyText = null;
      state.headlineText = null;
      state.restartBtnText = null;
    },
  };
});
