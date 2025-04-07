import { Scene } from "phaser";
import { TheScenes } from "./TheScenes";
import { sceneEvents } from "../common/sceneEvents";
import { IObserver, ODAPI } from "../OD";
import { controlBackground } from "../controlBackground";
import { controlTree } from "../controlTree";
import { controlQuestions } from "../controlQuestions";
import { controlChoice } from "../controlChoice";
import { gameEvents } from "../common/gameEvents";
import { controlFinalStory } from "../controlFinalStory";

const TARGET_FPS = 60;
const FPS_DELTA = 1000 / TARGET_FPS;

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  observers = [] as IObserver[];

  constructor() {
    super("Game");
  }

  create() {
    TheScenes.Game = this;

    const initObservers = () => {
      this.observers.push(
        controlBackground(),
        controlTree(),
        controlQuestions(),
        controlChoice(),
        controlFinalStory()
      );

      ODAPI.dispatchDeferredEvent(gameEvents.GAME_START);
    };

    initObservers(); // initial start

    this.events.on(Phaser.Scenes.Events.RESUME, () => {
      initObservers();
    });

    this.events.on(Phaser.Scenes.Events.DESTROY, () => {
      this.observers.forEach((o) => ODAPI.removeObs(o));
      this.observers = [];
    });

    this.events.on(Phaser.Scenes.Events.PAUSE, () => {
      this.observers.forEach((o) => ODAPI.removeObs(o));
      this.observers = [];
    });
  }

  private _deltaAccum = 0;
  private _isUpdatingThisStep = false;

  update(time, delta) {
    const currentFPS = 1000 / delta;
    const currentFPSFactor = TARGET_FPS / currentFPS;
    //  HIGHER-MONITOR-REFRESH-RATE-ISSUES:SOLVED: simulation visual speed
    if (this.matter?.world)
      this.matter.world.engine.timing.timeScale = currentFPSFactor;

    this._deltaAccum += delta;

    this._isUpdatingThisStep = this._deltaAccum > FPS_DELTA;

    //  HIGHER-MONITOR-REFRESH-RATE-ISSUES:SOLVED: UPDATE to always be dispatched 60 times per second
    if (this._deltaAccum > FPS_DELTA) {
      this._deltaAccum -= FPS_DELTA;
      // if (this.matter.world.enabled) {
      ODAPI.dispatchEvent(sceneEvents.UPDATE);
    }
  }
}
