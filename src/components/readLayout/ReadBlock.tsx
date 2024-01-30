"use client";
import styles from "@/styles/modules/readLayout/readPage.module.scss";
import { Section } from "@/utils/FileUtil";
import { useState } from "react";

interface ReaderProp {
  text: string;
  sections: Array<Section>;
}
function readSection(prop: ReaderProp, section: Section) {
  let endIndex = 0;
  const nextSection = prop.sections[prop.sections.indexOf(section) + 1];
  if (nextSection === undefined) endIndex = prop.text.length;
  else endIndex = nextSection.index;
  if (section == undefined) console.log(prop);
  return prop.text.substring(section.index + 12, endIndex);
}
function splitTextToParagraphs(text: string) {
  let startIndex = 0;
  let endIndex = text.indexOf("\n", 0);
  let xd = [];
  if (endIndex === -1) {
    xd.push(text.substring(startIndex, text.length));
    return xd;
  }
  
  while (endIndex != -1) {
    let paragraphText = text.substring(startIndex, endIndex);
    if (paragraphText.length > 0) xd.push(paragraphText);
    
    // +1, чтобы пропустить "\n"
    startIndex = endIndex + 1;
    endIndex = text.indexOf("\n", startIndex);
  }
  if (startIndex < text.length) {
    xd.push(text.substring(startIndex, text.length));
  }
  return xd;
}
function ReadBlock(prop: ReaderProp) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [text, changeText] = useState(
    readSection(prop, prop.sections[sectionIndex])
  );
  function change(lul: any) {
    if (lul.target != null || lul.target != undefined) {
      let index = prop.sections.findIndex(
        (elem) => elem.sectionName === lul.target?.value
      );
      if (index === -1) {
        console.error("Cannot find section with name: " + lul.target?.value);
        return;
      }
      setSectionIndex(index);
      changeText(readSection(prop, prop.sections[index]));
    }
  }
  const options = [];
  const errorStr = "ERROR";

  for (let i = 0; i < prop.sections.length; ++i) {
    let section = prop.sections[i];
    options.push(
      <option value={section.sectionName} key={i}>
        {section.sectionName}
      </option>
    );
  }
  if (prop.text.length > 0) {
    const paragraphsArr = splitTextToParagraphs(text);
    const paragraphsElements = [];
    for (let i = 0; i < paragraphsArr.length; ++i) {
      paragraphsElements.push(
        <p key={i} className={styles.renderText}>
          {paragraphsArr[i]}
        </p>
      );
    }
    return (
      <>
        <select onChange={change}>{options}</select>
        {paragraphsElements}
      </>
    );
  } else {
    return <p className={styles.renderText}>{errorStr}</p>;
  }
}
export { ReadBlock };
export type { ReaderProp };
