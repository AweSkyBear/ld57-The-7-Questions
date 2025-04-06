declare const window: {
  __EXPOSED: Record<string, any>;
};

export const exposeToWindow = (varObj: any) => {
  // if (process.env.NODE_ENV === 'production') return
  if (import.meta.env.PROD) return;

  const result = Object.keys(varObj).map((key) => {
    const value = varObj[key];
    (window as any)[key] = value;
    window.__EXPOSED = window.__EXPOSED || {};
    window.__EXPOSED[key] = value;

    return [key, value];
  });

  return result;
};
