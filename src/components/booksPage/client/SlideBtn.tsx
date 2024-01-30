'use client'
import { SlideArrowSvg } from "@/components/shared/Svg";
import styles from "@/styles/modules/booksPage/slideBtn.module.scss";

interface BtnProps {
    direction: 'left' | 'right';

}

const SlideBtn = ({ direction }: BtnProps) => {

    const spanText = direction === 'left' ? 'назад' : 'вперёд';

    return (
        <button className={styles.slideBtn} data-direction={direction}
            
        >
            {direction === 'right' && <span>{spanText}</span>}
            <SlideArrowSvg width={40} height={40} direction={direction} />
            {direction === 'left' && <span>{spanText}</span>}
        </button>
    )
};

export default SlideBtn;