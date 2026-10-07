import { useListener } from "../dispose/listener";

export async function* event<T extends Event>(target: EventTarget, type: string, options?: boolean | AddEventListenerOptions) {
    let resolvers = Promise.withResolvers<T>();
    using _listener = useListener(target, type, (ev) => resolvers.resolve(ev as T), options);

    if (typeof options === "object" && options.signal) {
        options.signal.throwIfAborted();
        using _signal_listener = useListener(options.signal, "abort", () => {
            resolvers.reject(options.signal!.reason);
        });
        while (true) {
            yield await resolvers.promise;
            resolvers = Promise.withResolvers<T>();
        }
    } else {
        while (true) {
            yield await resolvers.promise;
            resolvers = Promise.withResolvers<T>();
        }
    }
}
