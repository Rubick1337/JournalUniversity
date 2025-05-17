// AcademicBuildingController.js
const AcademicBuildingService = require("../services/AcademicBuildingService");

class AcademicBuildingController {
  create = async (req, res, next) => {
    try {
      const result = await AcademicBuildingService.create(req.body);
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
        sortBy = "name",
        sortOrder = "ASC",
        idQuery = "",
        nameQuery = "",
        addressQuery = "",
      } = req.query;

      const { data, meta } = await AcademicBuildingService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          nameQuery,
          addressQuery
        },
      });
      
      return res.status(200).json({
        data: data,
        meta: meta,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { academicBuildingId } = req.params;
      const data = await AcademicBuildingService.getById(academicBuildingId);
      return res.status(200).json({
        data,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { academicBuildingId } = req.params;
      const result = await AcademicBuildingService.update(academicBuildingId, req.body);
      return res.status(200).json({ message: "updated", data: result });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { academicBuildingId } = req.params;
      const result = await AcademicBuildingService.delete(academicBuildingId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found academic building by id ${academicBuildingId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new AcademicBuildingController();