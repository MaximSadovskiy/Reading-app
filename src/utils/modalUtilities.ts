// Types
type CloseCallback = () => void;
type CloseModalType = (e: MouseEvent, backdropElement: HTMLDivElement, closeCallback: CloseCallback) => void;

type Keys = 'Tab' | 'Shift';
type KeySetRefType = React.MutableRefObject<Set<Keys>>;
type FocusTrapDownType = (e: KeyboardEvent, modalEl: HTMLElement, closeCallback: CloseCallback, keySetRef: KeySetRefType, focusIndexRef: React.MutableRefObject<number>) => void;
type FocusTrapUpType = (e: KeyboardEvent, keySetRef: KeySetRefType) => void;


// Functions
const closeModalIfClickOutside: CloseModalType = (e, backdropEl, closeCallback) => {
    if (!backdropEl) return;

    const target = e.target as HTMLElement;
    if (target.id === 'backdrop') {
        closeCallback();
    }
    else {
        return;
    }
};


// Focus Trap
const focusTrapKeyDown: FocusTrapDownType = (e, modalEl, closeCallback, keySetRef, focusIndexRef) => {
    // edge cases
    if (e.key === 'Escape') {
        closeCallback();
        return;
    }
    else if (e.key !== "Tab" && e.key !== 'Shift') return;

    e.preventDefault();

    if (keySetRef.current == null || focusIndexRef.current == null) return;


    keySetRef.current.add(e.key);
    if (e.key === 'Shift') return;


    let allElementsInsideModal: NodeListOf<HTMLInputElement | HTMLButtonElement | HTMLAnchorElement | HTMLSelectElement | HTMLTextAreaElement> = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');


    if (keySetRef.current?.has('Shift')) {
        

        if (focusIndexRef.current > 0) {
            focusIndexRef.current -= 1;
            allElementsInsideModal[focusIndexRef.current].focus();
        }
        else {
            focusIndexRef.current = allElementsInsideModal.length - 1;
            allElementsInsideModal[focusIndexRef.current].focus();
        }
    } else {


        if (focusIndexRef.current < allElementsInsideModal.length - 1) {
            focusIndexRef.current++;
            allElementsInsideModal[focusIndexRef.current].focus();
        }
        else {
            focusIndexRef.current = 0;
            allElementsInsideModal[focusIndexRef.current].focus();
        }
    }
};


const focusTrapKeyUp: FocusTrapUpType = (e, keySetRef) => {
    if (e.key === 'Shift') {
        keySetRef.current?.delete('Shift');
    }
};

export { closeModalIfClickOutside, focusTrapKeyDown, focusTrapKeyUp };