const PersonService = require("../services/PersonService");
// const RoleDto = require('../DTOs/Data/RoleDto')

const PersonCreationDTO = require("../DTOs/ForCreation/PersonCreationDto");
const GetPersonDataForSelect = require("../DTOs/Data/GetPersonDataForSelect");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");
const PersonDataDto = require("../DTOs/Data/PersonDataDto");

class PersonController {
  create = async (req, res, next) => {
    try {
      const data = { ...req.body };
      const dataDto = new PersonCreationDTO(data);
      const result = await PersonService.createPerson(dataDto);
      return res.status(200).json({ message: "created", data: result });
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
        surnameQuery = "",
        nameQuery = '',
        middlenameQuery = '',
        phoneNumberQuery = '',
        emailQuery = ''
      } = req.query;
      console.log("afds", limit)

      const { data, meta } = await PersonService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          surnameQuery,
          nameQuery,
          middlenameQuery,
          phoneNumberQuery,
          emailQuery,
        },
      });
      const dataDto = data.map(obj => new PersonDataDto(obj));
      const metaDto = new MetaDataDto(meta);
      return res.status(200).json({
        data: dataDto,
        meta: metaDto
      })
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new PersonController();
