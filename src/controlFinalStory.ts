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

      const finalStory = GameState.selectedAnswers.join("♾️");

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

      // split by every 20 words
      const finalStoryFormatted = finalStory
        .split(/((?:(?:\S+\s){9})|(?:.+)(?=\n|$))/)
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
                  state.headlineText
                    ?.setY(state.storyText!.getBounds().top)
                    .setAlpha(1);

                  ODAPI.dispatchEvent(gameEvents.GAME_STORY_SHOWN);

                  defer(() => {
                    state.restartBtnText
                      ?.setAlpha(1)
                      .setY(state.storyText!.getBounds().bottom)
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
        .setFontSize("22px");

      exposeToWindow({ ...state });
      // TODO:EFFECT positioning to be proper / maybe scale up from very small, maybe add a background, etc.

      GameState.gameRunning = false;
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      TheScenes.Game.scene.scene.children.remove(state.storyText);
      TheScenes.Game.scene.scene.children.remove(state.headlineText);
      TheScenes.Game.scene.scene.children.remove(state.restartBtnText);
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
