import { TheScenes } from "../scenes/TheScenes";
import { midPoint } from "./point";
import { Scene } from "./types";

export const questionTextO = ({
  scene = TheScenes.Game,
  text,
}: {
  scene?: Scene;
  text: string;
}) => {
  return scene.add
    .text(midPoint()[0], midPoint()[1], text, {
      fontFamily: "Sitka Small, Arial Black",
      fontSize: 38,
      color: "#ffffff",
      stroke: "#333333",
      strokeThickness: 2,
      align: "center",
      textShadow: "0 2px grey",
    } as any)
    .setOrigin(0.5, 0.5);
};
