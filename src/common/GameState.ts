import Prando from "prando";
import QUESTIONS from "../data/questions";
import { exposeToWindow } from "./debug";

export const GameState = {
  // TODO:
  prando: null as Prando | null,
  currentQuestion: null as (typeof QUESTIONS)[0] | null,
  questionSet: [] as typeof QUESTIONS,
  qIndex: 0,
  selectedAnswers: [] as string[],
  gameRunning: true,
};

exposeToWindow({ GameState });
