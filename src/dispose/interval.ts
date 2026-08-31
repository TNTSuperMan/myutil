export function useInterval(callback: () => void, delay: number): Disposable {
  const int = setInterval(callback, delay);

  return {
    [Symbol.dispose]() {
      clearInterval(int);
    },
  };
}
