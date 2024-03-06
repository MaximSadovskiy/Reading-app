export const dotsToParagraphs = (text: string) => {
    const sentences = text.split(/\./);

    const filterNoSymbolPars = sentences.filter(sent => sent.length > 0);
    const paragraphSentences = filterNoSymbolPars.map(sentence => (
        <p key={sentence}>{sentence}.</p>
    ));
    return paragraphSentences;
};


// for all separators (., !, ?)
export const splitTextToParagraphs = (text: string) => {
    // do not split '...' symbol
    const separatorsReg = /((?<!\.)\.(?!\.)|\?|!)/;

    const partsOfText = text.split(separatorsReg).filter(string => string.length > 0); // filter empty parts

    // store container 
    let currentParagparh = '';
    // ready <p> tags with text
    const paragraphs: JSX.Element[] = [];

    for (let i = 0; i < partsOfText.length; i += 2) {
        // concatenate text with separator
        currentParagparh = (partsOfText[i] + partsOfText[i+1]).trim();

        const pElement = <p>{currentParagparh}</p>

        paragraphs.push(pElement);
    }

    return paragraphs;
}