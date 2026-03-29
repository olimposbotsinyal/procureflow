# api\main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import health, quotes, auth
from dotenv import load_dotenv
from .routers.auth import router as auth_router

load_dotenv()

app = FastAPI(title="ProcureFlow API", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)

app.include_router(health.router, prefix="/api/v1")
app.include_router(quotes.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
