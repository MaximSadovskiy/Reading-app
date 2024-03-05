// start char code for lowercase letters
const UNICODE_START = 97;
const UNICODE_RANGE = 26;

// users data for SEEDing database
export const usersData = {
    names: ['Игорь', 'Оля', 'Максим', 'Роман', 'Антон', 'Mikhail', 'rEgEn', 'sToryTailer', 'ruSSian_BeAr', 'GarryOldman', 'kerojey', 'blind_owl', 'Карманный_кошелёк', 'ФанЗиПам', 'Не_Думаю_Но_Знаю', 'Пушкин-Вор', 'Геральт_из_Ливии', 'пролЕтАрий_из_ВиТебска', 'seemsGood', 'StariyHrych', 'Стул+Стол', 'undefined', 'скитающийся_скиталец', 'BurriTTo_', 'что-тотам'],
    
    getRandomName() {
        const randomIndex = Math.floor(Math.random() * this.names.length);
        const randomName = this.names[randomIndex];
        const randomDigitsAfter = Math.floor(Math.random() * 999) + 11;

        return `${randomName}${randomDigitsAfter}`;
    },

    generateEmail() {
        let baseString = '';
        // string from 5 to 8 chars
        let randomLength = Math.floor(Math.random() * 8) + 5;

        while (baseString.length < randomLength) {
            const randomSymbolCode = Math.floor(Math.random() * UNICODE_RANGE) + UNICODE_START;

            baseString += String.fromCharCode(randomSymbolCode);
        }

        return `${baseString}@mail.com`;
    },
};