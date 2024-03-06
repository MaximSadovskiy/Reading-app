
// find top offset of element inside higher element container (div inside document)
// added offset - если мы хотим чтобы элемент появился раньше, чем на позиции центра экрана по высоте
export const getWindowTopOffset = (heightOfSmallEl: number, heightOfLargeEl: number, addedOffset: number = 0) => {

    // top window offset
    const topWindowOffset = (heightOfLargeEl - heightOfSmallEl) / 2 + addedOffset;
    return topWindowOffset;
};