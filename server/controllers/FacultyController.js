const FacultyFullDataDto = require("../DTOs/Data/Faculty/FacultyFullDataDto");
const FacultyServer = require("../services/FacultyServer");

class FacultyController {
  create = async (req, res, next) => {
    try {
      //TODO add implementation
      throw new Error("not implementation");
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  update = async (req, res, next) => {
    try {
      //TODO add implementation
      throw new Error("not implementation");
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  delete = async (req, res, next) => {
    try {
      //TODO add implementation
      throw new Error("not implementation");
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  getAll = async (req, res, next) => {
    try {
        const result = await FacultyServer.getAll();
        console.log(result)
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
      //TODO add implementation
      throw new Error("not implementation");
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new FacultyController();
