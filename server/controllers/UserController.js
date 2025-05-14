const UserService = require("../services/UserService");
const NAME_COOKIE_REFRESH_TOKEN = "refreshToken";
const MAX_AGE_FOR_REFRESH_TOKEN = 30 * 24 * 60 * 60 * 1000;
class UserController {
  saveTokenInRequest = (
    token,
    res,
    nameCookie = NAME_COOKIE_REFRESH_TOKEN,
    maxAgeForToken = MAX_AGE_FOR_REFRESH_TOKEN
  ) => {
    try {
      res.cookie(nameCookie, token, {
        maxAge: maxAgeForToken,
        httpOnly: true,
      });
    } catch (err) {
      console.log("Error in saveTokenInRequest", err);
      throw err;
    }
  };
  create = async (req, res, next) => {
    try {
      const result = await UserService.create(req.body);
      return res.status(200).json({ message: "created", data: result });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  login = async (req, res, next) => {
    try {
      const result = await UserService.login(req.body);
      this.saveTokenInRequest(result.refreshToken, res);
      return res.status(200).json({ message: "successfull", data: result });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  async doesUserExist(login) {
    const userInDB = await User.findOne({ where: { login } });

    if (!userInDB) {
      throw ApiError.badRequest("Login not found", {
        loginErr: "Login not found",
      });
    }
    return userInDB;
  }
  logout = async (req, res, next) => {
    try {
      // Получаем refreshToken из куки
      const refreshToken = req.cookies[NAME_COOKIE_REFRESH_TOKEN];

      // Вызываем сервис для выхода
      const resultDelete = await UserService.logout(refreshToken);

      // Очищаем куку
      res.clearCookie(NAME_COOKIE_REFRESH_TOKEN);

      // Возвращаем успешный ответ
      return res
        .status(204)

        .json({ message: "User logged out successfully" });
    } catch (err) {
      // Логируем ошибку
      console.log(
        `Method ==> logoutRequire`,
        err
      );
      next(err); // Передаем ошибку в следующий middleware
    }
  };
  //   getAll = async (req, res, next) => {
  //     try {
  //       const {
  //         limit = 10,
  //         page = 1,
  //         sortBy = "name",
  //         sortOrder = "ASC",
  //         idQuery = "",
  //         nameQuery = ""
  //       } = req.query;

  //       const { data, meta } = await TeacherPositionService.getAll({
  //         page: parseInt(page),
  //         limit: parseInt(limit),
  //         sortBy,
  //         sortOrder,
  //         query: {
  //           idQuery,
  //           nameQuery
  //         },
  //       });

  //       const dataDto = data.map((obj) => new TeacherPositionDataDto(obj));
  //       const metaDto = new MetaDataDto(meta);
  //       return res.status(200).json({
  //         data: dataDto,
  //         meta: metaDto,
  //       });
  //     } catch (err) {
  //       console.error(err);
  //       next(err);
  //     }
  //   };

  //   getById = async (req, res, next) => {
  //     try {
  //       const { teacherPositionId } = req.params;
  //       const data = await TeacherPositionService.getById(teacherPositionId);
  //       const dataDto = new TeacherPositionDataDto(data);
  //       return res.status(200).json({
  //         data: dataDto,
  //       });
  //     } catch (err) {
  //       console.error(err);
  //       next(err);
  //     }
  //   };

  //   update = async (req, res, next) => {
  //     try {
  //       const { teacherPositionId } = req.params;
  //       const dataDto = new TeacherPositionUpdateDto(req.body);
  //       const result = await TeacherPositionService.update(teacherPositionId, dataDto);
  //       const resultDto = new TeacherPositionDataDto(result);
  //       return res.status(200).json({ message: "updated", data: resultDto });
  //     } catch (err) {
  //       console.error(err);
  //       next(err);
  //     }
  //   };

  //   delete = async (req, res, next) => {
  //     try {
  //       const { teacherPositionId } = req.params;
  //       const result = await TeacherPositionService.delete(teacherPositionId);
  //       if (!result) {
  //         return res
  //           .status(404)
  //           .json({ message: `Not found teacher position by id ${teacherPositionId}` });
  //       }
  //       return res.status(204).send();
  //     } catch (err) {
  //       console.error(err);
  //       next(err);
  //     }
  //   };
}

module.exports = new UserController();
