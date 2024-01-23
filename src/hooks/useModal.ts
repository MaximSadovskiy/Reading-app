import { useState, useEffect } from 'react';
import { closeModalIfClickOutside, focusTrapKeyDown, focusTrapKeyUp } from '../utils/modalUtilities';

type ModalRefArg = React.RefObject<HTMLDivElement>;

const useModal = (modalRef: ModalRefArg, backdropRef: ModalRefArg) => {

    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => {
        if (isOpen == false) {
            setIsOpen(true);
        }
    }
    const closeModal = () => {
        if (isOpen) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const backdropElement = backdropRef.current as HTMLDivElement;

        // focus trap
        const keySet: Set<'Tab' | 'Shift'> = new Set();
        const onKeyDown = (e: KeyboardEvent) => focusTrapKeyDown(e, modalRef.current as HTMLDivElement, closeModal, keySet);
        const onKeyUp = (e: KeyboardEvent) => focusTrapKeyUp(e, keySet);
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        // click outside
        const handleClick = (e: MouseEvent) => closeModalIfClickOutside(e, backdropElement, closeModal);
        document.addEventListener('click', handleClick, true);

        // clean up
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('click', handleClick);
        }
    }, [isOpen, backdropRef, modalRef]);


    return { isOpen, openModal, closeModal } as const;
};

export default useModal;