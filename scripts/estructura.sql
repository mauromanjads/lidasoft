--
-- PostgreSQL database dump
--

\restrict yeX6mUJsbxLCXiUl7iEQrGMjVIOTGq6njzze82eMxjRAd3QGdJXleihE6aEdmiK

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-11-28 13:52:03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS lidasoft;
--
-- TOC entry 5098 (class 1262 OID 16602)
-- Name: lidasoft; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE lidasoft WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Colombia.1252';


ALTER DATABASE lidasoft OWNER TO postgres;

\unrestrict yeX6mUJsbxLCXiUl7iEQrGMjVIOTGq6njzze82eMxjRAd3QGdJXleihE6aEdmiK
\connect lidasoft
\restrict yeX6mUJsbxLCXiUl7iEQrGMjVIOTGq6njzze82eMxjRAd3QGdJXleihE6aEdmiK

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16627)
-- Name: ciiu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ciiu (
    id integer NOT NULL,
    codigo character varying(10) NOT NULL,
    descripcion character varying(200)
);


ALTER TABLE public.ciiu OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16626)
-- Name: ciiu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.ciiu ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ciiu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 232 (class 1259 OID 16650)
-- Name: departamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departamentos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    codigo_dian character varying(10),
    pais_id integer NOT NULL
);


ALTER TABLE public.departamentos OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16649)
-- Name: departamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.departamentos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.departamentos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 16635)
-- Name: generos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.generos (
    id integer NOT NULL,
    codigo character varying(5),
    descripcion character varying(50)
);


ALTER TABLE public.generos OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16634)
-- Name: generos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.generos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.generos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 234 (class 1259 OID 16664)
-- Name: municipios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.municipios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    codigo_dian character varying(10),
    departamento_id integer NOT NULL
);


ALTER TABLE public.municipios OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16663)
-- Name: municipios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.municipios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.municipios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 230 (class 1259 OID 16642)
-- Name: paises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paises (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    codigo_dian character varying(10)
);


ALTER TABLE public.paises OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16641)
-- Name: paises_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.paises ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.paises_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 16612)
-- Name: regimenestributarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.regimenestributarios (
    id integer NOT NULL,
    codigo character varying(50),
    descripcion character varying(100) NOT NULL
);


ALTER TABLE public.regimenestributarios OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16611)
-- Name: regimenestributarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.regimenestributarios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.regimenestributarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 236 (class 1259 OID 16678)
-- Name: terceros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.terceros (
    id integer CONSTRAINT clientes_id_not_null NOT NULL,
    tipo_persona character(1) DEFAULT 'N'::bpchar,
    tipo_documento_id integer,
    documento character varying(20) CONSTRAINT clientes_nit_not_null NOT NULL,
    dv character varying(1),
    nombre character varying(150),
    primer_nombre character varying(100),
    segundo_nombre character varying(100),
    primer_apellido character varying(100),
    segundo_apellido character varying(100),
    fecha_nacimiento date,
    genero_id integer,
    razon_social character varying(200),
    nombre_comercial character varying(150),
    regimen_id integer,
    tipo_responsable_id integer,
    gran_contribuyente boolean DEFAULT false,
    autoretenedor boolean DEFAULT false,
    ciiu_id integer,
    direccion character varying(200),
    municipio_id integer,
    telefono character varying(50),
    celular character varying(50),
    whatsapp character varying(50),
    correo character varying(150),
    pagina_web character varying(150),
    pais_id integer,
    lista_precio_id integer,
    vendedor_id integer,
    tiene_cupo boolean DEFAULT false,
    cupo_credito numeric(18,2) DEFAULT 0,
    plazo_dias integer DEFAULT 0,
    acepta_factura_electronica boolean DEFAULT true,
    recibe_correo boolean DEFAULT true,
    estado character(1) DEFAULT 'A'::bpchar,
    notas character varying(1000),
    usuario_creacion character varying(100),
    fecha_creacion timestamp without time zone DEFAULT now(),
    usuario_modifico character varying(100),
    fecha_modificacion timestamp without time zone,
    departamento_id integer,
    tipotercero character varying(100)
);


ALTER TABLE public.terceros OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16677)
-- Name: terceros_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.terceros ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.terceros_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 16620)
-- Name: tiporesponsable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tiporesponsable (
    id integer NOT NULL,
    codigo character varying(20),
    descripcion character varying(100)
);


ALTER TABLE public.tiporesponsable OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16619)
-- Name: tiporesponsable_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tiporesponsable ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tiporesponsable_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16604)
-- Name: tiposdocumento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tiposdocumento (
    id integer NOT NULL,
    codigo character varying(10) NOT NULL,
    descripcion character varying(100)
);


