class DepartmentFullDataDto {
    constructor({ 
        id,
        name, 
        full_name,
        head = {},
        faculty = {},
    }) {
        this.id = id;
        this.name = name;
        this.full_name = full_name;

        this.faculty = faculty ? {
            id: faculty.id,
            name: faculty.name,
            fullName: faculty.full_name
          } : null;
          
          this.head = head ? {
            id: head.id,
            surname: head.surname,
            name: head.name,
            middlename: head.middlename
          } : null;
    }
}

module.exports = DepartmentFullDataDto;
