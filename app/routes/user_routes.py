from app.utils.roles import require_role
from app.utils.dependencies import get_current_user, get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.user_service import get_all_users, get_user_profile
router = APIRouter(tags=["user"])

@router.get("/admin/users")
def get_users(
    db: Session = Depends(get_db),
    user = Depends(require_role("admin"))
):

    users = get_all_users(db)

    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role
        }
        for u in users
    ]

@router.get("/admin/users")
def get_users(
    db: Session = Depends(get_db),
    user = Depends(require_role("admin"))
):

    users = get_all_users(db)

    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role
        }
        for u in users
    ]
@router.get("/me")
def my_profile(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):

    return get_user_profile(db, user.id)

@router.get("/admin/user/{user_id}")
def admin_user_profile(
    user_id: int,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin"))
):

    return get_user_profile(db, user_id)