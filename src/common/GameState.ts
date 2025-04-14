import Prando from "prando";
import QUESTIONS from "../data/questions";
import { exposeToWindow } from "./debug";
import { TheScenes } from "../scenes/TheScenes";

const getInitialState = () => ({
  // TODO:
  prando: null as Prando | null,
  currentQuestion: null as (typeof QUESTIONS)[0] | null,
  questionSet: [] as typeof QUESTIONS,
  qIndex: 0,
  selectedAnswers: [] as string[],
  gameRunning: true,
});

export const GameState = getInitialState();

export const resetGameState = () => {
  Object.assign(GameState, getInitialState());
  TheScenes.Game.scene.stop();
  TheScenes.Game.scene.start();
};

exposeToWindow({ GameState });
