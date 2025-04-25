class DepartmentDataForUpdateDto {
    constructor(data) {
        this.name = data.name;
        this.full_name = data.full_name || data.fullName;
        this.faculty_id = data.faculty_id || data.facultyId;
        this.head_person_id = data.head_person_id ||
            data.chairperson_of_the_department_person_id ||
            data.headPersonId;
    }
}

module.exports = DepartmentDataForUpdateDto;
