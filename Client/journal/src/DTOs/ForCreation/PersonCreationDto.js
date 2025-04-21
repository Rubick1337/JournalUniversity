class PersonCreationDTO {
    constructor({ 
        surname, 
        name,
        middlename,
        phone_number,
        email
    }) {
        this.surname = surname;
        this.name = name;
        this.middlename = middlename || null;
        this.phone_number = phone_number || null;
        this.email = email;        
    }
}

module.exports = PersonCreationDTO;
