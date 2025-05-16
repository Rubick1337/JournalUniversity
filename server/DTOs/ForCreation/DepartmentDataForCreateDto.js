class DepartmentDataForCreateDto {
    constructor({
                    name,
                    full_name,
                    chairperson_of_the_department_person_id, // Принимаем прямой ID
                    faculty_id, // Принимаем прямой ID
                    chairperson_of_the_department_person = {}, // Оставляем для обратной совместимости
                    faculty = {} // Оставляем для обратной совместимости
                }) {
        this.name = name;
        this.full_name = full_name;

        // Используем прямой ID если передан, иначе пытаемся извлечь из объекта
        this.chairperson_of_the_department_person_id =
            chairperson_of_the_department_person_id !== undefined
                ? chairperson_of_the_department_person_id
                : (chairperson_of_the_department_person ? chairperson_of_the_department_person.id : null);

        this.faculty_id =
            faculty_id !== undefined
                ? faculty_id
                : (faculty ? faculty.id : null);
    }
}

module.exports = DepartmentDataForCreateDto;