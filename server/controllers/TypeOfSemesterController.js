const TypeOfSemesterService = require("../services/TypeOfSemesterService");

class TypeOfSemesterController {
  create = async (req, res, next) => {
    try {
      const result = await TypeOfSemesterService.create(req.body);
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
        startDateQuery = "",
        endDateQuery = "",
      } = req.query;

      const { data, meta } = await TypeOfSemesterService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          nameQuery,
          startDateQuery,
          endDateQuery
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
      const { typeOfSemesterId } = req.params;
      const data = await TypeOfSemesterService.getById(typeOfSemesterId);
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
      const { typeOfSemesterId } = req.params;
      const result = await TypeOfSemesterService.update(typeOfSemesterId, req.body);
      return res.status(200).json({ message: "updated", data: result });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { typeOfSemesterId } = req.params;
      const result = await TypeOfSemesterService.delete(typeOfSemesterId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found type of semester by id ${typeOfSemesterId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new TypeOfSemesterController();
