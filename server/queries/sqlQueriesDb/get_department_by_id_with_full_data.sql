CREATE OR REPLACE FUNCTION get_department_by_id_with_full_data(
    p_department_id UUID
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    department_exists BOOLEAN;
BEGIN
    -- Проверяем существование факультета
    SELECT EXISTS(SELECT 1 FROM public."Departments" WHERE id = p_department_id) INTO department_exists;
    
    IF NOT department_exists THEN
        RAISE EXCEPTION 'Department with ID % not found', p_department_id
        USING HINT = 'Check that the department ID is correct';
    END IF;
    
    -- Получаем данные факультета
    SELECT json_build_object(
        'id', id,
        'name', name,
        'full_name', full_name,
        'chairperson_of_the_department_person', get_json_fio_for_person_id(chairperson_of_the_department_person_id),
        'faculty', get_faculty_by_id_with_full_data(faculty_id)
    )
    INTO result
    FROM public."Departments"
    WHERE id = p_department_id;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Пример вызова функции
SELECT * FROM get_department_by_id_with_full_data('ddbc78e6-bbe1-44d1-9038-8088beff1082');