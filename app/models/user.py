from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(String(255), default="candidate")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

