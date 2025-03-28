const FacultyFullDataDto = require("../DTOs/Data/Faculty/FacultyFullDataDto");
const FacultyDataForCreateDto = require("../DTOs/ForCreation/FacultyDataForCreateDto");
const FacultyDataForUpdateDto = require("../DTOs/ForUpdate/FacultyDataForUpdateDto");
const ApiError = require("../error/ApiError");
const { badRequest } = require("../error/ApiError");
const FacultyServer = require("../services/FacultyServer");

const NAME_OF_FIELD_FOR_ID_FACULTY_IN_REQ_PARAMS = 'facultyId'

class FacultyController {
  create = async (req, res, next) => {
    try {
      const dataDto = new FacultyDataForCreateDto(req.body);
      const result = await FacultyServer.create(dataDto);
      return res.status(201).json({data: result});

    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  update = async (req, res, next) => {
    try {
      const id = this.getIdFromReqParams(req);
      const dataDto = new FacultyDataForUpdateDto(req.body);
      const result = await FacultyServer.update(id, dataDto);
      return res.status(200).json({data: result});
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  delete = async (req, res, next) => {
    try {
      const id = this.getIdFromReqParams(req);
      const result = await FacultyServer.delete(id);
      return res.status(200).json({result});
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  getAll = async (req, res, next) => {
    try {
        const result = await FacultyServer.getAll();
        const resultDto = result.map((element)=> {
            return new FacultyFullDataDto(element);
        })
        return res.status(200).json({data: resultDto}) 
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  getById = async (req, res, next) => {
    try {
      const id = this.getIdFromReqParams(req);
      const result = await FacultyServer.getById(id);
      const resultDto = new FacultyFullDataDto(result);
      return res.status(200).json({data: resultDto}) 

    } catch (err) {
      console.error(err);
      next(err);
    }
  };
//================> Other <================
  getIdFromReqParams = (req) => {
    const id = req.params[NAME_OF_FIELD_FOR_ID_FACULTY_IN_REQ_PARAMS];
    if(!id) {
      throw ApiError.badRequest("need id faculty")
    }
    return id;
  }
}

module.exports = new FacultyController();
