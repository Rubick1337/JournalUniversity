CREATE OR REPLACE FUNCTION get_academic_specialty_data_for_curriculum(
    p_curriculum_id UUID
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    p_specialty_code VARCHAR;
BEGIN
    -- Get the specialty_code for the given curriculum_id
    SELECT "specialty_code" 
    INTO p_specialty_code
    FROM "Curriculums"
    WHERE "id" = p_curriculum_id;

    -- Check if the curriculum was found
    IF p_specialty_code IS NULL THEN
        RAISE EXCEPTION 'Curriculum not found' USING ERRCODE = 'P0001';
    END IF;
	
    -- Get the academic specialty data
    SELECT json_build_object('code', code, 'name', name)
    INTO result
    FROM "AcademicSpecialties"
    WHERE code = p_specialty_code;

    -- Return the result
    RETURN result;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM public."AcademicSpecialties";
SELECT * FROM public."Curriculums";
SELECT get_academic_specialty_data_for_curriculum('7f236c9a-84ae-4a16-96ac-98cdba6415e3')