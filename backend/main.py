
from fastapi import FastAPI

app = FastAPI(
    title="Smart Campus Grievance API",
    description="Campus complaint management backend",
    version="1.0.0",
)


@app.get("/")
def home():
    return {
        "message": "Smart Campus Grievance API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
