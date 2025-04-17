CREATE OR REPLACE FUNCTION get_all_person_full_data(
    p_limit INT DEFAULT 10,
    p_page INT DEFAULT 1,
    p_sort_by VARCHAR DEFAULT 'id',
    p_sort_order VARCHAR DEFAULT 'ASC',
    p_surname_query VARCHAR DEFAULT NULL,
    p_name_query VARCHAR DEFAULT NULL,
    p_middlename_query VARCHAR DEFAULT NULL,
    p_phone_number_query VARCHAR DEFAULT NULL,
    p_email_query VARCHAR DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result_data JSON := '[]'::JSON;
    result_meta JSON := '{}'::JSON;
    person_record RECORD;
    person_json JSON;
    offset_val INT;
    query_text TEXT;
    count_query TEXT;
    filter_conditions TEXT := '';
    total_count INT;
    total_pages INT;
BEGIN
    -- Calculate offset based on page and limit
    offset_val := (p_page - 1) * p_limit;
    
    -- Build filter conditions once
    IF p_surname_query IS NOT NULL THEN
        filter_conditions := filter_conditions || ' AND surname ILIKE ''%' || p_surname_query || '%''';
    END IF;
    
    IF p_name_query IS NOT NULL THEN
        filter_conditions := filter_conditions || ' AND name ILIKE ''%' || p_name_query || '%''';
    END IF;
    
    IF p_middlename_query IS NOT NULL THEN
        filter_conditions := filter_conditions || ' AND middlename ILIKE ''%' || p_middlename_query || '%''';
    END IF;
    
    IF p_phone_number_query IS NOT NULL THEN
        filter_conditions := filter_conditions || ' AND phone_number ILIKE ''%' || p_phone_number_query || '%''';
    END IF;
    
    IF p_email_query IS NOT NULL THEN
        filter_conditions := filter_conditions || ' AND email ILIKE ''%' || p_email_query || '%''';
    END IF;
    
    -- Build the base queries with common filter conditions
    query_text := 'SELECT id FROM public."People" WHERE 1=1' || filter_conditions;
    count_query := 'SELECT COUNT(*) as total FROM public."People" WHERE 1=1' || filter_conditions;
    
    -- Get total count
    EXECUTE count_query INTO total_count;
    
    -- Calculate total pages
    total_pages := CEIL(total_count::FLOAT / p_limit);
    
    -- Add sorting and pagination to data query
    query_text := query_text || ' ORDER BY ' || quote_ident(p_sort_by) || ' ' || p_sort_order;
    query_text := query_text || ' LIMIT ' || p_limit || ' OFFSET ' || offset_val;
    
    -- Process each person
    FOR person_record IN EXECUTE query_text
    LOOP
        SELECT get_json_person_full_data_by_id(person_record.id) INTO person_json;
        
        IF person_json IS NOT NULL THEN
            result_data := jsonb_insert(result_data::jsonb, '{-1}', person_json::jsonb)::json;
        END IF;
    END LOOP;
    
    -- Build meta object
    result_meta := json_build_object(
        'currentPage', p_page,
        'perPage', p_limit,
        'totalItems', total_count,
        'totalPages', total_pages,
        'hasNextPage', p_page < total_pages,
        'hasPreviousPage', p_page > 1
    );
    
    -- Return combined result
    RETURN json_build_object(
        'data', result_data,
        'meta', result_meta
    );
END;
$$ LANGUAGE plpgsql;