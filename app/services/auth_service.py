from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.utils.security import hash_password, verify_password
from app.utils.jwt_handler import create_access_token


def register_user(db: Session, name: str, email: str, password: str):

    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        name=name,
        email=email,
        password_hash=hash_password(password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(db: Session, email: str, password: str):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_access_token({"sub": user.email})

    return token