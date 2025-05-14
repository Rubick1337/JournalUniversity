class LessonFullDataDto {
  constructor({
    GroupForLesson,
    SubgroupForLesson,
    date,
    SubjectForLesson,
    TeacherForLesson,
    TopicForLesson,
    audience_id,
    pair,
    SubjectTypeForLesson,
  }) {
    this.group = GroupForLesson
      ? { id: GroupForLesson.id, name: GroupForLesson.name }
      : {};
    this.subgroup = SubgroupForLesson
      ? { id: SubgroupForLesson.id, name: SubgroupForLesson.name }
      : {};
    this.date = date;
    this.subject = SubjectForLesson
      ? { id: SubjectForLesson.id, name: SubjectForLesson.name }
      : {};
    this.teacher = TeacherForLesson
      ? {
          id: TeacherForLesson.id,
          person: TeacherForLesson.person
            ? {
                id: TeacherForLesson.person.id,
                surname: TeacherForLesson.person.surname,
                name: TeacherForLesson.person.name,
                middlename: TeacherForLesson.person.middlename,
              }
            : {},
          position: TeacherForLesson.teachingPosition
            ? {
                id: TeacherForLesson.teachingPosition.id,
                name: TeacherForLesson.teachingPosition.name,
              }
            : {},
        }
      : {};
    this.topic = TopicForLesson
      ? { id: TopicForLesson.id, name: TopicForLesson.name }
      : {};
    this.audienceId = audience_id;
    this.SubjectType = SubjectTypeForLesson
    ? { id: SubjectTypeForLesson.id, name: SubjectTypeForLesson.name }
    : {};
  }
}

module.exports = LessonFullDataDto;
