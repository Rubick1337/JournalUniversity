const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { PlannedTask } = require("./PlannedTask");
const { Topic } = require("./Topic");
const { Subject } = require("./Subject");

const PlannedTaskTopic = sequelize.define("PlannedTaskTopic", {
  planned_task_id: {
    type: DataTypes.INTEGER,
    references: {
      model: PlannedTask,
      key: "id",
    },
    primaryKey: true,
  },
  topic_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Topic,
      key: "id",
    },
    primaryKey: true,
  },
  subject_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: "id",
    },
    primaryKey: true,
  },
});

  
module.exports = { PlannedTaskTopic };
  