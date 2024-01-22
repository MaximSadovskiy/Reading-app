// Types
type CloseCallback = () => void;
type CloseModalType = (e: MouseEvent, backdropElement: HTMLDivElement, closeCallback: CloseCallback) => void;

type Keys = 'Tab' | 'Shift'; 
type FocusTrapDownType = (e: KeyboardEvent, modalEl: HTMLElement, closeCallback: CloseCallback, keySet: Set<Keys>) => void;
type FocusTrapUpType = (e: KeyboardEvent, keySet: Set<Keys>) => void;


// Functions
const closeModalIfClickOutside: CloseModalType = (e, backdrop, closeCallback) => {
    const target = e.target as Node;
    if (backdrop.contains(target)) {
        closeCallback;
    }
    else {
        return;
    }
};


// Focus Trap
const focusTrapKeyDown: FocusTrapDownType = (e, modalEl, closeCallback, keySet) => {
    // edge cases
    if (e.key === 'Escape') {
        closeCallback();
        return;
    }
    else if (e.key !== "Tab" && e.key !== 'Shift') return;

    e.preventDefault();

    keySet.add(e.key);
    if (e.key === 'Shift') return;

    console.log('current keySEt: ', keySet);

    let focusElIndex = 0;
    let allElementsInsideModal: NodeListOf<HTMLInputElement | HTMLButtonElement | HTMLAnchorElement | HTMLSelectElement | HTMLTextAreaElement> = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

    if (keySet.has('Shift')) {
        if (focusElIndex > 0) {
            focusElIndex--;
            allElementsInsideModal[focusElIndex].focus();
        }
        else {
            focusElIndex = allElementsInsideModal.length;
            allElementsInsideModal[focusElIndex].focus();
        }
    } else {
        if (focusElIndex < allElementsInsideModal.length) {
            focusElIndex++;
            allElementsInsideModal[focusElIndex].focus();
        }
        else {
            focusElIndex = 0;
            allElementsInsideModal[focusElIndex].focus();
        }
    }
};


const focusTrapKeyUp: FocusTrapUpType = (e, keySet) => {
    if (e.key === 'Shift') {
        keySet.delete('Shift');
    }
};

export { closeModalIfClickOutside, focusTrapKeyDown, focusTrapKeyUp };