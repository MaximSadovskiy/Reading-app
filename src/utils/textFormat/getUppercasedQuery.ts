export const getUppercasedQuery = (query: string) => {
    return query[0].toUpperCase() + query.slice(1).toLowerCase();
};