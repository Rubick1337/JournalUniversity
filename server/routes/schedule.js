const scheduleRouter = require('express').Router();
const scheduleController = require('../controllers/ScheduleController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_schedule_PARAM = 'scheduleId'
//TODO validate

scheduleRouter.get(`/getScheduleForStudent`, scheduleController.getScheduleForStudent);
scheduleRouter.get(`/getSemesterByDate`, scheduleController.getSemesterByDate);
scheduleRouter.get(`/getScheduleByDate`, scheduleController.getScheduleByDate);

    
module.exports = scheduleRouter;