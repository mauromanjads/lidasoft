SELECT p.codigo, p.nombre, pr.tipo_presentacion, pr.cantidad_equivalente, u.codigo AS unidad_dian,
       pp.precio, pp.iva_porcentaje
FROM productos p
JOIN productos_presentaciones pr ON pr.producto_id = p.id
JOIN unidades_medida u ON u.id = pr.unidad_medida_id
JOIN productos_precios pp ON pp.presentacion_id = pr.id
WHERE p.codigo = 'ABC001'
AND (pp.fecha_hasta IS NULL OR pp.fecha_hasta >= CURRENT_DATE);
