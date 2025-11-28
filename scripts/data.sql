--
-- PostgreSQL database dump
--

\restrict 33cSoKKok6RY2wrnlNtTaa5WOEA77lIo1bOYaQSmyEnhlrBG74y0uxQBL8LUgci

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-11-28 13:54:21

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
-- TOC entry 5086 (class 0 OID 16627)
-- Dependencies: 226
-- Data for Name: ciiu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ciiu (id, codigo, descripcion) FROM stdin;
1	1	sistemas
\.


--
-- TOC entry 5090 (class 0 OID 16642)
-- Dependencies: 230
-- Data for Name: paises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paises (id, nombre, codigo_dian) FROM stdin;
1	COLOMBIA	170
\.


--
-- TOC entry 5092 (class 0 OID 16650)
-- Dependencies: 232
-- Data for Name: departamentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departamentos (id, nombre, codigo_dian, pais_id) FROM stdin;
\.


--
-- TOC entry 5088 (class 0 OID 16635)
-- Dependencies: 228
-- Data for Name: generos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.generos (id, codigo, descripcion) FROM stdin;
1	M	Masculino
2	F	Femenino
3	O	Otro
4	N	No informado
\.


--
-- TOC entry 5094 (class 0 OID 16664)
-- Dependencies: 234
-- Data for Name: municipios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.municipios (id, nombre, codigo_dian, departamento_id) FROM stdin;
\.


--
-- TOC entry 5082 (class 0 OID 16612)
-- Dependencies: 222
-- Data for Name: regimenestributarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.regimenestributarios (id, codigo, descripcion) FROM stdin;
1	SIMPLE	Régimen simple
2	ORDINARIO	Régimen ordinario
4	ESPECIAL	Régimen especial
3	NO_RESP	No responsable renta
\.


--
-- TOC entry 5084 (class 0 OID 16620)
-- Dependencies: 224
-- Data for Name: tiporesponsable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tiporesponsable (id, codigo, descripcion) FROM stdin;
1	49	Responsable de IVA - Código 49
2	R-99-PN	R-99-PN (No Responsable)
\.


--
-- TOC entry 5080 (class 0 OID 16604)
-- Dependencies: 220
-- Data for Name: tiposdocumento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tiposdocumento (id, codigo, descripcion) FROM stdin;
1	CC	Cédula de ciudadanía
2	NIT	NIT
3	CE	Cédula de extranjería
4	TI	Tarjeta de identidad
5	PPN	Pasaporte
\.


