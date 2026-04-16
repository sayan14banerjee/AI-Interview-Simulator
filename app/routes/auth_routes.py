from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.schemas.user_schema import UserRegister, UserLogin
from app.services.auth_service import register_user, login_user, refresh_access_token, revoke_refresh_token
from app.utils.dependencies import get_current_user
from app.utils.roles import require_role

router = APIRouter(tags=["auth"])


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
        password=user.password,
        role=user.role
    )

    return {"message": "User registered", "email": new_user.email, "role": new_user.role}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    access_token, refresh_token, name, role = login_user(db, user.email, user.password)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "name": name,
        "role": role
    }



@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "name": current_user.name,
        "role": current_user.role
    }

@router.post("/refresh")
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    access_token = refresh_access_token(db, refresh_token)
    return {"access_token": access_token}

@router.get("/admin-only")
def admin_data(user = Depends(require_role("admin"))):
    return {"message": "Welcome Admin"}

@router.post("/logout")
def logout(refresh_token: str, db: Session = Depends(get_db)):
    return revoke_refresh_token(db, refresh_token)