import { Variants } from "framer-motion";


const textVariants: Variants = {
    initial: {
        filter: 'blur(10px)',
        opacity: 0,
        x: -200,
    },
    animate: {
        filter: 'blur(0px)',
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.55
        }
    }
};


const ulVariants: Variants = {
    initial: {
        x: 0,
        y: 0
    },
    animate: {
        x: 0,
        y: 0, 
        transition: {
            staggerChildren: 0.4
        }
    }
};


const linkVariants: Variants = {
    initial: {
        scale: 0,
        filter: 'blur(15px)',
    },
    animate: {
        scale: [0, 1.15, 1],
        filter: 'blur(0px)',
        transition: {
            duration: 0.55
        }
    }
};

export { textVariants, ulVariants, linkVariants };