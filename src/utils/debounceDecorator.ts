type DebounceFunction = (...args: any[]) => void;
type DebounceType = (func: DebounceFunction, duration: number) => DebounceFunction;


const debounce: DebounceType = (func, duration) => {
    let timeout: ReturnType<typeof setTimeout>;

    return function(this: DebounceFunction, ...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), duration);
    }
};

export default debounce;