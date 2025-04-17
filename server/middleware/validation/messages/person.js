const { SURNAME } = require('../config/person');

module.exports = {
    SURNAME_EMPTY: 'Surname is required',
    SURNAME_LENGTH: `Surname must be between ${SURNAME.MIN_LENGTH} and ${SURNAME.MAX_LENGTH} characters`,

};