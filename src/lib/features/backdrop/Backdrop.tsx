import { createPortal } from 'react-dom';
import styles from '@/styles/modules/shared/backdrop.module.scss';
import { forwardRef } from 'react';

const Backdrop = forwardRef((props, ref: React.ForwardedRef<HTMLDivElement>) => {

    const Component = () => {
        return (
            <div id='backdrop' ref={ref} className={styles.backdrop}></div>
        )
    }

    return createPortal(<Component />, document.body);
});

export default Backdrop;