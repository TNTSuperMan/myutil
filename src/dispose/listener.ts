export function useListener(target: EventTarget, type: string, callback: EventListener, options?: boolean | AddEventListenerOptions): Disposable {
  target.addEventListener(type, callback, options);

  return {
    [Symbol.dispose]() {
      target.removeEventListener(type, callback, options);
    }
  }
}
