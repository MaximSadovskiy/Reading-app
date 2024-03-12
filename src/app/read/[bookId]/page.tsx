import styles from "@/styles/modules/readLayout/readPage.module.scss";
import { ReadBlockComponent } from "@/components/readLayout/ReadBlock";
import { File } from "@/utils/FileUtil";
import { getBookDataRead, DB_Book_Record } from "@/database/db_helpers_BOOKS";
import { readdir } from "fs/promises";
import path from "path";

type ReadPageParams = { params: { bookId: string } };

async function getBookFilePath(bookData: DB_Book_Record | null) {
    // it should not happen
    if (!bookData) {
        return null;
    }

    console.log('from database filepath: ', bookData.filePath);

    return path.join(process.cwd(), 'public', bookData.filePath);
}

const getDirectories = async (source: any) =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

export default async function ReadPage({ params }: ReadPageParams) {
    const numberBookId = parseInt(params.bookId);
    const bookData = await getBookDataRead(numberBookId);
    const filePath = await getBookFilePath(bookData);

    console.log('filepath is', filePath);
    console.log('path to public', await getDirectories('public'));

    //console.log("path for /var/task", await getDirectories('/var/task') );

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
