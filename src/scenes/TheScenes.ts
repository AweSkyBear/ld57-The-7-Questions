import { exposeToWindow } from "../common/debug";

/** To be populated upon scene creation */
export const TheScenes = {
  Game: null as any as Phaser.Scene,
  Menu: null as any as Phaser.Scene,
  Final: null as any as Phaser.Scene,
};

exposeToWindow({ TheScenes });
