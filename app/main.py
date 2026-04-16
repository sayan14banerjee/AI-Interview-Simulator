from fastapi import FastAPI
from app.models import user, resume, refresh_token, interview, answer, evaluation
from app.database import Base, engine


user.Base.metadata.create_all(bind=engine)
resume.Base.metadata.create_all(bind=engine)
refresh_token.Base.metadata.create_all(bind=engine)
interview.Base.metadata.create_all(bind=engine)
answer.Base.metadata.create_all(bind=engine)
evaluation.Base.metadata.create_all(bind=engine)


app = FastAPI(  
    title="AI Interview Simulator",
    description="An AI-powered interview simulator that helps users practice and improve their interview skills.",
    version="1.0.0"
)

main = app

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Interview Simulator!"}

from app.routes import auth_routes

app.include_router(auth_routes.router, prefix="/auth")

from app.routes import resume_routes

app.include_router(resume_routes.router, prefix="/resume")


from app.routes import interview_routes

app.include_router(interview_routes.router, prefix="/interview")

from app.routes import user_routes

app.include_router(user_routes.router, prefix="/users")