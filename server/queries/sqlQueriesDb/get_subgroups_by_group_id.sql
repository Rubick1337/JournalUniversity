CREATE OR REPLACE FUNCTION get_subgroups_by_group_id(input_group_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(json_build_object('id', id, 'name', name))
    INTO result
    FROM "Subgroups"
    WHERE group_id = input_group_id; -- Используем input_group_id вместо group_id

    RETURN COALESCE(result, '[]'::JSON); -- Возвращает пустой массив, если подгруппы не найдены
END;
$$ LANGUAGE plpgsql;
SELECT get_subgroups_by_group_id('db487c13-af08-4bf0-9218-e13333086a08')