export interface BookInterface {
    title: string;
    year: string;
    genres: GenreLiterals[];
    description: string;
    quotes: string[]; 
    authorName?: string;
    rating?: number;
    ratingMarks?: number[];
    // url для карточки в контейнере
    thumbnail: string;
    // url для страницы этой книги
    picture?: string;
    file: string; // путь до файла 
}


// Жанры книг
// должны совпадать с /loginSchemas/genreLiterals
export type GenreLiterals = 'Антиутопия' | 'Биография' | 'Роман' | 'Фантастика' | 'Фэнтези' | 'Детектив' | 'Триллер' | 'Классика';

export const GenreValues: GenreLiterals[] = ['Антиутопия', 'Биография', 'Роман', 'Фантастика', 'Фэнтези', 'Детектив', 'Триллер', 'Классика'];