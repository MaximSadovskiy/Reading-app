import { useLayoutEffect, useState, useRef} from "react";
import styles from "@/styles/modules/shared/tooltip.module.scss";
import { getTooltipPositioned } from "@/utils/tooltip/tooltip";
import { m, LazyMotion, domAnimation, Variants } from 'framer-motion';

const tooltipVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6
        }
    },
    exit: {
        opacity: 0,
        scale: 0,
        transition: {
            duration: 0.5,
        }
    }
}

type TooltipProps = {
    message: string;
    relativeElCoords: DOMRect;
};

export const Tooltip = ({ message, relativeElCoords }: TooltipProps) => {

    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [isPositioned, setIsPositioned] = useState(false);

    // positioning
    useLayoutEffect(() => {
        if (tooltipRef.current) {
            getTooltipPositioned(relativeElCoords, tooltipRef.current);
            setIsPositioned(true);
        }
    }, [tooltipRef.current, relativeElCoords]);

    return (
        <LazyMotion features={domAnimation}>
            <m.div 
                className={styles.tooltip}
                ref={tooltipRef}
                variants={tooltipVariants}
                initial='initial'
                exit='exit'
                animate={isPositioned && 'animate'}
            >
                {message}
            </m.div>
        </LazyMotion>
    )
};