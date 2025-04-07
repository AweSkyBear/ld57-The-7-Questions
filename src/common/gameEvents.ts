import { constructEvents } from "obs-disp";

export const gameEvents = constructEvents([
  "GAME_START",
  "QUESTION_SHOW_NEXT",
  "QUESTION_ASKED",
  "QUESTION_ANSWERED_ALL",
  "QUESTION_ANSWERED",
  "GAME_END",
]);
