const { CODE, NAME } = require('../config/acadmicSpecialty');

module.exports = {
  CODE_REQUIRED: 'Code is required',
  CODE_LENGTH: `Code must be between ${CODE.MIN_LENGTH} and ${CODE.MAX_LENGTH} characters`,
  CODE_NOT_UNIQUE: `Academic specialty with this code already exists`,
  NAME_REQUIRED: 'Name is required',
  NAME_LENGTH: `Name must be between ${NAME.MIN_LENGTH} and ${NAME.MAX_LENGTH} characters`,
};