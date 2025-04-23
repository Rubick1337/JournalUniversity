// FacultyController.js
const FacultyService = require("../services/FacultyServer" );
const FacultyCreationDTO = require("../DTOs/ForCreation/FacultyDataForCreateDto");
const FacultyDataDto = require("../DTOs/Data/Faculty/FacultyFullDataDto");
const FacultyUpdateDto = require("../DTOs/ForUpdate/FacultyDataForUpdateDto");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class FacultyController {
  create = async (req, res, next) => {
    try {
      const dataDto = new FacultyCreationDTO(req.body);
      const result = await FacultyService.create(dataDto);
      const resultDto = new FacultyDataDto(result);
      return res.status(200).json({ message: "created", data: resultDto });
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
        sortBy = "name",
        sortOrder = "ASC",
        idQuery = "",
        nameQuery = "",
        fullNameQuery = "",
        deanQuery = ""
      } = req.query;

      const { data, meta } = await FacultyService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          nameQuery,
          fullNameQuery,
          deanQuery
        },
      });
      
      const dataDto = data.map((obj) => new FacultyDataDto(obj));
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

  getById = async (req, res, next) => {
    try {
      const { facultyId } = req.params;
      const data = await FacultyService.getById(facultyId);
      const dataDto = new FacultyDataDto(data);
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
      const { facultyId } = req.params;
      const dataDto = new FacultyUpdateDto(req.body);
      const result = await FacultyService.update(facultyId, dataDto);
      const resultDto = new FacultyDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { facultyId } = req.params;
      const result = await FacultyService.delete(facultyId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found faculty by id ${facultyId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new FacultyController();