import { createPortal } from 'react-dom';
import styles from '@/styles/modules/shared/backdrop.module.scss';

const Backdrop = () => {

    const Component = () => {
        return (
            <div id='backdrop' className={styles.backdrop}></div>
        )
    }

    return createPortal(<Component />, document.body);
};