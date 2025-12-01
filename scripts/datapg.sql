--
-- PostgreSQL database dump
--

\restrict 8eiDLqABVsp0YU9efbv2NGivvyASbTeY2fbGri9ADMIoN5fLYl9eGZG9iKnFFIH

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-11-30 11:38:34

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
-- TOC entry 5137 (class 0 OID 16834)
-- Dependencies: 248
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categorias VALUES (1, 'Medicamentoos', 'Todo tipo de medicamentos', true, '2025-11-30 11:29:01.918219');
INSERT INTO public.categorias VALUES (2, 'Comestibles', 'Todo tipo de comestibles', true, '2025-11-30 11:29:01.918219');


--
-- TOC entry 5120 (class 0 OID 16627)
-- Dependencies: 226
-- Data for Name: ciiu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ciiu OVERRIDING SYSTEM VALUE VALUES (1, '1', 'sistemas');


--
-- TOC entry 5124 (class 0 OID 16642)
-- Dependencies: 230
-- Data for Name: paises; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.paises OVERRIDING SYSTEM VALUE VALUES (1, 'COLOMBIA', '170');


--
-- TOC entry 5126 (class 0 OID 16650)
-- Dependencies: 232
-- Data for Name: departamentos; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5122 (class 0 OID 16635)
-- Dependencies: 228
-- Data for Name: generos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.generos OVERRIDING SYSTEM VALUE VALUES (1, 'M', 'Masculino');
INSERT INTO public.generos OVERRIDING SYSTEM VALUE VALUES (2, 'F', 'Femenino');
INSERT INTO public.generos OVERRIDING SYSTEM VALUE VALUES (3, 'O', 'Otro');
INSERT INTO public.generos OVERRIDING SYSTEM VALUE VALUES (4, 'N', 'No informado');


--
-- TOC entry 5128 (class 0 OID 16664)
-- Dependencies: 234
-- Data for Name: municipios; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5134 (class 0 OID 16769)
-- Dependencies: 242
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.productos VALUES (1, 'ABC001', 'Ibuprofeno 400mg', 'Medicamento para dolor', true, NULL, NULL);
INSERT INTO public.productos VALUES (2, '', '', '', true, NULL, NULL);
INSERT INTO public.productos VALUES (3, '122123', 'FASDF', 'PRUEBA', true, NULL, NULL);
INSERT INTO public.productos VALUES (4, '111', 'ffff', 'dddd', true, NULL, NULL);
INSERT INTO public.productos VALUES (5, '1', 'sadasd', 'dsads', true, NULL, NULL);
INSERT INTO public.productos VALUES (6, '44', 'aaaa', 'sdfsd', true, NULL, NULL);
INSERT INTO public.productos VALUES (7, '77', 'ddd', 'fff', true, NULL, NULL);
INSERT INTO public.productos VALUES (8, '1212', 'aaa', 'dssdf', true, NULL, NULL);
INSERT INTO public.productos VALUES (9, 'bbb', 'bbbb', 'ffff', true, NULL, NULL);
INSERT INTO public.productos VALUES (11, 'CCC', 'CCCC', 'VVVV', true, NULL, NULL);
INSERT INTO public.productos VALUES (14, '55', 'FFF', 'FFF', true, NULL, NULL);


--
-- TOC entry 5133 (class 0 OID 16759)
-- Dependencies: 240
-- Data for Name: unidades_medida; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.unidades_medida VALUES (1, 'NIU', 'Unidad');
INSERT INTO public.unidades_medida VALUES (2, 'LTR', 'Litro');
INSERT INTO public.unidades_medida VALUES (3, 'KGM', 'Kilogramo');
INSERT INTO public.unidades_medida VALUES (4, 'MTR', 'Metro');


--
-- TOC entry 5135 (class 0 OID 16784)
-- Dependencies: 244
-- Data for Name: productos_presentaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.productos_presentaciones VALUES (1, 1, 'CAJA', 20.00, 1, true);
INSERT INTO public.productos_presentaciones VALUES (2, 1, 'BLISTER', 10.00, 1, true);
INSERT INTO public.productos_presentaciones VALUES (3, 1, 'UNIDAD', 1.00, 1, true);
INSERT INTO public.productos_presentaciones VALUES (4, 5, 'dsfsdf', 1.00, 1, true);
INSERT INTO public.productos_presentaciones VALUES (5, 6, 'dfsdfsd', 10.00, 1, true);
INSERT INTO public.productos_presentaciones VALUES (6, 7, 'qqqq', 1.00, 1, true);
INSERT INTO public.productos_presentaciones VALUES (7, 8, 'aaaa', 1.00, 1, true);
INSERT INTO public.productos_presentaciones VALUES (8, 9, 'CAJA', 1.00, 1, true);
INSERT INTO public.productos_presentaciones VALUES (9, 11, 'GDFGDF', 1.00, 1, true);
INSERT INTO public.productos_presentaciones VALUES (10, 14, 'FFF', 1.00, 1, true);


