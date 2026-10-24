import { promiseWithSignal } from "../signal";

export const timeout = (
  delay: number,
  {
    signal,
  }: {
    signal?: AbortSignal;
  } = {},
) =>
  promiseWithSignal((resolve) => {
    const id = setTimeout(resolve, delay);
    return () => clearTimeout(id);
  }, signal);
