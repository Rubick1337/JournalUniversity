class PersonDataDto {
    constructor({ 
        id,
        surname, 
        name,
        middlename,
        phone_number,
        email
    }) {
        this.id = id;
        this.surname = surname;
        this.name = name;
        this.middlename = middlename;      
        this.phone_number = phone_number;      
        this.email = email;      
    }
}

module.exports = PersonDataDto;
