import { promises as fs} from "fs";
import { ReadBlockComponent } from "@/components/readLayout/ReadBlock";
import { File } from "@/utils/FileUtil";
import styles from "@/styles/modules/readLayout/readPage.module.scss";
import { getBookDataRead } from "@/database/db_helpers_BOOKS";
import path from 'path';

async function getFile(path: string): Promise<File | null> {
  let buf: Buffer;
  try {
    buf = await fs.readFile(path);
  } catch (e: any) {
    return null;
  }
  return new File(buf);
}

type ReadPageParams = { params: { bookId: string }};

export default async function Read({ params }: ReadPageParams) {

  // path + query params
  const numberBookId = parseInt(params.bookId);

  const CURRENT_ABS_PATH = path.resolve('.');
  const bookData = await getBookDataRead(numberBookId);
  // it should not happen
  if (!bookData) {
    return <div>BOOK CANNOT BE FOUND!</div>;
  };

  // final abs path to book
  const RESULT_PATH = path.join(CURRENT_ABS_PATH, bookData.file);
  
  console.log(RESULT_PATH);

  let file = await getFile(RESULT_PATH);
  if (file == null) return <div>BOOK CANNOT BE FOUND!</div>;
  
  let str = "";
  let sections = file?.getListOfSections();

  if (file?.getListOfSections().length > 0) {
    str = file?.text;
  }

  if (sections === undefined) {
    sections = [];
  }

  let bookName = "";

  if (file.header != undefined) {
    bookName = file.header.getBookName();
  } else {
    bookName = "ERROR TITLE";
  }


  return (
    <main className={styles.main}>
      <div className={styles.readerBlock}>

        <ReadBlockComponent
          text={str}
          title={bookName}
          authorName={bookData.authorName}
          sections={JSON.parse(JSON.stringify(sections))}
          thumbnailPath={bookData.thumbnail}
        ></ReadBlockComponent>

      </div>
    </main>
  );
}
