const PersonService =  require('../services/PersonService')
// const RoleDto = require('../DTOs/Data/RoleDto')

const PersonCreationDTO = require("../DTOs/ForCreation/PersonCreationDto");

class PersonController {
    createPerson = async (req,res,next) => {
        const data = {...req.body};
        const dataDto = new PersonCreationDTO(data);
        const result = await PersonService.createPerson(dataDto);
        return res.status(200).json({message: "created"});
    }
}

module.exports = new PersonController();