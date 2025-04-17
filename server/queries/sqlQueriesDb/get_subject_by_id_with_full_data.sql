CREATE OR REPLACE FUNCTION get_subject_by_id_with_full_data(
    p_subject_id UUID
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    subject_exists BOOLEAN;
BEGIN
    -- Проверяем существование дисциплины
    SELECT EXISTS(SELECT 1 FROM public."Subjects" WHERE id = p_subject_id) INTO subject_exists;
    
    IF NOT subject_exists THEN
        RAISE EXCEPTION 'Subject with id % not found', p_subject_id
        USING HINT = 'Check that the subject ID is correct';
    END IF;
    
    -- Получаем данные дисциплины
    SELECT json_build_object(
        'id', s.id,
        'name', s.name,
        'department', get_department_by_id_with_name_data(s.department_id)
    )
    INTO result
    FROM public."Subjects" AS s
    WHERE s.id = p_subject_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
SELECT * FROM public."Subjects"
SELECT get_subject_by_id_with_full_data('301cfc6e-2d28-49f2-99ed-5f8456f80717')