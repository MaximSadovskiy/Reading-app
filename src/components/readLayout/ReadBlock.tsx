"use client";
import styles from "@/styles/modules/readLayout/readPage.module.scss";
import { Section } from "@/utils/FileUtil";
import { useState } from "react";
import { PaginationBlockComponent } from "@/components/readLayout/PaginationBlock";

interface ReaderProp {
  text: string;
  title: string;
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
  function change(sectionName: string) {
    let index = prop.sections.findIndex((elem) => elem.sectionName === sectionName);
    if (index === -1) {
      console.error("Cannot find section with name: " + sectionName);
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
    //push name of section at the top
    paragraphsElements.push(
      <h1 key={0} className={styles.title}>
        {"Страница: " + prop.sections[sectionIndex].sectionName}
      </h1>
    );
    for (let i = 0; i < paragraphsArr.length; ++i) {
      paragraphsElements.push(
        //&emsp; = tab
        <p key={i + 1} className={styles.paragraphText}>
          &emsp; {paragraphsArr[i]}
        </p>
      );
    }
    const sectionNames: Array<string> = [];
    prop.sections.forEach((section) => {
      if (section.sectionName != undefined) {
        sectionNames.push(section.sectionName);
      }
    });
    // Only add title if it's starting page
    const header = [];
    if (sectionIndex === 0) {
      header.push(<h1 className={styles.title}>{prop.title}</h1>);
      header.push(<img
        className={styles.img}
        src="https://litmarket.ru/storage/books/89821_1704286953_65955ae918d16.jpg"
        data-src="https://litmarket.ru/storage/books/89821_1704286953_65955ae918d16.jpg"
        width="152"
        height="238"
        alt='обложка книги Иоганн Милтон "Идол с глиняного холма"'
        title='обложка книги Иоганн Милтон "Идол с глиняного холма"'
        data-was-processed="true"
      ></img>);
    }
    return (
      <>
        {header}

        {paragraphsElements}

        <PaginationBlockComponent
          list={sectionNames}
          onClickFunction={(ev: any) => {
            change(ev.target.outerText);
          }}
          onClickMoveOneFunction={(isLeft: boolean) => {
            changeOne(isLeft);
          }}
          currentSectionIndex={sectionIndex}
        ></PaginationBlockComponent>
      </>
    );
  } else {
    return <p className={styles.paragraphText}>{errorStr}</p>;
  }
}
export { ReadBlockComponent };
