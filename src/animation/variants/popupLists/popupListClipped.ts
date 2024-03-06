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

// For mobile 
export const listVariantsWithoutClipPath: Variants = {
    initial: {
        opacity: 0,
        scale: 0,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            duration: 0.8,
            delayChildren: 0.2,
            staggerChildren: 0.15,
        }
    },
    exit: {
        opacity: 0,
        scale: 0,
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
    bounce?: number;
}

// helpers
const animateOpenProps: AnimateProps = {
    stiffness: 200,
    damping: 25,
};

const animateCloseProps: AnimateProps = {
    stiffness: 200,
    bounce: 0,
};

// item variants

export const itemVariants: Variants = {
    initial: {
        x: 250
    },
    animate: {
        x: 0,
        transition: {
            type: 'spring',
            duration: 0.6,
            ...animateOpenProps
        }
    },
    exit: {
        x: 250,
        transition: {
            type: 'spring',
            duration: 0.5,
            ...animateCloseProps
        }
    }
}