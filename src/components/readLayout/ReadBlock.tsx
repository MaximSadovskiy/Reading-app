"use client";

import styles from "@/styles/modules/readLayout/readPage.module.scss";
import { Section } from "@/utils/FileUtil";
import { useState } from "react";
import { PaginationBlockComponent } from "@/components/readLayout/PaginationBlock";
import Image from "next/image";

interface ReaderProp {
    text: string;
    title: string;
    authorName: string;
    sections: Array<Section>;
    thumbnailPath: string;
}

function readSection(prop: ReaderProp, section: Section) {
    let endIndex = 0;
    const nextSection = prop.sections[prop.sections.indexOf(section) + 1];
    if (nextSection === undefined) endIndex = prop.text.length;
    else endIndex = nextSection.index;
    //if (section == undefined) console.log(prop);
    return prop.text.substring(section.index + 6, endIndex);
}

function splitTextToParagraphs(text: string) {
    let startIndex = 0;
    let endIndex = text.indexOf("\n", 0);
    let paragraphsArr = [];
    if (endIndex === -1) {
        paragraphsArr.push(text.substring(startIndex, text.length));
        return paragraphsArr;
    }

    while (endIndex != -1) {
        let paragraphText = text.substring(startIndex, endIndex);
        if (paragraphText.length > 0) paragraphsArr.push(paragraphText);

        // +1, чтобы пропустить "\n"
        startIndex = endIndex + 1;
        endIndex = text.indexOf("\n", startIndex);
    }
    if (startIndex < text.length) {
        paragraphsArr.push(text.substring(startIndex, text.length));
    }
    return paragraphsArr;
}

function createHeader(sectionIndex: number, prop: ReaderProp) {
    if (sectionIndex != 0) return [];
    return [
        <h1 key={"header_title"} className={styles.title}>
            "{prop.title}"
        </h1>,

        <p key={"header_author"} className={styles.author}>
            {prop.authorName}
        </p>,

//<<<<<<< HEAD
//        <img
//            key={"header_img"}
          <Image
//>>>>>>> 6caf17e7aafc1bd521e2362a29a8647b7fb7e9ba
            className={styles.img}
            src={prop.thumbnailPath}
            data-src={prop.thumbnailPath}
            width={220}
            height={280}
            alt={`обложка книги &quot;${prop.title}&quot;`}
            title={`обложка книги &quot;${prop.title}&quot;`}
            data-was-processed="true"
        />,
    ];
}
function createTextBlock(text: string, sectionIndex: number, prop: ReaderProp) {
    if (prop.text.length < 1) return [];
    const paragraphsArr = splitTextToParagraphs(text);
    const paragraphsElements = [];
    //push name of section at the top
    paragraphsElements.push(
        <h2 key={"text_0"} className={styles.paragraphTitle}>
            {"Глава: " + prop.sections[sectionIndex].sectionName}
        </h2>
    );
    for (let i = 0; i < paragraphsArr.length; ++i) {
        paragraphsElements.push(
            //&emsp; = tab
            <p key={"text_" + (i + 1)} className={styles.paragraphText}>
                &emsp; {paragraphsArr[i]}
            </p>
        );
    }
    return paragraphsElements;
}
function ReadBlockComponent(prop: ReaderProp) {
    const [sectionIndex, setSectionIndex] = useState(0);
    const [text, changeText] = useState(
        readSection(prop, prop.sections[sectionIndex])
    );

    function movePageOne(isLeft: boolean) {
        let newIndex = sectionIndex;
        if (isLeft) newIndex -= 1;
        else newIndex += 1;
        if (sectionIndex === 0 && isLeft) return;
        if (prop.sections.length <= newIndex && !isLeft) return;
        setSectionIndex(newIndex);
        changeText(readSection(prop, prop.sections[newIndex]));
    }
    function movePage(sectionName: string) {
        let index = prop.sections.findIndex(
            (elem) => elem.sectionName === sectionName
        );
        if (index === -1) {
            console.error("Cannot find section with name: " + sectionName);
            return;
        }
        setSectionIndex(index);
        changeText(readSection(prop, prop.sections[index]));
    }

    if (prop.text.length > 0) {
        const HeaderBlock = createHeader(sectionIndex, prop);
        const TextBlock = createTextBlock(text, sectionIndex, prop);
        const sectionNames: Array<string> = [];
        prop.sections.forEach((section) => {
            if (section.sectionName != undefined) {
                sectionNames.push(section.sectionName);
            }
        });
        return (
            <>
                {HeaderBlock}

                {TextBlock}

                <PaginationBlockComponent
                    list={sectionNames}
                    onClickFunction={(ev: any) => {
                        movePage(ev.target.outerText);
                    }}
                    onClickMoveOneFunction={(isLeft: boolean) => {
                        movePageOne(isLeft);
                    }}
                    currentSectionIndex={sectionIndex}
                />
            </>
        );
    } else {
        const errorStr = "ERROR: book have no text";
        return (
            <p key={"text_error"} className={styles.paragraphText}>
                {errorStr}
            </p>
        );
    }
}
export { ReadBlockComponent };
