import { useRef, useEffect } from 'react';
import { closeModalIfClickOutside, focusTrapKeyDown, focusTrapKeyUp } from '../utils/modalUtilities';

type ModalRefArg = React.RefObject<HTMLDivElement>;
type KeysetType = Set<'Tab' | 'Shift'>;

const useModal = (modalRef: ModalRefArg, closeCallback: () => void, modalState: boolean) => {

    // current index ref for focus trap
    const focusIndexRef = useRef<number>(0);
    const keySetRef = useRef<KeysetType>(new Set());
    
    useEffect(() => {
        if (modalRef.current != null && document.getElementById('backdrop') != null) {
            document.body.style.overflow = 'hidden';
            const backdropElement = document.getElementById('backdrop') as HTMLDivElement;
            
            // focus trap
            let keySet: KeysetType | null = new Set();
            const onKeyDown = (e: KeyboardEvent) => focusTrapKeyDown(e, modalRef.current as HTMLDivElement, closeCallback, keySetRef, focusIndexRef);
            const onKeyUp = (e: KeyboardEvent) => focusTrapKeyUp(e, keySetRef);
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);

            // click outside
            const handleClick = (e: MouseEvent) => closeModalIfClickOutside(e, backdropElement, closeCallback);
            document.addEventListener('click', handleClick, true);

            // clean up
            return () => {
                keySet = null;
                document.body.style.overflow = 'unset';
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('keyup', onKeyUp);
                document.removeEventListener('click', handleClick);
            }
        }
    }, [modalState, modalRef]);
};

export default useModal;