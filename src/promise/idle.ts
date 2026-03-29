export const idleCallback = ({ timeout, signal }: {
    timeout?: number,
    signal?: AbortSignal,
} = {}) => new Promise<IdleDeadline>((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const handle = requestIdleCallback((deadline) => {
        signal?.removeEventListener("abort", onAbort);
        resolve(deadline);
    }, { timeout });
    const onAbort = () => {
        signal?.removeEventListener("abort", onAbort);
        cancelIdleCallback(handle);
        reject(signal?.reason);
    };
    signal?.addEventListener("abort", onAbort);
});
