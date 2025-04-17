const academicSpecialtyRouter = require("express").Router();
const academicSpecialtyController = require("../controllers/AcademicSpecialtyController");
// const authMiddleware = require('../middleware/AuthMiddleware')
const {validateCreate} = require('../middleware/validation/validators/academicSpecialtyValidator') 
academicSpecialtyRouter.post(
  `/create`,
  validateCreate,
  academicSpecialtyController.create
);

academicSpecialtyRouter.get(
  `/getAll`,
  academicSpecialtyController.getAll
);

academicSpecialtyRouter.delete(
  `/delete`,
  academicSpecialtyController.deleteAcademicSpecialties
);
academicSpecialtyRouter.put(
  `/update`,
  academicSpecialtyController.updateAcademicSpecialties
);

module.exports = academicSpecialtyRouter;
