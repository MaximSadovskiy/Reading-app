
// Horizontal offset
export const findHorizontalOffset = (largetElWidth: number, smallerElWidth: number) => {
    const halfDifference = (largetElWidth - smallerElWidth) / 2;
    return halfDifference;
};

// Top & Left render coords
// element is on which we relatively render tooltip
/**
 * @param elCoords - rectangle coordinates of element upon which we render tooltip (top, bottom, etc.)
 * @param elWidth - width of this element
 * @param tooltipWidth - width of the tooltip
 */

type GetPositionedTooltipType = (elCoords: DOMRect, tooltip: HTMLDivElement) => void;

export const getTooltipPositioned: GetPositionedTooltipType = (elCoords, tooltip) => {

    let tooltipCoords = {
        top: 0,
        left: 0,
    };
    const tooltipWidth = tooltip.offsetWidth;

    // top offset sufficient - render on top
    if (elCoords.top >= 120) {
        tooltipCoords.top = elCoords.top - 60; // 10 - margin between item and tooltip
    }
    // render on bottom otherwise
    else {
        tooltipCoords.top = elCoords.bottom + 10;
    }

    // HORIZONTAL
    const tooltipHorOffset = findHorizontalOffset(tooltipWidth, elCoords.width);
    // we want to render tooltip on left or on right?
    // left offset > right offset --> render on left, otherwise on right
    const rightSpace = document.documentElement.clientWidth - elCoords.right;
    const renderOnLeft = elCoords.left < rightSpace;
    // on left
    if (renderOnLeft) {
        // render above center of btn
        if (tooltipHorOffset + 20 < elCoords.left) {
            tooltipCoords.left = elCoords.left - tooltipHorOffset;
        } 
        // render left edge above left edge ob btn
        else {
            tooltipCoords.left = elCoords.left;
        }
    } 
    // on right
    else {
        if (tooltipHorOffset + 20 < rightSpace) {
            // .left for consistency
            // left = right + width
            const tooltipRight = elCoords.right + tooltipHorOffset;
            tooltipCoords.left = tooltipRight - tooltipWidth;
        }
        else {
            // render above center of element
            tooltipCoords.left = elCoords.right - tooltipWidth;
        }
    }

    // change position
    tooltip.style.top = tooltipCoords.top + 'px';
    tooltip.style.left = tooltipCoords.left + 'px';
};