const QUERIES = {
  GET_PEOPLE_DATA_FOR_SELECT: `SELECT * FROM get_people_data_for_select();`,
  GET_STUDENTS_FULL_NAME_BY_SUBGROUP_ID: `SELECT * FROM get_students_full_name_by_subgroup_id($1);`,
};

module.exports = QUERIES;
