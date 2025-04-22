class DepartmentDataForCreateDto {
    constructor({ 
        name, 
        full_name,
        chairperson_of_the_department_person = {},
        faculty = {},
    }) {
        this.name = name;
        this.full_name = full_name;

        this.chairperson_of_the_department_person_id = chairperson_of_the_department_person? chairperson_of_the_department_person.id: null;
        this.faculty_id = faculty? faculty.id: null;
    }
}

module.exports = DepartmentDataForCreateDto;
