CREATE OR REPLACE FUNCTION get_students_full_name_by_subgroup_id(p_subgroup_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON := '[]'::JSON;  -- Инициализируем результат пустым массивом
    student RECORD;
BEGIN
    FOR student IN
        SELECT s.id
        FROM "Students" s
        WHERE s.subgroup_id = p_subgroup_id
    LOOP
        result := jsonb_set(result::jsonb, '{0}', get_student_full_name(student.id)::jsonb, true);
    END LOOP;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM public."Subgroups"
SELECT * FROM public."Groups"
SELECT public.get_subgroups_by_group_id('db487c13-af08-4bf0-9218-e13333086a08')
SELECT get_students_full_name_by_subgroup_id('54a46a22-10d4-4b43-84e5-8c47a67bcc67')