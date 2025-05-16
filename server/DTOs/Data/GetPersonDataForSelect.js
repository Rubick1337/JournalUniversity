class GetPersonDataForSelect {
    constructor({ 
        id,
        surname, 
        name,
        middlename,
    }) {
        this.id = id;
        this.surname = surname;
        this.name = name;
        this.middlename = middlename;      
    }
}

module.exports = GetPersonDataForSelect;
