const StudyPlanService = require("../services/StudyPlanService");

class StudyPlanController {
    getTopicsProgressForSubject = async (req,res,next) => {
        try {
            const studentId = 5;
            const subjectId = req.query.subjectId;
            const result = await StudyPlanService.getTopicsProgressForSubject(studentId, subjectId);
            return res.status(200).json({data: result})
        } catch (err) {
            console.error("Error in StupyPlan controller", err);
            next(err);
        }
    }
        getLabsStatsForStudent = async (req,res,next) => {
        try {
            const studentId = 5;
            const subjectId = req.query.subjectId;
            const result = await StudyPlanService.getLabsStatsForStudent(studentId, subjectId);
            return res.status(200).json({data: result})
        } catch (err) {
            console.error("Error in StupyPlan controller", err);
            next(err);
        }
    }
}

module.exports = new StudyPlanController();
