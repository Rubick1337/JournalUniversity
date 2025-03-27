const QUERIES = {
  GET_PEOPLE_DATA_FOR_SELECT: `SELECT * FROM get_people_data_for_select();`,
  GET_STUDENTS_FULL_NAME_BY_SUBGROUP_ID: `SELECT * FROM get_students_full_name_by_subgroup_id($1);`,
  GET_SUBGROUPS_BY_GROUP_ID: `SELECT * FROM get_subgroups_by_group_id($1);`,
  GET_GROUP_NAME:`SELECT * FROM get_group_name($1);`,
  GET_ACADEMIC_SPECIALTIES: `SELECT * FROM get_academic_specialties_json();`,
  FACULTY: {
    GET_ALL_FACULTY_WITH_FULL_DATA: `SELECT * FROM get_all_faculty_with_full_data()`,
  },
};

module.exports = QUERIES;
