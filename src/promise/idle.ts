import { promiseWithSignal } from "../signal";

export const idleCallback = ({ signal }: { signal?: AbortSignal } = {}) =>
  promiseWithSignal<IdleDeadline>((resolve) => {
    const handle = requestIdleCallback(resolve);
    return () => cancelIdleCallback(handle);
  }, signal);
