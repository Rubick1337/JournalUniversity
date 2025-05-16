class SubjectFullDataDto {
    constructor({ 
        id,
        name, 
        department = {},
    }) {
        this.id = id;
        this.name = name;

        this.department = department ? {
            id: department.id,
            name: department.name,
            fullName: department.full_name
          } : null;
    }
}

module.exports = SubjectFullDataDto;
