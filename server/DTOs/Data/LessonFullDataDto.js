class LessonFullDataDto {
    constructor({
      group_id,
      subgroup_id,
      date,
      subject_id,
      teacher_person_id,
      topic_id,
      audience_id,
      subject_type_id,
    }) {
      this.groupId = group_id;
      this.subgroupId = subgroup_id;
      this.date = date;
      this.subjectId = subject_id;
      this.teacherPersonId = teacher_person_id;
      this.topicId = topic_id;
      this.audienceId = audience_id;
      this.subjectTypeId = subject_type_id;
    }
  }
  
  module.exports = LessonFullDataDto;
  