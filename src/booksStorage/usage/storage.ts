import { BookInterface } from '@/interfaces/bookInterface';
import fs from 'node:fs';

// private helpers
let currentID = 0;
// base === название книги
const getBookFromPath = (base: string) => {
    const path = `../srcs/books/${base}.txt`;
    const file = fs.readFileSync(path);
    return file;
};
const getImgFromPath = (base: string) => {
    const path = `../srcs/imgs/${base}.jpg`;
    const file = fs.readFileSync(path);
    return file;
};
const getID = () => {
    const returnID = String(currentID);
    currentID++;
    return returnID;
};

// export helpers
export const retrieveBooks = () => books;
export const retrieveBooksWithoutFiles = () => {
    const booksWithoutFiles = books.map(book => {
        const { id, name, author, year, description, quotes } = book;

        return {
            id,
            name,
            author,
            year,
            description,
            quotes
        };
    });


    return booksWithoutFiles;
};

// MAIN STORAGE
const books: BookInterface[] = [
    {
        id: '0',
        name: 'отверженные',
        author: 'виктор гюго',
        year: '1862',
        description: `Отверженные - это роман-эпопея, написанная Виктором Гюго и впервые опубликованная в 1862 году. Этот роман считается одним из величайших произведений XIX века и широко признан мировой литературной критикой и общественностью. Сюжет романа вплетает множество тем и мотивов, включая социальную несправедливость, бедность, несправедливое обращение с нищими и отверженными членами общества, а также мотив прощения и искупления.`,
        quotes: [
            'Все люди равны перед законом, но не все равны перед природой',
            'Никто не может быть свободным, если другие не свободны.',
            'Нельзя быть счастливым, если ты не спасаешь других.'
        ],
        files: {
            book: getBookFromPath('отверженные'),
            img: getImgFromPath('отверженные'),
        }
    }  
];


export default books;