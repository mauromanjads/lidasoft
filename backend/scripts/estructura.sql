CREATE TABLE public.categorias (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    estado boolean DEFAULT true,
    creado timestamp without time zone DEFAULT now()
);


ALTER TABLE public.categorias OWNER TO neondb_owner;

CREATE SEQUENCE public.categorias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 226 (class 1259 OID 16627)
-- Name: ciiu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ciiu (
    id integer NOT NULL,
    codigo character varying(10) NOT NULL,
    descripcion character varying(200)
);


ALTER TABLE public.ciiu OWNER TO neondb_owner;

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


ALTER TABLE public.departamentos OWNER TO neondb_owner;

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


ALTER TABLE public.generos OWNER TO neondb_owner;

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


ALTER TABLE public.municipios OWNER TO neondb_owner;

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


ALTER TABLE public.paises OWNER TO neondb_owner;

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
-- TOC entry 241 (class 1259 OID 16768)
-- Name: productos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_id_seq OWNER TO neondb_owner;

--
-- TOC entry 242 (class 1259 OID 16769)
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    id integer DEFAULT nextval('public.productos_id_seq'::regclass) NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(255) NOT NULL,
    descripcion text,
    activo boolean DEFAULT true,
    codigo_barra character varying(50),
    categoria_id integer
);


ALTER TABLE public.productos OWNER TO neondb_owner;

--
-- TOC entry 245 (class 1259 OID 16806)
-- Name: productos_precios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_precios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_precios_id_seq OWNER TO neondb_owner;

--
-- TOC entry 246 (class 1259 OID 16807)
-- Name: productos_precios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos_precios (
    id integer DEFAULT nextval('public.productos_precios_id_seq'::regclass) NOT NULL,
    presentacion_id integer NOT NULL,
    lista_precio character varying(50) DEFAULT 'GENERAL'::character varying NOT NULL,
    precio numeric(14,2) NOT NULL,
    iva_porcentaje numeric(5,2) DEFAULT 0,
    fecha_desde date DEFAULT CURRENT_DATE NOT NULL,
    fecha_hasta date,
    activo boolean DEFAULT true
);


ALTER TABLE public.productos_precios OWNER TO neondb_owner;

--
-- TOC entry 243 (class 1259 OID 16783)
-- Name: productos_presentaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_presentaciones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_presentaciones_id_seq OWNER TO neondb_owner;

