import { useInterval } from "../dispose/interval";
import { useListener } from "../dispose/listener";

export async function* interval(
  delay: number,
  { signal }: { signal?: AbortSignal } = {},
) {
  let resolvers = Promise.withResolvers<undefined>();
  using _interval = useInterval(() => {
    resolvers.resolve(undefined);
  }, delay);

  if (signal) {
    signal.throwIfAborted();
    using _listener = useListener(signal, "abort", () => {
      resolvers.reject(signal.reason);
    });
    while (true) {
      yield resolvers.promise;
      resolvers = Promise.withResolvers();
    }
  } else {
    while (true) {
      yield resolvers.promise;
      resolvers = Promise.withResolvers();
    }
  }
}
