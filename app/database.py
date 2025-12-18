# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# DATOS DE CONEXIÓN (LOCAL)
#POSTGRES_USER = "postgres"      # o el que creaste
#POSTGRES_PASSWORD = "sa"
#POSTGRES_DB = "lidasoftDic2025"        # igual al que migraste
#POSTGRES_HOST = "localhost"     # o IP si está en red o nube
#POSTGRES_PORT = "5432"          # puerto por defecto

# DATOS DE CONEXIÓN (NUBE)
POSTGRES_USER = "neondb_owner"      # o el que creaste
POSTGRES_PASSWORD = "npg_dZJI8k3bzalf"
POSTGRES_DB = "lidasoftnube"        # igual al que migraste
POSTGRES_HOST = "ep-raspy-violet-a8q3d64u.eastus2.azure.neon.tech"     # o IP si está en red o nube
POSTGRES_PORT = "5432"          # puerto por defecto




# STRING DE CONEXIÓN A POSTGRES
DATABASE_URL = (
    f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}"
    f"@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
