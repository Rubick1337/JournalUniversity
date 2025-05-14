class LessonDataForCreateDto {
  constructor({
    groupId,
    subgroupId,
    date,
    pairId,
    subjectId,
    teacherPersonId,
    topicId,
    audienceId,
    subjectTypeId,
  }) {
    this.group_id = groupId;
    this.subgroup_id = subgroupId;
    this.pair_id = pairId;
    this.date = date;
    this.subject_id = subjectId;
    this.teacher_person_id = teacherPersonId;
    this.topic_id = topicId;
    this.audience_id = audienceId;
    this.subject_type_id = subjectTypeId;
  }
}

module.exports = LessonDataForCreateDto;
