export default interface BookInterface {
    id: string;
    name: string;
    author: string;
    year: string;
    description: string;
    quotes: string[] | string;
    files: {
        book: Buffer | string;
        img: Buffer | string;
    }   
}

export type BookInputInterface = Omit<BookInterface, 'id' | 'files'> & {
    paths: {
        book: string;
        img: string;
    }
};