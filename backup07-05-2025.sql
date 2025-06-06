PGDMP      	    
            }            dbTj    17.0    17.0 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    38851    dbTj    DATABASE     z   CREATE DATABASE "dbTj" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
    DROP DATABASE "dbTj";
                     postgres    false                       1255    39107    get_academic_specialties_json()    FUNCTION       CREATE FUNCTION public.get_academic_specialties_json() RETURNS TABLE(json_data json)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT json_agg(row_to_json(t))
    FROM (
        SELECT code, name
        FROM public."AcademicSpecialties"
    ) t;
END;
$$;
 6   DROP FUNCTION public.get_academic_specialties_json();
       public               postgres    false                       1255    39129 0   get_academic_specialty_data_for_curriculum(uuid)    FUNCTION     �  CREATE FUNCTION public.get_academic_specialty_data_for_curriculum(p_curriculum_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
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
$$;
 W   DROP FUNCTION public.get_academic_specialty_data_for_curriculum(p_curriculum_id uuid);
       public               postgres    false                       1255    39059 !   get_active_curriculum_id(integer)    FUNCTION     p  CREATE FUNCTION public.get_active_curriculum_id(p_year integer) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
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
$$;
 ?   DROP FUNCTION public.get_active_curriculum_id(p_year integer);
       public               postgres    false                       1255    39132     get_all_faculty_with_full_data()    FUNCTION     �  CREATE FUNCTION public.get_all_faculty_with_full_data() RETURNS json
    LANGUAGE plpgsql
    AS $$
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
$$;
 7   DROP FUNCTION public.get_all_faculty_with_full_data();
       public               postgres    false                       1255    39432 �   get_all_person_full_data(integer, integer, character varying, character varying, character varying, character varying, character varying, character varying, character varying)    FUNCTION     �  CREATE FUNCTION public.get_all_person_full_data(p_limit integer DEFAULT 10, p_page integer DEFAULT 1, p_sort_by character varying DEFAULT 'id'::character varying, p_sort_order character varying DEFAULT 'ASC'::character varying, p_surname_query character varying DEFAULT NULL::character varying, p_name_query character varying DEFAULT NULL::character varying, p_middlename_query character varying DEFAULT NULL::character varying, p_phone_number_query character varying DEFAULT NULL::character varying, p_email_query character varying DEFAULT NULL::character varying) RETURNS json
    LANGUAGE plpgsql
    AS $$
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
$$;
 ?  DROP FUNCTION public.get_all_person_full_data(p_limit integer, p_page integer, p_sort_by character varying, p_sort_order character varying, p_surname_query character varying, p_name_query character varying, p_middlename_query character varying, p_phone_number_query character varying, p_email_query character varying);
       public               postgres    false                       1255    39042    get_current_semester(integer)    FUNCTION     5  CREATE FUNCTION public.get_current_semester(start_year integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    current_year INT;
    current_month INT;
    years_passed INT;
    semester INT;
BEGIN
    -- Получаем текущий год и месяц
    SELECT EXTRACT(YEAR FROM CURRENT_DATE), EXTRACT(MONTH FROM CURRENT_DATE)
    INTO current_year, current_month;
    -- Вычисляем количество полных учебных лет
    years_passed := current_year - start_year;

    -- Определяем семестр
    IF current_month BETWEEN 9 AND 12 OR current_month = 1 THEN
        semester := years_passed * 2 +1; -- Осенний семестр
    ELSE
        semester := years_passed * 2; -- Весенний семестр
    END IF;

    RETURN semester;
END;
$$;
 ?   DROP FUNCTION public.get_current_semester(start_year integer);
       public               postgres    false                       1255    39060    get_curriculum_for_group(uuid)    FUNCTION     �  CREATE FUNCTION public.get_curriculum_for_group(p_group_id uuid) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
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
$$;
 @   DROP FUNCTION public.get_curriculum_for_group(p_group_id uuid);
       public               postgres    false                       1255    39429 )   get_department_by_id_with_full_data(uuid)    FUNCTION     �  CREATE FUNCTION public.get_department_by_id_with_full_data(p_department_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    result JSON;
    department_exists BOOLEAN;
BEGIN
    -- Проверяем существование факультета
    SELECT EXISTS(SELECT 1 FROM public."Departments" WHERE id = p_department_id) INTO department_exists;
    
    IF NOT department_exists THEN
        RAISE EXCEPTION 'Department with ID % not found', p_department_id
        USING HINT = 'Check that the department ID is correct';
    END IF;
    
    -- Получаем данные факультета
    SELECT json_build_object(
        'id', id,
        'name', name,
        'full_name', full_name,
        'chairperson_of_the_department_person', get_json_fio_for_person_id(chairperson_of_the_department_person_id),
        'faculty', get_faculty_by_id_with_full_data(faculty_id)
    )
    INTO result
    FROM public."Departments"
    WHERE id = p_department_id;

    RETURN result;
END;
$$;
 P   DROP FUNCTION public.get_department_by_id_with_full_data(p_department_id uuid);
       public               postgres    false                       1255    39134 )   get_department_by_id_with_name_data(uuid)    FUNCTION     E  CREATE FUNCTION public.get_department_by_id_with_name_data(p_department_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE 
    result JSON;
    department_exists BOOLEAN;
BEGIN 
    -- Проверяем существование кафедры
    SELECT EXISTS (SELECT 1 FROM public."Departments" 
    WHERE id = p_department_id
    ) INTO department_exists;
    
    IF NOT department_exists THEN
        RAISE EXCEPTION 'Department with id % not found', p_department_id
        USING HINT = 'Check that the department ID is correct';
    END IF;
    
    -- Получаем данные кафедры
    SELECT json_build_object(
        'id', id,
        'name', name,
        'full_name', full_name
    )
    INTO result
    FROM public."Departments"
    WHERE id = p_department_id;
    
    RETURN result;
END;
$$;
 P   DROP FUNCTION public.get_department_by_id_with_name_data(p_department_id uuid);
       public               postgres    false                       1255    39133 &   get_faculty_by_id_with_full_data(uuid)    FUNCTION       CREATE FUNCTION public.get_faculty_by_id_with_full_data(faculty_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    result JSON;
    faculty_exists BOOLEAN;
BEGIN
    -- Проверяем существование факультета
    SELECT EXISTS(SELECT 1 FROM public."Faculties" WHERE id = faculty_id) INTO faculty_exists;
    
    IF NOT faculty_exists THEN
        RAISE EXCEPTION 'Faculty with ID % not found', faculty_id
        USING HINT = 'Check that the faculty ID is correct';
    END IF;
    
    -- Получаем данные факультета
    SELECT json_build_object(
        'id', f.id,
        'name', f.name,
        'full_name', f.full_name,
        'dean_person', json_build_object(
            'id', p.id,
            'last_name', p.surname,
            'first_name', p.name,
            'middle_name', p.middlename
        )
    )
    INTO result
    FROM public."Faculties" f
    LEFT JOIN public."People" p ON f.dean_person_id = p.id
    WHERE f.id = faculty_id;

    RETURN result;
END;
$$;
 H   DROP FUNCTION public.get_faculty_by_id_with_full_data(faculty_id uuid);
       public               postgres    false                       1255    39043     get_group_current_semester(uuid)    FUNCTION     �  CREATE FUNCTION public.get_group_current_semester(p_group_id uuid) RETURNS integer
    LANGUAGE plpgsql
    AS $$
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
$$;
 B   DROP FUNCTION public.get_group_current_semester(p_group_id uuid);
       public               postgres    false                        1255    39015    get_group_name(uuid)    FUNCTION     `  CREATE FUNCTION public.get_group_name(group_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
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
$$;
 4   DROP FUNCTION public.get_group_name(group_id uuid);
       public               postgres    false                       1255    39131     get_json_fio_for_person_id(uuid)    FUNCTION     #  CREATE FUNCTION public.get_json_fio_for_person_id(p_person_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
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
$$;
 C   DROP FUNCTION public.get_json_fio_for_person_id(p_person_id uuid);
       public               postgres    false                       1255    39431 %   get_json_person_full_data_by_id(uuid)    FUNCTION     a  CREATE FUNCTION public.get_json_person_full_data_by_id(p_person_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'id', p.id,
        'surname', p.surname,
        'name', p.name,
        'middlename', p.middlename,
        'phone_number', p.phone_number,
        'email', p.email
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
$$;
 H   DROP FUNCTION public.get_json_person_full_data_by_id(p_person_id uuid);
       public               postgres    false                       1255    39022    get_student_full_name(integer)    FUNCTION       CREATE FUNCTION public.get_student_full_name(p_student_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
		'id', s.id,
        'last_name', p.surname,
        'first_name', p.name,
        'middle_name', p.middlename
    )
    INTO result
    FROM "Students" s
    JOIN "People" p ON s.person_id = p.id
    WHERE s.id = p_student_id;

    IF result IS NULL THEN
        RAISE EXCEPTION 'Student not found';
    END IF;

    RETURN result;
END;
$$;
 B   DROP FUNCTION public.get_student_full_name(p_student_id integer);
       public               postgres    false                       1255    39018    get_student_full_name(uuid)    FUNCTION     �  CREATE FUNCTION public.get_student_full_name(student_uuid uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'last_name', p.last_name,
        'first_name', p.first_name,
        'middle_name', p.middle_name
    )
    INTO result
    FROM "Students" s
    JOIN "Persons" p ON s.person_id = p.id
    WHERE s.id = student_uuid;

    IF result IS NULL THEN
        RAISE EXCEPTION 'Student not found';
    END IF;

    RETURN result;
END;
$$;
 ?   DROP FUNCTION public.get_student_full_name(student_uuid uuid);
       public               postgres    false                       1255    39023 +   get_students_full_name_by_subgroup_id(uuid)    FUNCTION       CREATE FUNCTION public.get_students_full_name_by_subgroup_id(p_subgroup_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    result JSON := '[]'::JSON;  -- Инициализируем результат пустым массивом
    student RECORD;
BEGIN
    FOR student IN
        SELECT s.id
        FROM "Students" s
        WHERE s.subgroup_id = p_subgroup_id
    LOOP
        result := jsonb_set(result::jsonb, '{0}', get_student_full_name(student.id)::jsonb, true);
    END LOOP;

    RETURN result;
END;
$$;
 P   DROP FUNCTION public.get_students_full_name_by_subgroup_id(p_subgroup_id uuid);
       public               postgres    false                       1255    39017    get_subgroups_by_group_id(uuid)    FUNCTION     �  CREATE FUNCTION public.get_subgroups_by_group_id(input_group_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(json_build_object('id', id, 'name', name))
    INTO result
    FROM "Subgroups"
    WHERE group_id = input_group_id; -- Используем input_group_id вместо group_id

    RETURN COALESCE(result, '[]'::JSON); -- Возвращает пустой массив, если подгруппы не найдены
END;
$$;
 E   DROP FUNCTION public.get_subgroups_by_group_id(input_group_id uuid);
       public               postgres    false                       1255    39135 &   get_subject_by_id_with_full_data(uuid)    FUNCTION     W  CREATE FUNCTION public.get_subject_by_id_with_full_data(p_subject_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    result JSON;
    subject_exists BOOLEAN;
BEGIN
    -- Проверяем существование дисциплины
    SELECT EXISTS(SELECT 1 FROM public."Subjects" WHERE id = p_subject_id) INTO subject_exists;
    
    IF NOT subject_exists THEN
        RAISE EXCEPTION 'Subject with id % not found', p_subject_id
        USING HINT = 'Check that the subject ID is correct';
    END IF;
    
    -- Получаем данные дисциплины
    SELECT json_build_object(
        'id', s.id,
        'name', s.name,
        'department', get_department_by_id_with_name_data(s.department_id)
    )
    INTO result
    FROM public."Subjects" AS s
    WHERE s.id = p_subject_id;
    
    RETURN result;
END;
$$;
 J   DROP FUNCTION public.get_subject_by_id_with_full_data(p_subject_id uuid);
       public               postgres    false                       1255    39430 !   get_teacher_full_data_by_id(uuid)    FUNCTION     �  CREATE FUNCTION public.get_teacher_full_data_by_id(p_teacher_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE 
    result JSON;
    teacher_exists BOOLEAN;
BEGIN 
    -- Проверяем существование преподавателя
    SELECT EXISTS (SELECT 1 FROM public."Teachers" WHERE id = p_teacher_id) INTO teacher_exists;
    
    IF NOT teacher_exists THEN
        RAISE EXCEPTION 'Teacher with id % not found', p_teacher_id
        USING HINT = 'Check that the teacher ID is correct';
    END IF;
    
    -- Получаем данные преподавателя
    SELECT json_build_object(
        'id', t.id,
        'person', get_json_fio_for_person_id(t.person_id),
        'department', get_department_by_id_with_full_data(t.department_id),
        'teacher_position', tp.name
    )
    INTO result
    FROM public."Teachers" t
    LEFT JOIN public."TeachingPositions" tp ON t.teaching_position_id = tp.id
    WHERE t.id = p_teacher_id;

    RETURN result;
END;
$$;
 E   DROP FUNCTION public.get_teacher_full_data_by_id(p_teacher_id uuid);
       public               postgres    false            �            1259    39109    AcademicBuildings    TABLE       CREATE TABLE public."AcademicBuildings" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 '   DROP TABLE public."AcademicBuildings";
       public         heap r       postgres    false            �            1259    39108    AcademicBuildings_id_seq    SEQUENCE     �   CREATE SEQUENCE public."AcademicBuildings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public."AcademicBuildings_id_seq";
       public               postgres    false    224            �           0    0    AcademicBuildings_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public."AcademicBuildings_id_seq" OWNED BY public."AcademicBuildings".id;
          public               postgres    false    223            �            1259    38927    AcademicSpecialties    TABLE     �   CREATE TABLE public."AcademicSpecialties" (
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 )   DROP TABLE public."AcademicSpecialties";
       public         heap r       postgres    false            �            1259    47778    AssessmentTypes    TABLE     �   CREATE TABLE public."AssessmentTypes" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 %   DROP TABLE public."AssessmentTypes";
       public         heap r       postgres    false            �            1259    47777    AssessmentTypes_id_seq    SEQUENCE     �   CREATE SEQUENCE public."AssessmentTypes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public."AssessmentTypes_id_seq";
       public               postgres    false    242            �           0    0    AssessmentTypes_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public."AssessmentTypes_id_seq" OWNED BY public."AssessmentTypes".id;
          public               postgres    false    241            �            1259    48016 	   Audiences    TABLE     <  CREATE TABLE public."Audiences" (
    id integer NOT NULL,
    number integer NOT NULL,
    capacity integer NOT NULL,
    academic_building_id integer NOT NULL,
    description character varying(1026) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Audiences";
       public         heap r       postgres    false            �            1259    48015    Audiences_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Audiences_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Audiences_id_seq";
       public               postgres    false    254            �           0    0    Audiences_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Audiences_id_seq" OWNED BY public."Audiences".id;
          public               postgres    false    253            �            1259    47834    CurriculumSubjects    TABLE     k  CREATE TABLE public."CurriculumSubjects" (
    curriculum_id integer NOT NULL,
    subject_id integer NOT NULL,
    assessment_type_id integer NOT NULL,
    semester integer NOT NULL,
    all_hours integer DEFAULT 0 NOT NULL,
    lecture_hours integer DEFAULT 0 NOT NULL,
    lab_hours integer DEFAULT 0 NOT NULL,
    practice_hours integer DEFAULT 0 NOT NULL
);
 (   DROP TABLE public."CurriculumSubjects";
       public         heap r       postgres    false            �            1259    47761    Curriculums    TABLE     2  CREATE TABLE public."Curriculums" (
    id integer NOT NULL,
    year_of_specialty_training integer NOT NULL,
    specialty_code character varying(255) NOT NULL,
    education_form_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 !   DROP TABLE public."Curriculums";
       public         heap r       postgres    false            �            1259    47760    Curriculums_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Curriculums_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."Curriculums_id_seq";
       public               postgres    false    240            �           0    0    Curriculums_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."Curriculums_id_seq" OWNED BY public."Curriculums".id;
          public               postgres    false    239            �            1259    47689    Departments    TABLE     p  CREATE TABLE public."Departments" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    chairperson_of_the_department_person_id integer,
    faculty_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    head_person_id integer
);
 !   DROP TABLE public."Departments";
       public         heap r       postgres    false            �            1259    47688    Departments_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Departments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."Departments_id_seq";
       public               postgres    false    230            �           0    0    Departments_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."Departments_id_seq" OWNED BY public."Departments".id;
          public               postgres    false    229            �            1259    47754    EducationForms    TABLE     �   CREATE TABLE public."EducationForms" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 $   DROP TABLE public."EducationForms";
       public         heap r       postgres    false            �            1259    47753    EducationForms_id_seq    SEQUENCE     �   CREATE SEQUENCE public."EducationForms_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public."EducationForms_id_seq";
       public               postgres    false    238            �           0    0    EducationForms_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public."EducationForms_id_seq" OWNED BY public."EducationForms".id;
          public               postgres    false    237            �            1259    47644 	   Faculties    TABLE       CREATE TABLE public."Faculties" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    dean_person_id integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Faculties";
       public         heap r       postgres    false            �            1259    47643    Faculties_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Faculties_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Faculties_id_seq";
       public               postgres    false    228            �           0    0    Faculties_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Faculties_id_seq" OWNED BY public."Faculties".id;
          public               postgres    false    227            �            1259    47908    Groups    TABLE     �  CREATE TABLE public."Groups" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    graduation_year integer NOT NULL,
    year_of_beginning_of_study integer NOT NULL,
    faculty_id integer NOT NULL,
    class_representative_person_id integer,
    teacher_curator_id integer,
    department_id integer NOT NULL,
    specialty_code character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Groups";
       public         heap r       postgres    false            �            1259    47907    Groups_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Groups_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Groups_id_seq";
       public               postgres    false    249            �           0    0    Groups_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Groups_id_seq" OWNED BY public."Groups".id;
          public               postgres    false    248            �            1259    48029    Lessons    TABLE     �  CREATE TABLE public."Lessons" (
    id uuid NOT NULL,
    group_id integer NOT NULL,
    subgroup_id uuid,
    date timestamp with time zone NOT NULL,
    subject_id integer NOT NULL,
    teacher_person_id integer NOT NULL,
    topic_id integer NOT NULL,
    audience_id integer NOT NULL,
    subject_type_id integer NOT NULL,
    has_marked_absences boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Lessons";
       public         heap r       postgres    false            �            1259    38898    Pairs    TABLE     �  CREATE TABLE public."Pairs" (
    id uuid NOT NULL,
    weekday_number integer NOT NULL,
    name character varying(255) NOT NULL,
    start time without time zone NOT NULL,
    "end" time without time zone NOT NULL,
    break_start time without time zone NOT NULL,
    break_end time without time zone NOT NULL,
    week_type_name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Pairs";
       public         heap r       postgres    false            �            1259    39452    People    TABLE     i  CREATE TABLE public."People" (
    id integer NOT NULL,
    surname character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    middlename character varying(255),
    phone_number character varying(255),
    email character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."People";
       public         heap r       postgres    false            �            1259    39451    People_id_seq    SEQUENCE     �   CREATE SEQUENCE public."People_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."People_id_seq";
       public               postgres    false    226            �           0    0    People_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."People_id_seq" OWNED BY public."People".id;
          public               postgres    false    225            �            1259    39037    SemesterTypes    TABLE     <  CREATE TABLE public."SemesterTypes" (
    name character varying(255) NOT NULL,
    "startMonth" integer NOT NULL,
    "startDay" integer NOT NULL,
    "endMonth" integer NOT NULL,
    "endDay" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 #   DROP TABLE public."SemesterTypes";
       public         heap r       postgres    false            �            1259    47957    Students    TABLE     t  CREATE TABLE public."Students" (
    id integer NOT NULL,
    count_reprimand integer DEFAULT 0 NOT NULL,
    icon_path character varying(255),
    person_id integer NOT NULL,
    group_id integer NOT NULL,
    subgroup_id uuid NOT NULL,
    perent_person_id integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Students";
       public         heap r       postgres    false            �            1259    47956    Students_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Students_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Students_id_seq";
       public               postgres    false    252            �           0    0    Students_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Students_id_seq" OWNED BY public."Students".id;
          public               postgres    false    251            �            1259    47941 	   Subgroups    TABLE        CREATE TABLE public."Subgroups" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    group_id integer NOT NULL,
    leader_id integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Subgroups";
       public         heap r       postgres    false            �            1259    47860    SubjectTypes    TABLE     �   CREATE TABLE public."SubjectTypes" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 "   DROP TABLE public."SubjectTypes";
       public         heap r       postgres    false            �            1259    47859    SubjectTypes_id_seq    SEQUENCE     �   CREATE SEQUENCE public."SubjectTypes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."SubjectTypes_id_seq";
       public               postgres    false    245            �           0    0    SubjectTypes_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."SubjectTypes_id_seq" OWNED BY public."SubjectTypes".id;
          public               postgres    false    244            �            1259    47713    Subjects    TABLE     �   CREATE TABLE public."Subjects" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    department_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Subjects";
       public         heap r       postgres    false            �            1259    47712    Subjects_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Subjects_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Subjects_id_seq";
       public               postgres    false    232            �           0    0    Subjects_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Subjects_id_seq" OWNED BY public."Subjects".id;
          public               postgres    false    231            �            1259    47732    Teachers    TABLE       CREATE TABLE public."Teachers" (
    id integer NOT NULL,
    person_id integer NOT NULL,
    department_id integer NOT NULL,
    teaching_position_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Teachers";
       public         heap r       postgres    false            �            1259    47731    Teachers_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Teachers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Teachers_id_seq";
       public               postgres    false    236            �           0    0    Teachers_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Teachers_id_seq" OWNED BY public."Teachers".id;
          public               postgres    false    235            �            1259    47725    TeachingPositions    TABLE     �   CREATE TABLE public."TeachingPositions" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 '   DROP TABLE public."TeachingPositions";
       public         heap r       postgres    false            �            1259    47724    TeachingPositions_id_seq    SEQUENCE     �   CREATE SEQUENCE public."TeachingPositions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public."TeachingPositions_id_seq";
       public               postgres    false    234            �           0    0    TeachingPositions_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public."TeachingPositions_id_seq" OWNED BY public."TeachingPositions".id;
          public               postgres    false    233            �            1259    47896    Topics    TABLE     �   CREATE TABLE public."Topics" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    subject_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Topics";
       public         heap r       postgres    false            �            1259    47895    Topics_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Topics_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Topics_id_seq";
       public               postgres    false    247            �           0    0    Topics_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Topics_id_seq" OWNED BY public."Topics".id;
          public               postgres    false    246            �            1259    38876 	   WeekTypes    TABLE     �   CREATE TABLE public."WeekTypes" (
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."WeekTypes";
       public         heap r       postgres    false            �           2604    39112    AcademicBuildings id    DEFAULT     �   ALTER TABLE ONLY public."AcademicBuildings" ALTER COLUMN id SET DEFAULT nextval('public."AcademicBuildings_id_seq"'::regclass);
 E   ALTER TABLE public."AcademicBuildings" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223    224            �           2604    47781    AssessmentTypes id    DEFAULT     |   ALTER TABLE ONLY public."AssessmentTypes" ALTER COLUMN id SET DEFAULT nextval('public."AssessmentTypes_id_seq"'::regclass);
 C   ALTER TABLE public."AssessmentTypes" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    241    242    242            �           2604    48019    Audiences id    DEFAULT     p   ALTER TABLE ONLY public."Audiences" ALTER COLUMN id SET DEFAULT nextval('public."Audiences_id_seq"'::regclass);
 =   ALTER TABLE public."Audiences" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    253    254    254            �           2604    47764    Curriculums id    DEFAULT     t   ALTER TABLE ONLY public."Curriculums" ALTER COLUMN id SET DEFAULT nextval('public."Curriculums_id_seq"'::regclass);
 ?   ALTER TABLE public."Curriculums" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    239    240    240            �           2604    47692    Departments id    DEFAULT     t   ALTER TABLE ONLY public."Departments" ALTER COLUMN id SET DEFAULT nextval('public."Departments_id_seq"'::regclass);
 ?   ALTER TABLE public."Departments" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    230    229    230            �           2604    47757    EducationForms id    DEFAULT     z   ALTER TABLE ONLY public."EducationForms" ALTER COLUMN id SET DEFAULT nextval('public."EducationForms_id_seq"'::regclass);
 B   ALTER TABLE public."EducationForms" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    238    237    238            �           2604    47647    Faculties id    DEFAULT     p   ALTER TABLE ONLY public."Faculties" ALTER COLUMN id SET DEFAULT nextval('public."Faculties_id_seq"'::regclass);
 =   ALTER TABLE public."Faculties" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    228    227    228            �           2604    47911 	   Groups id    DEFAULT     j   ALTER TABLE ONLY public."Groups" ALTER COLUMN id SET DEFAULT nextval('public."Groups_id_seq"'::regclass);
 :   ALTER TABLE public."Groups" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    249    248    249            �           2604    39455 	   People id    DEFAULT     j   ALTER TABLE ONLY public."People" ALTER COLUMN id SET DEFAULT nextval('public."People_id_seq"'::regclass);
 :   ALTER TABLE public."People" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    225    226            �           2604    47960    Students id    DEFAULT     n   ALTER TABLE ONLY public."Students" ALTER COLUMN id SET DEFAULT nextval('public."Students_id_seq"'::regclass);
 <   ALTER TABLE public."Students" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    252    251    252            �           2604    47863    SubjectTypes id    DEFAULT     v   ALTER TABLE ONLY public."SubjectTypes" ALTER COLUMN id SET DEFAULT nextval('public."SubjectTypes_id_seq"'::regclass);
 @   ALTER TABLE public."SubjectTypes" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    245    244    245            �           2604    47716    Subjects id    DEFAULT     n   ALTER TABLE ONLY public."Subjects" ALTER COLUMN id SET DEFAULT nextval('public."Subjects_id_seq"'::regclass);
 <   ALTER TABLE public."Subjects" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    231    232    232            �           2604    47735    Teachers id    DEFAULT     n   ALTER TABLE ONLY public."Teachers" ALTER COLUMN id SET DEFAULT nextval('public."Teachers_id_seq"'::regclass);
 <   ALTER TABLE public."Teachers" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    235    236    236            �           2604    47728    TeachingPositions id    DEFAULT     �   ALTER TABLE ONLY public."TeachingPositions" ALTER COLUMN id SET DEFAULT nextval('public."TeachingPositions_id_seq"'::regclass);
 E   ALTER TABLE public."TeachingPositions" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    233    234    234            �           2604    47899 	   Topics id    DEFAULT     j   ALTER TABLE ONLY public."Topics" ALTER COLUMN id SET DEFAULT nextval('public."Topics_id_seq"'::regclass);
 :   ALTER TABLE public."Topics" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    246    247    247            �          0    39109    AcademicBuildings 
   TABLE DATA           Z   COPY public."AcademicBuildings" (id, name, address, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    224   �3      �          0    38927    AcademicSpecialties 
   TABLE DATA           U   COPY public."AcademicSpecialties" (code, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    221   �3      �          0    47778    AssessmentTypes 
   TABLE DATA           O   COPY public."AssessmentTypes" (id, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    242   Y4      �          0    48016 	   Audiences 
   TABLE DATA           x   COPY public."Audiences" (id, number, capacity, academic_building_id, description, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    254   5      �          0    47834    CurriculumSubjects 
   TABLE DATA           �   COPY public."CurriculumSubjects" (curriculum_id, subject_id, assessment_type_id, semester, all_hours, lecture_hours, lab_hours, practice_hours) FROM stdin;
    public               postgres    false    243   45      �          0    47761    Curriculums 
   TABLE DATA           �   COPY public."Curriculums" (id, year_of_specialty_training, specialty_code, education_form_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    240   �5      �          0    47689    Departments 
   TABLE DATA           �   COPY public."Departments" (id, name, full_name, chairperson_of_the_department_person_id, faculty_id, "createdAt", "updatedAt", head_person_id) FROM stdin;
    public               postgres    false    230   �5      �          0    47754    EducationForms 
   TABLE DATA           N   COPY public."EducationForms" (id, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    238   /7      �          0    47644 	   Faculties 
   TABLE DATA           d   COPY public."Faculties" (id, name, full_name, dean_person_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    228   �7      �          0    47908    Groups 
   TABLE DATA           �   COPY public."Groups" (id, name, graduation_year, year_of_beginning_of_study, faculty_id, class_representative_person_id, teacher_curator_id, department_id, specialty_code, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    249   9      �          0    48029    Lessons 
   TABLE DATA           �   COPY public."Lessons" (id, group_id, subgroup_id, date, subject_id, teacher_person_id, topic_id, audience_id, subject_type_id, has_marked_absences, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    255   x9      �          0    38898    Pairs 
   TABLE DATA           �   COPY public."Pairs" (id, weekday_number, name, start, "end", break_start, break_end, week_type_name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    220   �9      �          0    39452    People 
   TABLE DATA           p   COPY public."People" (id, surname, name, middlename, phone_number, email, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    226   �A      �          0    39037    SemesterTypes 
   TABLE DATA           y   COPY public."SemesterTypes" (name, "startMonth", "startDay", "endMonth", "endDay", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    222   /F      �          0    47957    Students 
   TABLE DATA           �   COPY public."Students" (id, count_reprimand, icon_path, person_id, group_id, subgroup_id, perent_person_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    252   �F      �          0    47941 	   Subgroups 
   TABLE DATA           ^   COPY public."Subgroups" (id, name, group_id, leader_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    250   �G      �          0    47860    SubjectTypes 
   TABLE DATA           L   COPY public."SubjectTypes" (id, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    245   �H      �          0    47713    Subjects 
   TABLE DATA           W   COPY public."Subjects" (id, name, department_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    232   ^I      �          0    47732    Teachers 
   TABLE DATA           r   COPY public."Teachers" (id, person_id, department_id, teaching_position_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    236   7K      �          0    47725    TeachingPositions 
   TABLE DATA           Q   COPY public."TeachingPositions" (id, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    234   �K      �          0    47896    Topics 
   TABLE DATA           R   COPY public."Topics" (id, name, subject_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    247   �L      �          0    38876 	   WeekTypes 
   TABLE DATA           E   COPY public."WeekTypes" (name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    219   	M      �           0    0    AcademicBuildings_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public."AcademicBuildings_id_seq"', 1, false);
          public               postgres    false    223            �           0    0    AssessmentTypes_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."AssessmentTypes_id_seq"', 7, true);
          public               postgres    false    241            �           0    0    Audiences_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Audiences_id_seq"', 1, false);
          public               postgres    false    253                        0    0    Curriculums_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."Curriculums_id_seq"', 3, true);
          public               postgres    false    239                       0    0    Departments_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Departments_id_seq"', 11, true);
          public               postgres    false    229                       0    0    EducationForms_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."EducationForms_id_seq"', 10, true);
          public               postgres    false    237                       0    0    Faculties_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Faculties_id_seq"', 11, true);
          public               postgres    false    227                       0    0    Groups_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Groups_id_seq"', 3, true);
          public               postgres    false    248                       0    0    People_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."People_id_seq"', 38, true);
          public               postgres    false    225                       0    0    Students_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Students_id_seq"', 19, true);
          public               postgres    false    251                       0    0    SubjectTypes_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."SubjectTypes_id_seq"', 3, true);
          public               postgres    false    244                       0    0    Subjects_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Subjects_id_seq"', 14, true);
          public               postgres    false    231            	           0    0    Teachers_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Teachers_id_seq"', 12, true);
          public               postgres    false    235            
           0    0    TeachingPositions_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public."TeachingPositions_id_seq"', 15, true);
          public               postgres    false    233                       0    0    Topics_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Topics_id_seq"', 2, true);
          public               postgres    false    246            �           2606    39116 (   AcademicBuildings AcademicBuildings_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public."AcademicBuildings"
    ADD CONSTRAINT "AcademicBuildings_pkey" PRIMARY KEY (id);
 V   ALTER TABLE ONLY public."AcademicBuildings" DROP CONSTRAINT "AcademicBuildings_pkey";
       public                 postgres    false    224            �           2606    38933 ,   AcademicSpecialties AcademicSpecialties_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public."AcademicSpecialties"
    ADD CONSTRAINT "AcademicSpecialties_pkey" PRIMARY KEY (code);
 Z   ALTER TABLE ONLY public."AcademicSpecialties" DROP CONSTRAINT "AcademicSpecialties_pkey";
       public                 postgres    false    221            �           2606    47783 $   AssessmentTypes AssessmentTypes_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public."AssessmentTypes"
    ADD CONSTRAINT "AssessmentTypes_pkey" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."AssessmentTypes" DROP CONSTRAINT "AssessmentTypes_pkey";
       public                 postgres    false    242                       2606    48023    Audiences Audiences_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Audiences"
    ADD CONSTRAINT "Audiences_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Audiences" DROP CONSTRAINT "Audiences_pkey";
       public                 postgres    false    254                       2606    47842 *   CurriculumSubjects CurriculumSubjects_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."CurriculumSubjects"
    ADD CONSTRAINT "CurriculumSubjects_pkey" PRIMARY KEY (curriculum_id, subject_id, assessment_type_id, semester);
 X   ALTER TABLE ONLY public."CurriculumSubjects" DROP CONSTRAINT "CurriculumSubjects_pkey";
       public                 postgres    false    243    243    243    243            �           2606    47766    Curriculums Curriculums_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Curriculums"
    ADD CONSTRAINT "Curriculums_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."Curriculums" DROP CONSTRAINT "Curriculums_pkey";
       public                 postgres    false    240            �           2606    47696    Departments Departments_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_pkey";
       public                 postgres    false    230            �           2606    47759 "   EducationForms EducationForms_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."EducationForms"
    ADD CONSTRAINT "EducationForms_pkey" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public."EducationForms" DROP CONSTRAINT "EducationForms_pkey";
       public                 postgres    false    238            �           2606    47651    Faculties Faculties_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Faculties"
    ADD CONSTRAINT "Faculties_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Faculties" DROP CONSTRAINT "Faculties_pkey";
       public                 postgres    false    228                       2606    47915    Groups Groups_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_pkey";
       public                 postgres    false    249                       2606    48034    Lessons Lessons_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_pkey";
       public                 postgres    false    255            �           2606    38904    Pairs Pairs_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Pairs"
    ADD CONSTRAINT "Pairs_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Pairs" DROP CONSTRAINT "Pairs_pkey";
       public                 postgres    false    220            �           2606    39459    People People_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."People"
    ADD CONSTRAINT "People_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."People" DROP CONSTRAINT "People_pkey";
       public                 postgres    false    226            �           2606    39041     SemesterTypes SemesterTypes_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."SemesterTypes"
    ADD CONSTRAINT "SemesterTypes_pkey" PRIMARY KEY (name);
 N   ALTER TABLE ONLY public."SemesterTypes" DROP CONSTRAINT "SemesterTypes_pkey";
       public                 postgres    false    222                       2606    47963    Students Students_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_pkey";
       public                 postgres    false    252            	           2606    47945    Subgroups Subgroups_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Subgroups"
    ADD CONSTRAINT "Subgroups_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Subgroups" DROP CONSTRAINT "Subgroups_pkey";
       public                 postgres    false    250                       2606    47865    SubjectTypes SubjectTypes_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."SubjectTypes"
    ADD CONSTRAINT "SubjectTypes_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."SubjectTypes" DROP CONSTRAINT "SubjectTypes_pkey";
       public                 postgres    false    245            �           2606    47718    Subjects Subjects_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_pkey";
       public                 postgres    false    232            �           2606    47737    Teachers Teachers_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_pkey";
       public                 postgres    false    236            �           2606    47730 (   TeachingPositions TeachingPositions_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public."TeachingPositions"
    ADD CONSTRAINT "TeachingPositions_pkey" PRIMARY KEY (id);
 V   ALTER TABLE ONLY public."TeachingPositions" DROP CONSTRAINT "TeachingPositions_pkey";
       public                 postgres    false    234                       2606    47901    Topics Topics_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Topics"
    ADD CONSTRAINT "Topics_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Topics" DROP CONSTRAINT "Topics_pkey";
       public                 postgres    false    247            �           2606    38880    WeekTypes WeekTypes_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."WeekTypes"
    ADD CONSTRAINT "WeekTypes_pkey" PRIMARY KEY (name);
 F   ALTER TABLE ONLY public."WeekTypes" DROP CONSTRAINT "WeekTypes_pkey";
       public                 postgres    false    219            *           2606    48024 -   Audiences Audiences_academic_building_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Audiences"
    ADD CONSTRAINT "Audiences_academic_building_id_fkey" FOREIGN KEY (academic_building_id) REFERENCES public."AcademicBuildings"(id);
 [   ALTER TABLE ONLY public."Audiences" DROP CONSTRAINT "Audiences_academic_building_id_fkey";
       public               postgres    false    254    224    4845                       2606    47853 =   CurriculumSubjects CurriculumSubjects_assessment_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CurriculumSubjects"
    ADD CONSTRAINT "CurriculumSubjects_assessment_type_id_fkey" FOREIGN KEY (assessment_type_id) REFERENCES public."AssessmentTypes"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 k   ALTER TABLE ONLY public."CurriculumSubjects" DROP CONSTRAINT "CurriculumSubjects_assessment_type_id_fkey";
       public               postgres    false    4863    242    243                       2606    47843 8   CurriculumSubjects CurriculumSubjects_curriculum_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CurriculumSubjects"
    ADD CONSTRAINT "CurriculumSubjects_curriculum_id_fkey" FOREIGN KEY (curriculum_id) REFERENCES public."Curriculums"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 f   ALTER TABLE ONLY public."CurriculumSubjects" DROP CONSTRAINT "CurriculumSubjects_curriculum_id_fkey";
       public               postgres    false    4861    240    243                       2606    47848 5   CurriculumSubjects CurriculumSubjects_subject_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CurriculumSubjects"
    ADD CONSTRAINT "CurriculumSubjects_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 c   ALTER TABLE ONLY public."CurriculumSubjects" DROP CONSTRAINT "CurriculumSubjects_subject_id_fkey";
       public               postgres    false    232    243    4853                       2606    47772 .   Curriculums Curriculums_education_form_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Curriculums"
    ADD CONSTRAINT "Curriculums_education_form_id_fkey" FOREIGN KEY (education_form_id) REFERENCES public."EducationForms"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 \   ALTER TABLE ONLY public."Curriculums" DROP CONSTRAINT "Curriculums_education_form_id_fkey";
       public               postgres    false    238    240    4859                       2606    47767 +   Curriculums Curriculums_specialty_code_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Curriculums"
    ADD CONSTRAINT "Curriculums_specialty_code_fkey" FOREIGN KEY (specialty_code) REFERENCES public."AcademicSpecialties"(code) ON UPDATE CASCADE ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public."Curriculums" DROP CONSTRAINT "Curriculums_specialty_code_fkey";
       public               postgres    false    4841    221    240                       2606    47697 D   Departments Departments_chairperson_of_the_department_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_chairperson_of_the_department_person_id_fkey" FOREIGN KEY (chairperson_of_the_department_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 r   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_chairperson_of_the_department_person_id_fkey";
       public               postgres    false    226    4847    230                       2606    47702 '   Departments Departments_faculty_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_faculty_id_fkey" FOREIGN KEY (faculty_id) REFERENCES public."Faculties"(id) ON UPDATE CASCADE;
 U   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_faculty_id_fkey";
       public               postgres    false    4849    230    228                       2606    47707 +   Departments Departments_head_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_head_person_id_fkey" FOREIGN KEY (head_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 Y   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_head_person_id_fkey";
       public               postgres    false    4847    226    230                       2606    47652 '   Faculties Faculties_dean_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Faculties"
    ADD CONSTRAINT "Faculties_dean_person_id_fkey" FOREIGN KEY (dean_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 U   ALTER TABLE ONLY public."Faculties" DROP CONSTRAINT "Faculties_dean_person_id_fkey";
       public               postgres    false    4847    228    226                       2606    47921 1   Groups Groups_class_representative_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_class_representative_person_id_fkey" FOREIGN KEY (class_representative_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 _   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_class_representative_person_id_fkey";
       public               postgres    false    4847    249    226                        2606    47931     Groups Groups_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public."Departments"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_department_id_fkey";
       public               postgres    false    230    249    4851            !           2606    47916    Groups Groups_faculty_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_faculty_id_fkey" FOREIGN KEY (faculty_id) REFERENCES public."Faculties"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 K   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_faculty_id_fkey";
       public               postgres    false    228    4849    249            "           2606    47936 !   Groups Groups_specialty_code_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_specialty_code_fkey" FOREIGN KEY (specialty_code) REFERENCES public."AcademicSpecialties"(code) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_specialty_code_fkey";
       public               postgres    false    4841    221    249            #           2606    47926 %   Groups Groups_teacher_curator_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_teacher_curator_id_fkey" FOREIGN KEY (teacher_curator_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 S   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_teacher_curator_id_fkey";
       public               postgres    false    249    226    4847            +           2606    48060     Lessons Lessons_audience_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_audience_id_fkey" FOREIGN KEY (audience_id) REFERENCES public."Audiences"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_audience_id_fkey";
       public               postgres    false    254    4877    255            ,           2606    48035    Lessons Lessons_group_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 K   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_group_id_fkey";
       public               postgres    false    249    4871    255            -           2606    48040     Lessons Lessons_subgroup_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_subgroup_id_fkey" FOREIGN KEY (subgroup_id) REFERENCES public."Subgroups"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 N   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_subgroup_id_fkey";
       public               postgres    false    250    4873    255            .           2606    48045    Lessons Lessons_subject_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public."Subjects"(id);
 M   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_subject_id_fkey";
       public               postgres    false    232    4853    255            /           2606    48065 $   Lessons Lessons_subject_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_subject_type_id_fkey" FOREIGN KEY (subject_type_id) REFERENCES public."SubjectTypes"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_subject_type_id_fkey";
       public               postgres    false    4867    245    255            0           2606    48050 &   Lessons Lessons_teacher_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_teacher_person_id_fkey" FOREIGN KEY (teacher_person_id) REFERENCES public."Teachers"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 T   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_teacher_person_id_fkey";
       public               postgres    false    4857    236    255            1           2606    48055    Lessons Lessons_topic_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES public."Topics"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 K   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_topic_id_fkey";
       public               postgres    false    4869    255    247                       2606    38905    Pairs Pairs_week_type_name_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Pairs"
    ADD CONSTRAINT "Pairs_week_type_name_fkey" FOREIGN KEY (week_type_name) REFERENCES public."WeekTypes"(name);
 M   ALTER TABLE ONLY public."Pairs" DROP CONSTRAINT "Pairs_week_type_name_fkey";
       public               postgres    false    220    219    4837            &           2606    47969    Students Students_group_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_group_id_fkey";
       public               postgres    false    4871    252    249            '           2606    47979 '   Students Students_perent_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_perent_person_id_fkey" FOREIGN KEY (perent_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 U   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_perent_person_id_fkey";
       public               postgres    false    252    226    4847            (           2606    47964     Students Students_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_person_id_fkey" FOREIGN KEY (person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_person_id_fkey";
       public               postgres    false    252    226    4847            )           2606    47974 "   Students Students_subgroup_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_subgroup_id_fkey" FOREIGN KEY (subgroup_id) REFERENCES public."Subgroups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_subgroup_id_fkey";
       public               postgres    false    252    250    4873            $           2606    47946 !   Subgroups Subgroups_group_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Subgroups"
    ADD CONSTRAINT "Subgroups_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public."Subgroups" DROP CONSTRAINT "Subgroups_group_id_fkey";
       public               postgres    false    250    249    4871            %           2606    47951 "   Subgroups Subgroups_leader_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Subgroups"
    ADD CONSTRAINT "Subgroups_leader_id_fkey" FOREIGN KEY (leader_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 P   ALTER TABLE ONLY public."Subgroups" DROP CONSTRAINT "Subgroups_leader_id_fkey";
       public               postgres    false    4847    250    226                       2606    47719 $   Subjects Subjects_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public."Departments"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_department_id_fkey";
       public               postgres    false    4851    230    232                       2606    47743 $   Teachers Teachers_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public."Departments"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_department_id_fkey";
       public               postgres    false    230    236    4851                       2606    47738     Teachers Teachers_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_person_id_fkey" FOREIGN KEY (person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_person_id_fkey";
       public               postgres    false    236    226    4847                       2606    47748 +   Teachers Teachers_teaching_position_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_teaching_position_id_fkey" FOREIGN KEY (teaching_position_id) REFERENCES public."TeachingPositions"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_teaching_position_id_fkey";
       public               postgres    false    234    236    4855                       2606    47902    Topics Topics_subject_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Topics"
    ADD CONSTRAINT "Topics_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 K   ALTER TABLE ONLY public."Topics" DROP CONSTRAINT "Topics_subject_id_fkey";
       public               postgres    false    232    247    4853            �      x������ � �      �   �   x�}�A
�0D��)���ߤQڳx�Z
ݺ�
AQ�mz��7�W����0ü�ڒ�T*\�y��[���!�h�n|�#�0�vx`�3��z3[>��ԕ#
������&x[n��H��D�p���h��"�O�f���_X��As��Vk�P�f}      �   �   x���M�0���)�H#�,����R�%�Wxs#[\i�.'o�{�b��i��j����0�2�N,�,k�B��Wܨ�&@*�h�
#.��|�=��c�>Q↡�-U���cd>'�6)j��F��O��S�g�T�ϟ��NI%�#�X����U��)�I�Ԫ����s��쐴      �      x������ � �      �   @   x�m��	  C�s:�4Z����s���X���C��b��hv�B��]odRZ�f���F|�_���l�x�      �   K   x�}̱�0��H}�؁Y��}��t�S2�R�%펁9�/d9
����[O߂x~�US%5�y��?�A�      �   @  x�}��N�@���S�ݔ����>A�R�&jR�l�s����f��oV�J������L�hKO�H/��+����O�S��ި��T#�H�����GuK%���#�q�+�9jW����D�S�V�*B;�Y���d���_��,��K�/�Tц�x)�B���=�1@T�
���Ì6Q�,�}c�_��4M�螞�U^�zw��?�&Ӫ�f$�;�\h�n�x��x-D�j��4=�t� �h��5��
�ε>p�`D��\O{�G��	�[��+���F�qsKw���N:&�a��$3<Jy�{���&�      �   i   x�3�0���x7o��paǅ�8��LuLt��,�L��,��-M���Hqq^�4f�/6u�Dc�ea�i��������%H�+F��� WL6y      �   J  x���QN�@��wO�;��Cx#(j��䁘���TR��+�{#g����Fc�̶3�����$p��7@�-�n�5*w��}�Q�U�3N��)6�/.�@����ҬE�tf�%�dEq��J�L0��t�ܽF��n�N�_����]��ێb}E�̿6T����l*F��8_�soC��J��b���:;:�
%��x��5^��%SYJ���B��j��bA��ig��U��&k(�E�y�`��o�z�0���?�,b�9�Rju��:��9�p 5b�S��xF��x
�_��[�0d~��ƚ�攤����${���9$|      �   f   x��̹�@D�خ�a�ڻ[P!GG.�#B!��$_z�|��g�|�T)Tϫ)P�����	Lp�T�М�-Ic	�Hl��>>�6[+�����;��+�      �      x������ � �      �   �  x���Kn&��תS��� L&��x�|�c6^7��0���1��7rT��M��*�Zh�P\�Cd��%�Qtt��� �V���a�P�h����/��������}��=��`���7ߏ7������������߾~����׏����}}K!�4
�%�{����Y��J���%� Y��g2k�����L)�v��������,��(m��
6��q n�Ik�dْW�T�N��G	�t�������7	�o�Y�S5�X�S����
5����3��78/�Y�)���g�qy ���eҘ#%%�ԝ~�[�e���c��˟g�w�f9��GiK3�ȍ�N��2�3���\ʐQ��E5�r/m�B�\'.Z�:C�:�Ȃ)�2(�O���T�`�C�|S�y~5��9p��#�I<z��Ӥ$�q�YT��kZ�`\#�3Raaf&ks�io�ڂ���'F�D��>����|��%�c������ǽ�Z�L*V�ت���L��8�ظ�$��0�[�E��<�������$��3j��O!ih"C�M�4z��k�T�΋j�9�^�&�6���~t�����WƂ�$�O;��;�Q�V�C�2w�z
�$*I������E5��G���Ih���@����lq,+���~�O;�KΔl�ą�Z�8%�t\U��5��yQ�s??J[Z�F�@� ��ad��k�-U̣�����Q�\��#\��Blp��&D9mSo�78/���r��4˂?���}���j�>����y�8J[W鸛	W���L�g��G����΋j���Vi&����(Jֹ�R
��2?�B�-tt��	/oFuPJ��+i�� ��=ޠ��e=�GiI�0Fc��!)��b�=b	�[P~܃^rba��X9c�B:�-h����g��yQ��|t�6K1�������t�*�X�2g��O{P=�GG	T"�`Bz�*	ײ"k�Z�#�΋j����� g;��@��TW(cyZR(���z���W�V$��6�~x1�֚�YU�78/���2�^k�'��Ss䎄�:�}���=���ͣ����#��Fv$x;�xΡ��e��78/�y������N�W�+iW�ΦѼυ���{�+N[sX��F���B�ʔ�.���A�����U^�^�JQ�������
�TP>�B�8�7/��
��S�|�+#����<O�GikҜ��8\�Ml#ַ�pQ��@���縣�����T�H�#�i�dC�78��y.桥�1��I�;`��BRr�kY�0�� =�GGiC@�^/�`⥓��B[S���΋Z���R{J�5#MSroǱc�j;����9�(!yt��U�� q�W�U�ҡ+�΋j����C���s��|]�!&�5շ��y�;J�'�k�7s$�Y15is��֢�Rop^T�<��Ϧ�E�M,8��؄Z0,F�΂��'�����8�W��olIN]3��z.b���E5�S�Q��T���׎u�c�d;z��3"�.��|ڃ^r6Y��Md�3Wl�C�}v"���<Oq�=m)�Dv��f��1�.ea�du��.�3T�^�����)�M��S`f2J:���.t��Ҧ#)�'�WF1$<��SL5�9w5w�D�#{pk=�)������YP�:�wd���|E��fkT��µd�7�x�uÒL��y:O���SC�s���U07��[K{�<"3����<�<�u�͊��T�7`�́�iui�f�`|ڃ�<��mκ8�EE�O��@/aϠ)IM��P��E-_Q°q'{�U|������{���f���i��w��,�"6�͹�kpy�^|���78/�����=LtwP�����W���8bIʠ|ڃ�<m�m�4j�k��X�Ã:�\���\˼�yQ��w�6� x�MJ3�w�)"g������(�����k�X��'���q���AD��ev���)�(m�i۶��X      �   �  x��W�nG<�|�������%�|�����Ȱ�(�7�Fd��Jl$8ç��Ř�����?J��H�rg4D�������/��r`��2���_����Ⱦ���ؾ�/@��|��:���`��U���e�ѝ�{{|�)�̖����Ȥ0���~!�-S�=���ʟ�4��ۉ�ڏ(bD��jFva�P�Ǜ2tjTn�ɓ4�6���\�rS<-��>�bM�qd&��	DN�Ҏ"�ʎ�4)O���9�E��Å���1���0oD'{S�!�a����</D�U��=�e0�<ƽaܢ<��Ⱦ Zx�6I�R��I�C,�����9l��g�)�Q���)p�Vs��3n��9>Ĥ@�\���rW@wB�\��S���Y��
bRR���M��.OH��u��m2���Z"L"���P��e.?�zd1繒	bRS'��2�t�s�אB�.i���W�h���f��~B#L(������~YYȌ��l��!&"����C��-��1ϴ
�{�id�BZO@���vٗP��+�Ø۪!7�+�!L��ށ�.(EdK��C�h5I��<nD�1�/%h�]Q�}V��Ny��\��N��k`���
q���.ڃ���0v��(;���F�����H˰�+�)E�&"��}�TBd�Μ�8׼��Bs����@�~���1�捬�����{���n�H�l�A�&U!���4�CL�����"֛���2�����{G-E��i��@
}�)��p��òU�vT�t�V��޽�;��}����@~ǁ��!���wCg���S�a���8tQ���T���<�ιJ��ׄ�J�n�:ߗϛ��������!���M���5��3�	1�U3}��:u�Օ���u���>��k�֩|�)�S,���'����U>��Bm�xW��Z'�I�Ĵ �F��t���=��|H8�o�آ�
mx��1�&�l���_��憩-L�����zj��3��-����4��-�e�F�z)�tqr����S�z[�����;F���2 �ny� �V�������Z��v�r��i��ç��{XfQb:�:��g4ޛ+$���޷���o���?h9w�h�I�pb:�'����^3���j	EkEi
s����1�U�v��iu�H7Ϯ�P�	ӎ�Q{���Դ��c�h|G5      �   Q   x��0�bㅭ��;9-9��ؐ����T��X��\��������H��R���ׅI���f4��ix������ mS-R      �   R  x���9n�0E��)��Eu�� ���?B4Y�Ia���.���������JG��N�Eݚ���E±���-�.��>B��+�G����A�/���P)����@zG�[j�=�� �,t_��3Z����I3��t8��� �LqF��+�)J��Ć��z������5Q�c�L^��L[ٗ%`vq�؉FtJ��Sָn��0M"�s6MA;�_�̘�zU�4 ���U\1�?�0�	`�e��.���Qqi��T�3'6�-s|��� ϔ��U��`����N�y+��1�t"��3*$���$�gJL��T"_��i �� �QԐs      �   �   x�}��i1г]�ރ�%ٖ5E����c��@
$�l�e.!q:>���u�EȽ3$�Jm@aͭ+���r܎���x���_��v�9t�Q��<�DްlQ�2=E�'�4��UP��4�VD�pZ��O��hm��b,!�%�H|�:��੐b�A	T�a�d�i�����g�n��Y��"ob��l`��g��7�!��&�g��j��k��k�����C      �   u   x�3估�bÅv]l���®8��Lu��H��������\���P������@c6^�2h��d�+��I4�2����`).c��[��l���b?�f�Iq��qqq �vN�      �   �  x�}TKn�0\��о!J�,�,=��$�"E�eE��P!���0�Q��l(6ؖ!93oޣ��3,v܊�;X�(j��Yq���7y�F��|J� Y<��-ѹ/�p��=�O�n�ʵ�wbqI�h�ZUfQ�A�x��dA�t1�6	�h`�y�u�\�����WI�w��鹬E�gJU�E�����otx�	�M�آKx���}s߽aw�^��-�N/HM��Zh}�7�d-��t���&S�$�w���z�6����̔�$�)tbۅ�W\^UK'G>|a|L�Z���W�9	~��'��J��Y��*���Z��|cm�]S՗�Os�R��flĕ��,���k"��J�Uuu���~��،I�K�n�<{G�u��a.�VeYG�!�s����׆t^o�4O9pd�!�uh�hF0�)Ӥ�*��a��JJ�|>�w      �   �   x�}�K�0�p�� >�Ɯ��?G��j]�Vb7o��AY}�o�)��Bnlv�~���L�SA8@G�+';���0@�ߔ���#����%�H��W��`���:F6�l=٨��T��Yb��Ò>)f�j� �"> �eQ�      �   �   x���Kj�0�ךSd_"4zԏ��0�J�tQ�2�&Đ���ύ*l��l�Ч��Ol�e%+��Y��Mje�K��,LQ�P���_�{��Ya'Ut��pD���y������1��>�!b����F*��	��'V��Ezń���:yO�ǧ��\*~�������T��t�n�qP��Ze-_��/1u3\�58'��ަ��7MD��4      �   :   x�3����+��4�4202�5 "##+#+C=ccCmcL)c3=#s3�W� �KM      �   V   x��0��֋[/���_���[/l���9��Lu�u�-��̬L�-ʹ��Hq]�{aǅměg��<�W� g�:"     