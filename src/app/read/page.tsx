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
  // path + query params
  let path = "src/booksStorage/srcs/books/";
  let query = context.searchParams.book;

  if (typeof query === "string") {
    path = path.concat(query);
  }

  console.log(path);

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

        <ReadBlockComponent
          text={str}
          title={bookName}
          sections={JSON.parse(JSON.stringify(sections))}
        ></ReadBlockComponent>

      </div>
    </main>
  );
}
