CREATE OR REPLACE FUNCTION get_teacher_full_data_by_id(
    p_teacher_id UUID
)
RETURNS JSON AS $$
DECLARE 
    result JSON;
    teacher_exists BOOLEAN;
BEGIN 
    -- Проверяем существование преподавателя
    SELECT EXISTS (SELECT 1 FROM public."Teachers" WHERE id = p_teacher_id) INTO teacher_exists;
    
    IF NOT teacher_exists THEN
        RAISE EXCEPTION 'Teacher with id % not found', p_teacher_id
        USING HINT = 'Check that the teacher ID is correct';
    END IF;
    
    -- Получаем данные преподавателя
    SELECT json_build_object(
        'id', t.id,
        'person', get_json_fio_for_person_id(t.person_id),
        'department', get_department_by_id_with_full_data(t.department_id),
        'teacher_position', tp.name
    )
    INTO result
    FROM public."Teachers" t
    LEFT JOIN public."TeachingPositions" tp ON t.teaching_position_id = tp.id
    WHERE t.id = p_teacher_id;

    RETURN result;
END;
$$ LANGUAGE plpgsql;
