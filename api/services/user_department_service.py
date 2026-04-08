from __future__ import annotations

from sqlalchemy.orm import Session

from api.models.department import Department
from api.models.user import User


_TRANSLATION_MAP = str.maketrans(
    {
        "ç": "c",
        "Ç": "c",
        "ğ": "g",
        "Ğ": "g",
        "ı": "i",
        "İ": "i",
        "ö": "o",
        "Ö": "o",
        "ş": "s",
        "Ş": "s",
        "ü": "u",
        "Ü": "u",
    }
)


def _normalize_label(value: str | None) -> str:
    if not value:
        return ""
    return " ".join(value.translate(_TRANSLATION_MAP).lower().split())


def resolve_effective_department_id(
    db: Session, user: User, *, persist: bool = True
) -> int | None:
    if user.department_id is not None:
        return user.department_id

    if user.user_departments:
        department = user.user_departments[0]
        if persist:
            user.department_id = department.id
            db.add(user)
            db.flush()
        return department.id

    normalized_user_name = _normalize_label(user.full_name)
    if not normalized_user_name:
        return None

    departments = db.query(Department).filter(Department.is_active.is_(True)).all()
    for department in departments:
        if _normalize_label(department.name) != normalized_user_name:
            continue

        if persist:
            user.department_id = department.id
            db.add(user)
            db.flush()
        return department.id

    return None
