class GroupDataForUpdateDto {
  constructor({
    name,
    graduationYear,
    yearOfBeginningOfStudy,
    facultyId,
    classRepresentativeId,
    teacherCuratorId,
    departmentId,
    academicSpecialtyCode,
  }) {
    this.name = name;
    this.graduationYear = graduationYear;
    this.yearOfBeginningOfStudy = yearOfBeginningOfStudy;
    this.facultyId = facultyId;
    this.classRepresentativeId = classRepresentativeId;
    this.teacherCuratorId = teacherCuratorId;
    this.departmentId = departmentId;
    this.academicSpecialtyCode = academicSpecialtyCode;
  }
}


module.exports = GroupDataForUpdateDto;