ALTER TABLE public.tiposdocumento OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16603)
-- Name: tiposdocumento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tiposdocumento ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tiposdocumento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 238 (class 1259 OID 16728)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    usuario character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    nombre character varying(100),
    rol character varying(50) DEFAULT 'usuario'::character varying,
    activo boolean DEFAULT true,
    creado_en timestamp without time zone DEFAULT now()
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16727)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 237
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4911 (class 2604 OID 16731)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4922 (class 2606 OID 16633)
-- Name: ciiu ciiu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciiu
    ADD CONSTRAINT ciiu_pkey PRIMARY KEY (id);


--
-- TOC entry 4928 (class 2606 OID 16657)
-- Name: departamentos departamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos
    ADD CONSTRAINT departamentos_pkey PRIMARY KEY (id);


--
-- TOC entry 4924 (class 2606 OID 16640)
-- Name: generos generos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generos
    ADD CONSTRAINT generos_pkey PRIMARY KEY (id);


--
-- TOC entry 4930 (class 2606 OID 16671)
-- Name: municipios municipios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT municipios_pkey PRIMARY KEY (id);


--
-- TOC entry 4926 (class 2606 OID 16648)
-- Name: paises paises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paises
    ADD CONSTRAINT paises_pkey PRIMARY KEY (id);


--
-- TOC entry 4918 (class 2606 OID 16618)
-- Name: regimenestributarios regimenestributarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regimenestributarios
    ADD CONSTRAINT regimenestributarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4932 (class 2606 OID 16696)
-- Name: terceros terceros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT terceros_pkey PRIMARY KEY (id);


--
-- TOC entry 4920 (class 2606 OID 16625)
-- Name: tiporesponsable tiporesponsable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiporesponsable
    ADD CONSTRAINT tiporesponsable_pkey PRIMARY KEY (id);


--
-- TOC entry 4916 (class 2606 OID 16610)
-- Name: tiposdocumento tiposdocumento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiposdocumento
    ADD CONSTRAINT tiposdocumento_pkey PRIMARY KEY (id);


--
-- TOC entry 4934 (class 2606 OID 16739)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4935 (class 1259 OID 16740)
-- Name: usuarios_usuario_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX usuarios_usuario_uindex ON public.usuarios USING btree (usuario);


--
-- TOC entry 4936 (class 2606 OID 16658)
-- Name: departamentos departamentos_pais_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos
    ADD CONSTRAINT departamentos_pais_id_fkey FOREIGN KEY (pais_id) REFERENCES public.paises(id);


--
-- TOC entry 4938 (class 2606 OID 16707)
-- Name: terceros fk_terceros_ciiu; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_ciiu FOREIGN KEY (ciiu_id) REFERENCES public.ciiu(id);


--
-- TOC entry 4939 (class 2606 OID 16741)
-- Name: terceros fk_terceros_departamento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_departamento FOREIGN KEY (departamento_id) REFERENCES public.departamentos(id);


--
-- TOC entry 4940 (class 2606 OID 16712)
-- Name: terceros fk_terceros_genero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_genero FOREIGN KEY (genero_id) REFERENCES public.generos(id);


--
-- TOC entry 4941 (class 2606 OID 16717)
-- Name: terceros fk_terceros_municipio; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_municipio FOREIGN KEY (municipio_id) REFERENCES public.municipios(id);


--
-- TOC entry 4942 (class 2606 OID 16722)
-- Name: terceros fk_terceros_pais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_pais FOREIGN KEY (pais_id) REFERENCES public.paises(id);


--
-- TOC entry 4943 (class 2606 OID 16697)
-- Name: terceros fk_terceros_regimen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_regimen FOREIGN KEY (regimen_id) REFERENCES public.regimenestributarios(id);


--
-- TOC entry 4944 (class 2606 OID 16702)
-- Name: terceros fk_terceros_tiporesponsable; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_tiporesponsable FOREIGN KEY (tipo_responsable_id) REFERENCES public.tiporesponsable(id);


--
-- TOC entry 4945 (class 2606 OID 16753)
-- Name: terceros fk_terceros_tiposdocumento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_tiposdocumento FOREIGN KEY (tipo_documento_id) REFERENCES public.tiposdocumento(id) NOT VALID;


--
-- TOC entry 4937 (class 2606 OID 16672)
-- Name: municipios municipios_departamento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT municipios_departamento_id_fkey FOREIGN KEY (departamento_id) REFERENCES public.departamentos(id);


-- Completed on 2025-11-28 13:52:03

--
-- PostgreSQL database dump complete
--

\unrestrict yeX6mUJsbxLCXiUl7iEQrGMjVIOTGq6njzze82eMxjRAd3QGdJXleihE6aEdmiK

