from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import QueuePool

def get_db(empresa):
    """
    Crea un engine, Base y sesión SQLAlchemy dinámica
    para la base de datos de una empresa específica.
    """

    DATABASE_URL = (
        f"postgresql+psycopg2://{empresa.db_user}:{empresa.db_password}"
        f"@{empresa.db_host}:{empresa.db_port}/{empresa.db_name}"
        "?sslmode=disable"
    )

    engine = create_engine(
        DATABASE_URL,
        poolclass=QueuePool,
        pool_size=5,
        max_overflow=2,
        pool_pre_ping=True,
        pool_recycle=1800
    )

    # Crear sesión
    SessionEmpresa = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )

    db = SessionEmpresa()
    try:
        yield db
    finally:
        db.close()
