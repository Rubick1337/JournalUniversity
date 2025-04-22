const DepartmentService = require("../services/DepartmentService");
const DepartmentCreationDTO = require("../DTOs/ForCreation/DepartmentDataForCreateDto");
const DepartmentDataDto = require("../DTOs/Data/Department/DepartmentFullDataDto");
const DepartmentUpdateDto = require("../DTOs/ForUpdate/DepartmentDataForUpdateDto");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class DepartmentController {
  create = async (req, res, next) => {
    try {
      const dataDto = new DepartmentCreationDTO(req.body);
      const result = await DepartmentService.create(dataDto);
      const resultDto = new DepartmentDataDto(result);
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
        facultyQuery = "",
        headQuery = ""
      } = req.query;

      const { data, meta } = await DepartmentService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          nameQuery,
          fullNameQuery,
          facultyQuery,
          headQuery
        },
      });
      
      const dataDto = data.map((obj) => new DepartmentDataDto(obj));
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
      const { departmentId } = req.params;
      const data = await DepartmentService.getById(departmentId);
      const dataDto = new DepartmentDataDto(data);
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
      const { departmentId } = req.params;
      const dataDto = new DepartmentUpdateDto(req.body);
      const result = await DepartmentService.update(departmentId, dataDto);
      const resultDto = new DepartmentDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { departmentId } = req.params;
      const result = await DepartmentService.delete(departmentId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found department by id ${departmentId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new DepartmentController();