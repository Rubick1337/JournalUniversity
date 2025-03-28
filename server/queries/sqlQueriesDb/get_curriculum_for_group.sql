CREATE OR REPLACE FUNCTION get_curriculum_for_group(p_group_id UUID)
RETURNS UUID AS $$
DECLARE
    graduation_year INTEGER;
    active_curriculum_id UUID;
BEGIN
    -- Получаем год начала обучения для указанной группы
    SELECT g.graduation_year
    INTO graduation_year
    FROM "Groups" g
    WHERE g.id = p_group_id;

    IF graduation_year IS NULL THEN
        RAISE EXCEPTION 'Group not found for ID %', p_group_id;
    END IF;

    -- Получаем действующий учебный план для года начала обучения группы
    active_curriculum_id := get_active_curriculum_id(graduation_year);

    RETURN active_curriculum_id;
END;
$$ LANGUAGE plpgsql;
SELECT * FROm public."Groups"
SELECT * FROm public."Curriculums"
SELECT get_curriculum_for_group('db487c13-af08-4bf0-9218-e13333086a08')