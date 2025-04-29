// person-update.dto.js
class PersonUpdateDto {
    constructor(data) {
        if (!data) {
            throw new Error('No data provided for PersonUpdateDto');
        }

        this.surname = data.surname;
        this.name = data.name;
        this.middlename = data.middlename ?? null;
        this.phone_number = data.phoneNumber ?? null;  // Изменено на phoneNumber
        this.email = data.email;
    }

    // Статический метод для создания DTO из сырых данных
    static fromRawData(data) {
        return new PersonUpdateDto({
            surname: data.surname,
            name: data.name,
            middlename: data.middlename,
            phone_number: data.phoneNumber,
            email: data.email
        });
    }
}

module.exports = PersonUpdateDto;