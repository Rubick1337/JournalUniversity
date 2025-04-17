CREATE OR REPLACE FUNCTION get_department_by_id_with_name_data(
    p_department_id UUID
)
RETURNS JSON AS $$
DECLARE 
    result JSON;
    department_exists BOOLEAN;
BEGIN 
    -- Проверяем существование кафедры
    SELECT EXISTS (SELECT 1 FROM public."Departments" 
    WHERE id = p_department_id
    ) INTO department_exists;
    
    IF NOT department_exists THEN
        RAISE EXCEPTION 'Department with id % not found', p_department_id
        USING HINT = 'Check that the department ID is correct';
    END IF;
    
    -- Получаем данные кафедры
    SELECT json_build_object(
        'id', id,
        'name', name,
        'full_name', full_name
    )
    INTO result
    FROM public."Departments"
    WHERE id = p_department_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
SELECT * FROM public."Departments"
SELECT get_department_by_id_with_name_data('ddbc78e6-bbe1-44d1-9038-8088beff1082')