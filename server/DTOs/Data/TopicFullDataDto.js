class TopicFullDataDto {
  constructor({id, name, subjectForTopic }) {
    this.id = id;
    this.name = name;
    this.subject = subjectForTopic? {
        id: subjectForTopic.id,
        name: subjectForTopic.name,
    }: {};
  }
}

module.exports = TopicFullDataDto;
