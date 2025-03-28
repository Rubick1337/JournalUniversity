class FacultyFullDataDto {
  constructor({ id, name, full_name, dean_person = {} }) {
    this.id = id;
    this.shortName = name;
    this.fullName = full_name;
    this.dean = `${dean_person.surname || ""} ${dean_person.name || ""} ${
      dean_person.middlename || ""
    }`.trim();
    this.dean_person = {
      id: dean_person.id,
      surname: dean_person.surname,
      name: dean_person.name,
      middlename: dean_person.middlename,
    };
  }
}

module.exports = FacultyFullDataDto;
