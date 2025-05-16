module.exports = {
    STUDENT: {
      MAX_REPRIMANDS: 3, //Максимальное количество выговоров у студента
      MIN_REPRIMANDS: 0, //Минимальное значение числа выговоров
      DEFAULT_REPRIMANDS: 0, //Начальное значение числа выговоров
    },
    ABSENTEEISM: {
      DEFAULT_COUNT_EXCUSED_HOUR: 0,
      DEFAULT_COUNT_UNEXCUSED_HOUR: 0,
    },
    ACADEMIC_PERFORMANCE: {
      MODULE_FIRST: {
        MIN_VALUE: 0,
        MAX_VALUE: 30,
      },
      MODULE_SECOND: {
        MIN_VALUE: 0,
        MAX_VALUE: 60,
      },
      EXAM_SCORE: {
        MIN_VALUE: 15,
        MAX_VALUE: 40,
      }
    },
    CURRICULUM: {
      COUNT_HOURS: {
        MIN_VALUE: 2,
      },
      NUMBER_SEMESTER: {
        MIN_VALUE: 1,
        MAX_VALUE: 12,
      }
    },
    TOTAL_SCORE_TYPE: {
      SCORE: {
        MIN_VALUE: 0,
        MAX_VALUE: 100,
      }
    },
  };
  