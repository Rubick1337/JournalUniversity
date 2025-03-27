const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const API_ENDPOINTS = {
    // CREATE_PERSON: '/person/create',
    // GET_PERSONS_DATA_FOR_SELECT: '/person/getDataForSelect',
    Faculty:
        {
            CREATE_Faculty: `${API_BASE_URL}/faculty/create`,
            UPDATE_Faculty: `${API_BASE_URL}/faculty/update`,
            DELETE_Faculty: `${API_BASE_URL}/faculty/delete`,
            GETALL_Faculty: `${API_BASE_URL}/faculty/GetAll`,
            GETIDE_Faculty: `${API_BASE_URL}/faculty/GetById`

        }
};