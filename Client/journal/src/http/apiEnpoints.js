const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const API_ENDPOINTS = {
  // CREATE_PERSON: '/person/create',
  // GET_PERSONS_DATA_FOR_SELECT: '/person/getDataForSelect',
  Faculty: {
    CREATE_Faculty: `/faculty/create`,
    UPDATE_Faculty: `/faculty/update`,
    DELETE_Faculty: `/faculty/delete`,
    GETALL_Faculty: `/faculty/getAll`,
    GETIDE_Faculty: `/faculty/getById`,
  },
  PERSON: {
    GETALL: "person/getAll",
    CREATE: 'person/create',
    UPDATE: 'person/update/:personId',
    DELETE: 'person/delete/:personId',
  },
};