--
-- TOC entry 244 (class 1259 OID 16784)
-- Name: productos_presentaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos_presentaciones (
    id integer DEFAULT nextval('public.productos_presentaciones_id_seq'::regclass) NOT NULL,
    producto_id integer NOT NULL,
    tipo_presentacion character varying(50) NOT NULL,
    cantidad_equivalente numeric(14,2) DEFAULT 1,
    unidad_medida_id integer NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE public.productos_presentaciones OWNER TO neondb_owner;

--
-- TOC entry 222 (class 1259 OID 16612)
-- Name: regimenestributarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.regimenestributarios (
    id integer NOT NULL,
    codigo character varying(50),
    descripcion character varying(100) NOT NULL
);


ALTER TABLE public.regimenestributarios OWNER TO neondb_owner;

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


ALTER TABLE public.terceros OWNER TO neondb_owner;

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


ALTER TABLE public.tiporesponsable OWNER TO neondb_owner;

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


ALTER TABLE public.tiposdocumento OWNER TO neondb_owner;

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
-- TOC entry 239 (class 1259 OID 16758)
-- Name: unidades_medida_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unidades_medida_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unidades_medida_id_seq OWNER TO neondb_owner;

--
-- TOC entry 240 (class 1259 OID 16759)
-- Name: unidades_medida; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unidades_medida (
    id integer DEFAULT nextval('public.unidades_medida_id_seq'::regclass) NOT NULL,
    codigo character varying(10) NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.unidades_medida OWNER TO neondb_owner;

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


ALTER TABLE public.usuarios OWNER TO neondb_owner;

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


ALTER SEQUENCE public.usuarios_id_seq OWNER TO neondb_owner;

--
-- TOC entry 5162 (class 0 OID 0)
-- Dependencies: 237
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4936 (class 2604 OID 16731)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4992 (class 2606 OID 16847)
-- Name: categorias categorias_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_nombre_key UNIQUE (nombre);


--
-- TOC entry 4994 (class 2606 OID 16845)
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- TOC entry 4961 (class 2606 OID 16633)
-- Name: ciiu ciiu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciiu
    ADD CONSTRAINT ciiu_pkey PRIMARY KEY (id);


--
-- TOC entry 4967 (class 2606 OID 16657)
-- Name: departamentos departamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos
    ADD CONSTRAINT departamentos_pkey PRIMARY KEY (id);


--
-- TOC entry 4963 (class 2606 OID 16640)
-- Name: generos generos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generos
    ADD CONSTRAINT generos_pkey PRIMARY KEY (id);


--
-- TOC entry 4969 (class 2606 OID 16671)
-- Name: municipios municipios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT municipios_pkey PRIMARY KEY (id);


--
-- TOC entry 4965 (class 2606 OID 16648)
-- Name: paises paises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paises
    ADD CONSTRAINT paises_pkey PRIMARY KEY (id);


--
-- TOC entry 4979 (class 2606 OID 16832)
-- Name: productos productos_codigo_barras_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_codigo_barras_key UNIQUE (codigo_barra);


--
-- TOC entry 4981 (class 2606 OID 16782)
-- Name: productos productos_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_codigo_key UNIQUE (codigo);


--
-- TOC entry 4983 (class 2606 OID 16780)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- TOC entry 4990 (class 2606 OID 16821)
-- Name: productos_precios productos_precios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_precios
    ADD CONSTRAINT productos_precios_pkey PRIMARY KEY (id);


--
-- TOC entry 4986 (class 2606 OID 16795)
-- Name: productos_presentaciones productos_presentaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_presentaciones
    ADD CONSTRAINT productos_presentaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4957 (class 2606 OID 16618)
-- Name: regimenestributarios regimenestributarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regimenestributarios
    ADD CONSTRAINT regimenestributarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4971 (class 2606 OID 16696)
-- Name: terceros terceros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT terceros_pkey PRIMARY KEY (id);


--
-- TOC entry 4959 (class 2606 OID 16625)
-- Name: tiporesponsable tiporesponsable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiporesponsable
    ADD CONSTRAINT tiporesponsable_pkey PRIMARY KEY (id);


--
-- TOC entry 4955 (class 2606 OID 16610)
-- Name: tiposdocumento tiposdocumento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiposdocumento
    ADD CONSTRAINT tiposdocumento_pkey PRIMARY KEY (id);


--
-- TOC entry 4976 (class 2606 OID 16767)
-- Name: unidades_medida unidades_medida_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidades_medida
    ADD CONSTRAINT unidades_medida_pkey PRIMARY KEY (id);


--
-- TOC entry 4973 (class 2606 OID 16739)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4987 (class 1259 OID 16829)
-- Name: idx_precios_presentacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_precios_presentacion ON public.productos_precios USING btree (presentacion_id);


--
-- TOC entry 4988 (class 1259 OID 16830)
-- Name: idx_precios_vigencia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_precios_vigencia ON public.productos_precios USING btree (fecha_hasta, activo);


--
-- TOC entry 4984 (class 1259 OID 16828)
-- Name: idx_presentaciones_producto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_presentaciones_producto ON public.productos_presentaciones USING btree (producto_id);


--
-- TOC entry 4977 (class 1259 OID 16827)
-- Name: idx_productos_codigo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_productos_codigo ON public.productos USING btree (codigo);


--
-- TOC entry 4974 (class 1259 OID 16740)
-- Name: usuarios_usuario_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX usuarios_usuario_uindex ON public.usuarios USING btree (usuario);


--
-- TOC entry 4995 (class 2606 OID 16658)
-- Name: departamentos departamentos_pais_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos
    ADD CONSTRAINT departamentos_pais_id_fkey FOREIGN KEY (pais_id) REFERENCES public.paises(id);


--
-- TOC entry 5005 (class 2606 OID 16848)
-- Name: productos fk_categoria; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES public.categorias(id);


--
-- TOC entry 4997 (class 2606 OID 16707)
-- Name: terceros fk_terceros_ciiu; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_ciiu FOREIGN KEY (ciiu_id) REFERENCES public.ciiu(id);


--
-- TOC entry 4998 (class 2606 OID 16741)
-- Name: terceros fk_terceros_departamento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_departamento FOREIGN KEY (departamento_id) REFERENCES public.departamentos(id);


--
-- TOC entry 4999 (class 2606 OID 16712)
-- Name: terceros fk_terceros_genero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_genero FOREIGN KEY (genero_id) REFERENCES public.generos(id);


--
-- TOC entry 5000 (class 2606 OID 16717)
-- Name: terceros fk_terceros_municipio; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_municipio FOREIGN KEY (municipio_id) REFERENCES public.municipios(id);


--
-- TOC entry 5001 (class 2606 OID 16722)
-- Name: terceros fk_terceros_pais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_pais FOREIGN KEY (pais_id) REFERENCES public.paises(id);


--
-- TOC entry 5002 (class 2606 OID 16697)
-- Name: terceros fk_terceros_regimen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_regimen FOREIGN KEY (regimen_id) REFERENCES public.regimenestributarios(id);


--
-- TOC entry 5003 (class 2606 OID 16702)
-- Name: terceros fk_terceros_tiporesponsable; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_tiporesponsable FOREIGN KEY (tipo_responsable_id) REFERENCES public.tiporesponsable(id);


--
-- TOC entry 5004 (class 2606 OID 16753)
-- Name: terceros fk_terceros_tiposdocumento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terceros
    ADD CONSTRAINT fk_terceros_tiposdocumento FOREIGN KEY (tipo_documento_id) REFERENCES public.tiposdocumento(id) NOT VALID;


--
-- TOC entry 4996 (class 2606 OID 16672)
-- Name: municipios municipios_departamento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT municipios_departamento_id_fkey FOREIGN KEY (departamento_id) REFERENCES public.departamentos(id);


--
-- TOC entry 5008 (class 2606 OID 16822)
-- Name: productos_precios productos_precios_presentacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_precios
    ADD CONSTRAINT productos_precios_presentacion_id_fkey FOREIGN KEY (presentacion_id) REFERENCES public.productos_presentaciones(id) ON DELETE CASCADE;


--
-- TOC entry 5006 (class 2606 OID 16796)
-- Name: productos_presentaciones productos_presentaciones_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_presentaciones
    ADD CONSTRAINT productos_presentaciones_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;


--
-- TOC entry 5007 (class 2606 OID 16801)
-- Name: productos_presentaciones productos_presentaciones_unidad_medida_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_presentaciones
    ADD CONSTRAINT productos_presentaciones_unidad_medida_id_fkey FOREIGN KEY (unidad_medida_id) REFERENCES public.unidades_medida(id);

