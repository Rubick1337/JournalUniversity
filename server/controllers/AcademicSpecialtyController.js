const GetAcademicSpecialtiesDto = require("../DTOs/Data/GetAcademicSpecialtiesDto");
const AcademicSpecialtyCreationDto = require("../DTOs/ForCreation/AcademicSpecialtyCreationDto");
const AcademicSpecialtyService = require("../services/AcademicSpecialtyService");

class AcademicSpecialtyController {
  getAcademicSpecialties = async (req, res, next) => {
    try {
      const result = await AcademicSpecialtyService.getAcademicSpecialties();
      const resultDto = result.map((element) => {
        return new GetAcademicSpecialtiesDto(element);
      });
      return res.status(200).json({ data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  createAcademicSpecialties = async (req, res, next) => {
    try {
      const dataForCreate = new AcademicSpecialtyCreationDto(req.body);
      const result = await AcademicSpecialtyService.createAcademicSpecialty(
        dataForCreate
      );
      const resultDto = result;
      // result.map((element) => {
      //   return new GetAcademicSpecialtiesDto(element);
      // });
      return res.status(201).json({ data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  updateAcademicSpecialties = async (req, res, next) => {
    try {

    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  deleteAcademicSpecialties = async (req,res,next) => {
    try {
      const {id} = req.params;
      const resultOfDelete = await AcademicSpecialtyService.deleteAcademicSpecialties(id);
      return res.status(200).json({message: "succesfull", resultOfDelete});
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}

module.exports = new AcademicSpecialtyController();
