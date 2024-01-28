import { Variants } from "framer-motion";

const getInitClipPath = (roundInPx: string) => `inset(50% 50% 50% 50% round ${roundInPx})`;
const getOpenClipPath = (roundInPx: string) => `inset(0 0 0 0 round ${roundInPx})`;

const getModalBlurVariants = (roundInPx: string): Variants => ({
    initial: {
        clipPath: getInitClipPath(roundInPx),
        filter: 'blur(15px)',
    },
    animate: {
        clipPath: getOpenClipPath(roundInPx),
        filter: 'blur(0px)',
        transition: {
            duration: 0.5,
            ease: 'easeInOut',
        }
    },
    exit: {
        clipPath: getInitClipPath(roundInPx),
        filter: 'blur(15px)',
        transition: {
            duration: 0.3,
            ease: 'circIn'
        }
    }
});


export default getModalBlurVariants;