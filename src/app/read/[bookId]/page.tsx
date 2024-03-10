import styles from "@/styles/modules/readLayout/readPage.module.scss";
import { ReadBlockComponent } from "@/components/readLayout/ReadBlock";
import { File } from "@/utils/FileUtil";
import { getBookDataRead, DB_Book_Record } from "@/database/db_helpers_BOOKS";
import { readdir } from 'fs/promises'
import path from 'node:path';
import { exec } from "child_process";

type ReadPageParams = { params: { bookId: string } };
async function getBookFilePath(bookData: DB_Book_Record | null) {
    // it should not happen
    if (!bookData) {
        return null;
    }

    const ABS_PATH = path.join('/var/task/.next/server/', bookData.filePath);

    console.log('abs path:' , ABS_PATH);

    return ABS_PATH;
}

const getDirectories = async (source: any) =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory() || dirent.isFile())
    .map(dirent => dirent.name);

// Define the command to find the file
const command = 'find . -name "великийГэтсби.txt"';

export default async function ReadPage({ params }: ReadPageParams) {
    const numberBookId = parseInt(params.bookId);
    const bookData = await getBookDataRead(numberBookId);
    const filePath = await getBookFilePath(bookData);

    const file = await File.getFile(filePath);

    // Execute the command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        // stdout contains the full path of the file
        console.log(`Full path: ${stdout}`);
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
    });

    console.log("var/task/" + await getDirectories('/var/task/src/'));
    console.log("dir /" + await getDirectories('/'));

    if (file === null || bookData === null) {
        return <div>BOOK CANNOT BE FOUND!</div>;
    }

    let sections = file.getListOfSections();
    if (sections === undefined) {
        sections = [];
    }
    if (sections.length < 1) {
        file.text = "";
    }

    return (
        <main className={styles.main}>
            <section className={styles.readerBlock}>
                <ReadBlockComponent
                    text={file.text}
                    title={bookData.title}
                    authorName={bookData.authorName}
                    sections={JSON.parse(JSON.stringify(sections))}
                    thumbnailPath={bookData.thumbnail}
                ></ReadBlockComponent>
            </section>
        </main>
    );
}
