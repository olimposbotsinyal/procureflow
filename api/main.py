from fastapi import FastAPI
from routers.health import router as health_router

app = FastAPI(title="ProcureFlow API")

@app.get("/")
def root():
    return {"message": "ProcureFlow API ayakta"}

app.include_router(health_router)
from routers.quotes import router as quotes_router
app.include_router(quotes_router)
