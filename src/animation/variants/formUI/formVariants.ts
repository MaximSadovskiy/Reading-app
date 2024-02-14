import { Variants } from "framer-motion";

const listItemVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            duration: 1,
            ease: 'easeInOut',
        }
    },
    exit: {
        opacity: 0,
        scale: 0,
        transition: {
            type: 'spring',
            duration: 1,
            ease: 'easeInOut',
        }
    }
};

export { listItemVariants };