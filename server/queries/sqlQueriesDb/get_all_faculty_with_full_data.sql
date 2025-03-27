CREATE OR REPLACE FUNCTION get_all_faculty_with_full_data()
RETURNS JSON AS $$
DECLARE
    result JSON := '[]'::JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
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
    )
    INTO result
    FROM public."Faculties" f
    LEFT JOIN public."People" p ON f.dean_person_id = p.id;

    RETURN result;
END;
$$ LANGUAGE plpgsql;
SELECT * FROM get_all_faculty_with_full_data();
