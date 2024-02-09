export interface BookInterface {
    id: string;
    title: string;
    author: string;
    year: string;
    genres: Genre[];
    description: string;
    quotes: string[]; 
    rating: number;
    ratingMarks: number[];
    // url для карточки в контейнере
    thumbnail: string;
    // url для страницы этой книги
    picture: string;
    files: {
        book: Buffer | string; // temp
    } 
}


// Жанры книг
type Genre = 'исторический роман' | 'психологический роман';