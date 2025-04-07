import Prando from "prando";
import QUESTIONS from "../data/questions";
import { exposeToWindow } from "./debug";

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
};

exposeToWindow({ GameState });
