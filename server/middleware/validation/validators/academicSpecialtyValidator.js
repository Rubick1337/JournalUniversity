const { body } = require("express-validator");
const { CODE, NAME } = require("../config/acadmicSpecialty");
const MESSAGES = require("../messages/academicSpecialty");
const { handleValidationErrors } = require("../utils/errorHandler");
const { AcademicSpecialty } = require("../../../models");

const checkCodeUniqueness =async (value) => {
  if(value = "" || value == null || value == undefined) {
    return true;
  }  
  const existing = await AcademicSpecialty.findOne({id: value});
  if(existing) {
    throw new Error(MESSAGES.CODE_NOT_UNIQUE);
  }
  return true;
}

const validateCreate = [
  body("code")
    .notEmpty()
    .withMessage(MESSAGES.CODE_REQUIRED)
    .isLength({
      min: CODE.MIN_LENGTH,
      max: CODE.MAX_LENGTH,
    })
    .withMessage(MESSAGES.CODE_LENGTH)
    .trim()
    .escape(),
    //TODO .custom(checkCodeUniqueness),
  body("name")
    .notEmpty()
    .withMessage(MESSAGES.NAME_REQUIRED)
    .isLength({
      min: NAME.MIN_LENGTH,
      max: NAME.MAX_LENGTH,
    })
    .withMessage(MESSAGES.NAME_LENGTH)
    .trim()
    .escape(),
  handleValidationErrors,
];

const validateUpdate = [
  body("code")
    .notEmpty()
    .withMessage(MESSAGES.CODE_REQUIRED)
    .isLength({
      min: CODE.MIN_LENGTH,
      max: CODE.MAX_LENGTH,
    })
    .withMessage(MESSAGES.CODE_LENGTH)
    .trim()
    .escape(),
    //TODO .custom(checkCodeUniqueness),
  body("name")
    .notEmpty()
    .withMessage(MESSAGES.NAME_REQUIRED)
    .isLength({
      min: NAME.MIN_LENGTH,
      max: NAME.MAX_LENGTH,
    })
    .withMessage(MESSAGES.NAME_LENGTH)
    .trim()
    .escape(),
  handleValidationErrors,
];
module.exports = {validateCreate,validateUpdate}