--
-- TOC entry 5096 (class 0 OID 16678)
-- Dependencies: 236
-- Data for Name: terceros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.terceros (id, tipo_persona, tipo_documento_id, documento, dv, nombre, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, genero_id, razon_social, nombre_comercial, regimen_id, tipo_responsable_id, gran_contribuyente, autoretenedor, ciiu_id, direccion, municipio_id, telefono, celular, whatsapp, correo, pagina_web, pais_id, lista_precio_id, vendedor_id, tiene_cupo, cupo_credito, plazo_dias, acepta_factura_electronica, recibe_correo, estado, notas, usuario_creacion, fecha_creacion, usuario_modifico, fecha_modificacion, departamento_id, tipotercero) FROM stdin;
2	N	1	728926	\N	MAURICIO	JOSE	MANJARRES			\N	\N			\N	\N	\N	\N	\N		\N	333456			\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clientes
6	N	1	56	\N	pepe					\N	\N			\N	\N	\N	\N	\N		\N				\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clientes
1	N	3	222222222222	\N	CONSUMIDOR FINAL	\N	\N	\N	\N	2025-11-04	\N	CONSUMIDOR FINAL	\N	3	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	f	0.00	0	t	t	A	\N	system	2025-11-24 18:54:07.401075	\N	\N	\N	clientes
3	J	1	1	\N	BERNARDO					2025-11-05	\N			\N	\N	\N	\N	\N		\N				\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clientes
13	N	1	34	\N	ANGELAa					1996-02-15	\N			\N	\N	\N	\N	\N		\N				\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clientes
17	N	1	963		bbbb					\N	2			\N	\N	\N	\N	\N		\N				\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clientes
18	N	1	567	1	aaaad					\N	1			2	\N	\N	\N	\N		\N				\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clientes
19	N	1	99898		aaas					\N	1			1	2	\N	\N	\N		\N				\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clientes
15	N	1	7289269	\N	ABELARD					\N	1			1	1	\N	\N	1		\N				\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clientes
21	N	1	5589	6	MAURICIOx			sss		2025-11-03	1			1	1	\N	\N	1		\N				ddxd@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clientes
22	N	1	80090196589		aaasdf			manjarres		\N	1			1	1	\N	\N	1		\N				ddd@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clientes
23	N	1	72289266		MAURICIO MANJARRES	mausfq	sdfasd	dsdfgq	dsdfg	\N	\N			\N	\N	\N	\N	\N		\N				mauromanja@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N	\N	\N	clientes
24	N	1	55896		bbbbbb					\N	\N			\N	\N	\N	\N	\N		\N				na@info.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	 	\N	\N	\N	\N	\N	\N	clientes
14	N	1	8989	\N	carlos					\N	1			1	\N	\N	\N	\N		\N		3017448596		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N	\N	\N	clientes
26	N	1	98584791		ANTONIO JOSE NARIÑO ALZATE	ANTONIO	JOSE	NARIÑO	ALZATE	\N	\N			\N	\N	\N	\N	\N		\N				tucorreo@info.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N	\N	\N	clientes
27	J	2	90008471589458	2	ACUARIOS DEL LORO					\N	\N	ACUARIOS DEL LORO		\N	\N	\N	\N	\N		\N				tucorreo@info.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N	\N	\N	clientes
16	J	2	15	3	AASCX					2025-11-12	1	AASCX		2	2	\N	\N	1		\N		3333333		dd@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	I	\N	\N	\N	\N	\N	\N	clientes
25	J	2	900185479822	2	fff					\N	1	fff		1	\N	\N	\N	\N		\N		4878		tucorreo@info.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N	\N	\N	clientes
28	J	2	5589612	2	aaaaaaaaaaaa					2025-11-04	3	aaaaaaaaaaaa	\N	3	\N	\N	\N	\N	fasdfasdfasdf	\N	323234	99999	f234234234	mauromanja@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N	\N	\N	clientes
29	N	1	555		qasa aa ss ss	qasa	aa	ss	ss	\N	\N			\N	\N	\N	\N	\N		\N				tucorreo@info.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N	\N	\N	clientes
30	J	2	344444	1	dfsdf					\N	\N	dfsdf		\N	\N	\N	\N	\N		\N				tucorreo@info.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N	\N	\N	clientes
31	J	2	95174	1	aaaaq					\N	\N	aaaaq		\N	\N	\N	\N	\N		\N				tucorreo@info.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N	\N	\N	clientes
5	N	1	4434	\N	jpeterx					\N	\N			\N	\N	\N	\N	\N		\N				\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clientes
4	N	2	111	\N	oooo					2025-11-07	\N			\N	\N	\N	\N	\N		\N				\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clientes
20	N	1	3333		aaasv da AAAA	aaasv	da	AAAA		\N	1			1	1	\N	\N	1		\N				m@hotmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	clientes,proveedores
32	J	2	555888444	8	LA CASA DEL CARNAVALX					\N	\N	LA CASA DEL CARNAVALX		\N	\N	\N	\N	\N		\N				tucorreo@info.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N	2025-11-28 10:28:19.970005	\N	proveedores
33	N	1	26845		PEDRITO PEREZ	PEDRITO	PEREZ			\N	1			1	\N	\N	\N	\N		\N				tucorreo@info.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	I	\N	\N	2025-11-28 10:28:50.021222	\N	2025-11-28 10:29:15.417967	\N	proveedores
\.


--
-- TOC entry 5098 (class 0 OID 16728)
-- Dependencies: 238
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, usuario, password, nombre, rol, activo, creado_en) FROM stdin;
1	admin	$2b$12$ZhZHwzL763ZLkyfuM/SbMee9tFdcBmRINjVoV8hyRFcXDgiNzlb8u	Mauricio Manjarres	usuario	t	2025-11-21 12:44:06.333
\.


--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 225
-- Name: ciiu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ciiu_id_seq', 1, true);


--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 231
-- Name: departamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departamentos_id_seq', 1, false);


--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 227
-- Name: generos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.generos_id_seq', 4, true);


--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 233
-- Name: municipios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.municipios_id_seq', 1, false);


--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 229
-- Name: paises_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paises_id_seq', 1, true);


--
-- TOC entry 5109 (class 0 OID 0)
-- Dependencies: 221
-- Name: regimenestributarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.regimenestributarios_id_seq', 4, true);


--
-- TOC entry 5110 (class 0 OID 0)
-- Dependencies: 235
-- Name: terceros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.terceros_id_seq', 33, true);


--
-- TOC entry 5111 (class 0 OID 0)
-- Dependencies: 223
-- Name: tiporesponsable_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tiporesponsable_id_seq', 2, true);


--
-- TOC entry 5112 (class 0 OID 0)
-- Dependencies: 219
-- Name: tiposdocumento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tiposdocumento_id_seq', 5, true);


--
-- TOC entry 5113 (class 0 OID 0)
-- Dependencies: 237
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, true);


-- Completed on 2025-11-28 13:54:21

--
-- PostgreSQL database dump complete
--

\unrestrict 33cSoKKok6RY2wrnlNtTaa5WOEA77lIo1bOYaQSmyEnhlrBG74y0uxQBL8LUgci

