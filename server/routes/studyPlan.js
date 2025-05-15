const studyPlanRouter = require('express').Router();
const StudyPlanController = require('../controllers/StudyPlanController');
// const authMiddleware = require('../middleware/AuthMiddleware')
//TODO validate

studyPlanRouter.get(`/getStydentProgressForSubject`, StudyPlanController.getTopicsProgressForSubject);
studyPlanRouter.get(`/getLabsStatsForStudent`, StudyPlanController.getLabsStatsForStudent);


    
module.exports = studyPlanRouter;