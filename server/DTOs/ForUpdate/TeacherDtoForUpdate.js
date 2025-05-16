class TeacherDtoForUpdate {
  constructor(data) {
    this.department_id = data.department_id || data.department?.id || null;
    this.person_id = data.person_id || data.person?.id || null;
    this.teaching_position_id = data.teaching_position_id || data.teacher_position_id || data.position || null;
  }
}

module.exports = TeacherDtoForUpdate;