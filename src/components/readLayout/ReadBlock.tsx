"use client";
import styles from "@/styles/modules/readLayout/readPage.module.scss";
import { Section } from "@/utils/FileUtil";
import { useState } from "react";
import { PaginationBlockComponent } from "@/components/readLayout/PaginationBlock";

interface ReaderProp {
  text: string;
  sections: Array<Section>;
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
function ReadBlockComponent(prop: ReaderProp) {
  function changeOne(isLeft: boolean) {
    let newIndex = sectionIndex;
    if (isLeft) newIndex -= 1;
    else newIndex += 1;
    if (sectionIndex === 0 && isLeft) return;
    if (prop.sections.length <= newIndex && !isLeft) return;
    setSectionIndex(newIndex);
    changeText(readSection(prop, prop.sections[newIndex]));
  }
  function change(lul: string) {
    let index = prop.sections.findIndex((elem) => elem.sectionName === lul);
    if (index === -1) {
      console.error("Cannot find section with name: " + lul);
      return;
    }
    setSectionIndex(index);
    changeText(readSection(prop, prop.sections[index]));
  }

  const errorStr = "ERROR";
  const [sectionIndex, setSectionIndex] = useState(0);
  const [text, changeText] = useState(
    readSection(prop, prop.sections[sectionIndex])
  );

  if (prop.text.length > 0) {
    const paragraphsArr = splitTextToParagraphs(text);
    const paragraphsElements = [];
    for (let i = 0; i < paragraphsArr.length; ++i) {
      paragraphsElements.push(
        <p key={i} className={styles.paragraphText}>
          {paragraphsArr[i]}
        </p>
      );
    }
    const sectionNames: Array<string> = [];
    prop.sections.forEach((section) => {
      if (section.sectionName != undefined) {
        sectionNames.push(section.sectionName);
      }
    });

    return (
      <>
        {paragraphsElements}
        <PaginationBlockComponent
          list={sectionNames}
          onClickFunction={(ev: any) => { change(ev.target.outerText); }}
          onClickMoveOneFunction={(isLeft: boolean) => { changeOne(isLeft)}}
          currentSectionIndex={sectionIndex}
        ></PaginationBlockComponent>
      </>
    );
  } else {
    return <p className={styles.paragraphText}>{errorStr}</p>;
  }
}
export { ReadBlockComponent };