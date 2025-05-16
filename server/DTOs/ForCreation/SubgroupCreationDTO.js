class SubgroupCreationDTO {
  constructor({
    name,
    groupId,
    leaderId
  }) {
    this.name = name;
    this.group_id = groupId;
    this.leader_id = leaderId;
  }
}

module.exports = SubgroupCreationDTO;
