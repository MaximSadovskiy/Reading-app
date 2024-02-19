export interface BookInterface {
    id: string;
    title: string;
    // для визуального отображения
    author: string;
    // для поиска
    authorForSearch: string;
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
// должны совпадать с /loginSchemas/genreLiterals
type Genre = 'Антиутопия' | 'Биография' | 'Роман' | 'Фантастика' | 'Фэнтези' | 'Детектив' | 'Триллер' | 'Классика';