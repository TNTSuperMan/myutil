type MaybePromise<T> = Promise<T> | T;

export class AsyncIter<T> {
  #iter: AsyncIterable<T>;
  constructor(iter: AsyncIterable<T>) {
    this.#iter = iter;
  }
  static fromSync<T>(iterable: Iterable<T>): AsyncIter<T> {
    return new AsyncIter({
      [Symbol.asyncIterator]() {
        const iter = iterable[Symbol.iterator]();
        return {
          next: () => new Promise((resolve) => resolve(iter.next())),
        };
      },
    });
  }
  private async *entries_gen(): AsyncGenerator<[number, T]> {
    let index = 0;
    for await (const value of this) yield [index++, value];
  }
  entries(): AsyncIter<[number, T]> {
    return new AsyncIter(this.entries_gen());
  }
  keys(): AsyncIter<number> {
    return this.map((_value, index) => index);
  }
  values(): AsyncIter<T> {
    return this;
  }

  [Symbol.asyncIterator]() {
    return this.#iter[Symbol.asyncIterator]();
  }

  private async *map_gen<E>(
    callbackfn: (value: T, index: number) => MaybePromise<E>,
  ): AsyncGenerator<E> {
    for await (const [index, value] of this.entries())
      yield await callbackfn(value, index);
  }
  map<E>(
    callbackfn: (value: T, index: number) => MaybePromise<E>,
  ): AsyncIter<E> {
    return new AsyncIter(this.map_gen(callbackfn));
  }

  private async *filter_gen(
    predicate: (value: T, index: number) => MaybePromise<boolean>,
  ): AsyncGenerator<T> {
    for await (const [index, value] of this.entries())
      if (await predicate(value, index)) yield value;
  }
  filter(
    predicate: (value: T, index: number) => MaybePromise<boolean>,
  ): AsyncIter<T> {
    return new AsyncIter(this.filter_gen(predicate));
  }

  private async *take_gen(limit: number): AsyncGenerator<T> {
    const iterator = this.#iter[Symbol.asyncIterator]();
    let index = 0;
    while (true) {
      if (++index > limit) break;
      const result = await iterator.next();
      if (result.done) break;
      yield result.value;
    }
  }
  take(limit: number): AsyncIter<T> {
    return new AsyncIter(this.take_gen(limit));
  }

  private async *drop_gen(count: number): AsyncGenerator<T> {
    for await (const [index, value] of this.entries())
      if (index < count) yield value;
  }
  drop(count: number): AsyncIter<T> {
    return new AsyncIter(this.drop_gen(count));
  }

  private async *flatMap_gen<U>(
    callback: (
      value: T,
      index: number,
    ) => MaybePromise<AsyncIterable<U> | Iterable<U>>,
  ): AsyncGenerator<U> {
    for await (const iterator of this.map_gen(callback)) yield* iterator;
  }
  async flatMap<U>(
    callback: (
      value: T,
      index: number,
    ) => MaybePromise<AsyncIterable<U> | Iterable<U>>,
  ): Promise<AsyncIter<U>> {
    return new AsyncIter(this.flatMap_gen(callback));
  }

  async reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
    ) => MaybePromise<U>,
    initialValue: U,
  ): Promise<U> {
    let previousValue = initialValue;
    this.forEach(async (value, index) => {
      previousValue = await callbackfn(previousValue, value, index);
    });
    return previousValue;
  }

  toArray(): Promise<T[]> {
    return Array.fromAsync(this.#iter);
  }

  async forEach(callbackfn: (value: T, index: number) => MaybePromise<void>) {
    for await (const [index, value] of this.entries())
      await callbackfn(value, index);
  }

  async some(
    predicate: (value: T, index: number) => MaybePromise<boolean>,
  ): Promise<boolean> {
    for await (const [index, value] of this.entries())
      if (await predicate(value, index)) return true;
    return false;
  }

  async every(
    predicate: (value: T, index: number) => MaybePromise<boolean>,
  ): Promise<boolean> {
    for await (const [index, value] of this.entries())
      if (!(await predicate(value, index))) return false;
    return true;
  }

  async find(
    predicate: (value: T, index: number) => MaybePromise<boolean>,
  ): Promise<T | undefined> {
    for await (const [index, value] of this.entries())
      if (await predicate(value, index)) return value;
  }
}
