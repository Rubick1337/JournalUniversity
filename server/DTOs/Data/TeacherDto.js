class TeacherPositionDto {
  constructor({ id, department = {}, person = {}, teachingPosition = {} }) {
    this.id = id;
    this.department = department
      ? {
          id: department.id,
          name: department.name,
          fullName: department.full_name,
        }
      : null;
    this.person = person
      ? {
          id: person.id,
          surname: person.surname,
          name: person.name,
          middlename: person.middlename,
        }
      : null;
    this.teachingPosition = {
      id: teachingPosition.id,
      name: teachingPosition.name,
    };
  }
}

module.exports = TeacherPositionDto;
