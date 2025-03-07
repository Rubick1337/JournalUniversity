PGDMP      
    	            }            dbTj    17.0    17.0 8    A           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            B           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            C           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            D           1262    38851    dbTj    DATABASE     z   CREATE DATABASE "dbTj" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
    DROP DATABASE "dbTj";
                     postgres    false            �            1255    39015    get_group_name(uuid)    FUNCTION     `  CREATE FUNCTION public.get_group_name(group_id uuid) RETURNS json
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
       public               postgres    false            �            1259    38927    AcademicSpecialties    TABLE     �   CREATE TABLE public."AcademicSpecialties" (
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 )   DROP TABLE public."AcademicSpecialties";
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
       public               postgres    false    227            E           0    0    Students_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Students_id_seq" OWNED BY public."Students".id;
          public               postgres    false    226            �            1259    38961 	   Subgroups    TABLE     �   CREATE TABLE public."Subgroups" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    group_id uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Subgroups";
       public         heap r       postgres    false            �            1259    38859    TeachingPositions    TABLE     �   CREATE TABLE public."TeachingPositions" (
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
       public         heap r       postgres    false            �           2604    38991    Students id    DEFAULT     n   ALTER TABLE ONLY public."Students" ALTER COLUMN id SET DEFAULT nextval('public."Students_id_seq"'::regclass);
 <   ALTER TABLE public."Students" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    227    226    227            :          0    38927    AcademicSpecialties 
   TABLE DATA           U   COPY public."AcademicSpecialties" (code, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    223   jV       9          0    38910    Departments 
   TABLE DATA           �   COPY public."Departments" (id, name, full_name, chairperson_of_the_department_person_id, faculty_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    222   W       6          0    38864 	   Faculties 
   TABLE DATA           d   COPY public."Faculties" (id, name, full_name, dean_person_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    219   [       ;          0    38934    Groups 
   TABLE DATA           �   COPY public."Groups" (id, name, graduation_year, year_of_beginning_of_study, faculty_id, class_representative_person_id, department_id, specialty_code, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    224   �\       8          0    38898    Pairs 
   TABLE DATA           �   COPY public."Pairs" (id, weekday_number, name, start, "end", break_start, break_end, week_type_name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    221   Z]       4          0    38852    People 
   TABLE DATA           p   COPY public."People" (id, surname, name, middlename, phone_number, email, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    217   Ee       >          0    38988    Students 
   TABLE DATA           �   COPY public."Students" (id, count_reprimand, person_id, group_id, subgroup_id, perent_person_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    227   �e       <          0    38961 	   Subgroups 
   TABLE DATA           S   COPY public."Subgroups" (id, name, group_id, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    225   Of       5          0    38859    TeachingPositions 
   TABLE DATA           Q   COPY public."TeachingPositions" (id, name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    218   g       7          0    38876 	   WeekTypes 
   TABLE DATA           E   COPY public."WeekTypes" (name, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    220   �g       F           0    0    Students_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Students_id_seq"', 1, true);
          public               postgres    false    226            �           2606    38933 ,   AcademicSpecialties AcademicSpecialties_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public."AcademicSpecialties"
    ADD CONSTRAINT "AcademicSpecialties_pkey" PRIMARY KEY (code);
 Z   ALTER TABLE ONLY public."AcademicSpecialties" DROP CONSTRAINT "AcademicSpecialties_pkey";
       public                 postgres    false    223            �           2606    38916    Departments Departments_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_pkey";
       public                 postgres    false    222            �           2606    38870    Faculties Faculties_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Faculties"
    ADD CONSTRAINT "Faculties_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Faculties" DROP CONSTRAINT "Faculties_pkey";
       public                 postgres    false    219            �           2606    38940    Groups Groups_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_pkey";
       public                 postgres    false    224            �           2606    38904    Pairs Pairs_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Pairs"
    ADD CONSTRAINT "Pairs_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Pairs" DROP CONSTRAINT "Pairs_pkey";
       public                 postgres    false    221            �           2606    38858    People People_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."People"
    ADD CONSTRAINT "People_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."People" DROP CONSTRAINT "People_pkey";
       public                 postgres    false    217            �           2606    38994    Students Students_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_pkey";
       public                 postgres    false    227            �           2606    38965    Subgroups Subgroups_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Subgroups"
    ADD CONSTRAINT "Subgroups_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Subgroups" DROP CONSTRAINT "Subgroups_pkey";
       public                 postgres    false    225            �           2606    38863 (   TeachingPositions TeachingPositions_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public."TeachingPositions"
    ADD CONSTRAINT "TeachingPositions_pkey" PRIMARY KEY (id);
 V   ALTER TABLE ONLY public."TeachingPositions" DROP CONSTRAINT "TeachingPositions_pkey";
       public                 postgres    false    218            �           2606    38880    WeekTypes WeekTypes_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."WeekTypes"
    ADD CONSTRAINT "WeekTypes_pkey" PRIMARY KEY (name);
 F   ALTER TABLE ONLY public."WeekTypes" DROP CONSTRAINT "WeekTypes_pkey";
       public                 postgres    false    220            �           2606    38917 D   Departments Departments_chairperson_of_the_department_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_chairperson_of_the_department_person_id_fkey" FOREIGN KEY (chairperson_of_the_department_person_id) REFERENCES public."People"(id);
 r   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_chairperson_of_the_department_person_id_fkey";
       public               postgres    false    217    4739    222            �           2606    38922 '   Departments Departments_faculty_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_faculty_id_fkey" FOREIGN KEY (faculty_id) REFERENCES public."Faculties"(id);
 U   ALTER TABLE ONLY public."Departments" DROP CONSTRAINT "Departments_faculty_id_fkey";
       public               postgres    false    219    222    4743            �           2606    38871 '   Faculties Faculties_dean_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Faculties"
    ADD CONSTRAINT "Faculties_dean_person_id_fkey" FOREIGN KEY (dean_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 U   ALTER TABLE ONLY public."Faculties" DROP CONSTRAINT "Faculties_dean_person_id_fkey";
       public               postgres    false    4739    217    219            �           2606    38946 1   Groups Groups_class_representative_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_class_representative_person_id_fkey" FOREIGN KEY (class_representative_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 _   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_class_representative_person_id_fkey";
       public               postgres    false    224    4739    217            �           2606    38951     Groups Groups_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public."Departments"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_department_id_fkey";
       public               postgres    false    222    224    4749            �           2606    38941    Groups Groups_faculty_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_faculty_id_fkey" FOREIGN KEY (faculty_id) REFERENCES public."Faculties"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 K   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_faculty_id_fkey";
       public               postgres    false    219    224    4743            �           2606    38956 !   Groups Groups_specialty_code_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Groups"
    ADD CONSTRAINT "Groups_specialty_code_fkey" FOREIGN KEY (specialty_code) REFERENCES public."AcademicSpecialties"(code) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public."Groups" DROP CONSTRAINT "Groups_specialty_code_fkey";
       public               postgres    false    4751    224    223            �           2606    38905    Pairs Pairs_week_type_name_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Pairs"
    ADD CONSTRAINT "Pairs_week_type_name_fkey" FOREIGN KEY (week_type_name) REFERENCES public."WeekTypes"(name);
 M   ALTER TABLE ONLY public."Pairs" DROP CONSTRAINT "Pairs_week_type_name_fkey";
       public               postgres    false    221    220    4745            �           2606    39000    Students Students_group_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_group_id_fkey";
       public               postgres    false    224    227    4753            �           2606    39010 '   Students Students_perent_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_perent_person_id_fkey" FOREIGN KEY (perent_person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 U   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_perent_person_id_fkey";
       public               postgres    false    4739    227    217            �           2606    38995     Students Students_person_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_person_id_fkey" FOREIGN KEY (person_id) REFERENCES public."People"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_person_id_fkey";
       public               postgres    false    4739    217    227            �           2606    39005 "   Students Students_subgroup_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT "Students_subgroup_id_fkey" FOREIGN KEY (subgroup_id) REFERENCES public."Subgroups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public."Students" DROP CONSTRAINT "Students_subgroup_id_fkey";
       public               postgres    false    225    4755    227            �           2606    38966 !   Subgroups Subgroups_group_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Subgroups"
    ADD CONSTRAINT "Subgroups_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public."Groups"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public."Subgroups" DROP CONSTRAINT "Subgroups_group_id_fkey";
       public               postgres    false    225    224    4753            :   �   x�}�A
�0D��)���ߤQڳx�Z
ݺ�
AQ�mz��7�W����0ü�ڒ�T*\�y��[���!�h�n|�#�0�vx`�3��z3[>��ԕ#
������&x[n��H��D�p���h��"�O�f���_X��As��Vk�P�f}      9   �  x�ŖKnG���)����Ç�	���9,*r(�lxc ��k�,*%RW�Q���eȘ,�E qf8-�����ǹ\U*3���Rb,�����y�^��t��m�������{���f6̇�m�_��}�χ����]a�Z(�P\HpJGpR-����`B��̌���?U����'&�ei��2(̀׌�R.�RA`&�tr�O��v�^�i9��M[���Q[��p6�h��v8�s���?9�!�#ζl7�	1
ԗ�\JkRU`j�׀�D(E�W��I���o�tڶ/��e�g�V3�;�]h����oo��K<_��l�FT�mz��3(�אS�Q��r�����f]���CT���������^3��E�D�5
���AO�{O]����@�j\��=��i�g�%���8CfȪ��ʨ�I�9��E���RW��v+:h�-�����tx�'�N�;�腠'�	WEoX*	���3s�Ŷ��C�ƥX��u,K�v@,q}R�p�\F��e������lP��v�՛q���lW�"g� 7�C_���ՂԆ���/��Y�O�Y7i��'��5�����-�[b|QF�(׎{d�w�bO^!A�6���[��F�LL%���s^ReB��f\������h(g4x)0��F����4�M�����ߗ]�>@�(z��Bm�����G���,�h �@	�ob����Zp=&ގs�Ҕ�`�t�+�+�k���ԑ1ɔ�M�Ѓ��@j�c"���Z��"z��e9�������Y	�D)���w���%6 e�K��w}����<� w�J����� i�Lu*x�F�q�45�*�Y+Q�(:f�4��D&��1�ߵ�p���Ų�-��3|�F�֧�[V����#�;����y�8-Ms�ɺb�]�^(?�t��s��ʙ4(��[z}ٍʮ���g?(��/������k��/��n�}��g�������v�w�gO���?���      6   �  x����n�0�������؎�!x�^b�y�P@D�=����J��-[������S�R@\&���|��������X�j���d��i�HQ�5��]}<�W�KݗWROP>�O���󡼓ƅ���:�P�݁v�	+
+����{�՘�g=z�e��z����E�GA��Բ+�y��\�VOmy#����Gٸ/�E�5�����Ԧ�0
�|N�Ӑ,��zB�+��M-��^ K�(k��$0�_�X>�#�i��PN'93�+�I~��)f����� ��/�<��R�N&x�%'�a���4�i'ŷ|������|��w��:?�|h�h��I�o��m�[v�vA�1:S�0��� �<��(�ojv��>�ղ��=�՜�5M�,�h�      ;   �   x�}���0c�
r�=����rT��oK�1БJ�P l�;w�Z�9��a��AUبq:�7X����/� �b�l�k!��IY@��d����!�a����X�ɽ1�L��`�w�I@��&��3!�`��(O\K������u�1~ ��3#      8   �  x���Kn&��תS��� L&��x�|�c6^7��0���1��7rT��M��*�Zh�P\�Cd��%�Qtt��� �V���a�P�h����/��������}��=��`���7ߏ7������������߾~����׏����}}K!�4
�%�{����Y��J���%� Y��g2k�����L)�v��������,��(m��
6��q n�Ik�dْW�T�N��G	�t�������7	�o�Y�S5�X�S����
5����3��78/�Y�)���g�qy ���eҘ#%%�ԝ~�[�e���c��˟g�w�f9��GiK3�ȍ�N��2�3���\ʐQ��E5�r/m�B�\'.Z�:C�:�Ȃ)�2(�O���T�`�C�|S�y~5��9p��#�I<z��Ӥ$�q�YT��kZ�`\#�3Raaf&ks�io�ڂ���'F�D��>����|��%�c������ǽ�Z�L*V�ت���L��8�ظ�$��0�[�E��<�������$��3j��O!ih"C�M�4z��k�T�΋j�9�^�&�6���~t�����WƂ�$�O;��;�Q�V�C�2w�z
�$*I������E5��G���Ih���@����lq,+���~�O;�KΔl�ą�Z�8%�t\U��5��yQ�s??J[Z�F�@� ��ad��k�-U̣�����Q�\��#\��Blp��&D9mSo�78/���r��4˂?���}���j�>����y�8J[W鸛	W���L�g��G����΋j���Vi&����(Jֹ�R
��2?�B�-tt��	/oFuPJ��+i�� ��=ޠ��e=�GiI�0Fc��!)��b�=b	�[P~܃^rba��X9c�B:�-h����g��yQ��|t�6K1�������t�*�X�2g��O{P=�GG	T"�`Bz�*	ײ"k�Z�#�΋j����� g;��@��TW(cyZR(���z���W�V$��6�~x1�֚�YU�78/���2�^k�'��Ss䎄�:�}���=���ͣ����#��Fv$x;�xΡ��e��78/�y������N�W�+iW�ΦѼυ���{�+N[sX��F���B�ʔ�.���A�����U^�^�JQ�������
�TP>�B�8�7/��
��S�|�+#����<O�GikҜ��8\�Ml#ַ�pQ��@���縣�����T�H�#�i�dC�78��y.桥�1��I�;`��BRr�kY�0�� =�GGiC@�^/�`⥓��B[S���΋Z���R{J�5#MSroǱc�j;����9�(!yt��U�� q�W�U�ҡ+�΋j����C���s��|]�!&�5շ��y�;J�'�k�7s$�Y15is��֢�Rop^T�<��Ϧ�E�M,8��؄Z0,F�΂��'�����8�W��olIN]3��z.b���E5�S�Q��T���׎u�c�d;z��3"�.��|ڃ^r6Y��Md�3Wl�C�}v"���<Oq�=m)�Dv��f��1�.ea�du��.�3T�^�����)�M��S`f2J:���.t��Ҧ#)�'�WF1$<��SL5�9w5w�D�#{pk=�)������YP�:�wd���|E��fkT��µd�7�x�uÒL��y:O���SC�s���U07��[K{�<"3����<�<�u�͊��T�7`�́�iui�f�`|ڃ�<��mκ8�EE�O��@/aϠ)IM��P��E-_Q°q'{�U|������{���f���i��w��,�"6�͹�kpy�^|���78/�����=LtwP�����W���8bIʠ|ڃ�<m�m�4j�k��X�Ã:�\���\˼�yQ��w�6� x�MJ3�w�)"g������(�����k�X��'���q���AD��ev���)�(m�i۶��X      4   m   x�}�1�0 ��yEw��1vL�+�,q���R����z�%Qg6�j[E!S,�f�J�jN2ex��_;<���� �v��Wi=~.`bE��i�i�s�B�@��k!� IO =      >   }   x�}���0ѳTE�<�v�����K�+�^�rAa�K$e�I��4��%=ԭ�Pɍ�'��;����6��T�"�X�N�����cڈL�:�@:��#|��7�F�/���Vk��j)      <   �   x���1�0E��ݑ+'vb�gaq��H\	f�Bz#�"!&����'����b����+(�	��X��Z�������_��7�+��@`�an%�5�1�l�.bL�����%�,��	�7�՚������v��6�U8��VBs�_i���H���}R���o��W�      5   �   x���=n�0���:E���$�H�ֱ@��%Q@�������v��|�Q8.�` �ja��y�I�|��a��X��#�G���5ʕ�%�����*z/	BmG4�֚�0�&��.o;�n:����)��\��(�0�&8�@�D"n��n����7WSGa���t��a�����c镖k�ڙA�Ƒf�ą EU���	��by���������>W��.ιo�P|�      7   V   x��0��֋[/���_���[/l���9��Lu�u�-��̬L�-ʹ��Hq]�{aǅměg��<�W� g�:"     