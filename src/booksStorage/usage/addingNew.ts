import { addBook, addBookType } from './storage';
import { BookInputInterface } from '@/interfaces/bookInterface';

// helper funcs
const getBookPath = (base: string) => `../srcs/books/${base}.txt`;
const getImgPath = (base: string) => `../srcs/imgs/${base}.jpg`;

const addingArr: BookInputInterface[] = [
    {
        name: 'отверженные',
        author: 'виктор гюго',
        year: '1862',
        description: `Отверженные - это роман-эпопея, написанная Виктором Гюго и впервые опубликованная в 1862 году. Этот роман считается одним из величайших произведений XIX века и широко признан мировой литературной критикой и общественностью 1 Сюжет романа вплетает множество тем и мотивов, включая социальную несправедливость, бедность, несправедливое обращение с нищими и отверженными членами общества, а также мотив прощения и искупления 2.`,
        quotes: [
            'Все люди равны перед законом, но не все равны перед природой',
            'Никто не может быть свободным, если другие не свободны.',
            'Нельзя быть счастливым, если ты не спасаешь других.'
        ],
        paths: {
            book: getBookPath('отверженные'),
            img: getImgPath('отверженные'),
        }
    }   
];

// add function
addingArr.forEach(book => addBook(book));