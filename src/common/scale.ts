const IMG_SCALE_TO_DPR = 1;
export const getRelativeScale = (scaleTarget: number = 1) =>
  scaleTarget / IMG_SCALE_TO_DPR;
