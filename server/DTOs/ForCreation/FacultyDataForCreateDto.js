class FacultyDataForCreateDto {
    constructor({ 
        name, 
        full_name,
        dean_person = null, // явно указываем дефолтное значение null
    }) {
        this.name = name;
        this.fullName = full_name;

        // Обрабатываем случай, когда декан не указан
        this.deanPerson = dean_person ? {
            id: dean_person.id,
            surname: dean_person.surname,
            name: dean_person.name,
            middlename: dean_person.middlename,  
        } : null; // или undefined, в зависимости от требований      
    }
}

module.exports = FacultyDataForCreateDto;