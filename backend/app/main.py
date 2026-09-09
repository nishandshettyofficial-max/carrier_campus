from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database
from app.routes import auth, jobs, resume, skills, interview, dashboard

# Ensure tables and seed data exist
Base.metadata.create_all(bind=engine)
_init_db = SessionLocal()
try:
    seed_database(_init_db)
finally:
    _init_db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(jobs.router, prefix=settings.API_V1_STR)
app.include_router(resume.router, prefix=settings.API_V1_STR)
app.include_router(skills.router, prefix=settings.API_V1_STR)
app.include_router(interview.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to CareerCompass API",
        "tagline": "Your skills. Your career. Your next opportunity.",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "CareerCompass Backend"}
