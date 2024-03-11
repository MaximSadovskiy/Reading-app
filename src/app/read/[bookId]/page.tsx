import styles from "@/styles/modules/readLayout/readPage.module.scss";
import { ReadBlockComponent } from "@/components/readLayout/ReadBlock";
import { File } from "@/utils/FileUtil";
import { getBookDataRead, DB_Book_Record } from "@/database/db_helpers_BOOKS";
import path from 'node:path';
import fs from "fs";


function findAppSubfolder(directoryPath: any, callback: any) {
    fs.readdir(directoryPath, (err, files) => {
       if (err) {
           return
       }
   
       files.forEach(file => {
         const fullPath = path.join(directoryPath, file);
         fs.stat(fullPath, (err, stats) => {
           if (err) {
             return
           }
   
           if (stats.isDirectory()) {
             if (file === 'booksStorage') {
               console.log('Found "booksStorage" subfolder at:', fullPath);
               callback(null, fullPath);
             } else {
               findAppSubfolder(fullPath, callback);
             }
           }
         });
       });
    });
}


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


export default async function ReadPage({ params }: ReadPageParams) {
    findAppSubfolder('/..', (err: any, path: any) => {
    });


    const numberBookId = parseInt(params.bookId);
    const bookData = await getBookDataRead(numberBookId);
    const filePath = await getBookFilePath(bookData);

    const file = await File.getFile(filePath);


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
