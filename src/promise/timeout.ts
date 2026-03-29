export const timeout = (delay: number, { signal }: {
    signal?: AbortSignal,
} = {}) => new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const timeout = setTimeout(() => {
        signal?.removeEventListener("abort", onAbort);
        resolve();
    }, delay);
    const onAbort = () => {
        signal?.removeEventListener("abort", onAbort);
        clearTimeout(timeout);
        reject(signal?.reason);
    }
    signal?.addEventListener("abort", onAbort);
});
