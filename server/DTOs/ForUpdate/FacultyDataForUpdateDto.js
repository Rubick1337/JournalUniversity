class FacultyDataForUpdateDto {
    constructor({
                    name,
                    full_name,
                    dean_person = {},
                    dean_person_id // Добавляем поддержку dean_person_id
                }) {
        this.name = name;
        this.fullName = full_name;

        // Логируем полученные данные
        console.log('FacultyDataForUpdateDto input:', { name, full_name, dean_person, dean_person_id });

        // Поддерживаем оба варианта - и объект dean_person, и dean_person_id
        this.deanPersonId = dean_person_id || dean_person.id;

        // Для обратной совместимости оставляем deanPerson
        this.deanPerson = {
            id: dean_person.id || dean_person_id,
            surname: dean_person.surname,
            name: dean_person.name,
            middlename: dean_person.middlename,
        };
    }
}

module.exports = FacultyDataForUpdateDto;