class TeacherDtoForUpdate {
  constructor({  department = {}, person = {}, teacherPosition = {} }) {
    this.department_id = department?department.id: null;
    this.person_id = person?person.id: null;
    this.teacher_position_id = teacherPosition?teacherPosition.id: null;
  }
}

module.exports = TeacherDtoForUpdate;
