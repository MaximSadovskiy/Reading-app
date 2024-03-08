import { promises as fs } from "fs";
class Section {
    public sectionName: string | undefined = undefined;
    public index: number = 0;
}
class HeaderPart {
    private authorName = "";
    private bookName = "";
    private size = 0;

    constructor(buffer: Buffer) {
        // Порядок важен
        this.authorName = this.nextHeaderLine(buffer, 0);
        this.bookName = this.nextHeaderLine(buffer, this.size - 1);
        //wtfff
        this.size -= 2;
    }
    public getAuthorName() {
        return this.authorName;
    }
    public getBookName() {
        return this.bookName;
    }
    public getSize() {
        return this.size;
    }
    private nextHeaderLine(buffer: Buffer, offset: number) {
        let i = offset;
        let found = false;

        while (i < buffer.length) {
            // Найти конец строки
            if (buffer[i] === 0x0a) {
                found = true;
                break;
            }
            i++;
        }

        if (!found) {
            console.error("Failed to read header at index: " + i);
        }

        const bufferSlice = buffer.slice(offset, i);
        this.size += i - offset + 2;

        return bufferSlice.toString("utf-8");
    }
}
class File {
    //make private later
    public header: HeaderPart | undefined = undefined;
    public sectionsArr: Array<Section> = [];
    public buffer: Buffer | undefined = undefined;
    public text: string = "";
    public textIndex = 0;

    public static async getFile(path: string | null): Promise<File | null> {
        if (path === null) return null;
        let buf: Buffer;
        try {
            buf = await fs.readFile(path);
        } catch (e: any) {
            return null;
        }
        return new File(buf);
    }
    private constructor(buffer: Buffer) {
        if (buffer.length < 20) {
            console.error("File too small");
            return;
        }
        this.buffer = buffer;
        // Порядок важен
        this.parseHeader(buffer);
        this.parseSections(buffer);
    }
    public getListOfSections() {
        return this.sectionsArr.slice();
    }
    private parseHeader(buffer: Buffer) {
        this.header = new HeaderPart(buffer);
        this.textIndex += this.header.getSize();
    }
    private parseSections(buffer: Buffer) {
        let start = this.textIndex;
        let end = this.textIndex;
        while (end < buffer.length - 1) {
            // Конец секции
            if (buffer[end] === 0x0a && buffer[end + 1] === 0x0a) {
                let lineBuffer = buffer.slice(start, end + 1);
                let sectionStr = lineBuffer.toString("utf-8");

                sectionStr.split("\n").forEach((str) => {
                    let section = new Section();
                    section.sectionName = str.toString();

                    this.sectionsArr.push(section);
                });
                //pop empty one
                this.sectionsArr.pop();

                start = end + 2;
                break;
            }
            end++;
        }
        this.textIndex += end - this.textIndex - 1;

        if (this.buffer === undefined) return;
        this.text = this.buffer
            .subarray(this.textIndex, this.buffer.length)
            .toString("utf-8");
        if (this.buffer === undefined) return;
        const pattern = new RegExp("\n\n\n([A-Za-zА-Яа-я0-9]+?)\n\n\n", "g");
        const matches = this.text.matchAll(pattern);

        let match = undefined;
        do {
            match = matches.next();
            if (!match.done) {
                const sectionStr = match.value[0].replaceAll("\n\n\n", "");
                const sectionIndex = this.sectionsArr.findIndex(
                    (e) => e.sectionName === sectionStr
                );
                if (sectionIndex === -1) {
                    console.error(
                        `Секция ${sectionStr} была обьявленна, но не найдена в секциях`
                    );
                } else {
                    if (
                        match.value != undefined &&
                        match.value.index != undefined
                    ) {
                        this.sectionsArr[sectionIndex].index =
                            match.value.index;
                    }
                }
            }
        } while (match.done === false);
    }
}
export { Section, HeaderPart, File };