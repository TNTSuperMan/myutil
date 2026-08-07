import { animationFrame } from "../promise";

export async function* animationFrames({ signal }: { signal?: AbortSignal } = {}): AsyncGenerator<DOMHighResTimeStamp> {
    while (true) {
        yield await animationFrame({ signal });
    }
}
