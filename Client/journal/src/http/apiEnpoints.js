const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const API_ENDPOINTS = {
  Faculty: {
    CREATE: `/faculty/create`,
    UPDATE: `/faculty/update/:facultyId`,
    DELETE: `/faculty/delete/:facultyId`,
    GETALL: `/faculty/getAll`,
    GETBYID: `/faculty/getById/:facultyId`,
  },
  PERSON: {
    GETALL: "/person/getAll",
    CREATE: '/person/create',
    UPDATE: '/person/update/:personId',
    DELETE: '/person/delete/:personId',
    GETBYID: `/faculty/getById/:facultyId`,

    GET_ALL_BY_FULL_NAME: `person/getAllByFullName`
  },
  DEPARTMENT: {
    GETALL: "/department/getAll",
    CREATE: '/department/create',
    UPDATE: '/department/update/:departmentId',
    DELETE: '/department/delete/:departmentId',
    GETBYID: `/department/getById/:departmentId`,

  },
  SUBJECT: {
    GETALL: "/subject/getAll",
    CREATE: '/subject/create',
    UPDATE: '/subject/update/:subjectId',
    DELETE: '/subject/delete/:subjectId',
    GETBYID: `/subject/getById/:subjectId`,
  },
  TEACHER_POSITION: {
    GETALL: "/teacherPosition/getAll",
    CREATE: '/teacherPosition/create',
    UPDATE: '/teacherPosition/update/:teacherPositionId',
    DELETE: '/teacherPosition/delete/:teacherPositionId',
    GETBYID: `/teacherPosition/getById/:teacherPositionId`,
  },
  TEACHER: {
    GETALL: "/teacher/getAll",
    CREATE: '/teacher/create',
    UPDATE: '/teacher/update/:teacherId',
    DELETE: '/teacher/delete/:teacherId',
    GETBYID: `/teacher/getById/:teacherId`,
  },
  ACADEMIC_SPECIALTY: {
    GETALL: "/academicSpecialty/getAll",
    CREATE: '/academicSpecialty/create',
    UPDATE: '/academicSpecialty/update/:code',
    DELETE: '/academicSpecialty/delete/:code',
    GETBYCODE: `/academicSpecialty/getByCode/:code`,
  },
  EDUCATION_FORM: {
    GETALL: "/educationForm/getAll",
    CREATE: '/educationForm/create',
    UPDATE: '/educationForm/update/:id',
    DELETE: '/educationForm/delete/:id',
    GETBYID: `/educationForm/getById/:id`,
  },
  CURRICULUM: {
    GETALL: "/curriculum/getAll",
    CREATE: '/curriculum/create',
    UPDATE: '/curriculum/update/:id',
    DELETE: '/curriculum/delete/:id',
    GETBYID: `/curriculum/getById/:id`,
  },

  ASSESSMENT_TYPE: {
    GETALL: "/assessmentType/getAll",
    CREATE: '/assessmentType/create',
    UPDATE: '/assessmentType/update/:id',
    DELETE: '/assessmentType/delete/:id',
    GETBYID: `/assessmentType/getById/:id`,
  },
  CURRICULUM_SUBJECT: {
    GETALL: "/curriculumSubject/getAll/:curriculumId",
    CREATE: '/curriculumSubject/create/:curriculumId',
    UPDATE: '/curriculumSubject/update/:curriculumId/:subjectId/:assessmentTypeId/:semester',
    DELETE: '/curriculumSubject/delete/:curriculumId/:subjectId/:assessmentTypeId/:semester',
    GET_BY_COMPOSITED_ID: `/curriculumSubject/getByCompositeId/:curriculumId/:subjectId/:assessmentTypeId/:semester`,
  },
  TOPIC: {
    GETALL: "/topic/getAll",
    CREATE: '/topic/create',
    UPDATE: '/topic/update/:id',
    DELETE: '/topic/delete/:id',
    GETBYID: `/topic/getById/:id`,
  },
  GROUP: {
    GETALL: "/group/getAll",
    CREATE: '/group/create',
    UPDATE: '/group/update/:id',
    DELETE: '/group/delete/:id',
    GETBYID: `/group/getById/:id`,
  },
  SUBGROUP: {
    GETALL: "/subgroup/getAll",
    CREATE: '/subgroup/create',
    UPDATE: '/subgroup/update/:id',
    DELETE: '/subgroup/delete/:id',
    GETBYID: `/subgroup/getById/:id`,
  }
};
