from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from api.database import Base


class SystemEmail(Base):
    __tablename__ = "system_emails"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=True, index=True)
    owner_user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    description = Column(Text, nullable=True)  # Kullanım amacı
    signature_name = Column(String(255), nullable=True)
    signature_title = Column(String(255), nullable=True)
    signature_note = Column(Text, nullable=True)
    signature_image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)

    tenant = relationship("Tenant", back_populates="system_emails")

    def __repr__(self):
        return f"<SystemEmail(email={self.email})>"
