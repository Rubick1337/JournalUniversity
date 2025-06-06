PGDMP       6                 }            dbTj    17.0    17.0 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    38851    dbTj    DATABASE     z   CREATE DATABASE "dbTj" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
    DROP DATABASE "dbTj";
                     postgres    false            �            1255    39107    get_academic_specialties_json()    FUNCTION       CREATE FUNCTION public.get_academic_specialties_json() RETURNS TABLE(json_data json)
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
       public               postgres    false                       1255    39129 0   get_academic_specialty_data_for_curriculum(uuid)    FUNCTION     �  CREATE FUNCTION public.get_academic_specialty_data_for_curriculum(p_curriculum_id uuid) RETURNS json
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
       public               postgres    false                       1255    39059 !   get_active_curriculum_id(integer)    FUNCTION     p  CREATE FUNCTION public.get_active_curriculum_id(p_year integer) RETURNS uuid
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
       public               postgres    false                       1255    39132     get_all_faculty_with_full_data()    FUNCTION     �  CREATE FUNCTION public.get_all_faculty_with_full_data() RETURNS json
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
       public               postgres    false                       1255    39432 �   get_all_person_full_data(integer, integer, character varying, character varying, character varying, character varying, character varying, character varying, character varying)    FUNCTION     �  CREATE FUNCTION public.get_all_person_full_data(p_limit integer DEFAULT 10, p_page integer DEFAULT 1, p_sort_by character varying DEFAULT 'id'::character varying, p_sort_order character varying DEFAULT 'ASC'::character varying, p_surname_query character varying DEFAULT NULL::character varying, p_name_query character varying DEFAULT NULL::character varying, p_middlename_query character varying DEFAULT NULL::character varying, p_phone_number_query character varying DEFAULT NULL::character varying, p_email_query character varying DEFAULT NULL::character varying) RETURNS json
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
       public               postgres    false                       1255    39042    get_current_semester(integer)    FUNCTION     5  CREATE FUNCTION public.get_current_semester(start_year integer) RETURNS integer
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
       public               postgres    false                       1255    39060    get_curriculum_for_group(uuid)    FUNCTION     �  CREATE FUNCTION public.get_curriculum_for_group(p_group_id uuid) RETURNS uuid
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
       public               postgres    false                       1255    39429 )   get_department_by_id_with_full_data(uuid)    FUNCTION     �  CREATE FUNCTION public.get_department_by_id_with_full_data(p_department_id uuid) RETURNS json
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
       public               postgres    false                       1255    39134 )   get_department_by_id_with_name_data(uuid)    FUNCTION     E  CREATE FUNCTION public.get_department_by_id_with_name_data(p_department_id uuid) RETURNS json
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
       public               postgres    false                       1255    39133 &   get_faculty_by_id_with_full_data(uuid)    FUNCTION       CREATE FUNCTION public.get_faculty_by_id_with_full_data(faculty_id uuid) RETURNS json
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
       public               postgres    false                       1255    39043     get_group_current_semester(uuid)    FUNCTION     �  CREATE FUNCTION public.get_group_current_semester(p_group_id uuid) RETURNS integer
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
       public               postgres    false            �            1255    39015    get_group_name(uuid)    FUNCTION     `  CREATE FUNCTION public.get_group_name(group_id uuid) RETURNS json
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
       public               postgres    false            	           1255    39131     get_json_fio_for_person_id(uuid)    FUNCTION     #  CREATE FUNCTION public.get_json_fio_for_person_id(p_person_id uuid) RETURNS json
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
       public               postgres    false                       1255    39431 %   get_json_person_full_data_by_id(uuid)    FUNCTION     a  CREATE FUNCTION public.get_json_person_full_data_by_id(p_person_id uuid) RETURNS json
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
       public               postgres    false            �            1255    39022    get_student_full_name(integer)    FUNCTION       CREATE FUNCTION public.get_student_full_name(p_student_id integer) RETURNS json
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
       public               postgres    false            �            1255    39018    get_student_full_name(uuid)    FUNCTION     �  CREATE FUNCTION public.get_student_full_name(student_uuid uuid) RETURNS json
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
       public               postgres    false            �            1255    39023 +   get_students_full_name_by_subgroup_id(uuid)    FUNCTION       CREATE FUNCTION public.get_students_full_name_by_subgroup_id(p_subgroup_id uuid) RETURNS json
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
       public               postgres    false            �            1255    39017    get_subgroups_by_group_id(uuid)    FUNCTION     �  CREATE FUNCTION public.get_subgroups_by_group_id(input_group_id uuid) RETURNS json
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
       public               postgres    false                       1255    39135 &   get_subject_by_id_with_full_data(uuid)    FUNCTION     W  CREATE FUNCTION public.get_subject_by_id_with_full_data(p_subject_id uuid) RETURNS json
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
       public               postgres    false                       1255    39430 !   get_teacher_full_data_by_id(uuid)    FUNCTION     �  CREATE FUNCTION public.get_teacher_full_data_by_id(p_teacher_id uuid) RETURNS json
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
       public               postgres    false    228            �           0    0    AcademicBuildings_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public."AcademicBuildings_id_seq" OWNED BY public."AcademicBuildings".id;
          public               postgres    false    227            �            1259    38927    AcademicSpecialties    TABLE     �   CREATE TABLE public."AcademicSpecialties" (
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
       public               postgres    false    247            �           0    0    AssessmentTypes_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public."AssessmentTypes_id_seq" OWNED BY public."AssessmentTypes".id;
          public               postgres    false    246            �            1259    39117 	   Audiences    TABLE     9  CREATE TABLE public."Audiences" (
    id uuid NOT NULL,
    number integer NOT NULL,
    capacity integer NOT NULL,
    academic_building_id integer NOT NULL,
    description character varying(1026) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Audiences";
       public         heap r       postgres    false            �            1259    47784    CurriculumSubjects    TABLE     k  CREATE TABLE public."CurriculumSubjects" (
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
       public               postgres    false    245            �           0    0    Curriculums_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."Curriculums_id_seq" OWNED BY public."Curriculums".id;
          public               postgres    false    244            �            1259    47689    Departments    TABLE     p  CREATE TABLE public."Departments" (
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
       public               postgres    false    235            �           0    0    Departments_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."Departments_id_seq" OWNED BY public."Departments".id;
          public               postgres    false    234            �            1259    47754    EducationForms    TABLE     �   CREATE TABLE public."EducationForms" (
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
       public               postgres    false    243            �           0    0    EducationForms_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public."EducationForms_id_seq" OWNED BY public."EducationForms".id;
          public               postgres    false    242            �            1259    47644 	   Faculties    TABLE       CREATE TABLE public."Faculties" (
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
       public               postgres    false    233            �           0    0    Faculties_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Faculties_id_seq" OWNED BY public."Faculties".id;
          public               postgres    false    232            �            1259    38934    Groups    TABLE     �  CREATE TABLE public."Groups" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    graduation_year integer NOT NULL,
    year_of_beginning_of_study integer NOT NULL,
    faculty_id uuid NOT NULL,
    class_representative_person_id uuid,
    department_id uuid NOT NULL,
    specialty_code character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Groups";
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
       public               postgres    false    231            �           0    0    People_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."People_id_seq" OWNED BY public."People".id;
          public               postgres    false    230            �            1259    39037    SemesterTypes    TABLE     <  CREATE TABLE public."SemesterTypes" (
    name character varying(255) NOT NULL,
    "startMonth" integer NOT NULL,
    "startDay" integer NOT NULL,
    "endMonth" integer NOT NULL,
    "endDay" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 #   DROP TABLE public."SemesterTypes";
       public         heap r       postgres    false            �            1259    38988    Students    TABLE     E  CREATE TABLE public."Students" (
    id integer NOT NULL,
    count_reprimand integer DEFAULT 0 NOT NULL,
    person_id uuid NOT NULL,
    group_id uuid NOT NULL,
    subgroup_id uuid NOT NULL,
    perent_person_id uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Students";
       public         heap r       postgres    false            �            1259    38987    Students_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Students_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Students_id_seq";
       public               postgres    false    225            �           0    0    Students_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Students_id_seq" OWNED BY public."Students".id;
          public               postgres    false    224            �            1259    38961 	   Subgroups    TABLE     �   CREATE TABLE public."Subgroups" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    group_id uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Subgroups";
       public         heap r       postgres    false            �            1259    47713    Subjects    TABLE     �   CREATE TABLE public."Subjects" (
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
       public               postgres    false    237            �           0    0    Subjects_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Subjects_id_seq" OWNED BY public."Subjects".id;
          public               postgres    false    236            �            1259    47732    Teachers    TABLE       CREATE TABLE public."Teachers" (
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
       public               postgres    false    241            �           0    0    Teachers_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Teachers_id_seq" OWNED BY public."Teachers".id;
          public               postgres    false    240            �            1259    47725    TeachingPositions    TABLE     �   CREATE TABLE public."TeachingPositions" (
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
       public               postgres    false    239            �           0    0    TeachingPositions_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public."TeachingPositions_id_seq" OWNED BY public."TeachingPositions".id;
          public               postgres    false    238            �            1259    38876 	   WeekTypes    TABLE     �   CREATE TABLE public."WeekTypes" (
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."WeekTypes";
       public         heap r       postgres    false            �           2604    39112    AcademicBuildings id    DEFAULT     �   ALTER TABLE ONLY public."AcademicBuildings" ALTER COLUMN id SET DEFAULT nextval('public."AcademicBuildings_id_seq"'::regclass);
 E   ALTER TABLE public."AcademicBuildings" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    228    227    228            �           2604    47781    AssessmentTypes id    DEFAULT     |   ALTER TABLE ONLY public."AssessmentTypes" ALTER COLUMN id SET DEFAULT nextval('public."AssessmentTypes_id_seq"'::regclass);
 C   ALTER TABLE public."AssessmentTypes" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    246    247    247            �           2604    47764    Curriculums id    DEFAULT     t   ALTER TABLE ONLY public."Curriculums" ALTER COLUMN id SET DEFAULT nextval('public."Curriculums_id_seq"'::regclass);
 ?   ALTER TABLE public."Curriculums" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    245    244    245            �           2604    47692    Departments id    DEFAULT     t   ALTER TABLE ONLY public."Departments" ALTER COLUMN id SET DEFAULT nextval('public."Departments_id_seq"'::regclass);
 ?   ALTER TABLE public."Departments" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    234    235    235            �           2604    47757    EducationForms id    DEFAULT     z   ALTER TABLE ONLY public."EducationForms" ALTER COLUMN id SET DEFAULT nextval('public."EducationForms_id_seq"'::regclass);
 B   ALTER TABLE public."EducationForms" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    243    242    243            �           2604    47647    Faculties id    DEFAULT     p   ALTER TABLE ONLY public."Faculties" ALTER COLUMN id SET DEFAULT nextval('public."Faculties_id_seq"'::regclass);
 =   ALTER TABLE public."Faculties" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    232    233    233            �           2604    39455 	   People id    DEFAULT     j   ALTER TABLE ONLY public."People" ALTER COLUMN id SET DEFAULT nextval('public."People_id_seq"'::regclass);
 :   ALTER TABLE public."People" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    230    231    231            �           2604    38991    Students id    DEFAULT     n   ALTER TABLE ONLY public."Students" ALTER COLUMN id SET DEFAULT nextval('public."Students_id_seq"'::regclass);
 <   ALTER TABLE public."Students" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    225    225            �           2604    47716    Subjects id    DEFAULT     n   ALTER TABLE ONLY public."Subjects" ALTER COLUMN id SET DEFAULT nextval('public."Subjects_id_seq"'::regclass);
 <   ALTER TABLE public."Subjects" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    237    236    237            �           2604    47735    Teachers id    DEFAULT     n   ALTER TABLE ONLY public."Teachers" ALTER COLUMN id SET DEFAULT nextval('public."Teachers_id_seq"'::regclass);
 <   ALTER TABLE public."Teachers" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    241    240    241            �           2604    47728    TeachingPositions id    DEFAULT     �   ALTER TABLE ONLY public."TeachingPositions" ALTER COLUMN id SET DEFAULT nextval('public."TeachingPositions_id_seq"'::regclass);
 E   ALTER TABLE public."TeachingPositions" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    238    239    239            �          0    39109    AcademicBuildings 
   TABLE DATA           Z   COPY public."AcademicBuildings" (id, name, address, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    228   ��       �          0    38927    AcademicSpecialties 
   TABLE DATA           U   COPY public."AcademicSpecialties" (code, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    221   ��       �          0    47778    AssessmentTypes 
   TABLE DATA           O   COPY public."AssessmentTypes" (id, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    247   ��       �          0    39117 	   Audiences 
   TABLE DATA           x   COPY public."Audiences" (id, number, capacity, academic_building_id, description, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    229   i�       �          0    47784    CurriculumSubjects 
   TABLE DATA           �   COPY public."CurriculumSubjects" (curriculum_id, subject_id, assessment_type_id, semester, all_hours, lecture_hours, lab_hours, practice_hours) FROM stdin;
    public               postgres    false    248   ��       �          0    47761    Curriculums 
   TABLE DATA           �   COPY public."Curriculums" (id, year_of_specialty_training, specialty_code, education_form_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    245   ��       �          0    47689    Departments 
   TABLE DATA           �   COPY public."Departments" (id, name, full_name, chairperson_of_the_department_person_id, faculty_id, "createdAt", "updatedAt", head_person_id) FROM stdin;
    public               postgres    false    235   ��       �          0    47754    EducationForms 
   TABLE DATA           N   COPY public."EducationForms" (id, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    243   ��       �          0    47644 	   Faculties 
   TABLE DATA           d   COPY public."Faculties" (id, name, full_name, dean_person_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    233          �          0    38934    Groups 
   TABLE DATA           �   COPY public."Groups" (id, name, graduation_year, year_of_beginning_of_study, faculty_id, class_representative_person_id, department_id, specialty_code, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    222   %      �          0    38898    Pairs 
   TABLE DATA           �   COPY public."Pairs" (id, weekday_number, name, start, "end", break_start, break_end, week_type_name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    220   �      �          0    39452    People 
   TABLE DATA           p   COPY public."People" (id, surname, name, middlename, phone_number, email, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    231   �	      �          0    39037    SemesterTypes 
   TABLE DATA           y   COPY public."SemesterTypes" (name, "startMonth", "startDay", "endMonth", "endDay", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    226   �
      �          0    38988    Students 
   TABLE DATA           �   COPY public."Students" (id, count_reprimand, person_id, group_id, subgroup_id, perent_person_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    225   �
      �          0    38961 	   Subgroups 
   TABLE DATA           S   COPY public."Subgroups" (id, name, group_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    223   q      �          0    47713    Subjects 
   TABLE DATA           W   COPY public."Subjects" (id, name, department_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    237   $      �          0    47732    Teachers 
   TABLE DATA           r   COPY public."Teachers" (id, person_id, department_id, teaching_position_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    241   z      �          0    47725    TeachingPositions 
   TABLE DATA           Q   COPY public."TeachingPositions" (id, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    239   �      �          0    38876 	   WeekTypes 
   TABLE DATA           E   COPY public."WeekTypes" (name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    219   u      �           0    0    AcademicBuildings_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public."AcademicBuildings_id_seq"', 1, false);
          public               postgres    false    227            �           0    0    AssessmentTypes_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."AssessmentTypes_id_seq"', 6, true);
          public               postgres    false    246            �           0    0    Curriculums_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."Curriculums_id_seq"', 3, true);
          public               postgres    false    244            �           0    0    Departments_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."Departments_id_seq"', 6, true);
          public               postgres    false    234            �           0    0    EducationForms_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."EducationForms_id_seq"', 3, true);
          public               postgres    false    242            �           0    0    Faculties_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Faculties_id_seq"', 7, true);
          public               postgres    false    232            �           0    0    People_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."People_id_seq"', 3, true);
          public               postgres    false    230            �           0    0    Students_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Students_id_seq"', 1, true);
          public               postgres    false    224            �           0    0    Subjects_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Subjects_id_seq"', 2, true);
          public               postgres    false    236            �           0    0    Teachers_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Teachers_id_seq"', 3, true);
          public               postgres    false    240            �           0    0    TeachingPositions_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public."TeachingPositions_id_seq"', 8, true);
          public               postgres    false    238            �           2606    39116 (   AcademicBuildings AcademicBuildings_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public."AcademicBuildings"
    ADD CONSTRAINT "AcademicBuildings_pkey" PRIMARY KEY (id);
 V   ALTER TABLE ONLY public."AcademicBuildings" DROP CONSTRAINT "AcademicBuildings_pkey";
       public                 postgres    false    228            �           2606    38933 ,   AcademicSpecialties AcademicSpecialties_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public."AcademicSpecialties"
    ADD CONSTRAINT "AcademicSpecialties_pkey" PRIMARY KEY (code);
 Z   ALTER TABLE ONLY public."AcademicSpecialties" DROP CONSTRAINT "AcademicSpecialties_pkey";
       public                 postgres    false    221            �           2606    47783 $   AssessmentTypes AssessmentTypes_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public."AssessmentTypes"
    ADD CONSTRAINT "AssessmentTypes_pkey" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."AssessmentTypes" DROP CONSTRAINT "AssessmentTypes_pkey";
       public                 postgres    false    247            �           2606    39123    Audiences Audiences_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Audiences"
    ADD CONSTRAINT "Audiences_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Audiences" DROP CONSTRAINT "Audiences_pkey";
       public                 postgres    false    229            �           2606    47794 B   CurriculumSubjects CurriculumSubjects_curriculum_id_subject_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public."CurriculumSubjects"
    ADD CONSTRAINT "CurriculumSubjects_curriculum_id_subject_id_key" UNIQUE (curriculum_id, subject_id);
 p   ALTER TABLE ONLY public."CurriculumSubjects" DROP CONSTRAINT "CurriculumSubjects_curriculum_id_subject_id_key";
       public                 postgres    false    248    248            �           2606    47792 *   CurriculumSubjects CurriculumSubjects_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."CurriculumSubjects"
    ADD CONSTRAINT "CurriculumSubjects_pkey" PRIMARY KEY (curriculum_id, subject_id, assessment_type_id, semester);
 X   ALTER TABLE ONLY public."CurriculumSubjects" DROP CONSTRAINT "CurriculumSubjects_pkey";
       public                 postgres    false    248    248    248    248            �           2606    47766    Curriculums Curriculums_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Curriculums"
    ADD CONSTRAINT "Curriculums_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."Curriculums" DROP CONSTRAINT "Curriculums_pkey";
       public                 postgres    false    245            �           2606    47696    Departments Departments_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_pkey";
       public                 postgres    false    235            �           2606    47759 "   EducationForms EducationForms_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."EducationForms"
    ADD CONSTRAINT "EducationForms_pkey" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public."EducationForms" DROP CONSTRAINT "EducationForms_pkey";
       public                 postgres    false    243            �           2606    47651    Faculties Faculties_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Faculties"
    ADD CONSTRAINT "Faculties_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Faculties" DROP CONSTRAINT "Faculties_pkey";
       public                 postgres    false    233            �           2606    38940    Groups Groups_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_pkey";
       public                 postgres    false    222            �           2606    38904    Pairs Pairs_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Pairs"
    ADD CONSTRAINT "Pairs_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Pairs" DROP CONSTRAINT "Pairs_pkey";
       public                 postgres    false    220            �           2606    39459    People People_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."People"
    ADD CONSTRAINT "People_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."People" DROP CONSTRAINT "People_pkey";
       public                 postgres    false    231            �           2606    39041     SemesterTypes SemesterTypes_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."SemesterTypes"
    ADD CONSTRAINT "SemesterTypes_pkey" PRIMARY KEY (name);
 N   ALTER TABLE ONLY public."SemesterTypes" DROP CONSTRAINT "SemesterTypes_pkey";
       public                 postgres    false    226            �           2606    38994    Students Students_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_pkey";
       public                 postgres    false    225            �           2606    38965    Subgroups Subgroups_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Subgroups"
    ADD CONSTRAINT "Subgroups_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Subgroups" DROP CONSTRAINT "Subgroups_pkey";
       public                 postgres    false    223            �           2606    47718    Subjects Subjects_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_pkey";
       public                 postgres    false    237            �           2606    47737    Teachers Teachers_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_pkey";
       public                 postgres    false    241            �           2606    47730 (   TeachingPositions TeachingPositions_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public."TeachingPositions"
    ADD CONSTRAINT "TeachingPositions_pkey" PRIMARY KEY (id);
 V   ALTER TABLE ONLY public."TeachingPositions" DROP CONSTRAINT "TeachingPositions_pkey";
       public                 postgres    false    239            �           2606    38880    WeekTypes WeekTypes_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."WeekTypes"
    ADD CONSTRAINT "WeekTypes_pkey" PRIMARY KEY (name);
 F   ALTER TABLE ONLY public."WeekTypes" DROP CONSTRAINT "WeekTypes_pkey";
       public                 postgres    false    219            �           2606    39124 -   Audiences Audiences_academic_building_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Audiences"
    ADD CONSTRAINT "Audiences_academic_building_id_fkey" FOREIGN KEY (academic_building_id) REFERENCES public."AcademicBuildings"(id);
 [   ALTER TABLE ONLY public."Audiences" DROP CONSTRAINT "Audiences_academic_building_id_fkey";
       public               postgres    false    229    228    4830                       2606    47805 =   CurriculumSubjects CurriculumSubjects_assessment_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CurriculumSubjects"
    ADD CONSTRAINT "CurriculumSubjects_assessment_type_id_fkey" FOREIGN KEY (assessment_type_id) REFERENCES public."AssessmentTypes"(id) ON UPDATE CASCADE;
 k   ALTER TABLE ONLY public."CurriculumSubjects" DROP CONSTRAINT "CurriculumSubjects_assessment_type_id_fkey";
       public               postgres    false    248    4850    247                       2606    47795 8   CurriculumSubjects CurriculumSubjects_curriculum_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CurriculumSubjects"
    ADD CONSTRAINT "CurriculumSubjects_curriculum_id_fkey" FOREIGN KEY (curriculum_id) REFERENCES public."Curriculums"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 f   ALTER TABLE ONLY public."CurriculumSubjects" DROP CONSTRAINT "CurriculumSubjects_curriculum_id_fkey";
       public               postgres    false    245    4848    248            	           2606    47800 5   CurriculumSubjects CurriculumSubjects_subject_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CurriculumSubjects"
    ADD CONSTRAINT "CurriculumSubjects_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 c   ALTER TABLE ONLY public."CurriculumSubjects" DROP CONSTRAINT "CurriculumSubjects_subject_id_fkey";
       public               postgres    false    237    4840    248                       2606    47772 .   Curriculums Curriculums_education_form_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Curriculums"
    ADD CONSTRAINT "Curriculums_education_form_id_fkey" FOREIGN KEY (education_form_id) REFERENCES public."EducationForms"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 \   ALTER TABLE ONLY public."Curriculums" DROP CONSTRAINT "Curriculums_education_form_id_fkey";
       public               postgres    false    245    243    4846                       2606    47767 +   Curriculums Curriculums_specialty_code_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Curriculums"
    ADD CONSTRAINT "Curriculums_specialty_code_fkey" FOREIGN KEY (specialty_code) REFERENCES public."AcademicSpecialties"(code) ON UPDATE CASCADE ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public."Curriculums" DROP CONSTRAINT "Curriculums_specialty_code_fkey";
       public               postgres    false    4820    221    245            �           2606    47697 D   Departments Departments_chairperson_of_the_department_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_chairperson_of_the_department_person_id_fkey" FOREIGN KEY (chairperson_of_the_department_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 r   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_chairperson_of_the_department_person_id_fkey";
       public               postgres    false    235    231    4834            �           2606    47702 '   Departments Departments_faculty_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_faculty_id_fkey" FOREIGN KEY (faculty_id) REFERENCES public."Faculties"(id) ON UPDATE CASCADE;
 U   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_faculty_id_fkey";
       public               postgres    false    233    4836    235                        2606    47707 +   Departments Departments_head_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_head_person_id_fkey" FOREIGN KEY (head_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 Y   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_head_person_id_fkey";
       public               postgres    false    4834    235    231            �           2606    47652 '   Faculties Faculties_dean_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Faculties"
    ADD CONSTRAINT "Faculties_dean_person_id_fkey" FOREIGN KEY (dean_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 U   ALTER TABLE ONLY public."Faculties" DROP CONSTRAINT "Faculties_dean_person_id_fkey";
       public               postgres    false    233    4834    231            �           2606    38956 !   Groups Groups_specialty_code_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_specialty_code_fkey" FOREIGN KEY (specialty_code) REFERENCES public."AcademicSpecialties"(code) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_specialty_code_fkey";
       public               postgres    false    222    4820    221            �           2606    38905    Pairs Pairs_week_type_name_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Pairs"
    ADD CONSTRAINT "Pairs_week_type_name_fkey" FOREIGN KEY (week_type_name) REFERENCES public."WeekTypes"(name);
 M   ALTER TABLE ONLY public."Pairs" DROP CONSTRAINT "Pairs_week_type_name_fkey";
       public               postgres    false    219    220    4816            �           2606    39000    Students Students_group_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_group_id_fkey";
       public               postgres    false    225    4822    222            �           2606    39005 "   Students Students_subgroup_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_subgroup_id_fkey" FOREIGN KEY (subgroup_id) REFERENCES public."Subgroups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_subgroup_id_fkey";
       public               postgres    false    225    4824    223            �           2606    38966 !   Subgroups Subgroups_group_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Subgroups"
    ADD CONSTRAINT "Subgroups_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public."Subgroups" DROP CONSTRAINT "Subgroups_group_id_fkey";
       public               postgres    false    222    4822    223                       2606    47719 $   Subjects Subjects_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public."Departments"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_department_id_fkey";
       public               postgres    false    237    4838    235                       2606    47743 $   Teachers Teachers_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public."Departments"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_department_id_fkey";
       public               postgres    false    241    235    4838                       2606    47738     Teachers Teachers_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_person_id_fkey" FOREIGN KEY (person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_person_id_fkey";
       public               postgres    false    241    231    4834                       2606    47748 +   Teachers Teachers_teaching_position_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_teaching_position_id_fkey" FOREIGN KEY (teaching_position_id) REFERENCES public."TeachingPositions"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_teaching_position_id_fkey";
       public               postgres    false    239    241    4842            �      x������ � �      �   �   x���MN�@���)��*#{~B2[��ô�E�*v�B*�h�3<ߨNZ�"Zl,y���7�ڒ��^1���D�V����֠3x�F���
;�kl��g:�1c+��L�#���Q����|����r:���Ǉ�Vc�'���T�f��p�o�������ڟ����
�c/��/�ƹ9�hc�Ψk�7��_,ǆ�(q���[�X�x?�7x�nv^���1�'[����(����{a�<? �`��      �   �   x���A
�0EיSd/-i�`�Y<L�E"^%�A-�^�ύL�]~����|;^�V���H�Z�n����^��"-����/ߙ*�H�j�<�$]����;̸�uS�G<������;�x��st�S� gm�ֈ�~[�ep:\0s������nJ"� ���      �      x������ � �      �      x������ � �      �   K   x�}̱�0��H}�؁Y��}��t�S2�R�%펁9�/d9
����[O߂x~�US%5�y��?�A�      �   �   x���1�0��99E�
�v��� S;��޿��*�[~����|�����,�L�L!F�e`����� �;�+e����z):���I��:��$0��!��&J��l�����/fxhj�G�y����N� �k�N�@���n      �   i   x�3�0���x7o��paǅ�8��LuLt��,�L��,��-M���Hqq^�4f�/6u�Dc�ea�i��������%H�+F��� WL6y      �     x���=N�@��Sl9��Q��0�!���)�8�E�,��+��3K�FBi��}��f�&;�ᨏ3�щv�#~ƀQ_���X�I��\�<���9�d󼜻t�ųI�^��l�Wi���o����|�?ɏWAfQ�ޢ�`�Z��I��x͕l9
U��3?��[��Pf�׃�I��Gn�ٶL�X�(7x����7��ǗѠ�#�/����-�R����-�]{�
�Z����w�Yޢ唈�	3j      �   �   x�}���0c�
r�=����rT��oK�1БJ�P l�;w�Z�9��a��AUبq:�7X����/� �b�l�k!��IY@��d����!�a����X�ɽ1�L��`�w�I@��&��3!�`��(O\K������u�1~ ��3#      �   �  x���Kn&��תS��� L&��x�|�c6^7��0���1��7rT��M��*�Zh�P\�Cd��%�Qtt��� �V���a�P�h����/��������}��=��`���7ߏ7������������߾~����׏����}}K!�4
�%�{����Y��J���%� Y��g2k�����L)�v��������,��(m��
6��q n�Ik�dْW�T�N��G	�t�������7	�o�Y�S5�X�S����
5����3��78/�Y�)���g�qy ���eҘ#%%�ԝ~�[�e���c��˟g�w�f9��GiK3�ȍ�N��2�3���\ʐQ��E5�r/m�B�\'.Z�:C�:�Ȃ)�2(�O���T�`�C�|S�y~5��9p��#�I<z��Ӥ$�q�YT��kZ�`\#�3Raaf&ks�io�ڂ���'F�D��>����|��%�c������ǽ�Z�L*V�ت���L��8�ظ�$��0�[�E��<�������$��3j��O!ih"C�M�4z��k�T�΋j�9�^�&�6���~t�����WƂ�$�O;��;�Q�V�C�2w�z
�$*I������E5��G���Ih���@����lq,+���~�O;�KΔl�ą�Z�8%�t\U��5��yQ�s??J[Z�F�@� ��ad��k�-U̣�����Q�\��#\��Blp��&D9mSo�78/���r��4˂?���}���j�>����y�8J[W鸛	W���L�g��G����΋j���Vi&����(Jֹ�R
��2?�B�-tt��	/oFuPJ��+i�� ��=ޠ��e=�GiI�0Fc��!)��b�=b	�[P~܃^rba��X9c�B:�-h����g��yQ��|t�6K1�������t�*�X�2g��O{P=�GG	T"�`Bz�*	ײ"k�Z�#�΋j����� g;��@��TW(cyZR(���z���W�V$��6�~x1�֚�YU�78/���2�^k�'��Ss䎄�:�}���=���ͣ����#��Fv$x;�xΡ��e��78/�y������N�W�+iW�ΦѼυ���{�+N[sX��F���B�ʔ�.���A�����U^�^�JQ�������
�TP>�B�8�7/��
��S�|�+#����<O�GikҜ��8\�Ml#ַ�pQ��@���縣�����T�H�#�i�dC�78��y.桥�1��I�;`��BRr�kY�0�� =�GGiC@�^/�`⥓��B[S���΋Z���R{J�5#MSroǱc�j;����9�(!yt��U�� q�W�U�ҡ+�΋j����C���s��|]�!&�5շ��y�;J�'�k�7s$�Y15is��֢�Rop^T�<��Ϧ�E�M,8��؄Z0,F�΂��'�����8�W��olIN]3��z.b���E5�S�Q��T���׎u�c�d;z��3"�.��|ڃ^r6Y��Md�3Wl�C�}v"���<Oq�=m)�Dv��f��1�.ea�du��.�3T�^�����)�M��S`f2J:���.t��Ҧ#)�'�WF1$<��SL5�9w5w�D�#{pk=�)������YP�:�wd���|E��fkT��µd�7�x�uÒL��y:O���SC�s���U07��[K{�<"3����<�<�u�͊��T�7`�́�iui�f�`|ڃ�<��mκ8�EE�O��@/aϠ)IM��P��E-_Q°q'{�U|������{���f���i��w��,�"6�͹�kpy�^|���78/�����=LtwP�����W���8bIʠ|ڃ�<m�m�4j�k��X�Ã:�\���\˼�yQ��w�6� x�MJ3�w�)"g������(�����k�X��'���q���AD��ev���)�(m�i۶��X      �   �   x�}�;
�@��?���}d�&���y�4��B$�X�,�D�,�����`�0{#7"v3��	�ޮm�;.�J�w}N�������Pܧd4zi:���t0I�lA�K��~K��"-#�W��՟ɓ����P�-
�9
TN�\�6g<qs*�GC-C�u�~	&�!F��Mĕ㳶�jx�<�{�e�      �   Q   x��0�bㅭ��;9-9��ؐ����T��X��\��������H��R���ׅI���f4��ix������ mS-R      �   }   x�}���0ѳTE�<�v�����K�+�^�rAa�K$e�I��4��%=ԭ�Pɍ�'��;����6��T�"�X�N�����cڈL�:�@:��#|��7�F�/���Vk��j)      �   �   x���1�0E��ݑ+'vb�gaq��H\	f�Bz#�"!&����'����b����+(�	��X��Z�������_��7�+��@`�an%�5�1�l�.bL�����%�,��	�7�՚������v��6�U8��VBs�_i���H���}R���o��W�      �   F   x�3�,I-.�pqq5�4�4202�50�52R04�2��21�334�60F�22�21�312Jq��qqq ��f      �   J   x�}˻�0��:��Ų��<����D]���͟������b/���O4\��ga��V��q�CE��$�      �   �   x���1
! k���d]Wsڥ���b��;P����)��0�hq��3��gAHvB��H4�} �fK'4�����.5�Q��[�i���e������SO�}�!�⺕��X���,��Y"���b7���k���� /�sY�      �   V   x��0��֋[/���_���[/l���9��Lu�u�-��̬L�-ʹ��Hq]�{aǅměg��<�W� g�:"     