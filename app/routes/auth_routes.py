from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.schemas.user_schema import UserRegister, UserLogin
from app.services.auth_service import register_user, login_user
from app.utils.dependencies import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):

    new_user = register_user(
        db,
        name=user.name,
        email=user.email,
        password=user.password
    )

    return {"message": "User registered", "email": new_user.email}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    token = login_user(db, user.email, user.password)

    return {
        "access_token": token,
        "token_type": "bearer"
    }



@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "name": current_user.name
    }
