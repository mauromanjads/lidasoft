# app/services/variantes.py

from typing import Dict


def build_descripcion_from_parametros(
    parametros: Dict[str, str],
    orden: list[str] | None = None,
    separador: str = " - "
) -> str:
    if not parametros:
        return ""

    if orden:
        valores = [parametros.get(k) for k in orden if parametros.get(k)]
    else:
        valores = [v for v in parametros.values() if v]

    return separador.join(map(str, valores))
