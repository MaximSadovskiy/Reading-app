import styles from '@/styles/modules/readLayout/readPage.module.scss';
import { promises as fs } from 'fs';

class Section {
    sectionName : string | undefined;
    index : number | undefined;
}
class HeaderPart {
    authorName = "";
    bookName = "";
    size = 0;

    constructor(buffer : Buffer) {
        // Порядок важен
        this.authorName = this.nextHeaderLine(buffer, 0);
        this.bookName = this.nextHeaderLine(buffer, this.size);
    }
    //private
    nextHeaderLine(buffer : Buffer, offset : number) {
        let i = offset;
        let found = false;

        while (i < buffer.length - 1) {
            // Найти конец строки
            if (buffer[i] === 0x0D && buffer[i + 1] === 0x0A) {
                found = true;
                break;
            }
            i++;
        }

        if (!found) {
            console.error("Failed to read header");
        }

        let bufferSlice = buffer.slice(offset, i);
        this.size += i - offset + 2;

        let str = bufferSlice.toString('utf-8');
        return str;
    }
}
class File {
    header : HeaderPart | undefined = undefined;
    sectionsArr : Array<Section> = [];
    currentSection : Section | undefined = undefined;
    buffer : Buffer | undefined   = undefined;
    text : string = "";
    textIndex = 0;

    constructor(buffer : Buffer) {
        if (buffer.length < 20) {
            console.error("File too small");
            return;
        }
        this.buffer = buffer;
        // Порядок важен
        this.parseHeader(buffer);
        this.parseSections(buffer);
    }
    getListOfSections() {
        // fuck js
        return JSON.parse(JSON.stringify(this.sectionsArr));
    }
    // искать по имени скорее всего не очень хорошая идея
    // потом можно ввести id, у каждой секции, чтобы легче искать
    readSection(sectionName : string | undefined) : string {
        if (sectionName == undefined) return "";

        let index = this.sectionsArr.findIndex(el => el.sectionName === sectionName);
        if (index === -1) return "";
        this.currentSection = this.sectionsArr[index];

        let end : number | undefined = 0;
        let nextSection = this.sectionsArr[index + 1];
        if (nextSection === undefined && this.buffer != undefined) {
            end = this.buffer.length;
        } else {
            end = nextSection.index;
        }
        if (this.buffer != undefined && this.currentSection.index
                != undefined && this.currentSection.sectionName != undefined) {
            return this.text.slice(this.currentSection.index + this.currentSection.sectionName.length + 12, end);
        }
        return "";
    }
    //private
    parseHeader(buffer : Buffer) {
        this.header = new HeaderPart(buffer);
        this.textIndex += this.header.size;
    }
    parseSections(buffer : Buffer) {
        let start = this.textIndex;
        let end = this.textIndex;
        while (end < buffer.length - 3) {
            // Конец секции
            if (buffer[end] === 0x0A && buffer[end + 1] === 0x0D
                && buffer[end + 2] === 0x0A && buffer[end + 3] === 0x0D) {
                let lineBuffer = buffer.slice(start, end + 1);
                let sectionStr = lineBuffer.toString('utf-8');

                sectionStr.split('\r\n').forEach((str) => {
                    let section = new Section();
                    section.sectionName = str.toString();

                    this.sectionsArr.push(section);
                });
                //pop empty one
                this.sectionsArr.pop();

                start = end + 4;
                break;
            }
            end++;
        }
        this.textIndex += end - this.textIndex - 1;

        if (this.buffer === undefined) return;
        this.text = this.buffer.subarray(this.textIndex, this.buffer.length).toString('utf-8');
        if (this.buffer === undefined) return;
        const pattern = new RegExp("\r\n\r\n\r\n([A-Za-zА-Яа-я0-9]+?)\r\n\r\n\r\n", "g");
        const matches = this.text.matchAll(pattern);

        let match = undefined;
        do {
            match = matches.next();
            if (!match.done) {
                const sectionStr = match.value[0].replaceAll("\r\n\r\n\r\n", '');
                const sectionIndex = this.sectionsArr.findIndex(e => e.sectionName === sectionStr);
                if (sectionIndex === -1) {
                    console.error(`Секция ${sectionStr} была обьявленна, но не найдена в тексте`);
                } else {
                    this.sectionsArr[sectionIndex].index = match.value.index;
                }
            }
        } while (match.done === false)
    }
}
async function BookRead() {
    let buf = await fs.readFile("src/booksStorage/srcs/books/отверженные.txt");
    const file = new File(buf);
    console.log("fdssfdd");
    let bookStr = "ERROR";
    if (file != null) bookStr = file.readSection("I");
    return (
        <p className={styles.renderText}>
            {bookStr}
        </p>
    );
};
export default BookRead;