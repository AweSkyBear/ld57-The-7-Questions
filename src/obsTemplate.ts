import { Func, Point } from "~/common/types";
import {
  constructEvents,
  createThrottledDispatch,
  dispatchEvent,
  IEvent,
  obsDispCreator,
  obsDispEvents,
  TEventTarget,
} from "../OD";
import { TEventDispatchOptions } from "obs-disp/dist/obs-disp";

export const createObs = obsDispCreator<{
  pos: Point;
}>(({ pos } = {} as any) => {
  const state = {};

  return {
    [obsDispEvents.OBS_CREATE]: () => {
      //
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      //
    },
  };
});
