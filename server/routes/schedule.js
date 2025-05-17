const scheduleRouter = require('express').Router();
const scheduleController = require('../controllers/ScheduleController');
// const authMiddleware = require('../middleware/AuthMiddleware')



const ID_FIELD_NAME = "scheduleId"

scheduleRouter.get(`/getAll`, scheduleController.getAll);
scheduleRouter.get(`/getById/:${ID_FIELD_NAME}`, scheduleController.getById);
scheduleRouter.delete(`/delete/:${ID_FIELD_NAME}`, scheduleController.delete);
scheduleRouter.post(`/create`, scheduleController.create);
scheduleRouter.put(`/update/:${ID_FIELD_NAME}`, scheduleController.update);
    

scheduleRouter.get(`/getScheduleForStudent`, scheduleController.getScheduleForStudent);
scheduleRouter.get(`/getLessonsForStudent`, scheduleController.getLessonsForStudent);
scheduleRouter.get(`/getSemesterByDate`, scheduleController.getSemesterByDate);
scheduleRouter.get(`/getScheduleByDate`, scheduleController.getScheduleByDate);

    

module.exports = scheduleRouter;