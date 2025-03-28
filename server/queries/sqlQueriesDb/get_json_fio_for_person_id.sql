CREATE OR REPLACE FUNCTION get_json_fio_for_person_id(
    p_person_id UUID
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'id', p.id,
        'last_name', p.surname,
        'first_name', p.name,
        'middle_name', p.middlename
    )
    INTO result
    FROM "People" p
    WHERE p.id = p_person_id;

    IF result IS NULL THEN
        RAISE EXCEPTION 'Person not found';
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql;
SELECT * FROM public."People"
SELECT * FROM get_json_fio_for_person_id('145d22bd-cbec-40b5-ad19-bc0d25bd0486')
