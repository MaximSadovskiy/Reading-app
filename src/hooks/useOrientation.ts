import { useState, useEffect } from 'react';

// window & document as arguments, чтобы обойти ошибки next js в связи с рендерингом на сервере (где они равны undefined)
export const useOrientation = (window: Window, document: Document, widthCondition: number = 500) => {
    const condition = `(max-width: ${widthCondition})`;
    
    const [isMobile, setIsMobile] = useState(
        window.matchMedia(condition).matches
    );

    useEffect(() => {
        const checkCondition = () => {
            const windowWidth = document.documentElement.clientWidth;
            if (windowWidth <= widthCondition && !isMobile) {
                setIsMobile(true);
            }
            else {
                if (isMobile) {
                    setIsMobile(false);
                }
            }
        }

        window
            .matchMedia(condition)
            .addEventListener('change', checkCondition);


        return () => {
            window  
                .matchMedia(condition)
                .removeEventListener('change', checkCondition);
        };

    }, []);


    return isMobile;
};