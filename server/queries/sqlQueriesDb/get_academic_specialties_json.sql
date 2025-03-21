CREATE OR REPLACE FUNCTION public.get_academic_specialties_json()
RETURNS TABLE (json_data JSON) AS
$$
BEGIN
    RETURN QUERY
    SELECT json_agg(row_to_json(t))
    FROM (
        SELECT code, name
        FROM public."AcademicSpecialties"
    ) t;
END;
$$
LANGUAGE plpgsql;

SELECT get_academic_specialties_json();