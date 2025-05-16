CREATE OR REPLACE FUNCTION get_active_curriculum_id(p_year INTEGER)
RETURNS UUID AS $$
DECLARE
    active_curriculum_id UUID;
BEGIN
    SELECT id
    INTO active_curriculum_id
    FROM "Curriculums"
    WHERE year_of_specialty_training <= p_year
    AND id = (
        SELECT id
        FROM "Curriculums"
        WHERE year_of_specialty_training <= p_year
        ORDER BY year_of_specialty_training DESC
        LIMIT 1
    );

    IF active_curriculum_id IS NULL THEN
        RAISE EXCEPTION 'No active curriculum found for the year %', p_year;
    END IF;

    RETURN active_curriculum_id;
END;
$$ LANGUAGE plpgsql;
SELECT * from public."Curriculums"
SELECT get_active_curriculum_id(2019)