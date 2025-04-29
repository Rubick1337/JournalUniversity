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
      const result = await CurriculumSubjectService.create(curriculumId,dataDto);
      const resultDto = new CurriculumSubjectDataDto(result);
      return res.status(200).json({ message: "created", data: result });
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
      const { curriculumId } = req.params;

      const { data, meta } = await CurriculumSubjectService.getAll({
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
      
      const dataDto = data.map((obj) => new CurriculumSubjectDataDto(obj));
      const metaDto = new MetaDataDto(meta);
      return res.status(200).json({
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
      const data = await CurriculumSubjectService.getByCompositeId({
        curriculumId,
        subjectId,
        assessmentTypeId,
        semester
      });
      const dataDto = new CurriculumSubjectDataDto(data);
      return res.status(200).json({
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
      const result = await CurriculumSubjectService.update(
        { curriculumId, subjectId, assessmentTypeId, semester },
        dataDto
      );
      const resultDto = new CurriculumSubjectDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { curriculumId, subjectId, assessmentTypeId, semester } = req.params;
      const result = await CurriculumSubjectService.delete({
        curriculumId,
        subjectId,
        assessmentTypeId,
        semester
      });
      if (!result) {
        return res.status(404).json({ 
          message: `Not found curriculum subject with specified composite id` 
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