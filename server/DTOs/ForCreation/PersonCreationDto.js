class PersonCreationDTO {
    constructor({ 
        surname, 
        name,
        middlename,
        phone,
        email
    }) {
        this.surname = surname;
        this.name = name;
        this.middlename = middlename;
        this.phone = phone;
        this.email = email;        
    }
}

module.exports = PersonCreationDTO;
