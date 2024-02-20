import { BookInterface } from "./bookInterface";

export interface AuthorInterface {
    name: string;
    books: BookInterface[];
    picture?: string;   
}