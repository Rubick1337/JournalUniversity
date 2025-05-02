// TopicController.js
const TopicService = require("../services/TopicService");
const TopicCreationDTO = require("../DTOs/ForCreation/TopicDataForCreateDto");
const TopicDataDto = require("../DTOs/Data/TopicFullDataDto");
const TopicUpdateDto = require("../DTOs/ForUpdate/TopicDataForUpdateDto");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class TopicController {
  create = async (req, res, next) => {
    try {
      const dataDto = new TopicCreationDTO(req.body);
      const result = await TopicService.create(dataDto);
      const resultDto = new TopicDataDto(result);
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
        subjectQuery = "",
        subjectTypeQuery = ""
      } = req.query;

      const { data, meta } = await TopicService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          nameQuery,
          subjectQuery,
          subjectTypeQuery
        },
      });
      
      const dataDto = data.map((obj) => new TopicDataDto(obj));
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
      const { topicId } = req.params;
      const data = await TopicService.getById(topicId);
      const dataDto = new TopicDataDto(data);
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
      const { topicId } = req.params;
      const dataDto = new TopicUpdateDto(req.body);
      const result = await TopicService.update(topicId, dataDto);
      const resultDto = new TopicDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { topicId } = req.params;
      const result = await TopicService.delete(topicId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found topic by id ${topicId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new TopicController();