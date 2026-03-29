export const animationFrame = ({ signal }: {
    signal?: AbortSignal,
} = {}) => new Promise<DOMHighResTimeStamp>((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const handle = requestAnimationFrame((time) => {
        signal?.removeEventListener("abort", onAbort);
        resolve(time);
    });
    const onAbort = () => {
        signal?.removeEventListener("abort", onAbort);
        cancelAnimationFrame(handle);
        reject(signal?.reason);
    };
    signal?.addEventListener("abort", onAbort);
});
