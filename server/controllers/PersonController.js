const PersonService = require("../services/PersonService");
// const RoleDto = require('../DTOs/Data/RoleDto')

const PersonCreationDTO = require("../DTOs/ForCreation/PersonCreationDto");
const GetPersonDataForSelect = require("../DTOs/Data/GetPersonDataForSelect");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");
const PersonDataDto = require("../DTOs/Data/PersonDataDto");
const PersonUpdateDto = require("../DTOs/ForUpdate/PersonUpdateDto");

class PersonController {
  create = async (req, res, next) => {
    try {
      const dataDto = new PersonCreationDTO(req.body);
      const result = await PersonService.create(dataDto);
      const resultDto = new PersonDataDto(result);
      return res.status(200).json({ message: "created", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  getDataForSelect = async (req, res, next) => {
    try {
      const result = await PersonService.getDataForSelect();
      const resultDto = result.map((element) => {
        return new GetPersonDataForSelect(element);
      });
      console.log(resultDto);
      return res.status(200).json({ data: resultDto });
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
        sortBy = "surname",
        sortOrder = "ASC",
        idQuery = "",
        surnameQuery = "",
        nameQuery = "",
        middlenameQuery = "",
        phoneNumberQuery = "",
        emailQuery = "",
      } = req.query;
      console.log("afds", limit);

      const { data, meta } = await PersonService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          surnameQuery,
          nameQuery,
          middlenameQuery,
          phoneNumberQuery,
          emailQuery,
        },
      });
      const dataDto = data.map((obj) => new PersonDataDto(obj));
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
      const { personId } = req.params;
      const data = await PersonService.getById(personId);
      const dataDto = new PersonDataDto(data);
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
      const { personId } = req.params;
      const dataDto = new PersonUpdateDto(req.body);
      const result = await PersonService.update(personId, dataDto)
      const resultDto = new PersonDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  delete = async (req, res, next) => {
    try {
      const { personId } = req.params;
      const result = await PersonService.delete(personId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found person by id ${result}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new PersonController();
