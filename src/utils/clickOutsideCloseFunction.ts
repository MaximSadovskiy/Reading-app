
export default function closeIfOutsideClick<T extends HTMLElement>(elementRefs: React.RefObject<T | null>[], event: MouseEvent, callback: () => void) {

    const { target } = event;

    // extract elements !== 'null'
    const noNullElements = elementRefs.filter(el => el.current !== null);

    if (noNullElements.length === 0) return;
    else {
        for (const elem of noNullElements) {
            if (elem.current?.contains(target as Node)) {
                return;
            }
        }

        // close modal only if none of the elements contains the target
        callback();
    }
};   