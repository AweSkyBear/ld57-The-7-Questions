import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    this.load.image("background", "assets/bg.png");

    //// FIX FOR BLACK SCREEN ON SOME DEVICES // Phaser sets the bg to 0 ???
    Array.from(document.querySelectorAll("canvas")).forEach((c) => {
      c.style.height = "";
      c.style.width = "";
    });
    ////
  }

  create() {
    this.scene.start("Preloader");
  }
}
