export class Listener<T extends EventTarget> {
    target: T;
    type: string;
    callback: EventListener;
    options: boolean | AddEventListenerOptions | undefined;
    constructor(target: T, type: string, callback: EventListener, options?: boolean | AddEventListenerOptions) {
        this.target = target;
        this.type = type;
        this.callback = callback;
        this.options = options;
        target.addEventListener(type, callback, options);
    }

    remove() {
        this.target.removeEventListener(this.type, this.callback, this.options);
    }

    [Symbol.dispose]() {
        this.remove();
    }
}
