import type { GenreLiterals } from "@/interfaces/storage/bookInterface";
import { GenreValues } from "@/interfaces/storage/bookInterface";
import { getUserById } from "./db_helpers";


// Favourite genres
export const getFavouriteGenres = async (userId: string): Promise<GenreLiterals[] | null> => {
    const user = await getUserById(userId);
    if (!user) {
        return null;
    }

    return user.favouriteGenres as GenreLiterals[];
};

// RandomGenres (if user is not Sign In)
export const getRandomGenres = (count: number = 3) => {
    const randomGenresResult: GenreLiterals[] = [];
    const range = GenreValues.length;

    while (randomGenresResult.length != count) {
        const randomIndex = Math.floor(Math.random() * range);
        const randomGenre = GenreValues[randomIndex];
        if (!randomGenresResult.includes(randomGenre)) {
            randomGenresResult.push(randomGenre);
        }
    }

    return randomGenresResult;
};