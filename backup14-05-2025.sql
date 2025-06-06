PGDMP      5                }            dbTj    17.0    17.0 �                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            !           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            "           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            #           1262    48070    dbTj    DATABASE     z   CREATE DATABASE "dbTj" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
    DROP DATABASE "dbTj";
                     postgres    false                       1255    48071    get_academic_specialties_json()    FUNCTION       CREATE FUNCTION public.get_academic_specialties_json() RETURNS TABLE(json_data json)
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
       public               postgres    false                       1255    48072 0   get_academic_specialty_data_for_curriculum(uuid)    FUNCTION     �  CREATE FUNCTION public.get_academic_specialty_data_for_curriculum(p_curriculum_id uuid) RETURNS json
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
       public               postgres    false            	           1255    48073 !   get_active_curriculum_id(integer)    FUNCTION     p  CREATE FUNCTION public.get_active_curriculum_id(p_year integer) RETURNS uuid
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
       public               postgres    false                       1255    48074     get_all_faculty_with_full_data()    FUNCTION     �  CREATE FUNCTION public.get_all_faculty_with_full_data() RETURNS json
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
       public               postgres    false                       1255    48075 �   get_all_person_full_data(integer, integer, character varying, character varying, character varying, character varying, character varying, character varying, character varying)    FUNCTION     �  CREATE FUNCTION public.get_all_person_full_data(p_limit integer DEFAULT 10, p_page integer DEFAULT 1, p_sort_by character varying DEFAULT 'id'::character varying, p_sort_order character varying DEFAULT 'ASC'::character varying, p_surname_query character varying DEFAULT NULL::character varying, p_name_query character varying DEFAULT NULL::character varying, p_middlename_query character varying DEFAULT NULL::character varying, p_phone_number_query character varying DEFAULT NULL::character varying, p_email_query character varying DEFAULT NULL::character varying) RETURNS json
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
       public               postgres    false                       1255    48076    get_current_semester(integer)    FUNCTION     5  CREATE FUNCTION public.get_current_semester(start_year integer) RETURNS integer
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
       public               postgres    false                        1255    48077    get_curriculum_for_group(uuid)    FUNCTION     �  CREATE FUNCTION public.get_curriculum_for_group(p_group_id uuid) RETURNS uuid
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
       public               postgres    false            !           1255    48078 )   get_department_by_id_with_full_data(uuid)    FUNCTION     �  CREATE FUNCTION public.get_department_by_id_with_full_data(p_department_id uuid) RETURNS json
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
       public               postgres    false            "           1255    48079 )   get_department_by_id_with_name_data(uuid)    FUNCTION     E  CREATE FUNCTION public.get_department_by_id_with_name_data(p_department_id uuid) RETURNS json
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
       public               postgres    false                       1255    48080 &   get_faculty_by_id_with_full_data(uuid)    FUNCTION       CREATE FUNCTION public.get_faculty_by_id_with_full_data(faculty_id uuid) RETURNS json
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
       public               postgres    false                       1255    48081     get_group_current_semester(uuid)    FUNCTION     �  CREATE FUNCTION public.get_group_current_semester(p_group_id uuid) RETURNS integer
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
       public               postgres    false                       1255    48082    get_group_name(uuid)    FUNCTION     `  CREATE FUNCTION public.get_group_name(group_id uuid) RETURNS json
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
       public               postgres    false                       1255    48083     get_json_fio_for_person_id(uuid)    FUNCTION     #  CREATE FUNCTION public.get_json_fio_for_person_id(p_person_id uuid) RETURNS json
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
       public               postgres    false                       1255    48084 %   get_json_person_full_data_by_id(uuid)    FUNCTION     a  CREATE FUNCTION public.get_json_person_full_data_by_id(p_person_id uuid) RETURNS json
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
       public               postgres    false                       1255    48085    get_student_full_name(integer)    FUNCTION       CREATE FUNCTION public.get_student_full_name(p_student_id integer) RETURNS json
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
       public               postgres    false                       1255    48086    get_student_full_name(uuid)    FUNCTION     �  CREATE FUNCTION public.get_student_full_name(student_uuid uuid) RETURNS json
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
       public               postgres    false            #           1255    48087 +   get_students_full_name_by_subgroup_id(uuid)    FUNCTION       CREATE FUNCTION public.get_students_full_name_by_subgroup_id(p_subgroup_id uuid) RETURNS json
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
       public               postgres    false            
           1255    48088    get_subgroups_by_group_id(uuid)    FUNCTION     �  CREATE FUNCTION public.get_subgroups_by_group_id(input_group_id uuid) RETURNS json
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
       public               postgres    false            $           1255    48089 &   get_subject_by_id_with_full_data(uuid)    FUNCTION     W  CREATE FUNCTION public.get_subject_by_id_with_full_data(p_subject_id uuid) RETURNS json
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
       public               postgres    false            %           1255    48090 !   get_teacher_full_data_by_id(uuid)    FUNCTION     �  CREATE FUNCTION public.get_teacher_full_data_by_id(p_teacher_id uuid) RETURNS json
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
       public               postgres    false            �            1259    48425    AcademicBuildings    TABLE     �   CREATE TABLE public."AcademicBuildings" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    address character varying(255) NOT NULL
);
 '   DROP TABLE public."AcademicBuildings";
       public         heap r       postgres    false            �            1259    48424    AcademicBuildings_id_seq    SEQUENCE     �   CREATE SEQUENCE public."AcademicBuildings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public."AcademicBuildings_id_seq";
       public               postgres    false    248            $           0    0    AcademicBuildings_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public."AcademicBuildings_id_seq" OWNED BY public."AcademicBuildings".id;
          public               postgres    false    247            �            1259    48097    AcademicSpecialties    TABLE     �   CREATE TABLE public."AcademicSpecialties" (
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 )   DROP TABLE public."AcademicSpecialties";
       public         heap r       postgres    false            �            1259    48102    AssessmentTypes    TABLE     �   CREATE TABLE public."AssessmentTypes" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 %   DROP TABLE public."AssessmentTypes";
       public         heap r       postgres    false            �            1259    48105    AssessmentTypes_id_seq    SEQUENCE     �   CREATE SEQUENCE public."AssessmentTypes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public."AssessmentTypes_id_seq";
       public               postgres    false    218            %           0    0    AssessmentTypes_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public."AssessmentTypes_id_seq" OWNED BY public."AssessmentTypes".id;
          public               postgres    false    219                       1259    48681 	   Audiences    TABLE     �   CREATE TABLE public."Audiences" (
    id integer NOT NULL,
    number integer NOT NULL,
    capacity integer NOT NULL,
    academic_building_id integer NOT NULL
);
    DROP TABLE public."Audiences";
       public         heap r       postgres    false                        1259    48680    Audiences_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Audiences_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Audiences_id_seq";
       public               postgres    false    257            &           0    0    Audiences_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Audiences_id_seq" OWNED BY public."Audiences".id;
          public               postgres    false    256            �            1259    48112    CurriculumSubjects    TABLE     k  CREATE TABLE public."CurriculumSubjects" (
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
       public         heap r       postgres    false            �            1259    48119    Curriculums    TABLE     2  CREATE TABLE public."Curriculums" (
    id integer NOT NULL,
    year_of_specialty_training integer NOT NULL,
    specialty_code character varying(255) NOT NULL,
    education_form_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 !   DROP TABLE public."Curriculums";
       public         heap r       postgres    false            �            1259    48122    Curriculums_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Curriculums_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."Curriculums_id_seq";
       public               postgres    false    221            '           0    0    Curriculums_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."Curriculums_id_seq" OWNED BY public."Curriculums".id;
          public               postgres    false    222            �            1259    48123    Departments    TABLE     p  CREATE TABLE public."Departments" (
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
       public         heap r       postgres    false            �            1259    48128    Departments_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Departments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."Departments_id_seq";
       public               postgres    false    223            (           0    0    Departments_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."Departments_id_seq" OWNED BY public."Departments".id;
          public               postgres    false    224            �            1259    48129    EducationForms    TABLE     �   CREATE TABLE public."EducationForms" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 $   DROP TABLE public."EducationForms";
       public         heap r       postgres    false            �            1259    48132    EducationForms_id_seq    SEQUENCE     �   CREATE SEQUENCE public."EducationForms_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public."EducationForms_id_seq";
       public               postgres    false    225            )           0    0    EducationForms_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public."EducationForms_id_seq" OWNED BY public."EducationForms".id;
          public               postgres    false    226            �            1259    48133 	   Faculties    TABLE       CREATE TABLE public."Faculties" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    dean_person_id integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Faculties";
       public         heap r       postgres    false            �            1259    48138    Faculties_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Faculties_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Faculties_id_seq";
       public               postgres    false    227            *           0    0    Faculties_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Faculties_id_seq" OWNED BY public."Faculties".id;
          public               postgres    false    228            �            1259    48139    Groups    TABLE     �  CREATE TABLE public."Groups" (
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
       public         heap r       postgres    false            �            1259    48144    Groups_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Groups_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Groups_id_seq";
       public               postgres    false    229            +           0    0    Groups_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Groups_id_seq" OWNED BY public."Groups".id;
          public               postgres    false    230            �            1259    48459    Lessons    TABLE       CREATE TABLE public."Lessons" (
    id uuid NOT NULL,
    group_id integer NOT NULL,
    subgroup_id uuid,
    pair_id integer NOT NULL,
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
       public         heap r       postgres    false            �            1259    48446    Pairs    TABLE     �  CREATE TABLE public."Pairs" (
    id integer NOT NULL,
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
       public         heap r       postgres    false            �            1259    48445    Pairs_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Pairs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Pairs_id_seq";
       public               postgres    false    250            ,           0    0    Pairs_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Pairs_id_seq" OWNED BY public."Pairs".id;
          public               postgres    false    249            �            1259    48154    People    TABLE     i  CREATE TABLE public."People" (
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
       public         heap r       postgres    false            �            1259    48159    People_id_seq    SEQUENCE     �   CREATE SEQUENCE public."People_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."People_id_seq";
       public               postgres    false    231            -           0    0    People_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."People_id_seq" OWNED BY public."People".id;
          public               postgres    false    232                       1259    48738    Roles    TABLE     c   CREATE TABLE public."Roles" (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);
    DROP TABLE public."Roles";
       public         heap r       postgres    false                       1259    48737    Roles_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Roles_id_seq";
       public               postgres    false    260            .           0    0    Roles_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Roles_id_seq" OWNED BY public."Roles".id;
          public               postgres    false    259                       1259    48692    ScheduleDetails    TABLE     ?  CREATE TABLE public."ScheduleDetails" (
    id uuid NOT NULL,
    schedule_id integer NOT NULL,
    pair_id integer NOT NULL,
    group_id integer NOT NULL,
    subgroup_id uuid,
    subject_id integer NOT NULL,
    audience_id integer NOT NULL,
    teacher_id integer NOT NULL,
    subject_type_id integer NOT NULL
);
 %   DROP TABLE public."ScheduleDetails";
       public         heap r       postgres    false            /           0    0    COLUMN "ScheduleDetails".id    COMMENT     �   COMMENT ON COLUMN public."ScheduleDetails".id IS 'Уникальный идентификатор записи расписания';
          public               postgres    false    258            �            1259    48589 	   Schedules    TABLE     )  CREATE TABLE public."Schedules" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    start_date timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    type_of_semester_id integer NOT NULL
);
    DROP TABLE public."Schedules";
       public         heap r       postgres    false            0           0    0    COLUMN "Schedules".name    COMMENT     V   COMMENT ON COLUMN public."Schedules".name IS 'Название расписания';
          public               postgres    false    255            1           0    0    COLUMN "Schedules".start_date    COMMENT     �   COMMENT ON COLUMN public."Schedules".start_date IS 'Дата, с которой расписание начинает действовать';
          public               postgres    false    255            �            1259    48588    Schedules_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Schedules_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Schedules_id_seq";
       public               postgres    false    255            2           0    0    Schedules_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Schedules_id_seq" OWNED BY public."Schedules".id;
          public               postgres    false    254            �            1259    48163    Students    TABLE     t  CREATE TABLE public."Students" (
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
       public         heap r       postgres    false            �            1259    48167    Students_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Students_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Students_id_seq";
       public               postgres    false    233            3           0    0    Students_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Students_id_seq" OWNED BY public."Students".id;
          public               postgres    false    234            �            1259    48168 	   Subgroups    TABLE        CREATE TABLE public."Subgroups" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    group_id integer NOT NULL,
    leader_id integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Subgroups";
       public         heap r       postgres    false            �            1259    48171    SubjectTypes    TABLE     �   CREATE TABLE public."SubjectTypes" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 "   DROP TABLE public."SubjectTypes";
       public         heap r       postgres    false            �            1259    48174    SubjectTypes_id_seq    SEQUENCE     �   CREATE SEQUENCE public."SubjectTypes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."SubjectTypes_id_seq";
       public               postgres    false    236            4           0    0    SubjectTypes_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."SubjectTypes_id_seq" OWNED BY public."SubjectTypes".id;
          public               postgres    false    237            �            1259    48175    Subjects    TABLE     �   CREATE TABLE public."Subjects" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    department_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Subjects";
       public         heap r       postgres    false            �            1259    48178    Subjects_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Subjects_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Subjects_id_seq";
       public               postgres    false    238            5           0    0    Subjects_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Subjects_id_seq" OWNED BY public."Subjects".id;
          public               postgres    false    239            �            1259    48179    Teachers    TABLE       CREATE TABLE public."Teachers" (
    id integer NOT NULL,
    person_id integer NOT NULL,
    department_id integer NOT NULL,
    teaching_position_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Teachers";
       public         heap r       postgres    false            �            1259    48182    Teachers_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Teachers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Teachers_id_seq";
       public               postgres    false    240            6           0    0    Teachers_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Teachers_id_seq" OWNED BY public."Teachers".id;
          public               postgres    false    241            �            1259    48183    TeachingPositions    TABLE     �   CREATE TABLE public."TeachingPositions" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 '   DROP TABLE public."TeachingPositions";
       public         heap r       postgres    false            �            1259    48186    TeachingPositions_id_seq    SEQUENCE     �   CREATE SEQUENCE public."TeachingPositions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public."TeachingPositions_id_seq";
       public               postgres    false    242            7           0    0    TeachingPositions_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public."TeachingPositions_id_seq" OWNED BY public."TeachingPositions".id;
          public               postgres    false    243            �            1259    48187    Topics    TABLE     �   CREATE TABLE public."Topics" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    subject_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Topics";
       public         heap r       postgres    false            �            1259    48190    Topics_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Topics_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Topics_id_seq";
       public               postgres    false    244            8           0    0    Topics_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Topics_id_seq" OWNED BY public."Topics".id;
          public               postgres    false    245            �            1259    48570    TypeOfSemesters    TABLE     �   CREATE TABLE public."TypeOfSemesters" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    start timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL
);
 %   DROP TABLE public."TypeOfSemesters";
       public         heap r       postgres    false            �            1259    48569    TypeOfSemesters_id_seq    SEQUENCE     �   CREATE SEQUENCE public."TypeOfSemesters_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public."TypeOfSemesters_id_seq";
       public               postgres    false    253            9           0    0    TypeOfSemesters_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public."TypeOfSemesters_id_seq" OWNED BY public."TypeOfSemesters".id;
          public               postgres    false    252                       1259    48775    Users    TABLE     '  CREATE TABLE public."Users" (
    id integer NOT NULL,
    login character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    token character varying(255) DEFAULT NULL::character varying,
    role_id integer NOT NULL,
    student_id integer,
    teacher_id integer
);
    DROP TABLE public."Users";
       public         heap r       postgres    false                       1259    48774    Users_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Users_id_seq";
       public               postgres    false    262            :           0    0    Users_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;
          public               postgres    false    261            �            1259    48191 	   WeekTypes    TABLE     �   CREATE TABLE public."WeekTypes" (
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."WeekTypes";
       public         heap r       postgres    false            �           2604    48428    AcademicBuildings id    DEFAULT     �   ALTER TABLE ONLY public."AcademicBuildings" ALTER COLUMN id SET DEFAULT nextval('public."AcademicBuildings_id_seq"'::regclass);
 E   ALTER TABLE public."AcademicBuildings" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    247    248    248            �           2604    48195    AssessmentTypes id    DEFAULT     |   ALTER TABLE ONLY public."AssessmentTypes" ALTER COLUMN id SET DEFAULT nextval('public."AssessmentTypes_id_seq"'::regclass);
 C   ALTER TABLE public."AssessmentTypes" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    218            �           2604    48684    Audiences id    DEFAULT     p   ALTER TABLE ONLY public."Audiences" ALTER COLUMN id SET DEFAULT nextval('public."Audiences_id_seq"'::regclass);
 =   ALTER TABLE public."Audiences" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    256    257    257            �           2604    48197    Curriculums id    DEFAULT     t   ALTER TABLE ONLY public."Curriculums" ALTER COLUMN id SET DEFAULT nextval('public."Curriculums_id_seq"'::regclass);
 ?   ALTER TABLE public."Curriculums" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221            �           2604    48198    Departments id    DEFAULT     t   ALTER TABLE ONLY public."Departments" ALTER COLUMN id SET DEFAULT nextval('public."Departments_id_seq"'::regclass);
 ?   ALTER TABLE public."Departments" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223            �           2604    48199    EducationForms id    DEFAULT     z   ALTER TABLE ONLY public."EducationForms" ALTER COLUMN id SET DEFAULT nextval('public."EducationForms_id_seq"'::regclass);
 B   ALTER TABLE public."EducationForms" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    225            �           2604    48200    Faculties id    DEFAULT     p   ALTER TABLE ONLY public."Faculties" ALTER COLUMN id SET DEFAULT nextval('public."Faculties_id_seq"'::regclass);
 =   ALTER TABLE public."Faculties" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    228    227            �           2604    48201 	   Groups id    DEFAULT     j   ALTER TABLE ONLY public."Groups" ALTER COLUMN id SET DEFAULT nextval('public."Groups_id_seq"'::regclass);
 :   ALTER TABLE public."Groups" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    230    229            �           2604    48449    Pairs id    DEFAULT     h   ALTER TABLE ONLY public."Pairs" ALTER COLUMN id SET DEFAULT nextval('public."Pairs_id_seq"'::regclass);
 9   ALTER TABLE public."Pairs" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    250    249    250            �           2604    48202 	   People id    DEFAULT     j   ALTER TABLE ONLY public."People" ALTER COLUMN id SET DEFAULT nextval('public."People_id_seq"'::regclass);
 :   ALTER TABLE public."People" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    232    231            �           2604    48741    Roles id    DEFAULT     h   ALTER TABLE ONLY public."Roles" ALTER COLUMN id SET DEFAULT nextval('public."Roles_id_seq"'::regclass);
 9   ALTER TABLE public."Roles" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    260    259    260            �           2604    48592    Schedules id    DEFAULT     p   ALTER TABLE ONLY public."Schedules" ALTER COLUMN id SET DEFAULT nextval('public."Schedules_id_seq"'::regclass);
 =   ALTER TABLE public."Schedules" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    254    255    255            �           2604    48203    Students id    DEFAULT     n   ALTER TABLE ONLY public."Students" ALTER COLUMN id SET DEFAULT nextval('public."Students_id_seq"'::regclass);
 <   ALTER TABLE public."Students" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    234    233            �           2604    48204    SubjectTypes id    DEFAULT     v   ALTER TABLE ONLY public."SubjectTypes" ALTER COLUMN id SET DEFAULT nextval('public."SubjectTypes_id_seq"'::regclass);
 @   ALTER TABLE public."SubjectTypes" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    237    236            �           2604    48205    Subjects id    DEFAULT     n   ALTER TABLE ONLY public."Subjects" ALTER COLUMN id SET DEFAULT nextval('public."Subjects_id_seq"'::regclass);
 <   ALTER TABLE public."Subjects" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    239    238            �           2604    48206    Teachers id    DEFAULT     n   ALTER TABLE ONLY public."Teachers" ALTER COLUMN id SET DEFAULT nextval('public."Teachers_id_seq"'::regclass);
 <   ALTER TABLE public."Teachers" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    241    240            �           2604    48207    TeachingPositions id    DEFAULT     �   ALTER TABLE ONLY public."TeachingPositions" ALTER COLUMN id SET DEFAULT nextval('public."TeachingPositions_id_seq"'::regclass);
 E   ALTER TABLE public."TeachingPositions" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    243    242            �           2604    48208 	   Topics id    DEFAULT     j   ALTER TABLE ONLY public."Topics" ALTER COLUMN id SET DEFAULT nextval('public."Topics_id_seq"'::regclass);
 :   ALTER TABLE public."Topics" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    245    244            �           2604    48573    TypeOfSemesters id    DEFAULT     |   ALTER TABLE ONLY public."TypeOfSemesters" ALTER COLUMN id SET DEFAULT nextval('public."TypeOfSemesters_id_seq"'::regclass);
 C   ALTER TABLE public."TypeOfSemesters" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    253    252    253            �           2604    48778    Users id    DEFAULT     h   ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);
 9   ALTER TABLE public."Users" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    261    262    262                      0    48425    AcademicBuildings 
   TABLE DATA           @   COPY public."AcademicBuildings" (id, name, address) FROM stdin;
    public               postgres    false    248   o      �          0    48097    AcademicSpecialties 
   TABLE DATA           U   COPY public."AcademicSpecialties" (code, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    217   �o      �          0    48102    AssessmentTypes 
   TABLE DATA           O   COPY public."AssessmentTypes" (id, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    218   `p                0    48681 	   Audiences 
   TABLE DATA           Q   COPY public."Audiences" (id, number, capacity, academic_building_id) FROM stdin;
    public               postgres    false    257   q      �          0    48112    CurriculumSubjects 
   TABLE DATA           �   COPY public."CurriculumSubjects" (curriculum_id, subject_id, assessment_type_id, semester, all_hours, lecture_hours, lab_hours, practice_hours) FROM stdin;
    public               postgres    false    220   _q      �          0    48119    Curriculums 
   TABLE DATA           �   COPY public."Curriculums" (id, year_of_specialty_training, specialty_code, education_form_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    221   �q      �          0    48123    Departments 
   TABLE DATA           �   COPY public."Departments" (id, name, full_name, chairperson_of_the_department_person_id, faculty_id, "createdAt", "updatedAt", head_person_id) FROM stdin;
    public               postgres    false    223   
r      �          0    48129    EducationForms 
   TABLE DATA           N   COPY public."EducationForms" (id, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    225   Zs      �          0    48133 	   Faculties 
   TABLE DATA           d   COPY public."Faculties" (id, name, full_name, dean_person_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    227   �s      �          0    48139    Groups 
   TABLE DATA           �   COPY public."Groups" (id, name, graduation_year, year_of_beginning_of_study, faculty_id, class_representative_person_id, teacher_curator_id, department_id, specialty_code, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    229   -u                0    48459    Lessons 
   TABLE DATA           �   COPY public."Lessons" (id, group_id, subgroup_id, pair_id, date, subject_id, teacher_person_id, topic_id, audience_id, subject_type_id, has_marked_absences, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    251   �u                0    48446    Pairs 
   TABLE DATA           �   COPY public."Pairs" (id, weekday_number, name, start, "end", break_start, break_end, week_type_name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    250   vv      �          0    48154    People 
   TABLE DATA           p   COPY public."People" (id, surname, name, middlename, phone_number, email, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    231   �y                0    48738    Roles 
   TABLE DATA           +   COPY public."Roles" (id, name) FROM stdin;
    public               postgres    false    260   }~                0    48692    ScheduleDetails 
   TABLE DATA           �   COPY public."ScheduleDetails" (id, schedule_id, pair_id, group_id, subgroup_id, subject_id, audience_id, teacher_id, subject_type_id) FROM stdin;
    public               postgres    false    258                    0    48589 	   Schedules 
   TABLE DATA           j   COPY public."Schedules" (id, name, start_date, "createdAt", "updatedAt", type_of_semester_id) FROM stdin;
    public               postgres    false    255   �                 0    48163    Students 
   TABLE DATA           �   COPY public."Students" (id, count_reprimand, icon_path, person_id, group_id, subgroup_id, perent_person_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    233   [�                0    48168 	   Subgroups 
   TABLE DATA           ^   COPY public."Subgroups" (id, name, group_id, leader_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    235   ��                0    48171    SubjectTypes 
   TABLE DATA           L   COPY public."SubjectTypes" (id, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    236   ��                0    48175    Subjects 
   TABLE DATA           W   COPY public."Subjects" (id, name, department_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    238   )�                0    48179    Teachers 
   TABLE DATA           r   COPY public."Teachers" (id, person_id, department_id, teaching_position_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    240   �      	          0    48183    TeachingPositions 
   TABLE DATA           Q   COPY public."TeachingPositions" (id, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    242   ʅ                0    48187    Topics 
   TABLE DATA           R   COPY public."Topics" (id, name, subject_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    244   ��                0    48570    TypeOfSemesters 
   TABLE DATA           C   COPY public."TypeOfSemesters" (id, name, start, "end") FROM stdin;
    public               postgres    false    253   <�                0    48775    Users 
   TABLE DATA           c   COPY public."Users" (id, login, password_hash, token, role_id, student_id, teacher_id) FROM stdin;
    public               postgres    false    262   ��                0    48191 	   WeekTypes 
   TABLE DATA           E   COPY public."WeekTypes" (name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    246   �      ;           0    0    AcademicBuildings_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public."AcademicBuildings_id_seq"', 8, true);
          public               postgres    false    247            <           0    0    AssessmentTypes_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."AssessmentTypes_id_seq"', 7, true);
          public               postgres    false    219            =           0    0    Audiences_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Audiences_id_seq"', 4, true);
          public               postgres    false    256            >           0    0    Curriculums_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."Curriculums_id_seq"', 3, true);
          public               postgres    false    222            ?           0    0    Departments_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Departments_id_seq"', 11, true);
          public               postgres    false    224            @           0    0    EducationForms_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."EducationForms_id_seq"', 10, true);
          public               postgres    false    226            A           0    0    Faculties_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Faculties_id_seq"', 11, true);
          public               postgres    false    228            B           0    0    Groups_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Groups_id_seq"', 3, true);
          public               postgres    false    230            C           0    0    Pairs_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Pairs_id_seq"', 60, true);
          public               postgres    false    249            D           0    0    People_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."People_id_seq"', 40, true);
          public               postgres    false    232            E           0    0    Roles_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Roles_id_seq"', 6, true);
          public               postgres    false    259            F           0    0    Schedules_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Schedules_id_seq"', 1, true);
          public               postgres    false    254            G           0    0    Students_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Students_id_seq"', 19, true);
          public               postgres    false    234            H           0    0    SubjectTypes_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."SubjectTypes_id_seq"', 3, true);
          public               postgres    false    237            I           0    0    Subjects_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Subjects_id_seq"', 14, true);
          public               postgres    false    239            J           0    0    Teachers_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Teachers_id_seq"', 14, true);
          public               postgres    false    241            K           0    0    TeachingPositions_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public."TeachingPositions_id_seq"', 15, true);
          public               postgres    false    243            L           0    0    Topics_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Topics_id_seq"', 3, true);
          public               postgres    false    245            M           0    0    TypeOfSemesters_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."TypeOfSemesters_id_seq"', 2, true);
          public               postgres    false    252            N           0    0    Users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Users_id_seq"', 2, true);
          public               postgres    false    261                        2606    48432 (   AcademicBuildings AcademicBuildings_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public."AcademicBuildings"
    ADD CONSTRAINT "AcademicBuildings_pkey" PRIMARY KEY (id);
 V   ALTER TABLE ONLY public."AcademicBuildings" DROP CONSTRAINT "AcademicBuildings_pkey";
       public                 postgres    false    248            �           2606    48212 ,   AcademicSpecialties AcademicSpecialties_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public."AcademicSpecialties"
    ADD CONSTRAINT "AcademicSpecialties_pkey" PRIMARY KEY (code);
 Z   ALTER TABLE ONLY public."AcademicSpecialties" DROP CONSTRAINT "AcademicSpecialties_pkey";
       public                 postgres    false    217                        2606    48214 $   AssessmentTypes AssessmentTypes_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public."AssessmentTypes"
    ADD CONSTRAINT "AssessmentTypes_pkey" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."AssessmentTypes" DROP CONSTRAINT "AssessmentTypes_pkey";
       public                 postgres    false    218            *           2606    48686    Audiences Audiences_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Audiences"
    ADD CONSTRAINT "Audiences_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Audiences" DROP CONSTRAINT "Audiences_pkey";
       public                 postgres    false    257                       2606    48218 *   CurriculumSubjects CurriculumSubjects_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."CurriculumSubjects"
    ADD CONSTRAINT "CurriculumSubjects_pkey" PRIMARY KEY (curriculum_id, subject_id, assessment_type_id, semester);
 X   ALTER TABLE ONLY public."CurriculumSubjects" DROP CONSTRAINT "CurriculumSubjects_pkey";
       public                 postgres    false    220    220    220    220                       2606    48220    Curriculums Curriculums_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Curriculums"
    ADD CONSTRAINT "Curriculums_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."Curriculums" DROP CONSTRAINT "Curriculums_pkey";
       public                 postgres    false    221                       2606    48222    Departments Departments_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_pkey";
       public                 postgres    false    223                       2606    48224 "   EducationForms EducationForms_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."EducationForms"
    ADD CONSTRAINT "EducationForms_pkey" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public."EducationForms" DROP CONSTRAINT "EducationForms_pkey";
       public                 postgres    false    225            
           2606    48226    Faculties Faculties_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Faculties"
    ADD CONSTRAINT "Faculties_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Faculties" DROP CONSTRAINT "Faculties_pkey";
       public                 postgres    false    227                       2606    48228    Groups Groups_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_pkey";
       public                 postgres    false    229            $           2606    48464    Lessons Lessons_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_pkey";
       public                 postgres    false    251            "           2606    48453    Pairs Pairs_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Pairs"
    ADD CONSTRAINT "Pairs_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Pairs" DROP CONSTRAINT "Pairs_pkey";
       public                 postgres    false    250                       2606    48234    People People_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."People"
    ADD CONSTRAINT "People_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."People" DROP CONSTRAINT "People_pkey";
       public                 postgres    false    231            .           2606    48743    Roles Roles_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Roles" DROP CONSTRAINT "Roles_pkey";
       public                 postgres    false    260            ,           2606    48696 $   ScheduleDetails ScheduleDetails_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public."ScheduleDetails"
    ADD CONSTRAINT "ScheduleDetails_pkey" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."ScheduleDetails" DROP CONSTRAINT "ScheduleDetails_pkey";
       public                 postgres    false    258            (           2606    48594    Schedules Schedules_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Schedules"
    ADD CONSTRAINT "Schedules_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Schedules" DROP CONSTRAINT "Schedules_pkey";
       public                 postgres    false    255                       2606    48238    Students Students_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_pkey";
       public                 postgres    false    233                       2606    48240    Subgroups Subgroups_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Subgroups"
    ADD CONSTRAINT "Subgroups_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Subgroups" DROP CONSTRAINT "Subgroups_pkey";
       public                 postgres    false    235                       2606    48242    SubjectTypes SubjectTypes_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."SubjectTypes"
    ADD CONSTRAINT "SubjectTypes_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."SubjectTypes" DROP CONSTRAINT "SubjectTypes_pkey";
       public                 postgres    false    236                       2606    48244    Subjects Subjects_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_pkey";
       public                 postgres    false    238                       2606    48246    Teachers Teachers_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_pkey";
       public                 postgres    false    240                       2606    48248 (   TeachingPositions TeachingPositions_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public."TeachingPositions"
    ADD CONSTRAINT "TeachingPositions_pkey" PRIMARY KEY (id);
 V   ALTER TABLE ONLY public."TeachingPositions" DROP CONSTRAINT "TeachingPositions_pkey";
       public                 postgres    false    242                       2606    48250    Topics Topics_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Topics"
    ADD CONSTRAINT "Topics_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Topics" DROP CONSTRAINT "Topics_pkey";
       public                 postgres    false    244            &           2606    48575 $   TypeOfSemesters TypeOfSemesters_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public."TypeOfSemesters"
    ADD CONSTRAINT "TypeOfSemesters_pkey" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."TypeOfSemesters" DROP CONSTRAINT "TypeOfSemesters_pkey";
       public                 postgres    false    253            0           2606    48783    Users Users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_pkey";
       public                 postgres    false    262                       2606    48252    WeekTypes WeekTypes_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."WeekTypes"
    ADD CONSTRAINT "WeekTypes_pkey" PRIMARY KEY (name);
 F   ALTER TABLE ONLY public."WeekTypes" DROP CONSTRAINT "WeekTypes_pkey";
       public                 postgres    false    246            S           2606    48687 -   Audiences Audiences_academic_building_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Audiences"
    ADD CONSTRAINT "Audiences_academic_building_id_fkey" FOREIGN KEY (academic_building_id) REFERENCES public."AcademicBuildings"(id);
 [   ALTER TABLE ONLY public."Audiences" DROP CONSTRAINT "Audiences_academic_building_id_fkey";
       public               postgres    false    248    257    4896            1           2606    48258 =   CurriculumSubjects CurriculumSubjects_assessment_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CurriculumSubjects"
    ADD CONSTRAINT "CurriculumSubjects_assessment_type_id_fkey" FOREIGN KEY (assessment_type_id) REFERENCES public."AssessmentTypes"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 k   ALTER TABLE ONLY public."CurriculumSubjects" DROP CONSTRAINT "CurriculumSubjects_assessment_type_id_fkey";
       public               postgres    false    218    220    4864            2           2606    48263 8   CurriculumSubjects CurriculumSubjects_curriculum_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CurriculumSubjects"
    ADD CONSTRAINT "CurriculumSubjects_curriculum_id_fkey" FOREIGN KEY (curriculum_id) REFERENCES public."Curriculums"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 f   ALTER TABLE ONLY public."CurriculumSubjects" DROP CONSTRAINT "CurriculumSubjects_curriculum_id_fkey";
       public               postgres    false    221    4868    220            3           2606    48268 5   CurriculumSubjects CurriculumSubjects_subject_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CurriculumSubjects"
    ADD CONSTRAINT "CurriculumSubjects_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 c   ALTER TABLE ONLY public."CurriculumSubjects" DROP CONSTRAINT "CurriculumSubjects_subject_id_fkey";
       public               postgres    false    4886    238    220            4           2606    48273 .   Curriculums Curriculums_education_form_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Curriculums"
    ADD CONSTRAINT "Curriculums_education_form_id_fkey" FOREIGN KEY (education_form_id) REFERENCES public."EducationForms"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 \   ALTER TABLE ONLY public."Curriculums" DROP CONSTRAINT "Curriculums_education_form_id_fkey";
       public               postgres    false    225    4872    221            5           2606    48278 +   Curriculums Curriculums_specialty_code_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Curriculums"
    ADD CONSTRAINT "Curriculums_specialty_code_fkey" FOREIGN KEY (specialty_code) REFERENCES public."AcademicSpecialties"(code) ON UPDATE CASCADE ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public."Curriculums" DROP CONSTRAINT "Curriculums_specialty_code_fkey";
       public               postgres    false    217    4862    221            6           2606    48283 D   Departments Departments_chairperson_of_the_department_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_chairperson_of_the_department_person_id_fkey" FOREIGN KEY (chairperson_of_the_department_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 r   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_chairperson_of_the_department_person_id_fkey";
       public               postgres    false    223    4878    231            7           2606    48288 '   Departments Departments_faculty_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_faculty_id_fkey" FOREIGN KEY (faculty_id) REFERENCES public."Faculties"(id) ON UPDATE CASCADE;
 U   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_faculty_id_fkey";
       public               postgres    false    227    223    4874            8           2606    48293 +   Departments Departments_head_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_head_person_id_fkey" FOREIGN KEY (head_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 Y   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_head_person_id_fkey";
       public               postgres    false    223    231    4878            9           2606    48298 '   Faculties Faculties_dean_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Faculties"
    ADD CONSTRAINT "Faculties_dean_person_id_fkey" FOREIGN KEY (dean_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 U   ALTER TABLE ONLY public."Faculties" DROP CONSTRAINT "Faculties_dean_person_id_fkey";
       public               postgres    false    4878    227    231            :           2606    48303 1   Groups Groups_class_representative_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_class_representative_person_id_fkey" FOREIGN KEY (class_representative_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 _   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_class_representative_person_id_fkey";
       public               postgres    false    4878    231    229            ;           2606    48308     Groups Groups_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public."Departments"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_department_id_fkey";
       public               postgres    false    229    4870    223            <           2606    48313    Groups Groups_faculty_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_faculty_id_fkey" FOREIGN KEY (faculty_id) REFERENCES public."Faculties"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 K   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_faculty_id_fkey";
       public               postgres    false    229    227    4874            =           2606    48318 !   Groups Groups_specialty_code_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_specialty_code_fkey" FOREIGN KEY (specialty_code) REFERENCES public."AcademicSpecialties"(code) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_specialty_code_fkey";
       public               postgres    false    4862    229    217            >           2606    48323 %   Groups Groups_teacher_curator_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_teacher_curator_id_fkey" FOREIGN KEY (teacher_curator_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 S   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_teacher_curator_id_fkey";
       public               postgres    false    231    4878    229            K           2606    48465    Lessons Lessons_group_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 K   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_group_id_fkey";
       public               postgres    false    251    229    4876            L           2606    48475    Lessons Lessons_pair_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_pair_id_fkey" FOREIGN KEY (pair_id) REFERENCES public."Pairs"(id);
 J   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_pair_id_fkey";
       public               postgres    false    4898    251    250            M           2606    48470     Lessons Lessons_subgroup_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_subgroup_id_fkey" FOREIGN KEY (subgroup_id) REFERENCES public."Subgroups"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 N   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_subgroup_id_fkey";
       public               postgres    false    4882    235    251            N           2606    48480    Lessons Lessons_subject_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public."Subjects"(id);
 M   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_subject_id_fkey";
       public               postgres    false    238    251    4886            O           2606    48500 $   Lessons Lessons_subject_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_subject_type_id_fkey" FOREIGN KEY (subject_type_id) REFERENCES public."SubjectTypes"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_subject_type_id_fkey";
       public               postgres    false    236    4884    251            P           2606    48485 &   Lessons Lessons_teacher_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_teacher_person_id_fkey" FOREIGN KEY (teacher_person_id) REFERENCES public."Teachers"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 T   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_teacher_person_id_fkey";
       public               postgres    false    240    251    4888            Q           2606    48490    Lessons Lessons_topic_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES public."Topics"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 K   ALTER TABLE ONLY public."Lessons" DROP CONSTRAINT "Lessons_topic_id_fkey";
       public               postgres    false    251    244    4892            J           2606    48454    Pairs Pairs_week_type_name_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Pairs"
    ADD CONSTRAINT "Pairs_week_type_name_fkey" FOREIGN KEY (week_type_name) REFERENCES public."WeekTypes"(name);
 M   ALTER TABLE ONLY public."Pairs" DROP CONSTRAINT "Pairs_week_type_name_fkey";
       public               postgres    false    4894    250    246            T           2606    48722 0   ScheduleDetails ScheduleDetails_audience_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ScheduleDetails"
    ADD CONSTRAINT "ScheduleDetails_audience_id_fkey" FOREIGN KEY (audience_id) REFERENCES public."Audiences"(id) ON UPDATE CASCADE;
 ^   ALTER TABLE ONLY public."ScheduleDetails" DROP CONSTRAINT "ScheduleDetails_audience_id_fkey";
       public               postgres    false    258    4906    257            U           2606    48707 -   ScheduleDetails ScheduleDetails_group_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ScheduleDetails"
    ADD CONSTRAINT "ScheduleDetails_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) ON UPDATE CASCADE;
 [   ALTER TABLE ONLY public."ScheduleDetails" DROP CONSTRAINT "ScheduleDetails_group_id_fkey";
       public               postgres    false    229    4876    258            V           2606    48702 ,   ScheduleDetails ScheduleDetails_pair_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ScheduleDetails"
    ADD CONSTRAINT "ScheduleDetails_pair_id_fkey" FOREIGN KEY (pair_id) REFERENCES public."Pairs"(id) ON UPDATE CASCADE;
 Z   ALTER TABLE ONLY public."ScheduleDetails" DROP CONSTRAINT "ScheduleDetails_pair_id_fkey";
       public               postgres    false    258    250    4898            W           2606    48697 0   ScheduleDetails ScheduleDetails_schedule_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ScheduleDetails"
    ADD CONSTRAINT "ScheduleDetails_schedule_id_fkey" FOREIGN KEY (schedule_id) REFERENCES public."Schedules"(id) ON UPDATE CASCADE;
 ^   ALTER TABLE ONLY public."ScheduleDetails" DROP CONSTRAINT "ScheduleDetails_schedule_id_fkey";
       public               postgres    false    258    4904    255            X           2606    48712 0   ScheduleDetails ScheduleDetails_subgroup_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ScheduleDetails"
    ADD CONSTRAINT "ScheduleDetails_subgroup_id_fkey" FOREIGN KEY (subgroup_id) REFERENCES public."Subgroups"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 ^   ALTER TABLE ONLY public."ScheduleDetails" DROP CONSTRAINT "ScheduleDetails_subgroup_id_fkey";
       public               postgres    false    235    4882    258            Y           2606    48717 /   ScheduleDetails ScheduleDetails_subject_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ScheduleDetails"
    ADD CONSTRAINT "ScheduleDetails_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public."Subjects"(id) ON UPDATE CASCADE;
 ]   ALTER TABLE ONLY public."ScheduleDetails" DROP CONSTRAINT "ScheduleDetails_subject_id_fkey";
       public               postgres    false    258    4886    238            Z           2606    48732 4   ScheduleDetails ScheduleDetails_subject_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ScheduleDetails"
    ADD CONSTRAINT "ScheduleDetails_subject_type_id_fkey" FOREIGN KEY (subject_type_id) REFERENCES public."SubjectTypes"(id) ON UPDATE CASCADE;
 b   ALTER TABLE ONLY public."ScheduleDetails" DROP CONSTRAINT "ScheduleDetails_subject_type_id_fkey";
       public               postgres    false    236    258    4884            [           2606    48727 /   ScheduleDetails ScheduleDetails_teacher_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ScheduleDetails"
    ADD CONSTRAINT "ScheduleDetails_teacher_id_fkey" FOREIGN KEY (teacher_id) REFERENCES public."Teachers"(id) ON UPDATE CASCADE;
 ]   ALTER TABLE ONLY public."ScheduleDetails" DROP CONSTRAINT "ScheduleDetails_teacher_id_fkey";
       public               postgres    false    240    258    4888            R           2606    48595 ,   Schedules Schedules_type_of_semester_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Schedules"
    ADD CONSTRAINT "Schedules_type_of_semester_id_fkey" FOREIGN KEY (type_of_semester_id) REFERENCES public."TypeOfSemesters"(id) ON UPDATE CASCADE;
 Z   ALTER TABLE ONLY public."Schedules" DROP CONSTRAINT "Schedules_type_of_semester_id_fkey";
       public               postgres    false    253    255    4902            ?           2606    48368    Students Students_group_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_group_id_fkey";
       public               postgres    false    233    229    4876            @           2606    48373 '   Students Students_perent_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_perent_person_id_fkey" FOREIGN KEY (perent_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 U   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_perent_person_id_fkey";
       public               postgres    false    231    4878    233            A           2606    48378     Students Students_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_person_id_fkey" FOREIGN KEY (person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_person_id_fkey";
       public               postgres    false    4878    233    231            B           2606    48383 "   Students Students_subgroup_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_subgroup_id_fkey" FOREIGN KEY (subgroup_id) REFERENCES public."Subgroups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_subgroup_id_fkey";
       public               postgres    false    235    4882    233            C           2606    48388 !   Subgroups Subgroups_group_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Subgroups"
    ADD CONSTRAINT "Subgroups_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public."Subgroups" DROP CONSTRAINT "Subgroups_group_id_fkey";
       public               postgres    false    235    229    4876            D           2606    48393 "   Subgroups Subgroups_leader_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Subgroups"
    ADD CONSTRAINT "Subgroups_leader_id_fkey" FOREIGN KEY (leader_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 P   ALTER TABLE ONLY public."Subgroups" DROP CONSTRAINT "Subgroups_leader_id_fkey";
       public               postgres    false    4878    231    235            E           2606    48398 $   Subjects Subjects_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public."Departments"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_department_id_fkey";
       public               postgres    false    223    4870    238            F           2606    48403 $   Teachers Teachers_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public."Departments"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_department_id_fkey";
       public               postgres    false    4870    223    240            G           2606    48408     Teachers Teachers_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_person_id_fkey" FOREIGN KEY (person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_person_id_fkey";
       public               postgres    false    240    4878    231            H           2606    48413 +   Teachers Teachers_teaching_position_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_teaching_position_id_fkey" FOREIGN KEY (teaching_position_id) REFERENCES public."TeachingPositions"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_teaching_position_id_fkey";
       public               postgres    false    240    242    4890            I           2606    48418    Topics Topics_subject_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Topics"
    ADD CONSTRAINT "Topics_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 K   ALTER TABLE ONLY public."Topics" DROP CONSTRAINT "Topics_subject_id_fkey";
       public               postgres    false    238    244    4886            \           2606    48784    Users Users_role_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public."Roles"(id) ON UPDATE CASCADE;
 F   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_role_id_fkey";
       public               postgres    false    4910    262    260            ]           2606    48789    Users Users_student_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Students"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 I   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_student_id_fkey";
       public               postgres    false    233    4880    262            ^           2606    48794    Users Users_teacher_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_teacher_id_fkey" FOREIGN KEY (teacher_id) REFERENCES public."Teachers"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 I   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_teacher_id_fkey";
       public               postgres    false    262    4888    240               �   x�����0E�)n �Il�]�!M
���!L�%��o#�&�;W'�{�2���tО�	���)MQZ�5���&,ڧGԫ�o2.��<7�d�{#RwW7Ҳ���}č�Lz b֠����'_�sG�Hr�O3��2��      �   �   x�}�A
�0D��)���ߤQڳx�Z
ݺ�
AQ�mz��7�W����0ü�ڒ�T*\�y��[���!�h�n|�#�0�vx`�3��z3[>��ԕ#
������&x[n��H��D�p���h��"�O�f���_X��As��Vk�P�f}      �   �   x���M�0���)�H#�,����R�%�Wxs#[\i�.'o�{�b��i��j����0�2�N,�,k�B��Wܨ�&@*�h�
#.��|�=��c�>Q↡�-U���cd>'�6)j��F��O��S�g�T�ϟ��NI%�#�X����U��)�I�Ԫ����s��쐴         1   x�3�41��45�4�2�410�42�4�2R� ��	�1DԔ+F��� �#�      �   @   x�m��	  C�s:�4Z����s���X���C��b��hv�B��]odRZ�f���F|�_���l�x�      �   K   x�}̱�0��H}�؁Y��}��t�S2�R�%펁9�/d9
����[O߂x~�US%5�y��?�A�      �   @  x�}��N�@���S�ݔ����>A�R�&jR�l�s����f��oV�J������L�hKO�H/��+����O�S��ި��T#�H�����GuK%���#�q�+�9jW����D�S�V�*B;�Y���d���_��,��K�/�Tц�x)�B���=�1@T�
���Ì6Q�,�}c�_��4M�螞�U^�zw��?�&Ӫ�f$�;�\h�n�x��x-D�j��4=�t� �h��5��
�ε>p�`D��\O{�G��	�[��+���F�qsKw���N:&�a��$3<Jy�{���&�      �   i   x�3�0���x7o��paǅ�8��LuLt��,�L��,��-M���Hqq^�4f�/6u�Dc�ea�i��������%H�+F��� WL6y      �   J  x���QN�@��wO�;��Cx#(j��䁘���TR��+�{#g����Fc�̶3�����$p��7@�-�n�5*w��}�Q�U�3N��)6�/.�@����ҬE�tf�%�dEq��J�L0��t�ܽF��n�N�_����]��ێb}E�̿6T����l*F��8_�soC��J��b���:;:�
%��x��5^��%SYJ���B��j��bA��ig��U��&k(�E�y�`��o�z�0���?�,b�9�Rju��:��9�p 5b�S��xF��x
�_��[�0d~��ƚ�攤����${���9$|      �   f   x��̹�@D�خ�a�ڻ[P!GG.�#B!��$_z�|��g�|�T)Tϫ)P�����	Lp�T�М�-Ic	�Hl��>>�6[+�����;��+�         �   x������0c���4�E�lbJV�%�7s�x��&'�� ��A��"`v4�%�*Tޯ�Z� ��ʎx��D!.rY\��!�8���QU�v��D%�gK0tq��I�F�Q��qC�.�@l�i)݀&K���IO2xG�0�K�����}�:"!G�vș��H|�a;�ܾd�P}o��?�>k�           x���MjA��O��>���?s�ƛ���^�!L�0�F�[~ě2���6Ô�?�K�3�/����?����|��q�t�tI���vQ֝�ם���|}�~=_���ǻ��|>����㥤"����;��G��E��T?�� ���Ο��02DXUE(�T.k����nv��ߐ�1īD�p���bI$�P�!������r�mG�0&�x�� \>�T�I���!�mAy[P/�펄|��`� �χ#iME�w��r;$�.�N?84���4�r
P���؈%Q���ݔ���4�r	P8���\eUwwee�l��
�,�A�(�涬�3����p:�3������o���0�|�TbM5�aw_J�u=O� ��	<�K��G�����)ڢ(
�x6�D�*��l8�K��
��Y.Ev�e��l���p:�s�,�]v�e�'G����p:10�XSv7f�3�$�)@�s��	��
������%Q-
�x:�DUS��1;N撨r����e�\�2�nLl���>N�Tve�ݗ�_K�:N'��e߈�T��}�?�D�N'>���%�l�K���$���91�t,�XϮ�}9q2�}�� ��	�
�$bQ��}9�tL���p:��c�tte�ݘOǴ�
�0��ɩ�onKN���$�����eI���m�	�ƒHJ���|�4��*���;�$P8���i�(��d<6-���!�`]6w%g<��&t(�N���6�Sv�e���I�R�����%ї{"����<      �   �  x��W�n7]�B���y��n��(캭�8P`[����"��6A'E�-�je�jdKJ~��G=���8�@�8����K���O���؎�ed��)�ܸ�ב}k��}�@��|��2��fg�~����;6���A��2"�P�'�¨B.t��з@LE���vZ�`o"�����E�H~U����J��(C�F�F�<I�h]!-L�e*���Bh��,�$G�G�*�@d�t/�(���J���׊#�)Q�^\���Z3��|�F�����-�-�.;��B$\%I�܃Xs�#�����S;�����Waj�*�*���>��Ȟ������iyV�����cZV�i�t�M0Ǉ�����sZnhOȟ��s
t�:�PZBLJ
8��|"��	�S�.:�MƓ�S5�$��3
�m�s���#�9ϕHx���8!���F��אB�.������h�7�f��~D#L(���c�!����υY�oBL&4D(�ú��CnG��1ϴ
�{�id�@ZO@����vٗP��+�Ø۩!7�-h L���Յ#�S�Ȗ^5'�$�i�.��y܊hb2�%h�]Q�}R��Ny�Z�܄�N��k,`���
q���6ڃ���0v�);���B�����H˰�K�)E�&":�~�TBd�͜�8׼��Bs����@�����1�f��.�����[�����3�>��T�L�N[Ӽ	1�.<s��N��X��׷����V��?�(-O�DR�CL���V%�Q�q[���l��֣����JH ��:��<�����_�C�U[/I��I��S蜫T�zm����P�{}�i�~l^z�R���^ȋX�9�SY5ӏ�Zo���ʘ��t�h�ʵF�T�ޔm�)����+�~��U>��Bc�x[��Z'�I�Ĵ �F��t���=�[_$��5v(�B��<��AL���;���j�0��su�p��Z�pM���mK���jb}�'�e�F븺)�tqr�����+�6���֫Kv�T	/e@8���*A���;�f���2՝����Ӻ�?�6�b�D}���b��xo!�����w6��v���cݱ���&�}�键\�;{�p�n:�PK(ZKJS���\�<�鬺�STO�m�@Z\��B�"L{"G�V\k��jAL/� ��j>�t<
��O�=�ɚq�s.���)����b4�+g�/6�^����z
l�!3ڦL�4���c�ͪ�         s   x�=���@E��*��A��b�#0���\ g���v�B`���}'\�HZOV{�!Y�R���a&{�y�Zp�vѽ�C���E�zn���E�Jx���?nU�SfO         �   x���͍�!�_/LD��&����B�%,�f�s����W��HZ��`����Ց*I��0����l�
=��- /v�U=��n;8'������8s04������X��5N����N&��+e?��	F޺�6�Ot�3]�� 9��� �f��XbgQ�?� ]��\~���L��*9b�:��ƥ�k�J��ëMF�!�:�T��v������^�̄߯�y~ged6         \   x�3�0��֋��^��;.�T s��/6]lP0202��� B��H��@���
����¦��&
�V&�V�z���&&�e�b���� �(�          R  x���9n�0E��)��Eu�� ���?B4Y�Ia���.���������JG��N�Eݚ���E±���-�.��>B��+�G����A�/���P)����@zG�[j�=�� �,t_��3Z����I3��t8��� �LqF��+�)J��Ć��z������5Q�c�L^��L[ٗ%`vq�؉FtJ��Sָn��0M"�s6MA;�_�̘�zU�4 ���U\1�?�0�	`�e��.���Qqi��T�3'6�-s|��� ϔ��U��`����N�y+��1�t"��3*$���$�gJL��T"_��i �� �QԐs         �   x�}��i1г]�ރ�%ٖ5E����c��@
$�l�e.!q:>���u�EȽ3$�Jm@aͭ+���r܎���x���_��v�9t�Q��<�DްlQ�2=E�'�4��UP��4�VD�pZ��O��hm��b,!�%�H|�:��੐b�A	T�a�d�i�����g�n��Y��"ob��l`��g��7�!��&�g��j��k��k�����C         u   x�3估�bÅv]l���®8��Lu��H��������\���P������@c6^�2h��d�+��I4�2����`).c��[��l���b?�f�Iq��qqq �vN�         �  x�}TKn�0\��о!J�,�,=��$�"E�eE��P!���0�Q��l(6ؖ!93oޣ��3,v܊�;X�(j��Yq���7y�F��|J� Y<��-ѹ/�p��=�O�n�ʵ�wbqI�h�ZUfQ�A�x��dA�t1�6	�h`�y�u�\�����WI�w��鹬E�gJU�E�����otx�	�M�آKx���}s߽aw�^��-�N/HM��Zh}�7�d-��t���&S�$�w���z�6����̔�$�)tbۅ�W\^UK'G>|a|L�Z���W�9	~��'��J��Y��*���Z��|cm�]S՗�Os�R��flĕ��,���k"��J�Uuu���~��،I�K�n�<{G�u��a.�VeYG�!�s����׆t^o�4O9pd�!�uh�hF0�)Ӥ�*��a��JJ�|>�w         �   x�}�Kn1D�p��G�(�?Β��#��hƝv"y��F�B�P���C��z@��%:���A\����B#R�m�q#k;�4�H��_w���&���#dc�#��������앚<�����>;�S�N�K��sY�����)�s�S�H��C4|-�#FP���w	�G��pE�-���i;      	   �   x���Kj�0�ךSd_"4zԏ��0�J�tQ�2�&Đ���ύ*l��l�Ч��Ol�e%+��Y��Mje�K��,LQ�P���_�{��Ya'Ut��pD���y������1��>�!b����F*��	��'V��Ezń���:yO�ǧ��\*~�������T��t�n�qP��Ze-_��/1u3\�58'��ަ��7MD��4         ~   x�3����+��4�4202�5 "##+#+C=ccCmcL)c3=#s3��1��6\�xa�ņ.6��@V���)\l���b���{́fpZ"L3W04�22�2��36A�]�+F��� '�4�         _   x�3�0��֋��^��;.�T s��/6]lP0202��F��
V`�m`6� sq^�G�H�^]K4�aC#]#c#c���� ��>,         .  x�5�K��0 ���wxF(�r�U����.�B�J��.�_�l̞&�e2��
��!�`�D�'neײ��tj�����D�Ns��i���7
�kp����+�����H�x�d�V����݁o1Z��mgf��aˉLw�܎��A�zɷ$r{c:��+J���ɘ�_8$��	Ґ�AO01Ƚ:S��������l"j~|?z��F}��cO�0܊Ԣ�7̊��p�؊��QH^vް���� ��)�����5ou��+�y�8J�s�/��8j<�'$��"�ˠ1D���*9�����ѥ�,I�/�qW         V   x��0��֋[/���_���[/l���9��Lu�u�-��̬L�-ʹ��Hq]�{aǅměg��<�W� g�:"     