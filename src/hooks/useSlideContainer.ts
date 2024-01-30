
type createSlideContainerSign = (containerRef: React.RefObject<HTMLElement>, currentScrollRef: React.MutableRefObject<number>, cardCount: number, cardWidth: number, containerPadding: number) => { handlePrevClick: () => void, handleNextClick: () => void};


const howMuchCardScrollOnBreakpoint = (windowWidth: number, cardWidth: number, gapWidth: number) => {

    let wantToScrollCardsCount: number;
    let gapCount: number;
    
    if (windowWidth < 550) {
        wantToScrollCardsCount = 1;
        gapCount = wantToScrollCardsCount - 1;
    }
    else if (windowWidth < 850) {
        wantToScrollCardsCount = 2;
        gapCount = wantToScrollCardsCount - 1;
    }
    else {
        wantToScrollCardsCount = 3;
        gapCount = wantToScrollCardsCount - 1;
    }

    return wantToScrollCardsCount * cardWidth + gapCount * gapWidth;
}


const createSlideContainer: createSlideContainerSign = (containerRef, currentScrollRef, allCardCount, cardWidth = 220, gapWidth = 20) => {   

    // helpers
    const container = containerRef.current as HTMLUListElement;
    const currentScroll = currentScrollRef.current as number;
    const windowWidth = document.documentElement.clientWidth;

    const allGapCount = allCardCount - 1;
    const maxScrollWidth = allCardCount * cardWidth + allGapCount * gapWidth;
    const wantToScrollWidth = howMuchCardScrollOnBreakpoint(windowWidth, cardWidth, gapWidth);
    
    /* event handlers */
    const handlePrevClick = () => {
        /* log */
        console.log('prev click');
        if (currentScroll < wantToScrollWidth) {
            if (currentScroll > 0) {
                container.style.transform = 'translateX(0)';
                /* update in ref */
                currentScrollRef.current = 0;
            } else {
                return;
            }
        }
        else {
            container.style.transform = `translateX(${-wantToScrollWidth}px)`;
            /* update in ref */
            currentScrollRef.current -= wantToScrollWidth;
        }
    };

    const handleNextClick = () => {
        /* log */
        console.log('next click');
        if (currentScroll + wantToScrollWidth > maxScrollWidth) {
            const scrollToEndWidth = maxScrollWidth - currentScroll;
            if (scrollToEndWidth > 0) {
                container.style.transform = `translateX(${scrollToEndWidth}px)`;
                /* update in ref */
                currentScrollRef.current = maxScrollWidth;
            }
            else {
                return;
            }
        }
        else {
            container.style.transform = `translateX(${wantToScrollWidth}px)`;
            /* update in ref */
            currentScrollRef.current += wantToScrollWidth;
        }
    }


    return { handlePrevClick, handleNextClick };
};

export default createSlideContainer;