class FacultyDataForCreateDto {
    constructor({
                    name,
                    full_name,
                    dean_person_id, // принимаем ID напрямую
                    dean_person = null // оставляем для обратной совместимости
                }) {
        this.name = name;
        this.fullName = full_name;

        // Если передали ID, используем его
        if (dean_person_id) {
            this.deanPersonId = dean_person_id;
        }
        // Иначе пытаемся взять ID из объекта
        else if (dean_person) {
            this.deanPersonId = dean_person.id;
        }
        // Если ничего не передано
        else {
            this.deanPersonId = null;
        }
    }
}

module.exports = FacultyDataForCreateDto;