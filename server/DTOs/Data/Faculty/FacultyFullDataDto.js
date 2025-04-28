class FacultyFullDataDto {
    constructor(faculty) {
        this.id = faculty.id;
        this.name = faculty.name;
        this.full_name = faculty.full_name;
        this.dean_person_id = faculty.dean_person_id;

        // Правильно обрабатываем декана
        if (faculty.dean) {
            this.dean_person = {
                id: faculty.dean.id,
                surname: faculty.dean.surname,
                name: faculty.dean.name,
                middlename: faculty.dean.middlename
            };
        } else if (faculty.dean_person) {
            // Обработка если данные пришли в другом формате
            this.dean_person = {
                id: faculty.dean_person.id,
                surname: faculty.dean_person.surname,
                name: faculty.dean_person.name,
                middlename: faculty.dean_person.middlename
            };
        } else {
            this.dean_person = null;
        }

        console.log('Преобразованный DTO:', this); // Логирование
    }
}

module.exports = FacultyFullDataDto;
