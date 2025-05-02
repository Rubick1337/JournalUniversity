// controllers/SubgroupController.js
const SubgroupService = require("../services/SubgroupService");
const SubgroupCreationDTO = require("../DTOs/ForCreation/SubgroupCreationDTO");
const SubgroupDataDto = require("../DTOs/Data/SubgroupDataDto");
const SubgroupUpdateDto = require("../DTOs/ForUpdate/SubgroupUpdateDto");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class SubgroupController {
  create = async (req, res, next) => {
    try {
      const dataDto = new SubgroupCreationDTO(req.body);
      const result = await SubgroupService.create(dataDto);
      const resultDto = new SubgroupDataDto(result);
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
        groupQuery = "",
        leaderQuery = ""
      } = req.query;

      const { data, meta } = await SubgroupService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          nameQuery,
          groupQuery,
          leaderQuery
        },
      });
      
      const dataDto = data.map((obj) => new SubgroupDataDto(obj));
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
      const { subgroupId } = req.params;
      const data = await SubgroupService.getById(subgroupId);
      const dataDto = new SubgroupDataDto(data);
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
      const { subgroupId } = req.params;
      const dataDto = new SubgroupUpdateDto(req.body);
      const result = await SubgroupService.update(subgroupId, dataDto);
      const resultDto = new SubgroupDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { subgroupId } = req.params;
      const result = await SubgroupService.delete(subgroupId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found subgroup by id ${subgroupId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new SubgroupController();