import { Listener } from "../listener";

export async function* event<T extends Event>(target: EventTarget, type: string, options?: boolean | AddEventListenerOptions) {
    const signal = typeof options === "object" ? options.signal : undefined;
    signal?.throwIfAborted();

    let resolvers: ReturnType<typeof Promise.withResolvers<T>> = Promise.withResolvers();
    using _target_listener = new Listener(target, type, (ev) => resolvers.resolve(ev as T), options);

    function rejectBySignal() {
        resolvers.reject(signal?.reason);
    }
    signal?.addEventListener("abort", rejectBySignal);
    try {
        while (true) {
            yield await resolvers.promise;
            resolvers = Promise.withResolvers<T>();
        }
    } finally {
        signal?.removeEventListener("abort", rejectBySignal);
    }
}
