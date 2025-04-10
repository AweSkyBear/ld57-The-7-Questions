import * as ObsDisp from "obs-disp";
import { createAPI } from "obs-disp";
import { exposeToWindow } from "./common/debug";

export const ODAPI = createAPI({
  //// for debugging
  onEvent: (ev) =>
    ![
      "GAME_UPDATE",
      "UPDATE",
      "POST_UPDATE",
      "INPUT_UPDATE",
      "INPUT_UPDATE_STATE",
      "GAME_UPDATE",
      "POST_UPDATE_THROTTLED",
      "HTML_EV_ANY",
    ].includes(ev!.name) &&
    import.meta.env.PROD &&
    console.log("EVENT DISP", ev),
  onObsCreated: (obs) => import.meta.env.PROD && console.log("OBS ADDED", obs),
  onObsRemoved: (obs) =>
    import.meta.env.PROD && console.log("OBS REMOVED", obs),
  onWarn: (args) =>
    import.meta.env.PROD && console.log("WARN: ", args?.msg, args?.params),
});

export const {
  ObsDispCreate,
  obsDispEvents,
  payloadPropOr,
  payloadProp,
  payload,
  constructEvents,
} = ObsDisp;
export const {
  addObsDisp,
  dispatchEvent,
  dispatchDeferredEvent,
  removeObs,
  obsDispCreator,
  removeObsById,
  removeAllObservers,
  createThrottledDispatch,
  getAllObservers,
} = ODAPI;

export type IObserver = ObsDisp.IObserver;
export type IObserverOptions = ObsDisp.IObserverOptions;
export type IEvent = ObsDisp.IEvent;
export type TEventTarget = ObsDisp.TEventTarget;

exposeToWindow({ ODAPI }); // for tinkering only - expose the whole API

export const getObserversByName = (name: string) =>
  ODAPI.getAllObservers().filter((o) => o.options?.name === name);
