const { SURNAME, PERSON_ID } = require('../config/person');

module.exports = {
    SURNAME_EMPTY: 'Surname is required',
    SURNAME_LENGTH: `Surname must be between ${SURNAME.MIN_LENGTH} and ${SURNAME.MAX_LENGTH} characters`,
    PERSON_ID: {
        IS_EMPTY: `Perosn ID is required`,
        IS_UUID: `Is not UUID ${PERSON_ID.IS_UUID}`
    },
    
};