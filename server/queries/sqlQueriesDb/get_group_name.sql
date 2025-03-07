CREATE OR REPLACE FUNCTION get_group_name(group_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object('id', id, 'name', name)
    INTO result
    FROM "Groups"
    WHERE id = group_id;

    IF result IS NULL THEN
        RAISE EXCEPTION 'Group not found';
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql;
SELECT * FROM public."Groups" 
SELECT get_group_name('db487c13-af08-4bf0-9218-e13333086a08')