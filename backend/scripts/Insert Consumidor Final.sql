INSERT INTO public.terceros
(
    tipo_persona,
    tipo_documento_id,
    documento,
    nombre,
    primer_nombre,
    primer_apellido,
    razon_social,
    nombre_comercial,
    regimen_id,
    tipo_responsable_id,
    gran_contribuyente,
    autoretenedor,
    direccion,
    municipio_id,
    telefono,
    correo,
    pais_id,
    lista_precio_id,
    vendedor_id,
    tiene_cupo,
    cupo_credito,
    plazo_dias,
    acepta_factura_electronica,
    recibe_correo,
    estado,
    notas,
    usuario_creacion,
    fecha_creacion,
    departamento_id,
    tipotercero
)
VALUES
(
    'N',             -- tipo_persona: Natural
    1,               -- tipo_documento_id: Consumidor Final DIAN
    '9999999999',    -- documento ficticio para consumidor final
    'CONSUMIDOR FINAL', -- nombre completo
    'CONSUMIDOR',    -- primer_nombre
    'FINAL',         -- primer_apellido
    NULL,            -- razon_social
    NULL,            -- nombre_comercial
    NULL,            -- regimen_id
    NULL,            -- tipo_responsable_id
    false,           -- gran_contribuyente
    false,           -- autoretenedor
    NULL,            -- direccion
    NULL,            -- municipio_id
    NULL,            -- telefono
    NULL,            -- correo
    NULL,            -- pais_id: Colombia
    NULL,            -- lista_precio_id
    NULL,            -- vendedor_id
    false,           -- tiene_cupo
    0,               -- cupo_credito
    0,               -- plazo_dias
    true,            -- acepta_factura_electronica
    true,            -- recibe_correo
    'A',             -- estado Activo
    'Cliente consumidor final DIAN', -- notas
    'SYSTEM',        -- usuario_creacion
    NOW(),           -- fecha_creacion
    NULL,            -- departamento_id
    'clientes' -- tipotercero
);
