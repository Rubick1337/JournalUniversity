const { body } = require("express-validator");
const { SURNAME } = require("../config/person");
const MESSAGES = require("../messages/person");
const { handleValidationErrors } = require("../utils/errorHandler");
const { Person } = require("../../../models");

const handleValidationSurname = body("surname")
  .notEmpty()
  .withMessage(MESSAGES.SURNAME_EMPTY)
  .isLength({
    min: SURNAME.MIN_LENGTH,
    max: SURNAME.MAX_LENGTH,
  })
  .withMessage(MESSAGES.SURNAME_LENGTH)
  .trim()
  .escape();
const handleValidationName = body("name");
const handleValidationMiddlename = body("middlename");
const handleValidationPhone = body("phone");
const handleValidationEmail = body("email");

const validateUpdate = [
  handleValidationSurname,
  handleValidationName,
  handleValidationMiddlename,
  handleValidationPhone,
  handleValidationEmail,
  handleValidationErrors,
];
const validateCreate = [
  handleValidationSurname,
  handleValidationName,
  handleValidationMiddlename,
  handleValidationPhone,
  handleValidationEmail,
  handleValidationErrors,
];
const validateDelete = [, handleValidationErrors];
const validateGetAll = [, handleValidationErrors];
module.exports = {
  validateCreate,
  validateUpdate,
  validateDelete,
  validateGetAll,
};
