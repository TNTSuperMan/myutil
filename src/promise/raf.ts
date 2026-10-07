import { promiseWithSignal } from "../signal";

export const animationFrame = (
    { signal }: { signal?: AbortSignal } = {}
) => promiseWithSignal<DOMHighResTimeStamp>((resolve) => {
    const handle = requestAnimationFrame(resolve);
    return () => cancelAnimationFrame(handle);
}, signal);
