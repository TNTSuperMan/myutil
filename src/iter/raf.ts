export async function* animationFrames({ signal }: { signal?: AbortSignal } = {}): AsyncGenerator<DOMHighResTimeStamp> {
    signal?.throwIfAborted();
    let handle: number | null = null;
    try {
        while (true) {
            yield await new Promise<DOMHighResTimeStamp>((resolve, reject) => {
                if (signal?.aborted) return reject(signal.reason);
                handle = requestAnimationFrame((time) => {
                    signal?.removeEventListener("abort", onAbort);
                    handle = null;
                    resolve(time);
                });
                const onAbort = () => {
                    signal?.removeEventListener("abort", onAbort);
                    reject(signal?.reason);
                };
                signal?.addEventListener("abort", onAbort);
            });
        }
    } finally {
        if (handle) {
            cancelAnimationFrame(handle);
        }
    }
}
