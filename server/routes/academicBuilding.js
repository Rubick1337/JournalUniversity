const academicBuildingRouter = require("express").Router();
const academicBuildingController = require("../controllers/AcademicBuildingController");


const ID_FIELD_NAME = "academicBuildingId"

academicBuildingRouter.get(`/getAll`, academicBuildingController.getAll);
academicBuildingRouter.get(`/getById/:${ID_FIELD_NAME}`, academicBuildingController.getById);
academicBuildingRouter.delete(`/delete/:${ID_FIELD_NAME}`, academicBuildingController.delete);
academicBuildingRouter.post(`/create`, academicBuildingController.create);
academicBuildingRouter.put(`/update/:${ID_FIELD_NAME}`, academicBuildingController.update);
    
module.exports = academicBuildingRouter;

