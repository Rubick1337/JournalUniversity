class ScheduleDetailsController {
  get = async (req, res, next) => {
    try {
      const {
        limit = 10,
        page = 1,
        sortBy = "date",
        sortOrder = "ASC",
        idQuery = "",
        groupQuery = "",
        subgroupQuery = "",
        subjectQuery = "",
        teacherQuery = "",
        topicQuery = "",
        audienceQuery = "",
        subjectTypeQuery = "",
        dateFrom = "",
        dateTo = ""
      } = req.query;

      const { data, meta } = await LessonService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          groupQuery,
          subgroupQuery,
          subjectQuery,
          teacherQuery,
          topicQuery,
          audienceQuery,
          subjectTypeQuery,
          dateFrom,
          dateTo
        },
      });
      
      const dataDto = data.map((obj) => new LessonDataDto(obj));
      const metaDto = new MetaDataDto(meta);
      return res.status(200).json({
        data: dataDto,
        meta: metaDto,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new ScheduleDetailsController();


/*
Главная расписание 
расписание общее
темы оценки личные
общий дисцплины прогресс
lesson - выстлание прогулов
журнал отчет
*/