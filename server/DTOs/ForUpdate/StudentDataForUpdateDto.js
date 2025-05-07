class StudentDataForUpdateDto {
  constructor({
                count_reprimand,
                icon_path,
                person_id,
                group_id,
                subgroup_id,
                perent_person_id,
              }) {
    this.count_reprimand = count_reprimand;
    this.icon_path = icon_path;
    this.person_id = person_id;
    this.group_id = group_id;
    this.subgroup_id = subgroup_id;
    this.perent_person_id = perent_person_id;
  }
  }
  
  module.exports = StudentDataForUpdateDto;
  