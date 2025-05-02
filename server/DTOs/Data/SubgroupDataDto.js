class SubgroupDataDto {
  constructor({ id, name, group, leader }) {
    this.id = id;
    this.name = name;
    this.group_id = group? {id: group.id, name: group.name}: {};
    this.leader_id = leader? {
        id: leader.id,
        surname: leader.surname,
        name: leader.name,
        middlename: leader.middlename,
    }: {};
  }
}

module.exports = SubgroupDataDto;
