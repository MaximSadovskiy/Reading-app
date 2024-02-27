export const getAuthorDisplayName = (name: string, isNeedToReduce: boolean) => { 
    const nameAsArray = name.split(' ');
    const upperCasedName = nameAsArray.map(name => name[0].toUpperCase() + name.slice(1));

    if (!isNeedToReduce) {
        return upperCasedName.join(' ');    
    }
    else {
        // mutate first part, then join
        const reducedNameArray = upperCasedName.map((partOfName, index) => {

            if (index === 0) {
                const firstLetterAndDot = partOfName[0] + '.';

                return firstLetterAndDot;
            }
            else {
                return partOfName;
            }
        });

        return reducedNameArray.join(' ');
    }
};