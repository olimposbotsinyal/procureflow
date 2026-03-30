# api\dependencies\authz.py
from fastapi import Depends, HTTPException, status
from api.models import User
from api.core.deps import get_current_user


def require_role(required_role: str):
    def _checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user

    return _checker
