CREATE OR REPLACE FUNCTION get_all_faculty_with_full_data()
RETURNS JSON AS $$
DECLARE
    result JSON := '[]'::JSON;
    faculty_record RECORD;
    faculty_json JSON;
BEGIN
    -- Создаем временный массив для хранения результатов
    result := '[]'::JSON;
    
    -- Для каждого факультета получаем его данные через get_faculty_by_id_with_full_data
    FOR faculty_record IN SELECT id FROM public."Faculties" LOOP
        SELECT get_faculty_by_id_with_full_data(faculty_record.id) INTO faculty_json;
        
        -- Добавляем данные факультета в массив результатов
        IF faculty_json IS NOT NULL THEN
            result := result::jsonb || jsonb_build_array(faculty_json);
        END IF;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
SELECT * from get_all_faculty_with_full_data()