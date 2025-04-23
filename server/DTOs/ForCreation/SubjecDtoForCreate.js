class SubjecDtoForCreate {
  constructor({ name, department = {} }) {
    this.name = name;

    this.department_id = department ? department.id : null;
  }
}

module.exports = SubjecDtoForCreate;