--
-- TOC entry 5136 (class 0 OID 16807)
-- Dependencies: 246
-- Data for Name: productos_precios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.productos_precios VALUES (1, 1, 'GENERAL', 50000.00, 19.00, '2025-11-28', NULL, true);
INSERT INTO public.productos_precios VALUES (2, 2, 'GENERAL', 30000.00, 19.00, '2025-11-28', NULL, true);
INSERT INTO public.productos_precios VALUES (3, 3, 'GENERAL', 5000.00, 0.00, '2025-11-28', NULL, true);
INSERT INTO public.productos_precios VALUES (4, 7, 'GENERAL', 111.00, 111.00, '2025-11-30', NULL, true);
INSERT INTO public.productos_precios VALUES (5, 10, 'GENERAL', 1.00, 2.00, '2025-11-30', NULL, true);


--
-- TOC entry 5116 (class 0 OID 16612)
-- Dependencies: 222
-- Data for Name: regimenestributarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.regimenestributarios OVERRIDING SYSTEM VALUE VALUES (1, 'SIMPLE', 'Régimen simple');
INSERT INTO public.regimenestributarios OVERRIDING SYSTEM VALUE VALUES (2, 'ORDINARIO', 'Régimen ordinario');
INSERT INTO public.regimenestributarios OVERRIDING SYSTEM VALUE VALUES (4, 'ESPECIAL', 'Régimen especial');
INSERT INTO public.regimenestributarios OVERRIDING SYSTEM VALUE VALUES (3, 'NO_RESP', 'No responsable renta');


--
-- TOC entry 5118 (class 0 OID 16620)
-- Dependencies: 224
-- Data for Name: tiporesponsable; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tiporesponsable OVERRIDING SYSTEM VALUE VALUES (1, '49', 'Responsable de IVA - Código 49');
INSERT INTO public.tiporesponsable OVERRIDING SYSTEM VALUE VALUES (2, 'R-99-PN', 'R-99-PN (No Responsable)');


--
-- TOC entry 5114 (class 0 OID 16604)
-- Dependencies: 220
-- Data for Name: tiposdocumento; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tiposdocumento OVERRIDING SYSTEM VALUE VALUES (1, 'CC', 'Cédula de ciudadanía');
INSERT INTO public.tiposdocumento OVERRIDING SYSTEM VALUE VALUES (2, 'NIT', 'NIT');
INSERT INTO public.tiposdocumento OVERRIDING SYSTEM VALUE VALUES (3, 'CE', 'Cédula de extranjería');
INSERT INTO public.tiposdocumento OVERRIDING SYSTEM VALUE VALUES (4, 'TI', 'Tarjeta de identidad');
INSERT INTO public.tiposdocumento OVERRIDING SYSTEM VALUE VALUES (5, 'PPN', 'Pasaporte');


