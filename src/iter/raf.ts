import { animationFrame } from "../promise";

export async function* animationFrames({ signal }: { signal?: AbortSignal } = {}): AsyncGenerator<DOMHighResTimeStamp> {
    signal?.throwIfAborted();
    while (true) {
        yield await animationFrame();
    }
}
