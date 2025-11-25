# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# DATOS DE CONEXIÓN (ajústalos a tu entorno)
POSTGRES_USER = "postgres"      # o el que creaste
POSTGRES_PASSWORD = "sa"
POSTGRES_DB = "lidasoft"        # igual al que migraste
POSTGRES_HOST = "localhost"     # o IP si está en red o nube
POSTGRES_PORT = "5432"          # puerto por defecto

# STRING DE CONEXIÓN A POSTGRES
DATABASE_URL = (
    f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}"
    f"@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
