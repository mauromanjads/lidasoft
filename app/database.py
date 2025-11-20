# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import urllib

server = 'localhost\\SQLEXPRESS'
database = 'lidasoft'
username = 'sa'     # si usas autenticación de Windows, déjelo vacío
password = 'sa'

# STRING DE CONEXIÓN
params = urllib.parse.quote_plus(
    f"DRIVER={{SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection=yes;"
)

engine = create_engine(f"mssql+pyodbc:///?odbc_connect={params}")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
