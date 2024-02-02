
/* получить желаемую дистанцию скролла */
export const getScrollDistanceOnBreakpoint = (windowWidth: number, cardWidth: number, gapWidth: number) => {

    /* want to scroll count, not All count */
    let cardCount: number;
    let gapCount: number;
    
    if (windowWidth < 1150) {
        cardCount = 1;
    }
    else {
        cardCount = 2;
    }

    gapCount = cardCount;
    return (cardCount * cardWidth) + (gapCount * gapWidth)
};


/* получить дистанцию видмимых кард (внутри лист-контейнера) */
export const getCurrentVisibleDistance = (windowWidth: number, cardWidth: number, gapWidth: number) => {
    let cardCount: number, gapCount: number;

    if (windowWidth < 550) cardCount = 1;
    else if (windowWidth < 850) cardCount = 2;
    else if (windowWidth < 1150) cardCount = 3;
    else if (windowWidth < 1450) cardCount = 4;
    else if (windowWidth < 1550) cardCount = 5;
    else cardCount = 6;
    

    gapCount = cardCount - 1;

    return (cardCount * cardWidth) + (gapCount * gapWidth)
};


/* получить максимальную дистанцию скролла */
export const getMaxScrollDistance = (windowWidth: number, cardCount: number, cardWidth: number, gapWidth: number) => {
    const visibleDistance = getCurrentVisibleDistance(windowWidth, cardWidth, gapWidth);

    const gapCount = cardCount - 1;
    /* visible + maxScroll */
    const wholeContainerDistance = (cardCount * cardWidth) + (gapCount * gapWidth);

    /* maxScroll */
    return wholeContainerDistance - visibleDistance;
};