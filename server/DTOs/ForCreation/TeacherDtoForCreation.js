class TeacherDtoForCreation {
  constructor(data) {
    console.log('Raw data received in DTO:', data);

    // Используем все возможные варианты именования полей
    this.department_id = data.department_id || data.department || null;
    this.person_id = data.person_id || data.person?.id || data.name?.id || null;
    this.teaching_position_id = data.teacher_position_id || data.teaching_position_id || data.position || null;

    console.log('Processed DTO:', this);
  }
}

module.exports = TeacherDtoForCreation;