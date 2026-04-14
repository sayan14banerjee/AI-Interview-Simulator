from sqlalchemy.orm import Session
from fastapi import HTTPException
from jose import JWTError, jwt
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.utils.security import hash_password, verify_password
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM, create_access_token, create_refresh_token


def register_user(db: Session, name: str, email: str, password: str, role="candidate"):

    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(db, email, password):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid password")

    payload = {
        "sub": user.email,
        "role": user.role
    }

    access_token = create_access_token(payload)
    refresh_token = create_refresh_token(payload)

    # 🔥 Store refresh token
    token_entry = RefreshToken(
        user_id=user.id,
        token=refresh_token
    )

    db.add(token_entry)
    db.commit()

    return access_token, refresh_token


def refresh_access_token(db: Session, refresh_token: str):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token")

    token_exists = db.query(RefreshToken).filter(
        RefreshToken.token == refresh_token
    ).first()

    if not token_exists:
        raise HTTPException(status_code=401, detail="Token revoked")

    return create_access_token({
        "sub": payload.get("sub"),
        "role": payload.get("role")
    })


def revoke_refresh_token(db: Session, refresh_token: str):
    db.query(RefreshToken).filter(
        RefreshToken.token == refresh_token
    ).delete()
    db.commit()
    return {"message": "Logged out successfully"}