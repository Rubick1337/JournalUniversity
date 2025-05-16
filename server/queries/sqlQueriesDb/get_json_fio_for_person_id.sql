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

    -- Если результат NULL, возвращаем пустой объект
    IF result IS NULL THEN
        RETURN '{}'::JSON;
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql;