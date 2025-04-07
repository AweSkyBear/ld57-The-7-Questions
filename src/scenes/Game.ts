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

    this.observers.push(
      controlBackground(),
      controlTree(),
      controlQuestions(),
      controlChoice(),
      controlFinalStory()
    );

    ODAPI.dispatchDeferredEvent(gameEvents.GAME_START);

    ////

    //// TODO:remove
    // this.camera = this.cameras.main;
    // this.camera.setBackgroundColor(0x00ff00);

    // this.background = this.add.image(512, 384, "background");
    // this.background.setAlpha(0.5);

    // this.msg_text = this.add.text(
    //   512,
    //   384,
    //   "Make something fun!\nand share it with us:\nsupport@phaser.io",
    //   {
    //     fontFamily: "Arial Black",
    //     fontSize: 38,
    //     color: "#ffffff",
    //     stroke: "#000000",
    //     strokeThickness: 8,
    //     align: "center",
    //   }
    // );
    // this.msg_text.setOrigin(0.5);

    // this.input.once('pointerdown', () => {

    //     this.scene.start('GameOver');

    // });

    this.events.on(Phaser.Scenes.Events.DESTROY, () => {
      this.observers.forEach((o) => ODAPI.removeObs(o));
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
