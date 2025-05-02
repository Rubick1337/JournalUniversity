class StudentDataForUpdateDto {
    constructor({
      countReprimand,
      iconPath,
      personId,
      groupId,
      subgroupId,
      perentPersonId,
    }) {
      this.count_reprimand = countReprimand;
      this.icon_path = iconPath;
      this.person_id = personId;
      this.group_id = groupId;
      this.subgroup_id = subgroupId;
      this.perent_person_id = perentPersonId;
    }
  }
  
  module.exports = StudentDataForUpdateDto;
  