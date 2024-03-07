'use client';

import { useState, useEffect } from 'react';
import debounce from '@/utils/debounceDecorator';


export type OrientationType = 'mobile' | 'tablet' | 'desktop';
export const BREAKPOINTS = {
    tablet: 900,
    desktop: 1150,
}

const getInitialOrientation = (): OrientationType => {
    const windowWidth = document.documentElement.clientWidth;
    if (windowWidth < BREAKPOINTS.tablet) {
        return 'mobile';
    }
    else if (windowWidth < BREAKPOINTS.desktop) {
        return 'tablet';
    }
    else {
        return 'desktop';
    }
};

export const useOrientation = (customBreakpoints?: typeof BREAKPOINTS) => {

    const [orientation, setOrientation] = useState(
        getInitialOrientation()
    );

    // if user define custom BREAKPOINTs
    const ACTIVE_BREAKPOINTS = customBreakpoints ?? BREAKPOINTS;

    useEffect(() => {
        const handleResize = debounce(() => {
            const windowWidth = document.documentElement.clientWidth;
            if (windowWidth < ACTIVE_BREAKPOINTS.tablet) {
                setTimeout(() => setOrientation('mobile'), 0);
            }
            else if (windowWidth < ACTIVE_BREAKPOINTS.desktop) {
                setTimeout(() => setOrientation('tablet'), 0);
            }
            else {
                setTimeout(() => setOrientation('desktop'), 0);
            }
        }, 50);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return orientation;
};