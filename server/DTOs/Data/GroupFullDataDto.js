class GroupFullDataDto {
  constructor({
    id,
    name,
    graduation_year,
    year_of_beginning_of_study,
    faculty,
    classRepresentative,
    teacherCurator,
    department,
    academicSpecialty,
  }) {
    this.id = id;
    this.name = name;
    this.graduationYear = graduation_year;
    this.yearOfBeginningOfStudy = year_of_beginning_of_study;
    this.faculty = faculty
      ? {
          id: faculty.id,
          name: faculty.name,
          fullName: faculty.full_name,
        }
      : {};
    this.classRepresentative = classRepresentative
      ? {
          id: classRepresentative.id,
          surname: classRepresentative.surname,
          name: classRepresentative.name,
          middlename: classRepresentative.middlename,
        }
      : {};
    this.teacherCurator = teacherCurator
      ? {
          id: teacherCurator.id,
          surname: teacherCurator.surname,
          name: teacherCurator.name,
          middlename: teacherCurator.middlename,
        }
      : {};
    this.department = department
      ? {
          id: department.id,
          name: department.name,
          fullName: department.full_name,
        }
      : {};
    this.academicSpecialty = academicSpecialty
      ? {
          code: academicSpecialty.code,
          name: academicSpecialty.name,
        }
      : {};
  }
}

module.exports = GroupFullDataDto;
