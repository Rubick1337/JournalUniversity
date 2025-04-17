class PersonDataDto {
    constructor({ 
        id,
        last_name, 
        first_name,
        middle_name,
        phone_number,
        email
    }) {
        this.id = id;
        this.surname = last_name;
        this.name = first_name;
        this.middlename = middle_name;      
        this.phone_number = phone_number;      
        this.email = email;      
    }
}

module.exports = PersonDataDto;