--
-- TOC entry 5130 (class 0 OID 16678)
-- Dependencies: 236
-- Data for Name: terceros; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (2, 'N', 1, '728926', NULL, 'MAURICIO', 'JOSE', 'MANJARRES', '', '', NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '333456', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (6, 'N', 1, '56', NULL, 'pepe', '', '', '', '', NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (1, 'N', 3, '222222222222', NULL, 'CONSUMIDOR FINAL', NULL, NULL, NULL, NULL, '2025-11-04', NULL, 'CONSUMIDOR FINAL', NULL, 3, NULL, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, false, 0.00, 0, true, true, 'A', NULL, 'system', '2025-11-24 18:54:07.401075', NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (3, 'J', 1, '1', NULL, 'BERNARDO', '', '', '', '', '2025-11-05', NULL, '', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (13, 'N', 1, '34', NULL, 'ANGELAa', '', '', '', '', '1996-02-15', NULL, '', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (17, 'N', 1, '963', '', 'bbbb', '', '', '', '', NULL, 2, '', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (18, 'N', 1, '567', '1', 'aaaad', '', '', '', '', NULL, 1, '', '', 2, NULL, NULL, NULL, NULL, '', NULL, '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (19, 'N', 1, '99898', '', 'aaas', '', '', '', '', NULL, 1, '', '', 1, 2, NULL, NULL, NULL, '', NULL, '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (15, 'N', 1, '7289269', NULL, 'ABELARD', '', '', '', '', NULL, 1, '', '', 1, 1, NULL, NULL, 1, '', NULL, '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (21, 'N', 1, '5589', '6', 'MAURICIOx', '', '', 'sss', '', '2025-11-03', 1, '', '', 1, 1, NULL, NULL, 1, '', NULL, '', '', '', 'ddxd@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (22, 'N', 1, '80090196589', '', 'aaasdf', '', '', 'manjarres', '', NULL, 1, '', '', 1, 1, NULL, NULL, 1, '', NULL, '', '', '', 'ddd@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (23, 'N', 1, '72289266', '', 'MAURICIO MANJARRES', 'mausfq', 'sdfasd', 'dsdfgq', 'dsdfg', NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', 'mauromanja@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (24, 'N', 1, '55896', '', 'bbbbbb', '', '', '', '', NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', 'na@info.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ' ', NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (14, 'N', 1, '8989', NULL, 'carlos', '', '', '', '', NULL, 1, '', '', 1, NULL, NULL, NULL, NULL, '', NULL, '', '3017448596', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (26, 'N', 1, '98584791', '', 'ANTONIO JOSE NARIÑO ALZATE', 'ANTONIO', 'JOSE', 'NARIÑO', 'ALZATE', NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', 'tucorreo@info.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (27, 'J', 2, '90008471589458', '2', 'ACUARIOS DEL LORO', '', '', '', '', NULL, NULL, 'ACUARIOS DEL LORO', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', 'tucorreo@info.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (16, 'J', 2, '15', '3', 'AASCX', '', '', '', '', '2025-11-12', 1, 'AASCX', '', 2, 2, NULL, NULL, 1, '', NULL, '', '3333333', '', 'dd@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'I', NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (25, 'J', 2, '900185479822', '2', 'fff', '', '', '', '', NULL, 1, 'fff', '', 1, NULL, NULL, NULL, NULL, '', NULL, '', '4878', '', 'tucorreo@info.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (34, 'J', 2, '1579', '1', 'aaq', '', '', '', '', NULL, NULL, 'aaq', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', 'tucorreo@info.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', NULL, 'admin', '2025-11-28 15:02:52.441703', NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (29, 'N', 1, '555', '', 'qasa aa ss ss', 'qasa', 'aa', 'ss', 'ss', NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', 'tucorreo@info.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (30, 'J', 2, '344444', '1', 'dfsdf', '', '', '', '', NULL, NULL, 'dfsdf', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', 'tucorreo@info.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (31, 'J', 2, '95174', '1', 'aaaaq', '', '', '', '', NULL, NULL, 'aaaaq', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', 'tucorreo@info.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (5, 'N', 1, '4434', NULL, 'jpeterx', '', '', '', '', NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (4, 'N', 2, '111', NULL, 'oooo', '', '', '', '', '2025-11-07', NULL, '', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'clientes');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (20, 'N', 1, '3333', '', 'aaasv da AAAA', 'aaasv', 'da', 'AAAA', '', NULL, 1, '', '', 1, 1, NULL, NULL, 1, '', NULL, '', '', '', 'm@hotmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'clientes,proveedores');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (32, 'J', 2, '555888444', '8', 'LA CASA DEL CARNAVALX', '', '', '', '', NULL, NULL, 'LA CASA DEL CARNAVALX', '', NULL, NULL, NULL, NULL, NULL, '', NULL, '', '', '', 'tucorreo@info.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', NULL, NULL, NULL, NULL, '2025-11-28 10:28:19.970005', NULL, 'proveedores');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (33, 'N', 1, '26845', '', 'PEDRITO PEREZ', 'PEDRITO', 'PEREZ', '', '', NULL, 1, '', '', 1, NULL, NULL, NULL, NULL, '', NULL, '', '', '', 'tucorreo@info.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'I', NULL, NULL, '2025-11-28 10:28:50.021222', NULL, '2025-11-28 10:29:15.417967', NULL, 'proveedores');
INSERT INTO public.terceros OVERRIDING SYSTEM VALUE VALUES (28, 'J', 2, '5589612', '2', 'aaaaaaaaaaaa', '', '', '', '', '2025-11-04', 3, 'aaaaaaaaaaaa', NULL, 3, NULL, NULL, NULL, NULL, 'fasdfasdfasdf', NULL, '323234', '99999', 'f234234234', 'mauromanja@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', NULL, NULL, NULL, 'admin', '2025-11-28 15:01:44.998627', NULL, 'clientes');


--
-- TOC entry 5132 (class 0 OID 16728)
-- Dependencies: 238
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios VALUES (1, 'admin', '$2b$12$ZhZHwzL763ZLkyfuM/SbMee9tFdcBmRINjVoV8hyRFcXDgiNzlb8u', 'Mauricio Manjarres', 'usuario', true, '2025-11-21 12:44:06.333');


--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 225
-- Name: ciiu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ciiu_id_seq', 1, true);


--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 231
-- Name: departamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departamentos_id_seq', 1, false);


--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 227
-- Name: generos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.generos_id_seq', 4, true);


--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 233
-- Name: municipios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.municipios_id_seq', 1, false);


--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 229
-- Name: paises_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paises_id_seq', 1, true);


--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 221
-- Name: regimenestributarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.regimenestributarios_id_seq', 4, true);


--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 235
-- Name: terceros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.terceros_id_seq', 34, true);


--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 223
-- Name: tiporesponsable_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tiporesponsable_id_seq', 2, true);


--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 219
-- Name: tiposdocumento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tiposdocumento_id_seq', 5, true);


--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 237
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, true);


-- Completed on 2025-11-30 11:38:34

--
-- PostgreSQL database dump complete
--

\unrestrict 8eiDLqABVsp0YU9efbv2NGivvyASbTeY2fbGri9ADMIoN5fLYl9eGZG9iKnFFIH

