const CurriculumSubjectService = require("../services/CurriculumSubjectService");
const CurriculumSubjectCreationDTO = require("../DTOs/ForCreation/CurriculumSubjectDtoForCreation");
const CurriculumSubjectDataDto = require("../DTOs/Data/CurriculumSubjectDto");
const CurriculumSubjectUpdateDto = require("../DTOs/ForUpdate/CurriculumSubjectDtoForUpdate");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class CurriculumSubjectController {
  create = async (req, res, next) => {
    try {
      const { curriculumId } = req.params;
      const dataDto = new CurriculumSubjectCreationDTO(req.body);
      
      // Проверяем, что curriculumId из params совпадает с curriculum_id в теле запроса (если есть)
      if (dataDto.curriculum_id && dataDto.curriculum_id !== curriculumId) {
        return res.status(400).json({
          message: "Curriculum ID in request body does not match URL parameter"
        });
      }

      const result = await CurriculumSubjectService.create(curriculumId, dataDto);
      const resultDto = new CurriculumSubjectDataDto(result);
      
      return res.status(201).json({ 
        message: "Curriculum subject created successfully", 
        data: resultDto 
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const {
        limit = 10,
        page = 1,
        sortBy = "semester",
        sortOrder = "ASC",
        curriculumQuery = "",
        subjectQuery = "",
        assessmentTypeQuery = "",
        semesterQuery = ""
      } = req.query;
      console.log("TESTadfEdafasdfasdf")

      const { curriculumId } = req.params;
      console.log("TESTadfE", curriculumId)
      const result = await CurriculumSubjectService.getAll({
        curriculumId,
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          curriculumQuery,
          subjectQuery,
          assessmentTypeQuery,
          semesterQuery
        },
      });
      console.log("result", result)

      const dataDto = result.data.map(obj => new CurriculumSubjectDataDto(obj));
      const metaDto = new MetaDataDto(result.meta);

      return res.status(200).json({
        message: "Curriculum subjects retrieved successfully",
        data: dataDto,
        meta: metaDto,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getByCompositeId = async (req, res, next) => {
    try {
      const { curriculumId, subjectId, assessmentTypeId, semester } = req.params;
      
      const compositeId = {
        curriculumId,
        subjectId,
        assessmentTypeId,
        semester: parseInt(semester)
      };
      
      const data = await CurriculumSubjectService.getByCompositeId(
        curriculumId,
        compositeId
      );
      
      if (!data) {
        return res.status(404).json({
          message: "Curriculum subject not found with specified composite id"
        });
      }
      
      const dataDto = new CurriculumSubjectDataDto(data);
      
      return res.status(200).json({
        message: "Curriculum subject retrieved successfully",
        data: dataDto,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { curriculumId, subjectId, assessmentTypeId, semester } = req.params;
      const dataDto = new CurriculumSubjectUpdateDto(req.body);
      
      const compositeId = {
        curriculumId,
        subjectId,
        assessmentTypeId,
        semester: parseInt(semester)
      };
      
      const result = await CurriculumSubjectService.update(
        curriculumId,
        compositeId,
        dataDto
      );
      
      const resultDto = new CurriculumSubjectDataDto(result);
      
      return res.status(200).json({ 
        message: "Curriculum subject updated successfully", 
        data: resultDto 
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { curriculumId, subjectId, assessmentTypeId, semester } = req.params;
      
      const compositeId = {
        curriculumId,
        subjectId,
        assessmentTypeId,
        semester: parseInt(semester)
      };
      
      const result = await CurriculumSubjectService.delete(
        curriculumId,
        compositeId
      );
      
      if (!result) {
        return res.status(404).json({ 
          message: "Curriculum subject not found with specified composite id" 
        });
      }
      
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new CurriculumSubjectController();