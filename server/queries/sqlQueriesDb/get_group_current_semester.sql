CREATE OR REPLACE FUNCTION get_group_current_semester(p_group_id UUID) 
RETURNS INT AS $$
DECLARE
    start_year INT;
    semester INT;
BEGIN
    -- Получаем год начала обучения группы
    SELECT graduation_year INTO start_year 
    FROM "Groups"
    WHERE id = p_group_id;

    -- Проверяем, найдена ли группа
    IF start_year IS NULL THEN
        RAISE EXCEPTION 'Группа с id % не найдена', p_group_id;
    END IF;

    -- Вызываем функцию get_current_semester
    semester := get_current_semester(start_year);

    RETURN semester;
END;
$$ LANGUAGE plpgsql;
SELECT get_group_current_semester('db487c13-af08-4bf0-9218-e13333086a08')
SELECT * FROM public."Groups"
