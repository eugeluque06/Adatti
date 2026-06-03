from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

class Local(BaseModel): 
    Nombre: str
    direccion: str 
    tipo_local: str 
    categoria: str 
    telefono: str 
    correo: str 

class Ingrediente(BaseModel): 
    nombre: str 

class producto(BaseModel): 
    nombre: str
    marca: str 
    RNPA: int = 0
    categoria: str 
    ingredientes: List[Ingrediente] = []
    tipo_producto: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
async def root():
    return {"message": "Hello World"}

# 👇 lista correcta
productos = []

# ✅ POST
@app.post('/producto')
async def create_producto(producto: producto): 
    productos.append(producto)
    return {
        "mensaje": "Producto creado",
        "producto": producto
    }

# ✅ GET

@app.get("/producto/{id}")
def obtener_producto(id: str):
    producto = productos.get(id)

    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    if not producto["disponible"]:
        return {"disponible": False}

    return {"disponible": True, "producto": producto}

# OTRO ENDPOINT
@app.post('/local')
async def create_local(local: Local): 
    return {
        'local': local,
        'nombre': local.Nombre,
        'direccion': local.direccion,
        'tipo_local': local.tipo_local,
        'categoria': local.categoria,
        'telefono': local.telefono,
        'correo': local.correo
    }