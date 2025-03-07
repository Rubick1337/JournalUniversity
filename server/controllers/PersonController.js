const PersonService = require("../services/PersonService");
// const RoleDto = require('../DTOs/Data/RoleDto')

const PersonCreationDTO = require("../DTOs/ForCreation/PersonCreationDto");
const GetPersonDataForSelect = require("../DTOs/Data/GetPersonDataForSelect");

class PersonController {
  createPerson = async (req, res, next) => {
    try {
      const data = { ...req.body };
      const dataDto = new PersonCreationDTO(data);
      const result = await PersonService.createPerson(dataDto);
      return res.status(200).json({ message: "created" });
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
      console.log(resultDto)
      return res.status(200).json({ data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new PersonController();
