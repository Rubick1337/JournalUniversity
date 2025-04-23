const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const API_ENDPOINTS = {
  // CREATE_PERSON: '/person/create',
  // GET_PERSONS_DATA_FOR_SELECT: '/person/getDataForSelect',
  Faculty: {
    CREATE: `/faculty/create`,
    UPDATE: `/faculty/update/:facultyId`,
    DELETE: `/faculty/delete/:facultyId`,
    GETALL: `/faculty/getAll`,
    GETBYID: `/faculty/getById/:facultyId`,
  },
  PERSON: {
    GETALL: "person/getAll",
    CREATE: 'person/create',
    UPDATE: 'person/update/:personId',
    DELETE: 'person/delete/:personId',
    GETBYID: `/faculty/getById/:facultyId`,
  },
  DEPARTMENT: {
    GETALL: "department/getAll",
    CREATE: 'department/create',
    UPDATE: 'department/update/:departmentId',
    DELETE: 'department/delete/:departmentId',
    GETBYID: `/department/getById/:departmentId`,

  },
  SUBJECT: {
    GETALL: "subject/getAll",
    CREATE: 'subject/create',
    UPDATE: 'subject/update/:subjectId',
    DELETE: 'subject/delete/:subjectId',
    GETBYID: `/subject/getById/:subjectId`,
  },
  TEACHER_POSITION: {
    GETALL: "teacherPosition/getAll",
    CREATE: 'teacherPosition/create',
    UPDATE: 'teacherPosition/update/:teacherPositionId',
    DELETE: 'teacherPosition/delete/:teacherPositionId',
    GETBYID: `/teacherPosition/getById/:teacherPositionId`,
  },
};
