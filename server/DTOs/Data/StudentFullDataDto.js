class StudentFullDataDto {
    constructor({
                    id,
                    count_reprimand,
                    icon_path,
                    person = {},
                    group = {},
                    subgroup = {},
                    perent = {},
                }) {
        this.id = id;
        this.countReprimand = count_reprimand;
        this.icon_path = icon_path;

        this.person = person
            ? {
                id: person.id,
                surname: person.surname,
                name: person.name,
                middlename: person.middlename,
                phoneNumber: person.phone_number, // преобразуем snake_case в camelCase
                email: person.email,
                // Добавьте другие поля Person при необходимости
            }
            : {};

        this.group = group
            ? {
                id: group.id,
                name: group.name,
            }
            : {};

        this.subgroup = subgroup
            ? {
                id: subgroup.id,
                name: subgroup.name,
            }
            : {};

        this.perent = perent
            ? {
                id: perent.id,
                surname: perent.surname,
                name: perent.name,
                middlename: perent.middlename,
                phoneNumber: perent.phone_number, // преобразуем snake_case в camelCase
                email: perent.email,
            }
            : {};
    }
}

module.exports = StudentFullDataDto;