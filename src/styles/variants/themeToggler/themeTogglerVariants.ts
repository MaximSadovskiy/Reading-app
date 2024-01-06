import { Variants } from "framer-motion";

const initClipPath = 'inset(10% 50% 90% 50% round 10px)';
const openClipPath = 'inset(0% 0% 0% 0% round 10px)';

export const listVariants: Variants = {
    initial: {
        clipPath: initClipPath,
    },
    animate: {
        clipPath: openClipPath,
        transition: {
            type: 'spring',
            duration: 0.8,
            delayChildren: 0.2,
            staggerChildren: 0.15,
        }
    },
    exit: {
        clipPath: initClipPath,
        transition: {
            type: 'spring',
            duration: 0.65,
        }
    }
};


// list items

interface AnimateProps {
    stiffness: number,
    damping?: number;
    bounce: number;
}

// helpers
const animateOpenProps: AnimateProps = {
    stiffness: 250,
    damping: 20,
    bounce: 0.5
};

const animateCloseProps: AnimateProps = {
    stiffness: 200,
    bounce: 0,
};

// item variants

export const itemVariants: Variants = {
    initial: {
        filter: 'blur(20px)',
        x: 50
    },
    animate: {
        filter: 'blur(0px)',
        x: 0,
        transition: {
            type: 'spring',
            duration: 0.6,
            ...animateOpenProps
        }
    },
    exit: {
        filter: 'blur(20px)',
        x: 50,
        transition: {
            type: 'spring',
            duration: 0.5,
            ...animateCloseProps
        }
    }
}