export function* loop(count: number) {
    for (let i = 0; i < count; i++) {
        yield i;
    }
}

export function* multiloop(...lengths: number[]): Generator<number[]> {
    const counts = lengths.map(() => 0);
    while (true) {
        yield [...counts];
        for (let i = lengths.length - 1; i >= 0; i--) {
            if (++counts[i]! >= lengths[i]!) {
                counts[i]! = 0;
                if (i === 0) {
                    return;
                } else {
                    continue;
                }
            } else {
                break;
            }
        }
    }
}
