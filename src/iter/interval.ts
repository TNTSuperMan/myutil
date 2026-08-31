import { useInterval } from "../dispose/interval";

export async function* interval(delay: number, { signal }: { signal?: AbortSignal } = {}) {
    signal?.throwIfAborted();
    let callback: (() => void) | null = null;
    using _int = useInterval(() => {
        if (callback) {
            callback();
            callback = null;
        }
    }, delay);
    while (true) {
        yield await new Promise<void>((resolve, reject) => {
            signal?.throwIfAborted();
            callback = () => {
                signal?.removeEventListener("abort", onAbort);
                resolve();
            };
            const onAbort = () => {
                signal?.removeEventListener("abort", onAbort);
                reject(signal?.reason);
            }
            signal?.addEventListener("abort", onAbort);
        });
    }
}
