const ApiError = require("../error/ApiError");
const COUNT_PASSWORD_HASH = 5;
const {
  User,
  Op,
  Sequelize,
  Group,
  Subgroup,
  Person,
  Teacher,
  Student,
} = require("../models/index");
const bcrypt = require("bcrypt");
const TokenService = require("./TokenService");
const { model } = require("../db");
class UserService {
  getHashPassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, COUNT_PASSWORD_HASH);
    return passwordHash;
  };
  async create(data) {
    try {
      const passwordHash = await this.getHashPassword(data.password);
      const object = await User.create({
        login: data.login,
        password_hash: passwordHash,
        token: null,
        role_id: data.roleId,
        student_id: data.studentId || null,
        teacher_id: data.teacherId || null,
      });
      return object;
    } catch (error) {
      throw ApiError.badRequest("Error creating", error);
    }
  }
  async login({ login, password }) {
    const userData = await this.doesUserExist(login);
    await this.verifyPassword(password, userData.password_hash);
    const tokens = await TokenService.getTokenForUser(userData);
    return { ...tokens };
  }

  // User => Student => Person

  async doesUserExist(login) {
    const userInDB = await User.findOne({
      where: { login },
      include: [
        {
          model: Student,
          as: "student",
          include: [
            { model: Group, as: "group" },
            { model: Subgroup, as: "subgroup" },
          ],
        },
        {
          model: Teacher,
          as: "teacher",
        },
      ],
    });

    if (!userInDB) {
      throw ApiError.badRequest("User not found", {
        loginErr: "User not found",
      });
    }
    return userInDB;
  }
  async verifyPassword(password, correctPassowrdHash) {
    const resultCompare = await bcrypt.compare(password, correctPassowrdHash);
    if (!resultCompare) {
      throw ApiError.badRequest("incorrect password", {
        passwordErr: "incorrect password",
      });
    }
  }
  async doesUserExistByRefresh(token) {
    console.log("TETSTET", token);
    const userInDB = await User.findOne({
      where: { token },
      include: [
        {
          model: Student,
          as: "student",
          include: [
            { model: Group, as: "group" },
            { model: Subgroup, as: "subgroup" },
          ],
        },
        {
          model: Teacher,
          as: "teacher",
        },
      ],
    });

    if (!userInDB) {
      throw ApiError.badRequest("User not found", {
        loginErr: "User not found",
      });
    }
    return userInDB;
  }
  async logout(refreshToken) {
    const candidate = await this.doesUserExistByRefresh(refreshToken);
    if (candidate) {
      candidate.token = null;
      await candidate.save();
      return true;
    }
    throw ApiError.badRequest("User not found", {
      loginErr: "User not found",
    });
  }
  async refresh(refreshToken) {
    const user = await this.doesUserExistByRefresh(refreshToken);
    const tokens = await TokenService.getTokenForUser(user);
    user.token = tokens.refreshToken;
    await user.save();


    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user:tokens.payload,
    };
  }
}

module.exports = new UserService();
