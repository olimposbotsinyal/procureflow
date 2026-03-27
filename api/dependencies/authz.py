from fastapi import Depends, HTTPException, status
from api.models import User
from api.v1.auth.dependencies import get_current_user  # projendeki gerÃ§ek path'e gÃ¶re dÃ¼zelt

def require_role(required_role: str):
    def _checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user
    return _checker

