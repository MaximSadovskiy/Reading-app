import { promises as fs} from "fs";
import { ReadBlockComponent } from "@/components/readLayout/ReadBlock";
import { File } from "@/utils/FileUtil";
import styles from "@/styles/modules/readLayout/readPage.module.scss";

async function getFile(path: string): Promise<File | null> {
  let buf: Buffer;
  try {
    buf = await fs.readFile(path);
  } catch (e: any) {
    return null;
  }
  return new File(buf);
}
export default async function Read(context: any) {
  if (context == undefined) return <div>CONTEXT NOT FOUND!</div>;
  let path = "books/";
  let query = context.searchParams.book;
  if (typeof query === "string") {
    path = path.concat(query);
  }
  let file = await getFile(path);
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

        <h1 className={styles.title}>{bookName}</h1>

        <img
          className={styles.img}
          src="https://litmarket.ru/storage/books/89821_1704286953_65955ae918d16.jpg"
          data-src="https://litmarket.ru/storage/books/89821_1704286953_65955ae918d16.jpg"
          width="152"
          height="238"
          alt='обложка книги Иоганн Милтон "Идол с глиняного холма"'
          title='обложка книги Иоганн Милтон "Идол с глиняного холма"'
          data-was-processed="true"
        ></img>

        <ReadBlockComponent
          text={str}
          sections={JSON.parse(JSON.stringify(sections))}
        ></ReadBlockComponent>

      </div>
    </main>
  );
}
