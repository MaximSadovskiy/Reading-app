export interface BookInterface {
    id: string;
    title: string;
    author: string;
    year: string;
    rating: number;
    genres: Genre | Genre[];
    description: string;
    quotes: string[] | string;
    // temporary optional 
    thumbnail?: Buffer;
    files: {
        book: Buffer | string; // temp
        img: Buffer | string; // temp
    } 
}


// Жанры книг
type Genre = 'исторический роман' | 'психологический роман';