from fastapi import FastAPI
from database import Base, engine
from routers.quotes import router as quotes_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ProcureFlow API")

@app.get("/")
def root():
    return {"message": "ProcureFlow API ayakta"}

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(quotes_router)
