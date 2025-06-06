PGDMP          
            }            dbTj    17.0    17.0 `    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
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
       public               postgres    false                       1255    39129 0   get_academic_specialty_data_for_curriculum(uuid)    FUNCTION     �  CREATE FUNCTION public.get_academic_specialty_data_for_curriculum(p_curriculum_id uuid) RETURNS json
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
       public               postgres    false            �            1255    39059 !   get_active_curriculum_id(integer)    FUNCTION     p  CREATE FUNCTION public.get_active_curriculum_id(p_year integer) RETURNS uuid
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
       public               postgres    false                       1255    39132     get_all_faculty_with_full_data()    FUNCTION     �  CREATE FUNCTION public.get_all_faculty_with_full_data() RETURNS json
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
       public               postgres    false                        1255    39042    get_current_semester(integer)    FUNCTION     5  CREATE FUNCTION public.get_current_semester(start_year integer) RETURNS integer
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
       public               postgres    false                       1255    39060    get_curriculum_for_group(uuid)    FUNCTION     �  CREATE FUNCTION public.get_curriculum_for_group(p_group_id uuid) RETURNS uuid
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
       public               postgres    false                       1255    39133 &   get_faculty_by_id_with_full_data(uuid)    FUNCTION       CREATE FUNCTION public.get_faculty_by_id_with_full_data(faculty_id uuid) RETURNS json
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
       public               postgres    false            �            1255    39043     get_group_current_semester(uuid)    FUNCTION     �  CREATE FUNCTION public.get_group_current_semester(p_group_id uuid) RETURNS integer
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
       public               postgres    false            �            1255    39131     get_json_fio_for_person_id(uuid)    FUNCTION     �  CREATE FUNCTION public.get_json_fio_for_person_id(p_person_id uuid) RETURNS json
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

    IF result IS NULL THEN
        RAISE EXCEPTION 'Person not found';
    END IF;

    RETURN result;
END;
$$;
 C   DROP FUNCTION public.get_json_fio_for_person_id(p_person_id uuid);
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
       public               postgres    false    234            �           0    0    AcademicBuildings_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public."AcademicBuildings_id_seq" OWNED BY public."AcademicBuildings".id;
          public               postgres    false    233            �            1259    38927    AcademicSpecialties    TABLE     �   CREATE TABLE public."AcademicSpecialties" (
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 )   DROP TABLE public."AcademicSpecialties";
       public         heap r       postgres    false            �            1259    39044    AssessmentTypes    TABLE     �   CREATE TABLE public."AssessmentTypes" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 %   DROP TABLE public."AssessmentTypes";
       public         heap r       postgres    false            �            1259    39117 	   Audiences    TABLE     9  CREATE TABLE public."Audiences" (
    id uuid NOT NULL,
    number integer NOT NULL,
    capacity integer NOT NULL,
    academic_building_id integer NOT NULL,
    description character varying(1026) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Audiences";
       public         heap r       postgres    false            �            1259    39049    Curriculums    TABLE       CREATE TABLE public."Curriculums" (
    id uuid NOT NULL,
    year_of_specialty_training integer NOT NULL,
    specialty_code character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 !   DROP TABLE public."Curriculums";
       public         heap r       postgres    false            �            1259    38910    Departments    TABLE     K  CREATE TABLE public."Departments" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    chairperson_of_the_department_person_id uuid,
    faculty_id uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 !   DROP TABLE public."Departments";
       public         heap r       postgres    false            �            1259    38864 	   Faculties    TABLE       CREATE TABLE public."Faculties" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    dean_person_id uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Faculties";
       public         heap r       postgres    false            �            1259    38934    Groups    TABLE     �  CREATE TABLE public."Groups" (
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
       public         heap r       postgres    false            �            1259    38852    People    TABLE     f  CREATE TABLE public."People" (
    id uuid NOT NULL,
    surname character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    middlename character varying(255),
    phone_number character varying(255),
    email character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."People";
       public         heap r       postgres    false            �            1259    39037    SemesterTypes    TABLE     <  CREATE TABLE public."SemesterTypes" (
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
       public               postgres    false    226            �           0    0    Students_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Students_id_seq" OWNED BY public."Students".id;
          public               postgres    false    225            �            1259    38961 	   Subgroups    TABLE     �   CREATE TABLE public."Subgroups" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    group_id uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Subgroups";
       public         heap r       postgres    false            �            1259    39024    Subjects    TABLE     �   CREATE TABLE public."Subjects" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    department_id uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Subjects";
       public         heap r       postgres    false            �            1259    39086    Teachers    TABLE       CREATE TABLE public."Teachers" (
    id uuid NOT NULL,
    person_id uuid NOT NULL,
    department_id uuid NOT NULL,
    teaching_position_id uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Teachers";
       public         heap r       postgres    false            �            1259    39081    TeachingPositions    TABLE     �   CREATE TABLE public."TeachingPositions" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 '   DROP TABLE public."TeachingPositions";
       public         heap r       postgres    false            �            1259    38876 	   WeekTypes    TABLE     �   CREATE TABLE public."WeekTypes" (
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."WeekTypes";
       public         heap r       postgres    false            �           2604    39112    AcademicBuildings id    DEFAULT     �   ALTER TABLE ONLY public."AcademicBuildings" ALTER COLUMN id SET DEFAULT nextval('public."AcademicBuildings_id_seq"'::regclass);
 E   ALTER TABLE public."AcademicBuildings" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    234    233    234            �           2604    38991    Students id    DEFAULT     n   ALTER TABLE ONLY public."Students" ALTER COLUMN id SET DEFAULT nextval('public."Students_id_seq"'::regclass);
 <   ALTER TABLE public."Students" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    226    226            �          0    39109    AcademicBuildings 
   TABLE DATA           Z   COPY public."AcademicBuildings" (id, name, address, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    234   ��       t          0    38927    AcademicSpecialties 
   TABLE DATA           U   COPY public."AcademicSpecialties" (code, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    222   ��       {          0    39044    AssessmentTypes 
   TABLE DATA           O   COPY public."AssessmentTypes" (id, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    229   J�       �          0    39117 	   Audiences 
   TABLE DATA           x   COPY public."Audiences" (id, number, capacity, academic_building_id, description, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    235   �       |          0    39049    Curriculums 
   TABLE DATA           q   COPY public."Curriculums" (id, year_of_specialty_training, specialty_code, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    230   ��       s          0    38910    Departments 
   TABLE DATA           �   COPY public."Departments" (id, name, full_name, chairperson_of_the_department_person_id, faculty_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    221   '�       p          0    38864 	   Faculties 
   TABLE DATA           d   COPY public."Faculties" (id, name, full_name, dean_person_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    218   թ       u          0    38934    Groups 
   TABLE DATA           �   COPY public."Groups" (id, name, graduation_year, year_of_beginning_of_study, faculty_id, class_representative_person_id, department_id, specialty_code, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    223   t�       r          0    38898    Pairs 
   TABLE DATA           �   COPY public."Pairs" (id, weekday_number, name, start, "end", break_start, break_end, week_type_name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    220   �       o          0    38852    People 
   TABLE DATA           p   COPY public."People" (id, surname, name, middlename, phone_number, email, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    217   �       z          0    39037    SemesterTypes 
   TABLE DATA           y   COPY public."SemesterTypes" (name, "startMonth", "startDay", "endMonth", "endDay", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    228   ��       x          0    38988    Students 
   TABLE DATA           �   COPY public."Students" (id, count_reprimand, person_id, group_id, subgroup_id, perent_person_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    226   �       v          0    38961 	   Subgroups 
   TABLE DATA           S   COPY public."Subgroups" (id, name, group_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    224   q�       y          0    39024    Subjects 
   TABLE DATA           W   COPY public."Subjects" (id, name, department_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    227   $�       ~          0    39086    Teachers 
   TABLE DATA           r   COPY public."Teachers" (id, person_id, department_id, teaching_position_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    232   ��       }          0    39081    TeachingPositions 
   TABLE DATA           Q   COPY public."TeachingPositions" (id, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    231   =�       q          0    38876 	   WeekTypes 
   TABLE DATA           E   COPY public."WeekTypes" (name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    219   6�       �           0    0    AcademicBuildings_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public."AcademicBuildings_id_seq"', 1, false);
          public               postgres    false    233            �           0    0    Students_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Students_id_seq"', 1, true);
          public               postgres    false    225            �           2606    39116 (   AcademicBuildings AcademicBuildings_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public."AcademicBuildings"
    ADD CONSTRAINT "AcademicBuildings_pkey" PRIMARY KEY (id);
 V   ALTER TABLE ONLY public."AcademicBuildings" DROP CONSTRAINT "AcademicBuildings_pkey";
       public                 postgres    false    234            �           2606    38933 ,   AcademicSpecialties AcademicSpecialties_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public."AcademicSpecialties"
    ADD CONSTRAINT "AcademicSpecialties_pkey" PRIMARY KEY (code);
 Z   ALTER TABLE ONLY public."AcademicSpecialties" DROP CONSTRAINT "AcademicSpecialties_pkey";
       public                 postgres    false    222            �           2606    39048 $   AssessmentTypes AssessmentTypes_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public."AssessmentTypes"
    ADD CONSTRAINT "AssessmentTypes_pkey" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."AssessmentTypes" DROP CONSTRAINT "AssessmentTypes_pkey";
       public                 postgres    false    229            �           2606    39123    Audiences Audiences_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Audiences"
    ADD CONSTRAINT "Audiences_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Audiences" DROP CONSTRAINT "Audiences_pkey";
       public                 postgres    false    235            �           2606    39053    Curriculums Curriculums_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Curriculums"
    ADD CONSTRAINT "Curriculums_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."Curriculums" DROP CONSTRAINT "Curriculums_pkey";
       public                 postgres    false    230            �           2606    38916    Departments Departments_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_pkey";
       public                 postgres    false    221            �           2606    38870    Faculties Faculties_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Faculties"
    ADD CONSTRAINT "Faculties_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Faculties" DROP CONSTRAINT "Faculties_pkey";
       public                 postgres    false    218            �           2606    38940    Groups Groups_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_pkey";
       public                 postgres    false    223            �           2606    38904    Pairs Pairs_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Pairs"
    ADD CONSTRAINT "Pairs_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Pairs" DROP CONSTRAINT "Pairs_pkey";
       public                 postgres    false    220            �           2606    38858    People People_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."People"
    ADD CONSTRAINT "People_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."People" DROP CONSTRAINT "People_pkey";
       public                 postgres    false    217            �           2606    39041     SemesterTypes SemesterTypes_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."SemesterTypes"
    ADD CONSTRAINT "SemesterTypes_pkey" PRIMARY KEY (name);
 N   ALTER TABLE ONLY public."SemesterTypes" DROP CONSTRAINT "SemesterTypes_pkey";
       public                 postgres    false    228            �           2606    38994    Students Students_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_pkey";
       public                 postgres    false    226            �           2606    38965    Subgroups Subgroups_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Subgroups"
    ADD CONSTRAINT "Subgroups_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Subgroups" DROP CONSTRAINT "Subgroups_pkey";
       public                 postgres    false    224            �           2606    39028    Subjects Subjects_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_pkey";
       public                 postgres    false    227            �           2606    39090    Teachers Teachers_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_pkey";
       public                 postgres    false    232            �           2606    39085 (   TeachingPositions TeachingPositions_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public."TeachingPositions"
    ADD CONSTRAINT "TeachingPositions_pkey" PRIMARY KEY (id);
 V   ALTER TABLE ONLY public."TeachingPositions" DROP CONSTRAINT "TeachingPositions_pkey";
       public                 postgres    false    231            �           2606    38880    WeekTypes WeekTypes_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."WeekTypes"
    ADD CONSTRAINT "WeekTypes_pkey" PRIMARY KEY (name);
 F   ALTER TABLE ONLY public."WeekTypes" DROP CONSTRAINT "WeekTypes_pkey";
       public                 postgres    false    219            �           2606    39124 -   Audiences Audiences_academic_building_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Audiences"
    ADD CONSTRAINT "Audiences_academic_building_id_fkey" FOREIGN KEY (academic_building_id) REFERENCES public."AcademicBuildings"(id);
 [   ALTER TABLE ONLY public."Audiences" DROP CONSTRAINT "Audiences_academic_building_id_fkey";
       public               postgres    false    235    4808    234            �           2606    39054 +   Curriculums Curriculums_specialty_code_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Curriculums"
    ADD CONSTRAINT "Curriculums_specialty_code_fkey" FOREIGN KEY (specialty_code) REFERENCES public."AcademicSpecialties"(code);
 Y   ALTER TABLE ONLY public."Curriculums" DROP CONSTRAINT "Curriculums_specialty_code_fkey";
       public               postgres    false    4788    222    230            �           2606    38917 D   Departments Departments_chairperson_of_the_department_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_chairperson_of_the_department_person_id_fkey" FOREIGN KEY (chairperson_of_the_department_person_id) REFERENCES public."People"(id);
 r   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_chairperson_of_the_department_person_id_fkey";
       public               postgres    false    4778    217    221            �           2606    38922 '   Departments Departments_faculty_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_faculty_id_fkey" FOREIGN KEY (faculty_id) REFERENCES public."Faculties"(id);
 U   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_faculty_id_fkey";
       public               postgres    false    4780    218    221            �           2606    38871 '   Faculties Faculties_dean_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Faculties"
    ADD CONSTRAINT "Faculties_dean_person_id_fkey" FOREIGN KEY (dean_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 U   ALTER TABLE ONLY public."Faculties" DROP CONSTRAINT "Faculties_dean_person_id_fkey";
       public               postgres    false    218    4778    217            �           2606    38946 1   Groups Groups_class_representative_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_class_representative_person_id_fkey" FOREIGN KEY (class_representative_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 _   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_class_representative_person_id_fkey";
       public               postgres    false    4778    223    217            �           2606    38951     Groups Groups_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public."Departments"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_department_id_fkey";
       public               postgres    false    221    223    4786            �           2606    38941    Groups Groups_faculty_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_faculty_id_fkey" FOREIGN KEY (faculty_id) REFERENCES public."Faculties"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 K   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_faculty_id_fkey";
       public               postgres    false    218    4780    223            �           2606    38956 !   Groups Groups_specialty_code_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_specialty_code_fkey" FOREIGN KEY (specialty_code) REFERENCES public."AcademicSpecialties"(code) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_specialty_code_fkey";
       public               postgres    false    223    4788    222            �           2606    38905    Pairs Pairs_week_type_name_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Pairs"
    ADD CONSTRAINT "Pairs_week_type_name_fkey" FOREIGN KEY (week_type_name) REFERENCES public."WeekTypes"(name);
 M   ALTER TABLE ONLY public."Pairs" DROP CONSTRAINT "Pairs_week_type_name_fkey";
       public               postgres    false    219    220    4782            �           2606    39000    Students Students_group_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_group_id_fkey";
       public               postgres    false    226    4790    223            �           2606    39010 '   Students Students_perent_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_perent_person_id_fkey" FOREIGN KEY (perent_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 U   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_perent_person_id_fkey";
       public               postgres    false    217    4778    226            �           2606    38995     Students Students_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_person_id_fkey" FOREIGN KEY (person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_person_id_fkey";
       public               postgres    false    226    4778    217            �           2606    39005 "   Students Students_subgroup_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_subgroup_id_fkey" FOREIGN KEY (subgroup_id) REFERENCES public."Subgroups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_subgroup_id_fkey";
       public               postgres    false    4792    224    226            �           2606    38966 !   Subgroups Subgroups_group_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Subgroups"
    ADD CONSTRAINT "Subgroups_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public."Subgroups" DROP CONSTRAINT "Subgroups_group_id_fkey";
       public               postgres    false    4790    223    224            �           2606    39029 $   Subjects Subjects_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public."Departments"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_department_id_fkey";
       public               postgres    false    221    227    4786            �           2606    39096 $   Teachers Teachers_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public."Departments"(id);
 R   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_department_id_fkey";
       public               postgres    false    232    221    4786            �           2606    39091     Teachers Teachers_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_person_id_fkey" FOREIGN KEY (person_id) REFERENCES public."People"(id);
 N   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_person_id_fkey";
       public               postgres    false    4778    217    232            �           2606    39101 +   Teachers Teachers_teaching_position_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Teachers"
    ADD CONSTRAINT "Teachers_teaching_position_id_fkey" FOREIGN KEY (teaching_position_id) REFERENCES public."TeachingPositions"(id);
 Y   ALTER TABLE ONLY public."Teachers" DROP CONSTRAINT "Teachers_teaching_position_id_fkey";
       public               postgres    false    232    231    4804            �      x������ � �      t   �   x�}�A
�0D��)���ߤQڳx�Z
ݺ�
AQ�mz��7�W����0ü�ڒ�T*\�y��[���!�h�n|�#�0�vx`�3��z3[>��ԕ#
������&x[n��H��D�p���h��"�O�f���_X��As��Vk�P�f}      {   %  x���MN1FדSt�\��I&=�$���
�*�*Z��܈L�B��2�"���ޤBH�@��F��|(�K�����G��=;-�i@��R+�W�K��i��D4!��,d"tZC�Ƀꋦ #�$��Ry_7�G�0K9G�%գ�\�I�@��B��Ϥˠ:~㏺���YOF����|���xl�.���R�U�D"��,����0&#(J&��ԓ��P���]��y�z��§��qf��O����U�� [�~:g��r$������&���
�-�n��,��ۥ��!��      �      x������ � �      |   {   x�}ͻ�0E�ښ"}@��=�Y��!r��ˇ��|�6��IPH��9G/,�j�12o%#�K�_D���5�V}�<�����Ѡ�fid��2�8�-~/��S����ߚ��R� ��/      s   �  x��V�NG]O�죋���#����;Ď#��,,Ųc{m	c��_����[�w��ES��Z�Խ�r.W��ʌe������&��b^������q�m�~>��v>��.���e9�~�iWm3>w�~\��
��B1E��B�S:���haX�/�f��ok������&��4(�3�5㠔���T��%������}h�tY�O�e;ƻ��nG��r���;��q���)�������V���	1K��.�5�*0�xP�k��D(E�W��E���no�i���<#:�v��}ǧGD�}�es��7��1^O�?�#�#���[�$���!@�������΀��|�4Țu��Q��FB���Vx�4V�{Z��o��l�'W}������!�y�T�R">�% d�8/Dn��%i�}��P>t`�>��K���ހ����q|v��2>�
�vүآ��>_*z�RI`T.��̑Nb4.Ţg����X}t�Z��0P�a?����51�T�u����'�<�P04K�n�z&ќ�����v��a�N�A�����-pm#i-D	���9/�2��@3�������_h(g4x)P��{#k���6�E{������W�>Q�z�u��"&�Yr�k�l������(���� M�uV����y^TX	6KW!��@�Xп4�r�RG�$S�\�.؃'� i����W�Nh�/QD�p�����l���sV�%Q�$~u��l�dahP8H�p�.���E4t�I��D���(/$���2թज़���Si0�*�Y+�:fL+��M�hR�ڟ���t���@���lW��KW{�k��55�~i��������y>Tr�ɺb(�)�?�t��s��ʙ$���%��$�i�.��Z(z���+�����:�)\�iO��]��>�����ZW�%&r�L^���D�-B!Ы_��q���C�q?� ����D� �^�OU�%L-���P��+BP2�䴊�+#�K��ԶP[Jm���UF�Ź��U9Z1�� 3�֠�2F���R8ޞ��zN|F�Ե��hb����+��D�$��֌]3��-�>��}bw��Z��>�,�8��iFV-��J�r��8�����q:�Ls���S��pEA�(q�ߴ~`��۩���0�o�      p   �  x���͎5���O1wT��]��y� R��Sn�;YA7r��r��-Y6���oD����Mz���Z��-����Z�P�x�U���@6A0�vX4���/���|�w�]�����~ӯ�g��I��W�����L^�_���w��r>|:h�� ���-�qRV}���1d�U .C�f`m�%r-Pd����/���� ����d>��ī�������~$�>��H#%v��Q�@�(`+��^�9U;�W��ex+׷P�s��/��M;�{�e��	Z�P�j���I���ڟ����n��_�y�_��6�j��V̕�����8�9h�a5��$%��+{�AI���V˺��/ޝ��Pn���q�E��mL`(x�h$�-D29�`)�4��$��sqᏽ3�Bv�f����Nb�x�{�m�����7�&�Z{�oP����ȸp?�k��Y+�X��>-!�&M)UsCMia~�_~��w0/���3�����"[�N$�3&�(����T��[7��Q���(��)V��d]QCͮ��{�����c���=z�>�H��]N���?$�PK
�㥼X� t8[ss�o�6��Ȫɱ^%��Ƙ�A��*RvrGP0��K�8�z""��0���i̵`����� �D��B0*�T����V���Z�$i���"� �_����5�8�rYku2"C�
v��NQy�ZVV*��/���J19�<3�����=�������|�(y������E�ei�6����d��Ic��K5�ٶ�%��=�5�*��ቈx���٭Hc�(���+[k[����|(-�I��o��+N�Dw�Xm&nR�JV�ua\&!ʭ��k���
�A3�������J�J#&oK3T��%'SC�+�>QI~-&k瑙Ь8~(��q���@�      u   �   x�}���0c�
r�=����rT��oK�1БJ�P l�;w�Z�9��a��AUبq:�7X����/� �b�l�k!��IY@��d����!�a����X�ɽ1�L��`�w�I@��&��3!�`��(O\K������u�1~ ��3#      r   �  x���Kn&��תS��� L&��x�|�c6^7��0���1��7rT��M��*�Zh�P\�Cd��%�Qtt��� �V���a�P�h����/��������}��=��`���7ߏ7������������߾~����׏����}}K!�4
�%�{����Y��J���%� Y��g2k�����L)�v��������,��(m��
6��q n�Ik�dْW�T�N��G	�t�������7	�o�Y�S5�X�S����
5����3��78/�Y�)���g�qy ���eҘ#%%�ԝ~�[�e���c��˟g�w�f9��GiK3�ȍ�N��2�3���\ʐQ��E5�r/m�B�\'.Z�:C�:�Ȃ)�2(�O���T�`�C�|S�y~5��9p��#�I<z��Ӥ$�q�YT��kZ�`\#�3Raaf&ks�io�ڂ���'F�D��>����|��%�c������ǽ�Z�L*V�ت���L��8�ظ�$��0�[�E��<�������$��3j��O!ih"C�M�4z��k�T�΋j�9�^�&�6���~t�����WƂ�$�O;��;�Q�V�C�2w�z
�$*I������E5��G���Ih���@����lq,+���~�O;�KΔl�ą�Z�8%�t\U��5��yQ�s??J[Z�F�@� ��ad��k�-U̣�����Q�\��#\��Blp��&D9mSo�78/���r��4˂?���}���j�>����y�8J[W鸛	W���L�g��G����΋j���Vi&����(Jֹ�R
��2?�B�-tt��	/oFuPJ��+i�� ��=ޠ��e=�GiI�0Fc��!)��b�=b	�[P~܃^rba��X9c�B:�-h����g��yQ��|t�6K1�������t�*�X�2g��O{P=�GG	T"�`Bz�*	ײ"k�Z�#�΋j����� g;��@��TW(cyZR(���z���W�V$��6�~x1�֚�YU�78/���2�^k�'��Ss䎄�:�}���=���ͣ����#��Fv$x;�xΡ��e��78/�y������N�W�+iW�ΦѼυ���{�+N[sX��F���B�ʔ�.���A�����U^�^�JQ�������
�TP>�B�8�7/��
��S�|�+#����<O�GikҜ��8\�Ml#ַ�pQ��@���縣�����T�H�#�i�dC�78��y.桥�1��I�;`��BRr�kY�0�� =�GGiC@�^/�`⥓��B[S���΋Z���R{J�5#MSroǱc�j;����9�(!yt��U�� q�W�U�ҡ+�΋j����C���s��|]�!&�5շ��y�;J�'�k�7s$�Y15is��֢�Rop^T�<��Ϧ�E�M,8��؄Z0,F�΂��'�����8�W��olIN]3��z.b���E5�S�Q��T���׎u�c�d;z��3"�.��|ڃ^r6Y��Md�3Wl�C�}v"���<Oq�=m)�Dv��f��1�.ea�du��.�3T�^�����)�M��S`f2J:���.t��Ҧ#)�'�WF1$<��SL5�9w5w�D�#{pk=�)������YP�:�wd���|E��fkT��µd�7�x�uÒL��y:O���SC�s���U07��[K{�<"3����<�<�u�͊��T�7`�́�iui�f�`|ڃ�<��mκ8�EE�O��@/aϠ)IM��P��E-_Q°q'{�U|������{���f���i��w��,�"6�͹�kpy�^|���78/�����=LtwP�����W���8bIʠ|ڃ�<m�m�4j�k��X�Ã:�\���\˼�yQ��w�6� x�MJ3�w�)"g������(�����k�X��'���q���AD��ev���)�(m�i۶��X      o   m   x�}�1�0 ��yEw��1vL�+�,q���R����z�%Qg6�j[E!S,�f�J�jN2ex��_;<���� �v��Wi=~.`bE��i�i�s�B�@��k!� IO =      z   Q   x��0�bㅭ��;9-9��ؐ����T��X��\��������H��R���ׅI���f4��ix������ mS-R      x   }   x�}���0ѳTE�<�v�����K�+�^�rAa�K$e�I��4��%=ԭ�Pɍ�'��;����6��T�"�X�N�����cڈL�:�@:��#|��7�F�/���Vk��j)      v   �   x���1�0E��ݑ+'vb�gaq��H\	f�Bz#�"!&����'����b����+(�	��X��Z�������_��7�+��@`�an%�5�1�l�.bL�����%�,��	�7�՚������v��6�U8��VBs�_i���H���}R���o��W�      y   o  x��V�r7<�~�I�f���ߒ��C��䠃�|p9�T��b�LK��?� �\$��sВ��r�g����u1
� ��*[T:[f�����4�T��Mٕ��*��P��8�hl�B�8rpLZ��ڐr�̊N0��I`f��R�%S���+��߮��#W^K0)z@o-8)2��M�Gٕ�־�C�5�ەm[��ꉀn���j)���f�E��"k�� ��^�"BHc���Zf�?�\����-ݺ<����͢<_Py���_���麖Z��1�g��V{�����**@�Fp^Db%���s%�+o���5A^�Me4�����|�
���\3��0�W{����2YJ@����<�(��ԕ_�����E�5�i��^_�M�An�,��b���J�P��B6"_Y�����@�mmZ�-ͻl�s[�V�,_*̲YPCo��U_귪櫰�%��F+9��ڏ2����j_	2F��9�ӌ���I��5%o�����7EǊn��*��)XnZ��I$��?6��VK_��a��sV>��R%a���bt$�уB�Cm�]���>'E�#�]@�b
�#�.2p)P2*���B��Wۥd������k���DyDN^�قw1Br�~Z��sՕ�G=���	�� ���ۚ2ͬ���&ڥR�(��{Z�UM?<$��ӏ�ʐb��z-HN�u��a��A�,R�\c�i���q0E��׌�ҏ�'��Y]���l��r�g��W{��(��4��Uq��H/�\��d]W~'��ʆlq��9�{7�j���qjێik�x�.�\�Gm(R|�^���%dŗBJ06���4�6� I�6)QD!�0Yr��?rm��nz�Ɋ(�)Y��쮵'�o�C��%��	Q@QԜY����em&�F$� ZjW��t�rd�c�Lh[=����O/q�B려�.�|{K3�X�_IF��):ʘY2��^���Q	��.蘠<FY���$�3Y��%k�X5u�j���L����Fv��x��!st�r#�4"`"e[��8+�5E�%b\r;h�$�I؋j��H�dO��(3������u1�#�ʻJ�Eٛ�:mT܏����&A+w6���|����#��s�Uj����F�c}^����o#D�      ~   �   x�}̱!���"}�O����,i���G��@�'�i4d�y�ņ[�Ι�cӋՖH,d�R��HZb�H�]kEv��������=�9L.WFH͓`W���iBk��A>:_Bb�
��c�������T�k�ܥ�/�.2I      }   �   x���1n�0���:E��)Q���c�=@��,	`;����N����љ���l9BC6P�����k��X��2E�0��Ӆ�[}��"��;&�����.����U�U��w�����k.�!�����AK��e&P�
�Y{O:�듻��ܶ�v�=S0՘�hf�6�t�gD��s�4}��80���j/��7Cn��g�Z#�Rε�A&��mݖ�mGO(+���!�3�}^      q   V   x��0��֋[/���_���[/l���9��Lu�u�-��̬L�-ʹ��Hq]�{aǅměg��<�W� g�:"     