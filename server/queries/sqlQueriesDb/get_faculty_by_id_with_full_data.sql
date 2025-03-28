CREATE OR REPLACE FUNCTION get_faculty_by_id_with_full_data(
    faculty_id UUID
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    faculty_exists BOOLEAN;
BEGIN
    -- Проверяем существование факультета
    SELECT EXISTS(SELECT 1 FROM public."Faculties" WHERE id = faculty_id) INTO faculty_exists;
    
    IF NOT faculty_exists THEN
        RAISE EXCEPTION 'Faculty with ID % not found', faculty_id
        USING HINT = 'Check that the faculty ID is correct';
    END IF;
    
    -- Получаем данные факультета
    SELECT json_build_object(
        'id', f.id,
        'name', f.name,
        'full_name', f.full_name,
        'dean_person', json_build_object(
            'id', p.id,
            'last_name', p.surname,
            'first_name', p.name,
            'middle_name', p.middlename
        )
    )
    INTO result
    FROM public."Faculties" f
    LEFT JOIN public."People" p ON f.dean_person_id = p.id
    WHERE f.id = faculty_id;

    RETURN result;
END;
$$ LANGUAGE plpgsql;
SELECT * FROM get_faculty_by_id_with_full_data('79211b97-157b-4120-b424-8f111ecf023b')