// uppercase user query to match database field

export const getUppercasedQuery = (query: string) => {
    let queryAsArray = query.split(' ')
                        .map(queryWord => queryWord[0].toUpperCase() + queryWord.slice(1).toLowerCase());

    return queryAsArray.join(' '); 
};