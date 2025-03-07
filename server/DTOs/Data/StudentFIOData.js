class StudentFIOData {
    constructor({ 
        id,
        last_name, 
        first_name,
        middle_name,
    }) {
        this.id = id;
        this.last_name = last_name;
        this.first_name = first_name;
        this.middle_name = middle_name;      
    }
}

module.exports = StudentFIOData;
