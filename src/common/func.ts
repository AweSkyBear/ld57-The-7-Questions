import Prando from "prando";
import { Func } from "./types";
import { exposeToWindow } from "./debug";

export const repeat = (n: number) => Array(n).fill(undefined);

export const shuffle = (array: any[], prando: Prando) => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(prando.next() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const defer = (cb: Func<any, any>, timeout?: number) =>
  setTimeout(cb, timeout);

export const splitStringBySegmentLength = (
  source: string,
  segmentLength: number
) => {
  if (!segmentLength || segmentLength < 1)
    throw Error("Segment length must be defined and greater than/equal to 1");
  const target = [];
  for (
    const array = Array.from(source);
    array.length;
    target.push(array.splice(0, segmentLength).join(""))
  );
  return target;
};

exposeToWindow({ splitStringBySegmentLength });
