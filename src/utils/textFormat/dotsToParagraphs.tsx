export const dotsToParagraphs = (text: string) => {
    const sentences = text.split('.');
    const filterNoSymbolPars = sentences.filter(sent => sent.length > 0);
    const paragraphSentences = filterNoSymbolPars.map(sentence => (
        <p key={sentence}>{sentence}.</p>
    ));
    return paragraphSentences;
};