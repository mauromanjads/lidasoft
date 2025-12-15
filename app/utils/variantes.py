# app/services/variantes.py

from typing import Dict


def build_descripcion_from_parametros(
    parametros: Dict[str, str],
    separador: str = " - "
) -> str:
    """
    Convierte:
    { "color": "Rojo", "talla": "M" }
    en:
    "Rojo - M"
    """
    if not parametros:
        return ""

    return separador.join(
        str(v) for v in parametros.values() if v
    )
