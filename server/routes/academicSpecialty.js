const academicSpecialtyRouter = require("express").Router();
const academicSpecialtyController = require("../controllers/AcademicSpecialtyController");
// const authMiddleware = require('../middleware/AuthMiddleware')
const {
  validateCreate,
} = require("../middleware/validation/validators/academicSpecialtyValidator");
const NAME_OF_ID_ACADEMIC_SPECIALTY_PARAM = 'code'

academicSpecialtyRouter.post(
  `/create`,
  validateCreate,
  academicSpecialtyController.create
);

academicSpecialtyRouter.get(`/getAll`, academicSpecialtyController.getAll);
academicSpecialtyRouter.get(`/getByCode/:${NAME_OF_ID_ACADEMIC_SPECIALTY_PARAM}`, academicSpecialtyController.getByCode);

academicSpecialtyRouter.delete(
  `/delete/:${NAME_OF_ID_ACADEMIC_SPECIALTY_PARAM}`,
  academicSpecialtyController.delete
);
academicSpecialtyRouter.put(
  `/update/:${NAME_OF_ID_ACADEMIC_SPECIALTY_PARAM}`,
  academicSpecialtyController.update
);

module.exports = academicSpecialtyRouter;

