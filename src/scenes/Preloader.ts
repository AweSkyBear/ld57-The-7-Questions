import { Scene } from "phaser";
import { TEXTURES_MAP } from "../common/textures";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, TEXTURES_MAP.bg);

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.image(TEXTURES_MAP.bg, "assets/bg.png");
    this.load.image(TEXTURES_MAP.cube, "assets/cube.png");
    this.load.image({
      key: TEXTURES_MAP.tree,
      url: "assets/tree-2.jpg",
      normalMap: "assets/tree-normals.jpg",
    }); // TODO: other trees ?
    this.load.image(TEXTURES_MAP.questionBg, "assets/q-bg.png");
    this.load.image(TEXTURES_MAP.questionBg, "assets/choice-hexa.png");

    this.load.audio("ambient", "assets/ambient.mp3");
    this.load.audio("story-reveal", "assets/story-reveal1.mp3");

    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    // this.load.image("logo", "logo.png");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("Game"); // TODO: use `MainMenu` when one is available
  }
}
