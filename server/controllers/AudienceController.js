// AudienceController.js
const AudienceService = require("../services/AudienceService");

class AudienceController {
  create = async (req, res, next) => {
    try {
      const result = await AudienceService.create(req.body);
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
        sortBy = "number",
        sortOrder = "ASC",
        idQuery = "",
        numberQuery = "",
        capacityQuery = "",
        buildingIdQuery = "",
        buildingNameQuery = "",
      } = req.query;

      const { data, meta } = await AudienceService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          numberQuery,
          capacityQuery,
          buildingIdQuery,
          buildingNameQuery,
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
      const { audienceId } = req.params;
      const data = await AudienceService.getById(audienceId);
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
      const { audienceId } = req.params;
      const result = await AudienceService.update(audienceId, req.body);
      return res.status(200).json({ message: "updated", data: result });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { audienceId } = req.params;
      const result = await AudienceService.delete(audienceId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found audience by id ${audienceId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new AudienceController();
