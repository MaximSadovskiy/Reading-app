import { Variants } from "framer-motion";


const upDownVariants: Variants = {
    initial: {
        y: 400,
        opacity: 0,
    },
    animate: {
        y: [400, 200, 0],
        opacity: [0, 0.6, 1],
        clipPath: 'inset(0 0 0 0 round 15px)',
        transition: {
            type: 'spring',
            duration: 1,
            ease: 'easeInOut',
            delay: 0.35
        }
    },
    exit: {
        y: [0, 200, 400],
        opacity: [1, 0.3, 0],
        transition: {
            duration: 0.3,
            ease: 'circIn'
        }
    }
};


export default upDownVariants;