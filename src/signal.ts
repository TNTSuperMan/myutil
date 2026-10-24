import { useListener } from "./dispose/listener";

export async function promiseWithSignal<T>(
  executor: (
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void,
  ) => ((ev: Event) => any) | undefined,
  signal?: AbortSignal,
): Promise<T> {
  if (signal) {
    signal.throwIfAborted();

    const { promise, resolve, reject } = Promise.withResolvers<T>();
    const abort = executor(resolve, reject);

    using _listener = useListener(signal, "abort", (ev) => {
      abort?.(ev);
      reject(signal.reason);
    });

    return await promise;
  } else {
    return await new Promise(executor);
  }
}
