const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { TOTAL_SCORE_TYPE } = require("../config");

const TotalScoreType = sequelize.define("TotalScoreType", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  min_score: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      min: TOTAL_SCORE_TYPE.SCORE.MIN_VALUE,
      max: TOTAL_SCORE_TYPE.SCORE.MAX_VALUE,      
    }
  },
  //TODO maxscore >= min score
  max_score: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      min: TOTAL_SCORE_TYPE.SCORE.MIN_VALUE,
      max: TOTAL_SCORE_TYPE.SCORE.MAX_VALUE,      
    }
  },
});

  
module.exports = { TotalScoreType };
  