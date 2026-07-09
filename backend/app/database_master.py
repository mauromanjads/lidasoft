# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
load_dotenv()

# DATOS DE CONEXIÓN (NUBE)
POSTGRES_USER = os.getenv("POSTGRES_USER") 
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD") 
POSTGRES_DB = os.getenv("POSTGRES_DB") 
POSTGRES_HOST = os.getenv("POSTGRES_HOST") 
POSTGRES_PORT = os.getenv("POSTGRES_PORT") 


# STRING DE CONEXIÓN A POSTGRES
DATABASE_URL = (
    f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}"
    f"@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db_master():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

