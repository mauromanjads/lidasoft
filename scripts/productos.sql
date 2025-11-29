-- ===========================================================
-- 1️⃣ UNIDADES DE MEDIDA  (recomendado por DIAN)
-- ===========================================================
CREATE SEQUENCE unidades_medida_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE unidades_medida (
    id          INTEGER NOT NULL DEFAULT nextval('unidades_medida_id_seq') PRIMARY KEY,
    codigo      VARCHAR(10) NOT NULL,   -- NIU / LTR / KGM / MTQ
    nombre      VARCHAR(50) NOT NULL
);

-- Ejemplos básicos:
INSERT INTO unidades_medida (codigo, nombre) VALUES
('NIU', 'Unidad'),
('LTR', 'Litro'),
('KGM', 'Kilogramo'),
('MTR', 'Metro');


-- ===========================================================
-- 2️⃣ PRODUCTOS
-- ===========================================================
CREATE SEQUENCE productos_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE productos (
    id              INTEGER NOT NULL DEFAULT nextval('productos_id_seq') PRIMARY KEY,
    codigo          VARCHAR(50) NOT NULL UNIQUE,
    nombre          VARCHAR(255) NOT NULL,
    descripcion     TEXT,
    activo          BOOLEAN DEFAULT TRUE
	codigo_barra    VARCHAR(50)  NULL UNIQUE,
);


-- ===========================================================
-- 3️⃣ PRESENTACIONES DE PRODUCTO  (1 producto → N presentaciones)
-- ===========================================================
CREATE SEQUENCE productos_presentaciones_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE productos_presentaciones (
    id                      INTEGER NOT NULL DEFAULT nextval('productos_presentaciones_id_seq') PRIMARY KEY,
    producto_id             INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    
    tipo_presentacion       VARCHAR(50) NOT NULL,     -- caja / blister / unidad / sobre / botella
    cantidad_equivalente    NUMERIC(14,2) DEFAULT 1,  -- ejemplo: 1 caja = 20 unidades

    unidad_medida_id        INTEGER NOT NULL REFERENCES unidades_medida(id),  -- unidad DIAN

    activo BOOLEAN DEFAULT TRUE
);


-- ===========================================================
-- 4️⃣ PRECIOS DE PRODUCTO  (Histórico y múltiples listas)
-- ===========================================================
CREATE SEQUENCE productos_precios_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE productos_precios (
    id              INTEGER NOT NULL DEFAULT nextval('productos_precios_id_seq') PRIMARY KEY,
    presentacion_id INTEGER NOT NULL REFERENCES productos_presentaciones(id) ON DELETE CASCADE,
    
    lista_precio    VARCHAR(50) NOT NULL DEFAULT 'GENERAL',   -- mayorista, distribuidor, etc.
    precio          NUMERIC(14,2) NOT NULL,
    iva_porcentaje  NUMERIC(5,2) DEFAULT 0,   -- ejemplo: 19

    fecha_desde     DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_hasta     DATE,  -- NULL = precio actual

    activo          BOOLEAN DEFAULT TRUE
);


-- ===========================================================
-- 🔍 INDICES PARA RENDIMIENTO 
-- ===========================================================
CREATE INDEX idx_productos_codigo ON productos (codigo);
CREATE INDEX idx_presentaciones_producto ON productos_presentaciones (producto_id);
CREATE INDEX idx_precios_presentacion ON productos_precios (presentacion_id);
CREATE INDEX idx_precios_vigencia ON productos_precios (fecha_hasta, activo);


-- ===========================================================
-- 📥 EJEMPLO DE INSERCIÓN 
-- ===========================================================
-- Producto
INSERT INTO productos (codigo, nombre, descripcion)
VALUES ('ABC001', 'Ibuprofeno 400mg', 'Medicamento para dolor');

-- Presentaciones
INSERT INTO productos_presentaciones (producto_id, tipo_presentacion, cantidad_equivalente, unidad_medida_id)
VALUES 
(1, 'CAJA', 20, 1),    -- 20 unidades
(1, 'BLISTER', 10, 1), -- 10 unidades
(1, 'UNIDAD', 1, 1);   -- 1 unidad

-- Precios
INSERT INTO productos_precios (presentacion_id, lista_precio, precio, iva_porcentaje)
VALUES 
(1, 'GENERAL', 50000, 19),
(2, 'GENERAL', 30000, 19),
(3, 'GENERAL', 5000, 0);
