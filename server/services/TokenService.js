const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const NAME_COOKIE_REFRESH_TOKEN = "refreshToken";
const MAX_AGE_FOR_REFRESH_TOKEN = 30 * 24 * 60 * 60 * 1000;
const { User, Op, Sequelize } = require("../models/index");

const EXPRES_IN_REFRESH = "30d";
const EXPRES_IN_ASSECC = "30m";
const PERENT_USER = "id";
const NAME_TOKEN_VALUE_COLUME_IN_DB = "value";

class TokenService {
  generateRefreshToken(payload) {
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: EXPRES_IN_REFRESH,
    });
    return refreshToken;
  }
  generateAccessToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
      expiresIn: EXPRES_IN_ASSECC,
    });
    return accessToken;
  }
  generateTokens(payload) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(user_id, refreshToken) {
    const candidate = await User.findOne({
      where: { [PERENT_USER]: user_id },
    });
    console.log("hjifern;hiqwehnf;oweubgr", candidate);
    console.log("hjifern;hiqwehnf;oweubgr", user_id);
    if (candidate) {
      candidate.token = refreshToken;
      await candidate.save();
      return candidate;
    }

    return candidate;
  }

  async getTokenForUser(user) {
    const payload = {
      id: user.id,
      role_id: user.role_id,
      student_id: user.student_id,
      teacher_id: user.teacher_id,
      isClassRepresentative:
      user.student?.group.class_representative_person_id === user.student?.person_id,
      isSubgroupLeader: user.student?.subgroup.leader_id === user.student?.person_id,
    };
    // console.log(
    //   "=========1111======",
    //   user.person_id
    // );
    console.log("TESTSEEST", payload);
    const tokens = this.generateTokens(payload);

    const tokenInDb = await this.saveToken(user.id, tokens.refreshToken);
    if (!tokenInDb) {
      throw ApiError.badRequest("Failed to create the token");
    }
    return { payload, ...tokens };
  }
  //TODO delete token
  // async deleteToken(refreshToken) {
  //   if (!refreshToken) {
  //     throw ApiError.badRequest("Need refreshToken for deletion.");
  //   }

  //   try {
  //     const resultDeleted = await Token.destroy({
  //       where: { [this.NAME_TOKEN_VALUE_COLUME_IN_DB]: refreshToken },
  //     });

  //     if (resultDeleted === 0) {
  //       throw ApiError.notFound("Token not found for deletion.");
  //     }
  //     return { message: "Token successfully deleted." };
  //   } catch (error) {
  //     console.error("Error while deleting token:", error);
  //     throw ApiError.internal("Error while deleting token.");
  //   }
  // }
  validateToken(valueToken, secretKey) {
    try {
      const result = jwt.verify(valueToken, secretKey);
      return result;
    } catch (err) {
      console.log("Error in TOKEN SERVICE validateToken:", err.message);
      throw err;
    }
  }

  validateAccessToken(valueToken) {
    try {
      const result = this.validateToken(
        valueToken,
        process.env.JWT_ACCESS_SECRET_KEY
      );

      return result;
    } catch (err) {
      console.log("Error in TOKEN SERVICE validateAccessToken:", err);
      throw err;
    }
  }
  validateRefreshToken(valueToken) {
    try {
      const result = this.validateToken(
        valueToken,
        process.env.JWT_REFRESH_SECRET_KEY
      );
      return result;
    } catch (err) {
      console.log("Error in TOKEN SERVICE validateRefreshToken:", err);
      throw err;
    }
  }
  async findToken(tokenValue) {
    try {
      const tokenInDb = await Token.findOne({ where: { value: tokenValue } });
      if (!tokenInDb) {
        throw ApiError.badRequest("Token not found.");
      }
      return tokenInDb;
    } catch (err) {
      console.log("Error in TOKEN SERVICE findToken:", err);
      throw err;
    }
  }
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
}

module.exports = new TokenService();
